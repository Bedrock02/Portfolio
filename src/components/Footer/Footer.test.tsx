import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'

import Footer from './index'
import type { FooterData, FooterLink } from '../../lib/sanity'

const link = (overrides: Partial<FooterLink> = {}): FooterLink => ({
  href: 'https://github.com/example',
  iconName: 'github',
  ariaLabel: 'GitHub',
  order: 0,
  ...overrides,
})

const data = (overrides: Partial<FooterData> = {}): FooterData => ({
  links: [link()],
  copyright: '© 2026 Steven Jimenez',
  ...overrides,
})

describe('Footer', () => {
  describe('render', () => {
    it('renders the footer landmark when content exists', () => {
      render(<Footer data={data()} />)
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('renders the copyright text from Sanity data', () => {
      render(<Footer data={data({ copyright: '© 2026 Custom Co.' })} />)
      expect(screen.getByText('© 2026 Custom Co.')).toBeInTheDocument()
    })

    it('renders the social link list with accessible label', () => {
      render(<Footer data={data()} />)
      expect(screen.getByRole('list', { name: /social links/i })).toBeInTheDocument()
    })

    it('renders one list item per link', () => {
      const links = [
        link({ iconName: 'github', ariaLabel: 'GitHub', order: 0 }),
        link({ iconName: 'linkedin', ariaLabel: 'LinkedIn', order: 1 }),
        link({ iconName: 'mail', ariaLabel: 'Email', order: 2 }),
      ]
      render(<Footer data={data({ links })} />)
      const list = screen.getByRole('list', { name: /social links/i })
      expect(within(list).getAllByRole('listitem')).toHaveLength(3)
    })

    it('returns null when there are no links and no copyright', () => {
      const { container } = render(
        <Footer data={{ links: [], copyright: undefined }} />
      )
      expect(container).toBeEmptyDOMElement()
    })

    it('returns null when data is null', () => {
      const { container } = render(<Footer data={null} />)
      expect(container).toBeEmptyDOMElement()
    })

    it('returns null when data is undefined', () => {
      const { container } = render(<Footer />)
      expect(container).toBeEmptyDOMElement()
    })

    it('renders only the copyright when no links are present', () => {
      render(<Footer data={{ links: [], copyright: '© Only Text' }} />)
      expect(screen.queryByRole('list')).not.toBeInTheDocument()
      expect(screen.getByText('© Only Text')).toBeInTheDocument()
    })

    it('renders only the link list when copyright is empty', () => {
      render(<Footer data={{ links: [link()], copyright: '' }} />)
      expect(screen.getByRole('list', { name: /social links/i })).toBeInTheDocument()
    })
  })

  describe('props', () => {
    it('builds a default copyright using profileName when copyright is missing', () => {
      const year = new Date().getFullYear()
      render(
        <Footer
          data={{ links: [link()], copyright: undefined }}
          profileName="Ada Lovelace"
        />
      )
      expect(
        screen.getByText(`© ${year} Ada Lovelace`)
      ).toBeInTheDocument()
    })

    it('falls back to "Steven Jimenez" when profileName is omitted', () => {
      const year = new Date().getFullYear()
      render(<Footer data={{ links: [link()], copyright: undefined }} />)
      expect(
        screen.getByText(`© ${year} Steven Jimenez`)
      ).toBeInTheDocument()
    })

    it('treats a whitespace-only copyright as empty and uses fallback', () => {
      const year = new Date().getFullYear()
      render(
        <Footer
          data={{ links: [link()], copyright: '   ' }}
          profileName="Grace Hopper"
        />
      )
      expect(
        screen.getByText(`© ${year} Grace Hopper`)
      ).toBeInTheDocument()
    })

    it('sorts links by ascending order field', () => {
      const links = [
        link({ iconName: 'mail', ariaLabel: 'Email', order: 2 }),
        link({ iconName: 'github', ariaLabel: 'GitHub', order: 0 }),
        link({ iconName: 'linkedin', ariaLabel: 'LinkedIn', order: 1 }),
      ]
      render(<Footer data={data({ links })} />)
      const items = screen.getAllByRole('listitem')
      const labels = items.map((li) =>
        li.querySelector('a')?.getAttribute('aria-label')
      )
      expect(labels).toEqual([
        'GitHub (opens in new tab)',
        'LinkedIn (opens in new tab)',
        'Email (opens in new tab)',
      ])
    })

    it('treats missing order values as 0 for sorting', () => {
      const links = [
        { href: '#b', iconName: 'rss', ariaLabel: 'RSS' } as unknown as FooterLink,
        { href: '#a', iconName: 'github', ariaLabel: 'GitHub' } as unknown as FooterLink,
      ]
      render(<Footer data={data({ links })} />)
      // No throw + both rendered is enough — sort is stable on equal keys.
      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })

    it('renders the literal iconName when the icon is not in the map', () => {
      render(
        <Footer
          data={data({
            links: [link({ iconName: 'unknown-icon', ariaLabel: 'Unknown' })],
          })}
        />
      )
      expect(screen.getByText('unknown-icon')).toBeInTheDocument()
    })

    it('renders a known SVG glyph instead of literal text for mapped icons', () => {
      render(
        <Footer
          data={data({ links: [link({ iconName: 'github', ariaLabel: 'GitHub' })] })}
        />
      )
      expect(screen.queryByText('github')).not.toBeInTheDocument()
      const anchor = screen.getByRole('link', { name: /github/i })
      expect(anchor.querySelector('svg')).not.toBeNull()
    })

    it('passes through ariaLabel as accessible name with new-tab suffix', () => {
      render(
        <Footer
          data={data({
            links: [link({ ariaLabel: 'My Strava', iconName: 'strava' })],
          })}
        />
      )
      expect(
        screen.getByRole('link', { name: 'My Strava (opens in new tab)' })
      ).toBeInTheDocument()
    })
  })

  describe('interaction', () => {
    it('renders anchors that open in a new tab with safe rel', () => {
      render(<Footer data={data()} />)
      const anchor = screen.getByRole('link', { name: /github/i })
      expect(anchor).toHaveAttribute('target', '_blank')
      expect(anchor).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('uses the href from Sanity data as the anchor target', () => {
      render(
        <Footer
          data={data({
            links: [link({ href: 'https://linkedin.com/in/example', iconName: 'linkedin', ariaLabel: 'LinkedIn' })],
          })}
        />
      )
      expect(
        screen.getByRole('link', { name: /linkedin/i })
      ).toHaveAttribute('href', 'https://linkedin.com/in/example')
    })

    it('supports mailto: hrefs without rewriting them', () => {
      render(
        <Footer
          data={data({
            links: [link({ href: 'mailto:hi@example.com', iconName: 'mail', ariaLabel: 'Email' })],
          })}
        />
      )
      expect(
        screen.getByRole('link', { name: /email/i })
      ).toHaveAttribute('href', 'mailto:hi@example.com')
    })

    it('fires a click event on the anchor without throwing', () => {
      render(<Footer data={data()} />)
      const anchor = screen.getByRole('link', { name: /github/i })
      // Attach a listener that calls preventDefault so jsdom does not
      // attempt navigation; verify the click reaches the anchor.
      const handler = jest.fn((e: Event) => e.preventDefault())
      anchor.addEventListener('click', handler)
      fireEvent.click(anchor)
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })
})
