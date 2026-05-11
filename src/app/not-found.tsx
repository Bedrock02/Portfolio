/**
 * App Router 404 page.
 *
 * Replaces the legacy Pages Router `src/pages/404.jsx`. The site chrome
 * (sidebar, profile, footer, nav) is provided by `src/app/layout.tsx`,
 * so this component renders only the inline copy that shows in the
 * main column when an unknown route is requested.
 *
 * The single-page site has no real subroutes — this exists mainly for
 * mistyped anchor links and any stray crawler hits.
 */
const NotFound = (): JSX.Element => {
  return (
    <section className="portfolio-section pb-[100px]">
      <h2 className="mb-4 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-sky-200">
        <span role="img" aria-label="Forbidden sign">
          🚫
        </span>{' '}
        Not found
      </h2>
      <p className="text-[0.95rem] leading-[1.7] text-slate-500">
        You just hit a route that doesn&apos;t exist… the sadness.
      </p>
      <p className="mt-4 text-[0.95rem] leading-[1.7] text-slate-500">
        <a
          href="/"
          className="border-b border-transparent text-purple-700 no-underline transition-colors hover:border-purple-700"
        >
          ← Back to the portfolio
        </a>
      </p>
    </section>
  )
}

export default NotFound
