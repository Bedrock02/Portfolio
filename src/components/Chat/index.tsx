'use client'

import React, { useState, FormEvent } from 'react'

const API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8080'
const MAX_QUERY_LENGTH = 300

const Chat = (): JSX.Element => {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState('')

  const tooLong = query.length > MAX_QUERY_LENGTH
  const disabled = loading || streaming || !query.trim() || tooLong

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!query.trim() || tooLong) return

    setLoading(true)
    setAnswer('')
    setError('')
    setStreaming(false)

    try {
      const response = await fetch(`${API_URL}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Something went wrong. Please try again.')
      }

      setLoading(false)
      setStreaming(true)

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await reader.read()
        if (done) break
        setAnswer((prev) => prev + decoder.decode(value))
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg)
    } finally {
      setLoading(false)
      setStreaming(false)
    }
  }

  return (
    <section id="chat" className="portfolio-section pb-[100px]">
      <h2 className="mb-4 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-sky-200">
        Ask About My Experience
      </h2>
      <p className="mb-5 text-[0.95rem] leading-[1.7] text-slate-500">
        Curious about my background? Ask anything about my work, skills, or projects.
      </p>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex w-full items-stretch overflow-hidden rounded-md border border-navy-800 bg-navy-600/5 focus-within:border-navy-600">
          <input
            type="text"
            placeholder="e.g. What did Steven work on at Peloton?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading || streaming}
            aria-label="Question"
            className="flex-1 bg-transparent px-4 py-2.5 text-[0.9rem] text-sky-200 placeholder:text-slate-500 focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={disabled}
            className="border-l border-navy-800 bg-purple-700/20 px-5 py-2.5 text-[0.8rem] font-semibold uppercase tracking-wide text-purple-300 transition-colors duration-200 ease-in-out hover:bg-purple-700/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </div>
        {tooLong && (
          <p className="mt-2 text-[0.78rem] text-purple-300">
            Query too long ({query.length}/{MAX_QUERY_LENGTH} characters)
          </p>
        )}
      </form>
      {error && (
        <div
          role="alert"
          className="rounded-md border border-purple-700/60 bg-purple-700/10 p-4 text-[0.9rem] leading-[1.7] text-purple-300"
        >
          <p>{error}</p>
        </div>
      )}
      {answer && (
        <div
          className={`rounded-md border border-navy-800 bg-navy-600/10 p-4 text-[0.95rem] leading-[1.7] text-slate-400${
            streaming ? ' animate-pulse' : ''
          }`}
        >
          <p>{answer}</p>
        </div>
      )}
    </section>
  )
}

export default Chat
