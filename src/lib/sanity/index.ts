/**
 * Top-level barrel for the Sanity data layer.
 *
 * Page-level fetches and Server Components should import from this
 * module rather than reaching into the `client` / `queries` / `image`
 * sub-modules directly. Keeping the surface flat means we can rework
 * the internal layout (e.g. splitting out a `live` client for ISR)
 * without touching call sites.
 *
 * Typical usage:
 *
 *   import {
 *     getSanityClient,
 *     profileQuery,
 *     type ProfileData,
 *   } from '@/lib/sanity'
 *
 *   const client = getSanityClient({ preview: false })
 *   const data: ProfileData | null = await client.fetch(profileQuery)
 */

export {
  sanityClient,
  sanityPreviewClient,
  getSanityClient,
} from './client'

export { urlForImage, altForImage } from './image'
export type { SanityImageObject, SanityImageSource } from './image'

export * from './queries'
