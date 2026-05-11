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

const errorResponseWithJson = (status: number, body: Record<string, unknown>) => ({
  ok: false,
  status,
  json: jest.fn(() => Promise.resolve(body)),
})

const errorResponseNoJson = (status: number) => ({
  ok: false,
  status,
  json: jest.fn(() => Promise.reject(new Error('not JSON'))),
})

const deferredFetch = () => {
  let resolveFn: (v: unknown) => void
  let rejectFn: (e: unknown) => void
  const promise = new Promise<unknown>((resolve, reject) => {
    resolveFn = resolve
    rejectFn = reject
  })
  return { promise, resolve: resolveFn!, reject: rejectFn! }
}

const typeQuery = (value: string) => {
  fireEvent.change(screen.getByRole('textbox', { name: /question/i }), {
    target: { value },
  })
}

const clickAsk = async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /ask|thinking/i }))
  })
}

describe('Chat — Python backend API interaction (sub-AC 13.5.3)', () => {
  let fetchMock: jest.Mock

  beforeEach(() => {
    fetchMock = jest.fn()
    global.fetch = fetchMock as unknown as typeof global.fetch
  })

  afterEach(() => {
    jest.clearAllMocks()
    ;(global as unknown as Record<string, unknown>).fetch = undefined
  })

  describe('mocked fetch — request contract', () => {
    it('issues exactly one fetch call per submission', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['ok']))
      render(<Chat />)
      typeQuery('one call only')
      await clickAsk()
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('targets the /chat/stream path on the configured API base URL', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['ok']))
      render(<Chat />)
      typeQuery('endpoint check')
      await clickAsk()
      const [url] = fetchMock.mock.calls[0] as [string]
      expect(url).toMatch(/^https?:\/\/.+\/chat\/stream$/)
    })

    it('uses HTTP POST', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['ok']))
      render(<Chat />)
      typeQuery('method check')
      await clickAsk()
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
      expect(init.method).toBe('POST')
    })

    it('sends Content-Type: application/json', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['ok']))
      render(<Chat />)
      typeQuery('headers check')
      await clickAsk()
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
      expect(init.headers).toEqual({ 'Content-Type': 'application/json' })
    })

    it('serializes the user query into a JSON body { query }', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['ok']))
      render(<Chat />)
      typeQuery('What did you build at Peloton?')
      await clickAsk()
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
      expect(JSON.parse(init.body as string)).toEqual({
        query: 'What did you build at Peloton?',
      })
    })
  })

  describe('loading state', () => {
    it('flips the button label to "Thinking..." while the request is in-flight', async () => {
      const pending = deferredFetch()
      fetchMock.mockReturnValueOnce(pending.promise)

      render(<Chat />)
      typeQuery('loading label check')
      const button = screen.getByRole('button', { name: /ask/i })

      await act(async () => {
        fireEvent.click(button)
      })

      await waitFor(() => expect(button).toHaveTextContent(/thinking/i))
      expect(button).toBeDisabled()

      await act(async () => {
        pending.resolve(streamingResponse(['done']))
      })
    })

    it('disables the input while the request is in-flight', async () => {
      const pending = deferredFetch()
      fetchMock.mockReturnValueOnce(pending.promise)

      render(<Chat />)
      typeQuery('input disabled while loading')

      const input = screen.getByRole('textbox', { name: /question/i })
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ask/i }))
      })

      await waitFor(() => expect(input).toBeDisabled())

      await act(async () => {
        pending.resolve(streamingResponse(['done']))
      })
    })

    it('reverts the button label to "Ask" after the round-trip completes', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['done']))
      render(<Chat />)
      typeQuery('label reverts')
      await clickAsk()

      await waitFor(() =>
        expect(screen.getByRole('button', { name: /ask/i })).toHaveTextContent(/^ask$/i)
      )
    })

    it('does not show "Thinking..." on initial render', () => {
      render(<Chat />)
      expect(screen.getByRole('button', { name: /ask/i })).toHaveTextContent(/^ask$/i)
    })

    it('does not render an error alert while a request is loading', async () => {
      const pending = deferredFetch()
      fetchMock.mockReturnValueOnce(pending.promise)

      render(<Chat />)
      typeQuery('no alert during loading')

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ask/i }))
      })

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()

      await act(async () => {
        pending.resolve(streamingResponse(['done']))
      })
    })
  })

  describe('success response', () => {
    it('renders the streamed answer text on a 2xx response', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['Hello from RAG backend.']))
      render(<Chat />)
      typeQuery('success render')
      await clickAsk()

      await waitFor(() =>
        expect(screen.getByText('Hello from RAG backend.')).toBeInTheDocument()
      )
    })

    it('concatenates multi-chunk streamed bodies into the rendered answer', async () => {
      fetchMock.mockResolvedValueOnce(
        streamingResponse(['Part one. ', 'Part two. ', 'Part three.'])
      )
      render(<Chat />)
      typeQuery('multi chunk success')
      await clickAsk()

      await waitFor(() =>
        expect(screen.getByText('Part one. Part two. Part three.')).toBeInTheDocument()
      )
    })

    it('does not render an error alert on a successful response', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['Clean success.']))
      render(<Chat />)
      typeQuery('no alert on success')
      await clickAsk()

      await waitFor(() => expect(screen.getByText('Clean success.')).toBeInTheDocument())
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('calls reader.read() until { done: true } on a finite stream', async () => {
      const encoder = new TextEncoderImpl()
      const queue = ['a', 'b', 'c'].map((c) => encoder.encode(c))
      const read = jest.fn(() => {
        if (queue.length === 0) {
          return Promise.resolve({ done: true, value: undefined })
        }
        return Promise.resolve({ done: false, value: queue.shift() })
      })
      fetchMock.mockResolvedValueOnce({
        ok: true,
        body: { getReader: () => ({ read }) },
      })

      render(<Chat />)
      typeQuery('reader drain')
      await clickAsk()

      await waitFor(() => expect(screen.getByText('abc')).toBeInTheDocument())
      expect(read).toHaveBeenCalledTimes(4)
    })
  })

  describe('error handling', () => {
    it('renders the server-supplied error message when !response.ok and body has { error }', async () => {
      fetchMock.mockResolvedValueOnce(
        errorResponseWithJson(500, { error: 'Backend exploded: upstream LLM down' })
      )
      render(<Chat />)
      typeQuery('server json error')
      await clickAsk()

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent(/backend exploded: upstream llm down/i)
    })

    it('falls back to generic copy when !response.ok and body is missing { error }', async () => {
      fetchMock.mockResolvedValueOnce(errorResponseWithJson(500, {}))
      render(<Chat />)
      typeQuery('missing error field')
      await clickAsk()

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent(/something went wrong\. please try again\./i)
    })

    it('falls back to generic copy when !response.ok and body is non-JSON', async () => {
      fetchMock.mockResolvedValueOnce(errorResponseNoJson(502))
      render(<Chat />)
      typeQuery('non-json error body')
      await clickAsk()

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent(/something went wrong\. please try again\./i)
    })

    it('renders a thrown network error message via the alert region', async () => {
      fetchMock.mockRejectedValueOnce(new Error('NetworkError: connection refused'))
      render(<Chat />)
      typeQuery('network failure')
      await clickAsk()

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent(/connection refused/i)
    })

    it('does not render the answer block when the request errors', async () => {
      fetchMock.mockRejectedValueOnce(new Error('boom'))
      const { container } = render(<Chat />)
      typeQuery('no answer on error')
      await clickAsk()

      await screen.findByRole('alert')
      expect(container.querySelector('.bg-navy-600\\/10')).toBeNull()
    })

    it('re-enables the input and submit button after an error so the user can retry', async () => {
      fetchMock.mockRejectedValueOnce(new Error('retry me'))
      render(<Chat />)
      typeQuery('retry path')
      await clickAsk()

      await screen.findByRole('alert')
      expect(screen.getByRole('textbox', { name: /question/i })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: /ask/i })).not.toBeDisabled()
    })

    it('clears the prior error alert on a subsequent successful submit', async () => {
      fetchMock
        .mockRejectedValueOnce(new Error('first failure'))
        .mockResolvedValueOnce(streamingResponse(['recovered']))

      render(<Chat />)
      typeQuery('will fail then succeed')
      await clickAsk()

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent(/first failure/i)

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ask/i }))
      })

      await waitFor(() => expect(screen.getByText('recovered')).toBeInTheDocument())
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('does not re-throw — error is contained inside the component boundary', async () => {
      fetchMock.mockRejectedValueOnce(new Error('contained'))
      render(<Chat />)
      typeQuery('error containment')

      await expect(
        act(async () => {
          fireEvent.click(screen.getByRole('button', { name: /ask/i }))
        })
      ).resolves.toBeUndefined()

      await screen.findByRole('alert')
    })
  })
})
