import React from 'react';

function Roles() {
  return (
    <section id="about" className="portfolio-section">
      <h2 className="portfolio-section-title">About</h2>

      <div className="about-bio">
        <p>
          Full-stack engineer with 10+ years shipping production systems at scale —
          from high-traffic e-commerce checkout flows to experimentation platforms and
          performance-critical user journeys. I specialize in frontend-leaning full-stack
          work: React, TypeScript, and Next.js on the client; Go and Python on the backend;
          AWS for infrastructure that holds up under load.
        </p>
        <p>
          My work has moved real numbers: launched a tiered delivery experience at{' '}
          <a href="https://onepeloton.com/" target="_blank" rel="noopener noreferrer">Peloton</a>
          {' '}that generated $0.4M revenue in month one, scaled checkout throughput from
          60 → 120 orders/minute, improved Guest Pass conversion by 85%, and drove a +16%
          application conversion lift at{' '}
          <a href="https://nomadhealth.com/" target="_blank" rel="noopener noreferrer">Nomad Health</a>.
          I own experimentation end-to-end — scoping, instrumenting, and analyzing A/B tests
          with Optimizely and Split.io — and treat observability (Datadog, Sentry, k6) as a
          first-class engineering concern.
        </p>
        <p>
          I&apos;m energized by the current AI moment and actively building with LLM-powered tooling.
          I believe the next generation of great products will be defined by teams that can
          move fast without sacrificing reliability — and that&apos;s exactly the intersection I
          operate in: strong engineering fundamentals paired with a genuine excitement for
          what&apos;s possible when AI capabilities are woven thoughtfully into the user experience.
        </p>
      </div>

    </section>
  );
}

export default Roles;
