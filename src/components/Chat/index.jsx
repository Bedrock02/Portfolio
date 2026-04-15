import React, { useState } from 'react';
import { Input, Button } from 'semantic-ui-react';

const API_URL = process.env.GATSBY_API_URL || 'http://localhost:8080';
const MAX_QUERY_LENGTH = 300;

function Chat() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || query.length > MAX_QUERY_LENGTH) return;

    setLoading(true);
    setAnswer('');
    setError('');
    setStreaming(false);

    try {
      const response = await fetch(`${API_URL}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Something went wrong. Please try again.');
      }

      setLoading(false);
      setStreaming(true);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setAnswer((prev) => prev + decoder.decode(value));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  return (
    <section id="chat" className="portfolio-section">
      <h2 className="portfolio-section-title">Ask About My Experience</h2>
      <p className="chat-description">
        Curious about my background? Ask anything about my work, skills, or projects.
      </p>
      <form onSubmit={handleSubmit} className="chat-form">
        <Input
          fluid
          placeholder="e.g. What did Steven work on at Peloton?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading || streaming}
          action={
            <Button
              type="submit"
              disabled={loading || streaming || !query.trim() || query.length > MAX_QUERY_LENGTH}
              className="chat-button"
            >
              {loading ? 'Thinking...' : 'Ask'}
            </Button>
          }
        />
        {query.length > MAX_QUERY_LENGTH && (
          <p className="chat-char-warning">
            Query too long ({query.length}/{MAX_QUERY_LENGTH} characters)
          </p>
        )}
      </form>
      {error && (
        <div className="chat-answer chat-answer--error">
          <p>{error}</p>
        </div>
      )}
      {answer && (
        <div className={`chat-answer${streaming ? ' chat-answer--streaming' : ''}`}>
          <p>{answer}</p>
        </div>
      )}
    </section>
  );
}

export default Chat;
