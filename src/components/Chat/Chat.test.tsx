import '@testing-library/jest-dom'
import React from 'react'
import { TextEncoder as NodeTextEncoder, TextDecoder as NodeTextDecoder } from 'util'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'

// jsdom omits TextEncoder/TextDecoder; the component decodes stream chunks
// via TextDecoder and the test fixture produces matching Uint8Array buffers
// via TextEncoder. Polyfill both onto the global before importing Chat.
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

const findAnswerBlock = (text: string) => {
  const para = screen.getByText(text)
  return para.closest('div')
}

describe('Chat — message rendering', () => {
  let fetchMock: jest.Mock

  beforeEach(() => {
    fetchMock = jest.fn()
    global.fetch = fetchMock as unknown as typeof global.fetch
  })

  afterEach(() => {
    jest.clearAllMocks()
    ;(global as unknown as Record<string, unknown>).fetch = undefined
  })

  describe('empty state', () => {
    it('renders the section heading on first mount', () => {
      render(<Chat />)
      expect(
        screen.getByRole('heading', { level: 2, name: /ask about my experience/i })
      ).toBeInTheDocument()
    })

    it('renders an empty question input on first mount', () => {
      render(<Chat />)
      const input = screen.getByRole('textbox', { name: /question/i })
      expect(input).toHaveValue('')
    })

    it('does not render an assistant answer block before any submission', () => {
      const { container } = render(<Chat />)
      expect(container.querySelector('.bg-navy-600\\/10')).toBeNull()
    })

    it('does not render an error alert before any submission', () => {
      render(<Chat />)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('does not call fetch on initial render', () => {
      render(<Chat />)
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })

  describe('user message (question input)', () => {
    it('echoes typed user text into the input field', () => {
      render(<Chat />)
      const input = screen.getByRole('textbox', { name: /question/i })
      fireEvent.change(input, { target: { value: 'What did you build at Peloton?' } })
      expect(input).toHaveValue('What did you build at Peloton?')
    })

    it('keeps the submitted user question visible in the input after submit', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['ok']))
      render(<Chat />)
      const input = screen.getByRole('textbox', { name: /question/i })
      fireEvent.change(input, { target: { value: 'Tell me about your backend work' } })

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ask/i }))
      })

      expect(input).toHaveValue('Tell me about your backend work')
    })
  })

  describe('assistant message (answer block)', () => {
    it('renders the streamed answer text after submission', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['Hello, ', 'world!']))
      render(<Chat />)
      fireEvent.change(screen.getByRole('textbox', { name: /question/i }), {
        target: { value: 'Hi?' },
      })

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ask/i }))
      })

      await waitFor(() =>
        expect(screen.getByText('Hello, world!')).toBeInTheDocument()
      )
    })

    it('concatenates multiple streamed chunks into one answer paragraph', async () => {
      fetchMock.mockResolvedValueOnce(
        streamingResponse(['Chunk-A. ', 'Chunk-B. ', 'Chunk-C.'])
      )
      render(<Chat />)
      fireEvent.change(screen.getByRole('textbox', { name: /question/i }), {
        target: { value: 'q' },
      })

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ask/i }))
      })

      await waitFor(() =>
        expect(
          screen.getByText('Chunk-A. Chunk-B. Chunk-C.')
        ).toBeInTheDocument()
      )
    })

    it('wraps the assistant answer in a single styled bubble container', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['Streamed answer body.']))
      render(<Chat />)
      fireEvent.change(screen.getByRole('textbox', { name: /question/i }), {
        target: { value: 'q' },
      })

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ask/i }))
      })

      const bubble = await waitFor(() => findAnswerBlock('Streamed answer body.'))
      expect(bubble).not.toBeNull()
      expect(bubble?.className).toMatch(/rounded-md/)
      expect(bubble?.className).toMatch(/bg-navy-600\/10/)
    })

    it('drops the animate-pulse streaming indicator once the stream completes', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['Final.']))
      render(<Chat />)
      fireEvent.change(screen.getByRole('textbox', { name: /question/i }), {
        target: { value: 'q' },
      })

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ask/i }))
      })

      const bubble = await waitFor(() => findAnswerBlock('Final.'))
      expect(bubble?.className).not.toMatch(/animate-pulse/)
    })
  })

  describe('message list (ordering)', () => {
    it('renders the user question input before the assistant answer block', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['Answer text.']))
      render(<Chat />)
      const input = screen.getByRole('textbox', { name: /question/i })
      fireEvent.change(input, { target: { value: 'Ordered?' } })

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ask/i }))
      })

      const bubble = await waitFor(() => findAnswerBlock('Answer text.'))
      // DOCUMENT_POSITION_FOLLOWING (0x04) — input precedes the answer bubble.
      // eslint-disable-next-line no-bitwise
      expect(input.compareDocumentPosition(bubble!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })

    it('renders exactly one assistant answer block per successful submission', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse(['Only one.']))
      const { container } = render(<Chat />)
      fireEvent.change(screen.getByRole('textbox', { name: /question/i }), {
        target: { value: 'q' },
      })

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ask/i }))
      })

      await waitFor(() => expect(screen.getByText('Only one.')).toBeInTheDocument())
      const bubbles = container.querySelectorAll('.bg-navy-600\\/10')
      expect(bubbles).toHaveLength(1)
    })

    it('does not render an assistant block when the stream yields no chunks', async () => {
      fetchMock.mockResolvedValueOnce(streamingResponse([]))
      const { container } = render(<Chat />)
      fireEvent.change(screen.getByRole('textbox', { name: /question/i }), {
        target: { value: 'q' },
      })

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /ask/i }))
      })

      await waitFor(() =>
        expect(screen.getByRole('button', { name: /ask/i })).not.toBeDisabled()
      )
      expect(container.querySelector('.bg-navy-600\\/10')).toBeNull()
    })
  })
})
