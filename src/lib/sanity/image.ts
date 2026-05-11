/**
 * Image URL builder for Sanity asset references.
 *
 * The Sanity `image` field stores an asset reference, not a URL. The
 * App Router can render that reference once it is resolved to a URL +
 * dimensions via `@sanity/image-url`. We expose a thin helper so
 * components stay declarative:
 *
 *   <Image
 *     src={urlForImage(entry.logo).width(96).height(96).url()}
 *     ...
 *   />
 *
 * Returns the builder directly so callers can chain `.width()`, `.fit()`,
 * `.auto('format')`, etc. without leaking Sanity-specific options into
 * call sites that just want a URL.
 */
import imageUrlBuilder from '@sanity/image-url'
import type { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder'
import type {
  SanityImageSource,
  SanityImageObject,
} from '@sanity/image-url/lib/types/types'

import { sanityClient } from './client'

/**
 * Shared builder bound to the production project + dataset. Reused
 * across calls so we don't re-parse client config on every render.
 */
const builder = imageUrlBuilder(sanityClient)

/**
 * Build an `ImageUrlBuilder` for a Sanity image source. Returning the
 * builder (rather than a string) lets callers chain transformations:
 *
 *   urlForImage(logo).width(96).height(96).fit('crop').url()
 */
export function urlForImage(source: SanityImageSource): ImageUrlBuilder {
  return builder.image(source)
}

/**
 * Resolve the alt text on a Sanity image. Falls back to a caller-
 * provided default so components never render an empty `alt` attribute,
 * which would degrade accessibility audits.
 */
export function altForImage(
  source: SanityImageObject & { alt?: string },
  fallback: string,
): string {
  return source.alt && source.alt.trim().length > 0 ? source.alt : fallback
}

export type { SanityImageSource, SanityImageObject }
