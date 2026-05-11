/**
 * Sanity HTTP client singletons.
 *
 * Exposes two prebuilt clients:
 *   - `sanityClient`        — CDN-backed, anonymous reads. Used for
 *                             SSG fetches at `next build` time.
 *   - `sanityPreviewClient` — direct API (CDN off), authenticated with
 *                             the server-only read token. Used for
 *                             draft-aware preview rendering.
 *
 * Both reuse the same project / dataset / api version so a content
 * change shows the same shape in production and preview.
 *
 * Why singletons: `@sanity/client` opens HTTP/2 sessions and caches
 * GROQ responses internally. Re-creating clients per request defeats
 * that cache and inflates cold-start latency on Vercel.
 */
import { createClient, type SanityClient } from '@sanity/client'

import {
  apiVersion,
  dataset,
  hasReadToken,
  projectId,
  readToken,
} from './env'

/**
 * Build a client. Kept private so callers always go through the
 * singletons below, which guarantees consistent caching + token usage.
 */
const buildClient = (options: {
  useCdn: boolean
  token?: string
  perspective?: 'published' | 'previewDrafts'
}): SanityClient => {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: options.useCdn,
    token: options.token,
    perspective: options.perspective ?? 'published',
    // `stega` left at default (off) — we render plain strings in SSG
    // pages, so embedding edit-overlay metadata adds bytes for no win.
  })
}

/**
 * Production client used by SSG page-level fetches.
 *
 * `useCdn: true` reads from api.sanity.io's CDN edge cache — fine for
 * `next build` because we always read the latest published content.
 * Drafts are excluded server-side; the consumer cannot accidentally
 * ship an unpublished record into the bundle.
 */
export const sanityClient: SanityClient = buildClient({
  useCdn: true,
  perspective: 'published',
})

/**
 * Preview client used when rendering with `?preview=...` (or any
 * draft-aware route). Skips the CDN so editors see writes within a
 * few seconds and authenticates with the server-only read token so
 * unpublished drafts are returned.
 *
 * When no `SANITY_API_READ_TOKEN` is configured we fall back to the
 * published client. That way the route can call `previewClient` without
 * having to branch on env-var presence at the call site.
 */
export const sanityPreviewClient: SanityClient = hasReadToken
  ? buildClient({
      useCdn: false,
      token: readToken,
      perspective: 'previewDrafts',
    })
  : sanityClient

/**
 * Resolve the correct client for a given preview flag. Page-level
 * fetches can call this once and forget about preview wiring.
 *
 *   const client = getSanityClient({ preview: searchParams.preview === '1' })
 *   const data = await client.fetch(profileQuery)
 */
export const getSanityClient = ({
  preview,
}: {
  preview?: boolean
}): SanityClient => {
  return preview ? sanityPreviewClient : sanityClient
}

export default sanityClient
