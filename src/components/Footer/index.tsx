import type { ReactNode } from 'react'

import type { FooterData, FooterLink } from '../../lib/sanity'

/**
 * Sidebar footer — social link row plus optional copyright line.
 *
 * Editorial content (the link list and the copyright string) is
 * sourced from the singleton `footerData` document in Sanity. The
 * parent `Layout` receives that document from the root server layout
 * and forwards it via the `data` prop. This component is pure and has
 * no `'use client'` directive — it can render in either a server or
 * client tree.
 *
 * Icons are an internal presentation concern (not editorial), so the
 * SVG map lives in this file. The Sanity `iconName` string keys into
 * the map; unknown values fall back to rendering the literal string
 * which makes typos visible in the Studio preview.
 */

const SOCIAL_ICONS: Record<string, ReactNode> = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-6 w-6">
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.93c.57.1.78-.25.78-.55v-2.1c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.4-5.27 5.68.41.35.78 1.05.78 2.12v3.14c0 .3.21.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-6 w-6">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z" />
    </svg>
  ),
  rss: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-6 w-6">
      <path d="M4 4v3.5C13.06 7.5 16.5 10.94 16.5 20H20C20 8.95 11.05 4 4 4zm0 6v3.5c3.59 0 6.5 2.91 6.5 6.5H14c0-5.51-4.49-10-10-10zm2.5 8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
    </svg>
  ),
  strava: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-6 w-6">
      <path d="M15.39 11.94l-2.18-4.3-2.17 4.3H7.83L13.21 22l5.39-10.06h-3.21zM9.66 2L4 13.18h3.4L9.66 8.7l2.27 4.48h3.4L9.66 2z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-6 w-6">
      <path d="M2 4h20c.55 0 1 .45 1 1v14c0 .55-.45 1-1 1H2c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1zm10 9L3.16 6.34A1 1 0 0 0 3 6.9V18h18V6.9a1 1 0 0 0-.16-.56L12 13zm0-2.36L20.4 6H3.6L12 10.64z" />
    </svg>
  ),
}

export interface FooterProps {
  /** GROQ result from `footerQuery`. May be `null` pre-authoring. */
  data?: FooterData | null
  /**
   * Fallback name used to compose a default copyright string when the
   * Sanity document does not provide one. Typically forwarded from the
   * profile singleton by `Layout`.
   */
  profileName?: string
}

function sortLinks(links: readonly FooterLink[] | undefined): FooterLink[] {
  if (!links || links.length === 0) return []
  return [...links].sort((a, b) => {
    const ao = typeof a.order === 'number' ? a.order : 0
    const bo = typeof b.order === 'number' ? b.order : 0
    return ao - bo
  })
}

function Footer({ data, profileName }: FooterProps): JSX.Element | null {
  const links = sortLinks(data?.links)

  // Render nothing when there's no editorial content at all — keeps
  // the sidebar tidy on a freshly-seeded Sanity project.
  if (links.length === 0 && !data?.copyright) {
    return null
  }

  const copyright =
    data?.copyright?.trim() ||
    `© ${new Date().getFullYear()} ${profileName || 'Steven Jimenez'}`

  return (
    <footer className="flex flex-col gap-4 pt-10 lg:pt-6" aria-label="Site footer">
      {links.length > 0 ? (
        <ul
          className="flex items-center gap-5"
          role="list"
          aria-label="Social links"
        >
          {links.map(({ href, iconName, ariaLabel }, idx) => (
            <li key={`${iconName}-${idx}`} className="inline-flex">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-slate-500 transition duration-200 ease-out hover:-translate-y-[3px] hover:text-sky-200"
                aria-label={`${ariaLabel} (opens in new tab)`}
              >
                {SOCIAL_ICONS[iconName] || (
                  <span className="text-sm">{iconName}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {copyright ? (
        <p className="text-xs tracking-wide text-slate-500">{copyright}</p>
      ) : null}
    </footer>
  )
}

export default Footer
