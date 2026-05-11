import type { ReactNode } from 'react'

import type { RoleEntry } from '../../lib/sanity/queries/roles'

/**
 * About / Roles section.
 *
 * All cards (title, icon, blurb, tools, audience) come from Sanity
 * (`roleEntry` document type). The Next.js page-level fetch consumes
 * `rolesQuery` at build time for SSG rendering and passes the resulting
 * `RoleEntry[]` through the `data` prop. No inline content lives here —
 * the legacy `src/components/Roles/data.js` was removed in Sub-AC 6.x.
 *
 * Styling: Tailwind utility classes only. The `portfolio-section` class
 * is retained as a JS hook for the `IntersectionObserver` in `Layout`
 * that toggles `section-visible` for fade-in animation.
 *
 * Rendering rules:
 *   - Empty/missing `data` renders nothing — keeps SSG output clean
 *     when no roles have been authored yet.
 *   - Order is governed entirely by the GROQ `order asc` sort; this
 *     component never re-sorts.
 *   - `_id` is used as the React key.
 *   - Unknown icon identifiers fall back to rendering the literal
 *     string so editorial typos are visible in the Studio preview.
 */

const ROLE_ICONS: Record<string, ReactNode> = {
  code: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-6 w-6"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  laptop: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-6 w-6"
    >
      <rect x="2" y="4" width="20" height="12" rx="1" />
      <line x1="1" y1="20" x2="23" y2="20" />
    </svg>
  ),
  server: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-6 w-6"
    >
      <rect x="2" y="3" width="20" height="7" rx="1" />
      <rect x="2" y="14" width="20" height="7" rx="1" />
      <line x1="6" y1="6.5" x2="6.01" y2="6.5" />
      <line x1="6" y1="17.5" x2="6.01" y2="17.5" />
    </svg>
  ),
}

export interface RolesProps {
  /** GROQ result from `rolesQuery`. May be empty/undefined pre-authoring. */
  data?: RoleEntry[] | null
}

const Roles = ({ data }: RolesProps): JSX.Element | null => {
  if (!data || data.length === 0) return null

  return (
    <section id="about" className="portfolio-section pb-[100px]">
      <h2 className="mb-8 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-sky-200">
        About
      </h2>
      <div
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
        role="list"
        aria-label="Roles"
      >
        {data.map(({ _id, title, icon, description, tools, audience }) => (
          <article
            key={_id}
            role="listitem"
            className="rounded-md border border-navy-800 bg-navy-600/5 p-5 transition-colors duration-200 ease-in-out hover:border-navy-600 hover:bg-navy-600/15"
          >
            <header className="mb-3 flex items-center gap-3">
              <span
                className="inline-flex h-8 w-8 items-center justify-center text-sky-200"
                data-testid={`role-icon-${icon}`}
              >
                {ROLE_ICONS[icon] || (
                  <span className="text-sm">{icon}</span>
                )}
              </span>
              <h3 className="m-0 text-[0.9rem] font-semibold tracking-wide text-sky-200">
                {title}
              </h3>
            </header>
            <p className="mb-4 text-[0.9rem] leading-[1.7] text-slate-500">
              {description}
            </p>
            {tools && tools.length > 0 ? (
              <ul
                className="m-0 mb-3 flex list-none flex-wrap gap-2 p-0"
                aria-label={`Tools for ${title}`}
              >
                {tools.map((tool, idx) => (
                  <li
                    key={`${tool}-${idx}`}
                    className="rounded-[20px] bg-purple-700/20 px-3 py-1 text-[0.72rem] font-semibold tracking-wide text-purple-300"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            ) : null}
            {audience && audience.length > 0 ? (
              <ul
                className="m-0 flex list-none flex-wrap gap-2 p-0"
                aria-label={`Audience for ${title}`}
              >
                {audience.map((tag, idx) => (
                  <li
                    key={`${tag}-${idx}`}
                    className="rounded-[20px] border border-sky-200/40 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wider text-sky-200"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

export default Roles
