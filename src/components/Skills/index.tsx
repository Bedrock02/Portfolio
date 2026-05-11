import React from 'react'
import type { SkillGroup } from '../../lib/sanity/queries/skills'

/**
 * Skills section.
 *
 * All groups + pills come from Sanity (`skillGroup` document type).
 * The Next.js page fetches at build time via the GROQ query in
 * `src/lib/sanity/queries/skills.ts` and passes the resulting
 * `SkillGroup[]` through the `data` prop. No inline content lives here —
 * the legacy `src/components/Skills/data.js` was removed in Sub-AC 8.4.
 *
 * Styling: Tailwind utility classes only. The `portfolio-section` class
 * is retained as a JS hook for the IntersectionObserver in `Layout`.
 *
 * Rendering rules:
 *   - Empty/missing `data` renders nothing — keeps SSG output clean when
 *     no groups have been authored yet.
 *   - Group order is governed entirely by the GROQ `order asc` sort; this
 *     component never re-sorts.
 *   - `_id` is used as the React key when present, falling back to
 *     `category` for legacy fixtures that don't carry Sanity ids.
 */
export interface SkillsProps {
  /** GROQ result from `skillsQuery`. May be empty/undefined pre-authoring. */
  data?: SkillGroup[]
}

const Skills = ({ data }: SkillsProps): JSX.Element | null => {
  if (!data || data.length === 0) return null

  return (
    <section id="skills" className="portfolio-section pb-[100px]">
      <h2 className="mb-8 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-sky-200">
        Skills
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {data.map(({ _id, category, skills }) => (
          <div
            key={_id || category}
            className="rounded-md border border-navy-800 bg-navy-600/5 p-5 transition-colors duration-200 ease-in-out hover:border-navy-600 hover:bg-navy-600/15"
          >
            <h3 className="mb-3 mt-0 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-sky-200">
              {category}
            </h3>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {skills.map((skill, idx) => (
                <li
                  key={`${skill}-${idx}`}
                  className="rounded-[20px] bg-purple-700/20 px-3 py-1 text-[0.72rem] font-semibold tracking-wide text-purple-300"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
