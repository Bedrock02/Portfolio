import '@testing-library/jest-dom'
import React from 'react'
import { TextEncoder as NodeTextEncoder, TextDecoder as NodeTextDecoder } from 'util'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'

if (typeof globalThis.TextEncoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).TextEncoder = NodeTextEncoder
}
if (typeof globalThis.TextDecoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).TextDecoder = NodeTextDecoder
}

// eslint-disable-next-line import/first
import Chat from './index'

const TextEncoderImpl = globalThis.TextEncoder

const MAX_QUERY_LENGTH = 300

const streamingResponse = (chunks: string[]) => {
  const encoder = new TextEncoderImpl()
  const queue = chunks.map((c) => encoder.encode(c))
  return {
    ok: true,
    body: {
      getReader: () => ({
        read: jest.fn(() => {
          if (queue.length === 0) {
            return Promise.resolve({ done: true, value: undefined })
          }
          return Promise.resolve({ done: false, value: queue.shift() })
        }),
      }),
    },
  }
}

const hangingStreamResponse = () => ({
  ok: true,
  body: {
    getReader: () => ({
      read: jest.fn(() => new Promise<never>(() => {})),
    }),
  },
})

const pendingResponse = () => {
  let resolveFetch: (v: ReturnType<typeof streamingResponse>) => void
  const promise = new Promise<ReturnType<typeof streamingResponse>>((resolve) => {
    resolveFetch = resolve
  })
  return {
    promise,
    resolve: () => resolveFetch(streamingResponse(['done'])),
  }
}

describe('Chat — input handling (sub-AC 13.5.2)', () => {
  let fetchMock: jest.Mock

  beforeEach(() => {
    fetchMock = jest.fn()
    global.fetch = fetchMock as unknown as typeof global.fetch
  })

  afterEach(() => {
    jest.clearAllMocks()
    ;(global as unknown as Record<string, unknown>).fetch = undefined
  })

  describe('text input', () => {
    it('updates input value as the user types', () => {
      render(<Chat />)
      const input = screen.getByRole('textbox', { name: /question/i })
      fireEvent.change(input, { target: { value: 'How did you scale Peloton?' } })
      expect(input).toHaveValue('How did you scale Peloton?')
    })

    it('replaces input value on subsequent edits', () => {
      render(<Chat />)
      const input = screen.getByRole('textbox', { name: /question/i })
      fireEvent.change(input, { target: { value: 'first' } })
      fireEvent.change(input, { target: { value: 'second' } })
      expect(input).toHaveValue('second')
    })

    it('renders the placeholder copy when the input is empty', () => {
      render(<Chat />)
      expect(
        screen.getByPlaceholderText(/what did steven work on at peloton\?/i)
      ).toBeInTheDocument()
    })
  })

  describe('submit on button click', () => {
    it('calls fetch with the typed query when the Ask button is clicked', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['ok']))
      render(<Chat />)
      fireEvent.change(screen.getByRole('textbox', { name: /question/i }), {
        target: { value: 'Tell me about your backend work' },
      })

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ask/i }))
      })

      expect(fetchMock).toHaveBeenCalledTimes(1)
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
      expect(init.method).toBe('POST')
      expect(JSON.parse(init.body as string)).toEqual({
        query: 'Tell me about your backend work',
      })
    })

    it('hits the /chat/stream endpoint on the configured API base URL', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['ok']))
      render(<Chat />)
      fireEvent.change(screen.getByRole('textbox', { name: /question/i }), {
        target: { value: 'q' },
      })

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ask/i }))
      })

      const [url] = fetchMock.mock.calls[0] as [string]
      expect(url).toMatch(/\/chat\/stream$/)
    })
  })

  describe('submit on Enter', () => {
    it('submits the form when Enter is pressed inside the input', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['ok']))
      render(<Chat />)
      const input = screen.getByRole('textbox', { name: /question/i })
      fireEvent.change(input, { target: { value: 'Enter submits this' } })

      await act(async () => {
        fireEvent.submit(input.closest('form')!)
      })

      expect(fetchMock).toHaveBeenCalledTimes(1)
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
      expect(JSON.parse(init.body as string)).toEqual({
        query: 'Enter submits this',
      })
    })

    it('does not submit on Enter when the input is empty', async () => {
      render(<Chat />)
      const input = screen.getByRole('textbox', { name: /question/i })

      await act(async () => {
        fireEvent.submit(input.closest('form')!)
      })

      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('does not submit on Enter when the input is whitespace-only', async () => {
      render(<Chat />)
      const input = screen.getByRole('textbox', { name: /question/i })
      fireEvent.change(input, { target: { value: '     ' } })

      await act(async () => {
        fireEvent.submit(input.closest('form')!)
      })

      expect(fetchMock).not.toHaveBeenCalled()
    })
  })

  describe('input clearing', () => {
    it('clears the input when the user sets it to empty', () => {
      render(<Chat />)
      const input = screen.getByRole('textbox', { name: /question/i })
      fireEvent.change(input, { target: { value: 'about to be cleared' } })
      expect(input).toHaveValue('about to be cleared')
      fireEvent.change(input, { target: { value: '' } })
      expect(input).toHaveValue('')
    })

    it('preserves the submitted query in the input after a successful submit', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['answer']))
      render(<Chat />)
      const input = screen.getByRole('textbox', { name: /question/i })
      fireEvent.change(input, { target: { value: 'preserved after submit' } })

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ask/i }))
      })

      await waitFor(() => expect(screen.getByText('answer')).toBeInTheDocument())
      expect(input).toHaveValue('preserved after submit')
    })

    it('disables the submit button after the user clears a previously valid input', () => {
      render(<Chat />)
      const input = screen.getByRole('textbox', { name: /question/i })
      const button = screen.getByRole('button', { name: /ask/i })
      fireEvent.change(input, { target: { value: 'hello' } })
      expect(button).not.toBeDisabled()
      fireEvent.change(input, { target: { value: '' } })
      expect(button).toBeDisabled()
    })
  })

  describe('disabled states', () => {
    it('disables the submit button on initial render (empty input)', () => {
      render(<Chat />)
      expect(screen.getByRole('button', { name: /ask/i })).toBeDisabled()
    })

    it('disables the submit button when the input contains only whitespace', () => {
      render(<Chat />)
      fireEvent.change(screen.getByRole('textbox', { name: /question/i }), {
        target: { value: '   \t  \n  ' },
      })
      expect(screen.getByRole('button', { name: /ask/i })).toBeDisabled()
    })

    it('enables the submit button once a non-empty query is typed', () => {
      render(<Chat />)
      fireEvent.change(screen.getByRole('textbox', { name: /question/i }), {
        target: { value: 'valid query' },
      })
      expect(screen.getByRole('button', { name: /ask/i })).not.toBeDisabled()
    })

    it(`disables the submit button when the query exceeds ${MAX_QUERY_LENGTH} chars`, () => {
      render(<Chat />)
      const overLong = 'x'.repeat(MAX_QUERY_LENGTH + 1)
      fireEvent.change(screen.getByRole('textbox', { name: /question/i }), {
        target: { value: overLong },
      })
      expect(screen.getByRole('button', { name: /ask/i })).toBeDisabled()
      expect(
        screen.getByText(
          new RegExp(`query too long \\(${overLong.length}/${MAX_QUERY_LENGTH}`, 'i')
        )
      ).toBeInTheDocument()
    })

    it(`accepts an exactly-${MAX_QUERY_LENGTH}-char query as valid`, () => {
      render(<Chat />)
      const exact = 'y'.repeat(MAX_QUERY_LENGTH)
      fireEvent.change(screen.getByRole('textbox', { name: /question/i }), {
        target: { value: exact },
      })
      expect(screen.getByRole('button', { name: /ask/i })).not.toBeDisabled()
      expect(screen.queryByText(/query too long/i)).not.toBeInTheDocument()
    })

    it('blocks a second submission while the first request is still loading', async () => {
      const pending = pendingResponse()
      fetchMock.mockReturnValueOnce(pending.promise)

      render(<Chat />)
      fireEvent.change(screen.getByRole('textbox', { name: /question/i }), {
        target: { value: 'first' },
      })

      const button = screen.getByRole('button', { name: /ask/i })

      await act(async () => {
        fireEvent.click(button)
      })

      await waitFor(() => expect(button).toHaveTextContent(/thinking/i))
      expect(button).toBeDisabled()
      expect(screen.getByRole('textbox', { name: /question/i })).toBeDisabled()

      await act(async () => {
        fireEvent.click(button)
      })
      expect(fetchMock).toHaveBeenCalledTimes(1)

      await act(async () => {
        pending.resolve()
      })
    })

    it('disables the input and button while a response is actively streaming', async () => {
      fetchMock.mockResolvedValueOnce(hangingStreamResponse())

      render(<Chat />)
      const input = screen.getByRole('textbox', { name: /question/i })
      fireEvent.change(input, { target: { value: 'streaming q' } })

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ask/i }))
      })

      await waitFor(() =>
        expect(screen.getByRole('textbox', { name: /question/i })).toBeDisabled()
      )
      expect(screen.getByRole('button', { name: /ask/i })).toBeDisabled()
    })

    it('re-enables the submit button after a successful round-trip completes', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['done']))
      render(<Chat />)
      fireEvent.change(screen.getByRole('textbox', { name: /question/i }), {
        target: { value: 'roundtrip' },
      })

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ask/i }))
      })

      await waitFor(() =>
        expect(screen.getByRole('button', { name: /ask/i })).not.toBeDisabled()
      )
      expect(screen.getByRole('textbox', { name: /question/i })).not.toBeDisabled()
    })
  })
})
