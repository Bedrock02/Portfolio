import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, cleanup, within } from '@testing-library/react'

import Layout from './index'
import type { FooterData, ProfileData } from '../../lib/sanity'

/**
 * Layout nests Header, which spawns its own IntersectionObserver. So
 * any render of Layout produces TWO observer instances: Header's first
 * (child effects fire before parent effects in React), then Layout's.
 * Tests that need Layout's section-reveal observer specifically should
 * call `layoutObserver()` rather than indexing into the array blindly.
 */

/**
 * Same IO stub pattern as Header.test.tsx. Layout's effect attaches an
 * observer to `.portfolio-section` nodes — tests need to inspect what
 * was observed and trigger entries to validate the reveal animation
 * side effects.
 */
interface FakeObserver {
  callback: IntersectionObserverCallback
  observed: Element[]
  observe: jest.Mock
  unobserve: jest.Mock
  disconnect: jest.Mock
  fire: (entries: Array<Partial<IntersectionObserverEntry> & { isIntersecting: boolean; target: Element }>) => void
}

const observerInstances: FakeObserver[] = []

beforeEach(() => {
  observerInstances.length = 0
  class MockIO {
    callback: IntersectionObserverCallback
    observed: Element[] = []
    observe = jest.fn((el: Element) => {
      this.observed.push(el)
    })
    unobserve = jest.fn()
    disconnect = jest.fn()
    constructor(cb: IntersectionObserverCallback) {
      this.callback = cb
      observerInstances.push({
        callback: cb,
        observed: this.observed,
        observe: this.observe,
        unobserve: this.unobserve,
        disconnect: this.disconnect,
        fire: (entries) =>
          cb(entries as unknown as IntersectionObserverEntry[], this as unknown as IntersectionObserver),
      })
    }
  }
  ;(global as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
    MockIO as unknown as typeof IntersectionObserver
})

afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
})

/**
 * Pick the observer that watched `.portfolio-section` nodes — that one
 * belongs to Layout, not the nested Header.
 */
function layoutObserver(): FakeObserver {
  const found = observerInstances.find((io) =>
    io.observed.some((el) => (el as HTMLElement).classList?.contains('portfolio-section')),
  )
  if (!found) throw new Error('Layout IntersectionObserver was never created')
  return found
}

const profileFixture = (overrides: Partial<ProfileData> = {}): ProfileData => ({
  name: 'Ada Lovelace',
  title: 'Senior Software Engineer',
  tagline: 'Builds things that scale.',
  resumeUrl: 'https://example.com/resume.pdf',
  resumeLabel: 'View Résumé',
  openToWork: true,
  openToWorkLabel: 'Open to new opportunities',
  contactEmail: 'ada@example.com',
  ...overrides,
})

const footerFixture = (overrides: Partial<FooterData> = {}): FooterData => ({
  links: [
    {
      href: 'https://github.com/ada',
      iconName: 'github',
      ariaLabel: 'GitHub',
      order: 0,
    },
  ],
  copyright: '© 2026 Ada Lovelace',
  ...overrides,
})

describe('Layout', () => {
  describe('child rendering', () => {
    it('renders children inside the <main> landmark', () => {
      render(
        <Layout>
          <p data-testid="content">hello world</p>
        </Layout>,
      )
      const main = screen.getByRole('main')
      expect(within(main).getByTestId('content')).toHaveTextContent('hello world')
    })

    it('attaches id="main-content" to the <main> element', () => {
      render(<Layout>child</Layout>)
      expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
    })

    it('renders multiple children in order', () => {
      render(
        <Layout>
          <p>first</p>
          <p>second</p>
          <p>third</p>
        </Layout>,
      )
      const paragraphs = screen.getByRole('main').querySelectorAll('p')
      expect(Array.from(paragraphs).map((p) => p.textContent)).toEqual([
        'first',
        'second',
        'third',
      ])
    })

    it('still renders chrome when children is an empty fragment', () => {
      render(<Layout><></></Layout>)
      expect(screen.getByRole('main')).toBeInTheDocument()
    })
  })

  describe('navigation chrome', () => {
    it('renders the sidebar aside with an accessible label', () => {
      render(<Layout>child</Layout>)
      expect(
        screen.getByRole('complementary', { name: /site navigation and profile/i }),
      ).toBeInTheDocument()
    })

    it('mounts the primary Header inside the sidebar', () => {
      render(<Layout>child</Layout>)
      const aside = screen.getByRole('complementary')
      expect(within(aside).getByRole('navigation', { name: /primary/i })).toBeInTheDocument()
    })

    it('exposes all four primary nav items', () => {
      render(<Layout>child</Layout>)
      ;['AI Chat', 'About', 'Skills', 'Experience'].forEach((name) => {
        expect(screen.getByRole('link', { name })).toBeInTheDocument()
      })
    })
  })

  describe('SEO / accessibility surface', () => {
    it('renders a skip-to-main-content link as the first focusable element', () => {
      render(<Layout>child</Layout>)
      const skip = screen.getByRole('link', { name: /skip to main content/i })
      expect(skip).toHaveAttribute('href', '#main-content')
    })

    it('renders exactly one <main> landmark', () => {
      render(<Layout>child</Layout>)
      expect(screen.getAllByRole('main')).toHaveLength(1)
    })

    it('skip link target id matches the main landmark id', () => {
      render(<Layout>child</Layout>)
      const skipHref = screen.getByRole('link', { name: /skip to main content/i })
        .getAttribute('href')
      const mainId = screen.getByRole('main').getAttribute('id')
      expect(skipHref).toBe(`#${mainId}`)
    })
  })

  describe('profile + footer props', () => {
    it('renders the profile hero name when profile is provided', () => {
      render(<Layout profile={profileFixture()}>child</Layout>)
      expect(screen.getByRole('heading', { level: 1, name: 'Ada Lovelace' })).toBeInTheDocument()
    })

    it('omits the profile hero when profile is null', () => {
      render(<Layout profile={null}>child</Layout>)
      expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    })

    it('renders the footer landmark when footer is provided', () => {
      render(<Layout footer={footerFixture()}>child</Layout>)
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('omits the footer landmark when footer data is null and no profile is given', () => {
      render(<Layout profile={null} footer={null}>child</Layout>)
      expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
    })

    it('forwards profile name into the footer copyright fallback', () => {
      const year = new Date().getFullYear()
      render(
        <Layout
          profile={profileFixture({ name: 'Grace Hopper' })}
          footer={footerFixture({ copyright: undefined })}
        >
          child
        </Layout>,
      )
      expect(screen.getByText(`© ${year} Grace Hopper`)).toBeInTheDocument()
    })

    it('defaults profile and footer to null when props are omitted', () => {
      render(<Layout>child</Layout>)
      expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
      expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
    })
  })

  describe('section reveal IntersectionObserver', () => {
    it('observes every .portfolio-section element rendered as a child', () => {
      render(
        <Layout>
          <section className="portfolio-section" data-testid="s1" />
          <section className="portfolio-section" data-testid="s2" />
          <section>not observed</section>
        </Layout>,
      )
      expect(layoutObserver().observed).toHaveLength(2)
    })

    it('adds the section-visible class once a section intersects', () => {
      render(
        <Layout>
          <section className="portfolio-section" data-testid="s1" />
        </Layout>,
      )
      const section = screen.getByTestId('s1')
      expect(section.classList.contains('section-visible')).toBe(false)
      layoutObserver().fire([{ isIntersecting: true, target: section }])
      expect(section.classList.contains('section-visible')).toBe(true)
    })

    it('unobserves a section after it becomes visible', () => {
      render(
        <Layout>
          <section className="portfolio-section" data-testid="s1" />
        </Layout>,
      )
      const section = screen.getByTestId('s1')
      const io = layoutObserver()
      io.fire([{ isIntersecting: true, target: section }])
      expect(io.unobserve).toHaveBeenCalledWith(section)
    })

    it('does not promote a section that has not intersected yet', () => {
      render(
        <Layout>
          <section className="portfolio-section" data-testid="s1" />
        </Layout>,
      )
      const section = screen.getByTestId('s1')
      const io = layoutObserver()
      io.fire([{ isIntersecting: false, target: section }])
      expect(section.classList.contains('section-visible')).toBe(false)
      expect(io.unobserve).not.toHaveBeenCalled()
    })

    it('disconnects the observer on unmount', () => {
      const { unmount } = render(
        <Layout>
          <section className="portfolio-section" />
        </Layout>,
      )
      const io = layoutObserver()
      unmount()
      expect(io.disconnect).toHaveBeenCalledTimes(1)
    })
  })
})
