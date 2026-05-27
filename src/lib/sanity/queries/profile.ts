/**
 * GROQ query + result type for the Profile hero singleton.
 *
 * The schema (sanity/schemas/profileData.ts) treats `profileData` as a
 * singleton document type, so the query selects the first match and
 * returns null when no document has been authored yet. Page-level
 * `generateStaticParams` / `fetch` in the App Router consumes this query
 * at build time for SSG rendering.
 */

export interface ProfileData {
  name: string
  title: string
  tagline: string
  resumeUrl: string
  resumeLabel: string
  openToWork: boolean
  openToWorkLabel: string
  contactEmail?: string
}

/**
 * Selects the singleton profileData document. Order by `_updatedAt desc`
 * so the most recent draft / published edit wins if multiple exist.
 */
export const profileQuery = /* groq */ `
  *[_type == "profileData"] | order(_updatedAt desc)[0]{
    name,
    title,
    tagline,
    "resumeUrl": resumeUrl,
    "resumeLabel": coalesce(resumeLabel, "View Full Résumé"),
    "openToWork": coalesce(openToWork, false),
    "openToWorkLabel": coalesce(openToWorkLabel, "Open to new opportunities"),
    contactEmail
  }
`

export default profileQuery
