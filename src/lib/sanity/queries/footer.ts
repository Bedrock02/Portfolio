/**
 * GROQ query + result types for the Footer / sidebar social link list.
 *
 * The schema (sanity/schemas/footerData.ts) treats `footerData` as a
 * singleton document type, so the query selects the first match and
 * returns null when no document has been authored yet. Page-level
 * `fetch` in the App Router consumes this query at build time for SSG
 * rendering.
 *
 * Mirrors the legacy linkData shape in src/components/Footer/data.js:
 *   { href, iconName, ariaLabel }
 * with an added `order` field so editors can drag-reorder links in
 * the Studio.
 */

export interface FooterLink {
  /** Target URL. Supports http(s):// and mailto: schemes. */
  href: string
  /** Icon identifier keyed into the component icon map. */
  iconName: string
  /** Accessible label for screen readers. */
  ariaLabel: string
  /** Sort weight within the link row — lower renders earlier. */
  order: number
}

export interface FooterData {
  /** Icon-button social links, sorted by ascending `order`. */
  links: FooterLink[]
  /** Optional copyright line rendered beneath the link row. */
  copyright?: string
}

/**
 * Selects the singleton footerData document. Order by
 * `_updatedAt desc` so the most recent draft / published edit wins if
 * multiple exist (defensive against editor mistakes — the Studio is
 * intended to keep exactly one).
 *
 * Inner array projection sorts links by `order` ascending so the
 * consuming component receives a render-ready list.
 */
export const footerQuery = /* groq */ `
  *[_type == "footerData"] | order(_updatedAt desc)[0]{
    "links": coalesce(links[]{
      href,
      iconName,
      ariaLabel,
      order
    } | order(order asc), []),
    copyright
  }
`

export default footerQuery
