/**
 * GROQ query + result types for the Work Experience timeline section.
 *
 * The schema (sanity/schemas/workExperienceEntry.ts) treats each
 * employment record as its own `workExperienceEntry` document. The
 * Next.js Experience page-level fetch consumes this query at build
 * time for SSG rendering and passes the resulting
 * `WorkExperienceEntry[]` into the component via its `data` prop.
 *
 * Mirrors the legacy inline data shape in
 * src/components/WorkExperience/data.js:
 *   { image, href, company, date, title, description, tools[] }
 *
 * The Sanity field `dates` is exposed under the alias `date` to keep
 * the consuming component's prop contract unchanged across the
 * migration. The asset reference on `logo` is left intact so callers
 * can run it through `urlForImage()` (see ../image.ts) to obtain a CDN
 * URL with width/height transforms applied at the call site.
 */
import type { SanityImageObject } from '@sanity/image-url/lib/types/types'

export interface WorkExperienceLogo extends SanityImageObject {
  /** Optional accessible alt text authored alongside the asset. */
  alt?: string
}

export interface WorkExperienceEntry {
  /** Stable Sanity document id — useful as React key. */
  _id: string
  /** Company display name. */
  company: string
  /** External link opened from the role title. */
  href: string
  /** Asset reference for the company logo, resolved via `urlForImage()`. */
  logo: WorkExperienceLogo
  /**
   * Free-text range string (e.g. "Feb. 2024 - Feb. 2026").
   * Aliased from the schema's `dates` field for legacy-prop parity.
   */
  date: string
  /** Role title at the company. */
  title: string
  /** Free-text description / accomplishments. */
  description: string
  /** Ordered tech stack rendered as pill list. */
  tools: string[]
  /** Sort weight — lower renders earlier. Mirrored from schema. */
  order: number
}

/**
 * Selects every `workExperienceEntry` document, sorted ascending by the
 * `order` field so editors control the timeline sequence from the
 * Studio. Returns an empty array — never null — when no entries have
 * been authored yet so the consuming component can `.map` without a
 * null guard at the root.
 *
 * Field projection:
 *   - `date` is aliased from the schema's `dates` field.
 *   - `logo` keeps its full asset reference so the component can apply
 *     `urlForImage(...).width(96).height(96).url()` transforms.
 */
export const workExperienceQuery = /* groq */ `
  *[_type == "workExperienceEntry"] | order(order asc){
    _id,
    company,
    href,
    logo{
      ...,
      "alt": coalesce(alt, company + " logo")
    },
    "date": dates,
    title,
    description,
    tools,
    order
  }
`

export default workExperienceQuery
