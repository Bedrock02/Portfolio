/**
 * GROQ query + result types for the Skills section.
 *
 * The schema (sanity/schemas/skillGroup.ts) treats each skill category as
 * its own `skillGroup` document so editors can author groups
 * independently, drag-reorder via the `order` field, and add/remove
 * categories without code changes. The Next.js Skills page-level fetch
 * consumes this query at build time for SSG rendering and passes the
 * resulting `SkillGroup[]` into the component via its `data` prop.
 *
 * Mirrors the legacy inline `skillGroups` array previously co-located in
 * src/components/Skills/index.jsx, preserving:
 *   - `category`: pill-list heading (e.g. "Frontend", "AI Tools").
 *   - `skills`:   ordered list of short display strings rendered as pills.
 */

export interface SkillGroup {
  /** Stable Sanity document id — useful as React key. */
  _id: string
  /** Heading shown above the skill pill list. */
  category: string
  /** Pill-rendered skill strings in author-defined order. */
  skills: string[]
  /** Sort weight — lower renders earlier. Mirrored from schema. */
  order: number
}

/**
 * Selects every `skillGroup` document, sorted ascending by the `order`
 * field so editors control the grid sequence from the Studio. Returns an
 * empty array — never null — when no groups have been authored yet so
 * the consuming component can `.map` without a null guard at the root.
 */
export const skillsQuery = /* groq */ `
  *[_type == "skillGroup"] | order(order asc){
    _id,
    category,
    skills,
    order
  }
`

export default skillsQuery
