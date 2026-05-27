/**
 * Centralised env-var access for the Sanity layer.
 *
 * Reading env vars in one place keeps the rest of the lib free of
 * `process.env` lookups and makes test mocking trivial.
 *
 * All `NEXT_PUBLIC_*` vars are inlined by Next.js at build time so they
 * are safe to reference in both Server Components and the embedded
 * Studio. `SANITY_API_READ_TOKEN` is server-only and must never be
 * prefixed with NEXT_PUBLIC_.
 *
 * NOTE: Missing project id / dataset DO NOT throw. The App Router
 * `next build` runs `generateMetadata` + page-level fetches at compile
 * time; throwing at module-eval time would abort the build entirely.
 * The Sanity HTTP client tolerates a placeholder projectId — calls fail
 * at request time, and our page-level `try/catch` blocks degrade to
 * empty content. This keeps `next build` green on a fresh checkout
 * (e.g. CI without secrets) while still surfacing real config gaps via
 * the failed fetch path.
 */

/** Sanity project id — created in sanity.io/manage. */
export const projectId: string =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID.trim() !== ''
    ? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    : 'placeholder'

/** Dataset name — defaults to "production". */
export const dataset: string =
  process.env.NEXT_PUBLIC_SANITY_DATASET && process.env.NEXT_PUBLIC_SANITY_DATASET.trim() !== ''
    ? process.env.NEXT_PUBLIC_SANITY_DATASET
    : 'production'

/**
 * Pinned API version. Bumping requires a deliberate code change so GROQ
 * result shapes do not silently drift mid-deploy.
 */
export const apiVersion: string =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION && process.env.NEXT_PUBLIC_SANITY_API_VERSION.trim() !== ''
    ? process.env.NEXT_PUBLIC_SANITY_API_VERSION
    : '2024-05-01'

/**
 * Optional read token. Only required when fetching draft documents for
 * preview rendering — never bundled into the client by Next.js because
 * it lacks the `NEXT_PUBLIC_` prefix.
 */
export const readToken: string | undefined = process.env.SANITY_API_READ_TOKEN

/** Marker used by callers to decide whether preview fetches are possible. */
export const hasReadToken = typeof readToken === 'string' && readToken.length > 0

/** True when real Sanity credentials are configured. */
export const hasSanityConfig =
  !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID.trim() !== ''
