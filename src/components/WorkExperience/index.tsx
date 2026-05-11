import React from 'react'
import { altForImage, urlForImage } from '../../lib/sanity/image'
import type { WorkExperienceEntry } from '../../lib/sanity/queries/workExperience'

/**
 * WorkExperience section.
 *
 * All entries come from Sanity (`workExperienceEntry` document type).
 * The Next.js page is a Server Component that fetches at build time via
 * the GROQ query in `src/lib/sanity/queries/workExperience.ts` and
 * passes the resulting `WorkExperienceEntry[]` through the `data` prop.
 * No inline content lives here — the legacy
 * `src/components/WorkExperience/data.js` was removed in Sub-AC 6.5.2.
 *
 * Styling: Tailwind utility classes only. The `portfolio-section` class
 * is retained as a JS hook for the IntersectionObserver in `Layout`.
 *
 * Rendering rules:
 *   - Empty/missing `data` renders nothing — keeps SSG output clean
 *     when no entries have been authored yet.
 *   - Sort order is governed entirely by the GROQ `order asc` sort;
 *     this component never re-sorts.
 *   - Logo asset references are resolved through `urlForImage()` so the
 *     Sanity CDN serves a fixed-size variant rather than the full
 *     original asset.
 */
export interface WorkExperienceProps {
  /** GROQ result from `workExperienceQuery`. May be empty/undefined pre-authoring. */
  data?: WorkExperienceEntry[]
}

interface WorkItemProps {
  item: WorkExperienceEntry
}

/**
 * Single timeline entry. Uses Tailwind utilities + a `group` parent so
 * hover styles on the card cascade to logo, title link, and arrow.
 *
 * Layout mirrors the legacy `work.module.css` two-column grid:
 *   - 110px date rail (left)
 *   - 1fr details column (right) with logo, title, copy, tool pills
 */
const WorkItem = ({ item }: WorkItemProps): JSX.Element => {
  const { logo, href, company, date, title, description, tools } = item
  const logoUrl = urlForImage(logo)
    .width(192)
    .height(48)
    .fit('max')
    .auto('format')
    .url()
  const logoAlt = altForImage(logo, `${company} logo`)
  return (
    <div className="group grid grid-cols-[110px_1fr] gap-6 cursor-default rounded-md border border-transparent p-5 transition-colors duration-200 ease-in-out hover:border-navy-800 hover:bg-navy-600/15">
      <div className="pt-1 text-[0.72rem] font-semibold uppercase leading-relaxed tracking-wider text-slate-500">
        {date}
      </div>
      <div className="flex-1">
        <div className="mb-3">
          <img
            src={logoUrl}
            alt={logoAlt}
            className="h-6 w-auto object-contain opacity-50 grayscale-[20%] transition-[opacity,filter] duration-200 ease-in-out group-hover:opacity-100 group-hover:grayscale-0"
          />
        </div>
        <h3 className="mb-2.5 mt-0 text-base font-semibold">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${title} at ${company} (opens in new tab)`}
            className="inline-flex items-baseline gap-1 text-sky-200 no-underline transition-colors duration-200 ease-in-out hover:text-sky-200"
          >
            {title}
            <span
              aria-hidden="true"
              className="inline-block text-[0.85rem] text-slate-500 transition-transform duration-200 ease-in-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-purple-700"
            >
              {' '}
              ↗
            </span>
          </a>
        </h3>
        <p className="text-slate-400">{description}</p>
        <ul
          className="m-0 flex list-none flex-wrap gap-2 p-0 mt-3"
          aria-label="Technologies used"
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
      </div>
    </div>
  )
}

const WorkExperience = ({ data }: WorkExperienceProps): JSX.Element | null => {
  if (!data || data.length === 0) return null

  return (
    <section id="work" className="portfolio-section pb-[100px]">
      <h2 className="mb-8 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-sky-200">
        Experience
      </h2>
      <div className="flex flex-col gap-1">
        {data.map((item) => (
          <WorkItem key={item._id || item.href} item={item} />
        ))}
      </div>
    </section>
  )
}

export default WorkExperience
