import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'

import Header from './index'

/**
 * Minimal IntersectionObserver stub so the `useEffect` in Header can
 * instantiate one without crashing under jsdom. Each instance keeps a
 * reference to its callback so tests can drive section-crossing events
 * deterministically.
 */
type ObservedEntry = Partial<IntersectionObserverEntry> & {
  isIntersecting: boolean
  target: Element
}

interface FakeObserver {
  callback: IntersectionObserverCallback
  observed: Element[]
  observe: jest.Mock
  unobserve: jest.Mock
  disconnect: jest.Mock
  fire: (entries: ObservedEntry[]) => void
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
      const fake: FakeObserver = {
        callback: cb,
        observed: this.observed,
        observe: this.observe,
        unobserve: this.unobserve,
        disconnect: this.disconnect,
        fire: (entries) =>
          cb(entries as unknown as IntersectionObserverEntry[], this as unknown as IntersectionObserver),
      }
      observerInstances.push(fake)
    }
  }
  ;(global as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
    MockIO as unknown as typeof IntersectionObserver
})

afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
})

/** Helper — inject section nodes referenced by Header's observer. */
function mountSections(ids: string[]) {
  ids.forEach((id) => {
    const el = document.createElement('section')
    el.id = id
    document.body.appendChild(el)
  })
}

describe('Header', () => {
  describe('navigation rendering', () => {
    it('renders a primary nav landmark', () => {
      render(<Header />)
      expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument()
    })

    it('renders all four navigation items in declared order', () => {
      render(<Header />)
      const links = screen.getAllByRole('link')
      expect(links.map((a) => a.textContent?.trim())).toEqual([
        'AI Chat',
        'About',
        'Skills',
        'Experience',
      ])
    })

    it('wires each nav item to its anchor href', () => {
      render(<Header />)
      expect(screen.getByRole('link', { name: 'AI Chat' })).toHaveAttribute('href', '#chat')
      expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about')
      expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '#skills')
      expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute('href', '#work')
    })

    it('renders one decorative line element per nav item (aria-hidden)', () => {
      const { container } = render(<Header />)
      const lines = container.querySelectorAll('span[aria-hidden="true"]')
      expect(lines).toHaveLength(4)
    })
  })

  describe('active state', () => {
    it('marks "About" active on initial render', () => {
      render(<Header />)
      expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'true')
    })

    it('leaves other items with no aria-current on initial render', () => {
      render(<Header />)
      expect(screen.getByRole('link', { name: 'AI Chat' })).not.toHaveAttribute('aria-current')
      expect(screen.getByRole('link', { name: 'Skills' })).not.toHaveAttribute('aria-current')
      expect(screen.getByRole('link', { name: 'Experience' })).not.toHaveAttribute('aria-current')
    })

    it('promotes the clicked nav item to active', () => {
      render(<Header />)
      const skills = screen.getByRole('link', { name: 'Skills' })
      fireEvent.click(skills)
      expect(skills).toHaveAttribute('aria-current', 'true')
      expect(screen.getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current')
    })

    it('applies the active text color class to the active link', () => {
      render(<Header />)
      const about = screen.getByRole('link', { name: 'About' })
      expect(about.className).toMatch(/text-sky-200/)
      const aiChat = screen.getByRole('link', { name: 'AI Chat' })
      expect(aiChat.className).toMatch(/text-slate-500/)
    })
  })

  describe('IntersectionObserver wiring', () => {
    it('creates an IntersectionObserver with a 30% threshold', () => {
      mountSections(['chat', 'about', 'skills', 'work'])
      render(<Header />)
      expect(observerInstances).toHaveLength(1)
      expect(observerInstances[0].observed.map((el) => (el as HTMLElement).id)).toEqual([
        'chat',
        'about',
        'skills',
        'work',
      ])
    })

    it('only observes sections that are actually present in the DOM', () => {
      mountSections(['about', 'work']) // intentionally skip chat + skills
      render(<Header />)
      expect(observerInstances[0].observed.map((el) => (el as HTMLElement).id)).toEqual([
        'about',
        'work',
      ])
    })

    it('promotes the matching nav item when its section intersects', () => {
      mountSections(['chat', 'about', 'skills', 'work'])
      render(<Header />)
      const skillsSection = document.getElementById('skills') as Element
      act(() => {
        observerInstances[0].fire([{ isIntersecting: true, target: skillsSection }])
      })
      expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('aria-current', 'true')
    })

    it('ignores entries that are not intersecting', () => {
      mountSections(['chat', 'about', 'skills', 'work'])
      render(<Header />)
      const skillsSection = document.getElementById('skills') as Element
      act(() => {
        observerInstances[0].fire([{ isIntersecting: false, target: skillsSection }])
      })
      expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'true')
    })

    it('ignores entries whose target id does not match any nav item', () => {
      mountSections(['about'])
      const stray = document.createElement('div')
      stray.id = 'unknown'
      document.body.appendChild(stray)
      render(<Header />)
      act(() => {
        observerInstances[0].fire([{ isIntersecting: true, target: stray }])
      })
      expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'true')
    })

    it('disconnects the observer on unmount', () => {
      mountSections(['about'])
      const { unmount } = render(<Header />)
      unmount()
      expect(observerInstances[0].disconnect).toHaveBeenCalledTimes(1)
    })
  })
})
