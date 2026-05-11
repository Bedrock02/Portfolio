import './globals.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import Layout from '../components/Layout'
import {
  footerQuery,
  profileQuery,
  sanityClient,
  type FooterData,
  type ProfileData,
} from '../lib/sanity'

/**
 * Root App Router layout.
 *
 * Server component that runs at build time (SSG) and fetches the two
 * singleton documents that power every page chrome render:
 *   - `profileData`  → hero copy + SEO metadata source of truth
 *   - `footerData`   → sidebar social link list + copyright line
 *
 * Both fetches are issued in parallel and forwarded to the client
 * `Layout` island as props. The client island handles the
 * IntersectionObserver scroll-reveal animation while keeping data
 * acquisition on the server so no Sanity credentials leak into the
 * bundle and no API hop happens at request time.
 *
 * SEO is emitted via Next.js's Metadata API (replaces the legacy
 * `react-helmet` block). `generateMetadata` runs at the same build
 * step, reading the same Sanity profile document so site title, meta
 * description, and Open Graph tags stay in sync with the rendered
 * hero.
 */

const SITE_URL = 'https://wepadev.com/'
const FALLBACK_NAME = 'Steven Jimenez'
const FALLBACK_TITLE = 'Senior Software Engineer'
const FALLBACK_DESCRIPTION =
  'Steven Jimenez is a senior full-stack software engineer building product experiences that scale.'

/**
 * Derive the first non-empty paragraph from the multi-line Sanity
 * tagline. The hero shows the whole tagline; SEO surfaces benefit
 * from a single tight sentence so we trim conservatively.
 */
function firstParagraph(text: string | undefined): string | undefined {
  if (!text) return undefined
  const trimmed = text
    .split(/\n+/)
    .map((line) => line.trim())
    .find((line) => line.length > 0)
  return trimmed && trimmed.length > 0 ? trimmed : undefined
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata(): Promise<Metadata> {
  // Defensive: a fresh Sanity project may have no `profileData` doc
  // authored yet. Fall back to baked-in copy so `next build` never
  // crashes on a missing singleton.
  let profile: ProfileData | null = null
  try {
    profile = await sanityClient.fetch<ProfileData | null>(profileQuery)
  } catch {
    profile = null
  }

  const name = profile?.name?.trim() || FALLBACK_NAME
  const title = profile?.title?.trim() || FALLBACK_TITLE
  const description =
    firstParagraph(profile?.tagline) || FALLBACK_DESCRIPTION

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: name,
      template: `%s — ${name}`,
    },
    description,
    keywords: [name, 'portfolio', 'software engineer', 'full stack', 'Bedrock02'],
    authors: [{ name }],
    icons: {
      icon: '/static/favicon.png',
      shortcut: '/static/favicon.png',
    },
    openGraph: {
      type: 'website',
      url: SITE_URL,
      siteName: name,
      title: `${name} — ${title}`,
      description,
      images: [
        {
          url: '/static/profile2-3436f6fd1dbdc38c13e9ec70ef939e22.jpg',
          alt: name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} — ${title}`,
      description,
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}): Promise<JSX.Element> {
  // Same defensive pattern as generateMetadata — chrome renders with
  // sane fallbacks when Sanity hasn't been seeded yet.
  let profile: ProfileData | null = null
  let footer: FooterData | null = null
  try {
    ;[profile, footer] = await Promise.all([
      sanityClient.fetch<ProfileData | null>(profileQuery),
      sanityClient.fetch<FooterData | null>(footerQuery),
    ])
  } catch {
    profile = null
    footer = null
  }

  return (
    <html lang="en">
      <body>
        <Layout profile={profile} footer={footer}>
          {children}
        </Layout>
      </body>
    </html>
  )
}
