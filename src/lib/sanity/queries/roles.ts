/**
 * GROQ query + result types for the About / Roles grid section.
 *
 * The schema (sanity/schemas/roleEntry.ts) stores each role card as
 * its own `roleEntry` document. The Next.js Roles page-level fetch
 * consumes this query at build time for SSG rendering and passes the
 * resulting `RoleEntry[]` into the component via its `data` prop.
 *
 * Mirrors the legacy roleCard structure previously hardcoded inside
 * src/components/Roles, preserving:
 *   - `icon`        — identifier keyed into the component icon map.
 *   - `title`       — role headline.
 *   - `description` — short blurb.
 *   - `tools`       — tech identifiers rendered as icon pills.
 *   - `audience`    — target audience tags (e.g. "Startups").
 */

export interface RoleEntry {
  /** Stable Sanity document id — useful as React key. */
  _id: string
  /** Headline for the role card. */
  title: string
  /** Icon identifier mapped by the component icon map. */
  icon: string
  /** Short blurb describing the role. */
  description: string
  /** Tech identifiers rendered as icon pills. */
  tools: string[]
  /** Target audience tags. May be empty when omitted by the editor. */
  audience: string[]
  /** Sort weight — lower renders earlier. Mirrored from schema. */
  order: number
}

/**
 * Selects every `roleEntry` document, sorted ascending by the `order`
 * field so editors control the grid sequence from the Studio. Returns
 * an empty array — never null — when no roles have been authored yet
 * so the consuming component can `.map` without a null guard.
 *
 * `audience` is coalesced to `[]` because the schema permits zero
 * audience tags and GROQ otherwise emits `null` for missing arrays.
 */
export const rolesQuery = /* groq */ `
  *[_type == "roleEntry"] | order(order asc){
    _id,
    title,
    icon,
    description,
    tools,
    "audience": coalesce(audience, []),
    order
  }
`

export default rolesQuery
