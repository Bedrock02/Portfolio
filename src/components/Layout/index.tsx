'use client'

import { useEffect, type ReactNode } from 'react'

import Footer from '../Footer'
import Header from '../Header'
import Profile from '../Profile'
import type { FooterData, ProfileData } from '../../lib/sanity'

/**
 * Site chrome (sidebar + main column) rendered around every App Router
 * page. The parent server layout (`src/app/layout.tsx`) fetches the
 * `profileData` and `footerData` singletons from Sanity at build time
 * and forwards them through as props — no `fetch` runs in this client
 * island.
 *
 * This component is marked `'use client'` for two reasons:
 *   1. The IntersectionObserver below adds a `section-visible` class
 *      to `.portfolio-section` elements as they scroll into view to
 *      power the fade-in animation declared in `globals.css`.
 *   2. The nested `Header` uses `useState` + `useEffect` to track the
 *      active anchor link, which already crosses the client boundary.
 *
 * Props are optional so legacy callers (and unit tests that exercise
 * the chrome without mocking Sanity) can still mount the component
 * with reasonable empty-state behaviour.
 */
export interface LayoutProps {
  children: ReactNode
  /** Sanity `profileData` singleton — `null` when unauthored. */
  profile?: ProfileData | null
  /** Sanity `footerData` singleton — `null` when unauthored. */
  footer?: FooterData | null
}

function Layout({ children, profile = null, footer = null }: LayoutProps): JSX.Element {
  useEffect(() => {
    const sections = document.querySelectorAll('.portfolio-section')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 },
    )
    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-navy-800 focus:px-4 focus:py-2 focus:text-sky-200 focus:outline focus:outline-2 focus:outline-navy-600"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex min-h-screen max-w-page flex-col bg-navy-950 px-6 text-slate-500 sm:px-10 lg:flex-row lg:px-12">
        <aside
          className="flex w-full flex-shrink-0 flex-col justify-between py-12 lg:sticky lg:top-0 lg:h-screen lg:w-[45%] lg:max-w-sidebar lg:py-24 lg:pr-12"
          aria-label="Site navigation and profile"
        >
          <div className="flex flex-1 flex-col">
            <Profile data={profile} />
            <Header />
          </div>
          <Footer data={footer} profileName={profile?.name} />
        </aside>
        <main id="main-content" className="flex-1 py-10 lg:py-24 lg:pl-12">
          {children}
        </main>
      </div>
    </>
  )
}

export default Layout
