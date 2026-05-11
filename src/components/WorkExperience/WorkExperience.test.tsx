import React from 'react'
import { render, screen, within } from '@testing-library/react'

import WorkExperience from './index'
import type {
  WorkExperienceEntry,
  WorkExperienceLogo,
} from '../../lib/sanity/queries/workExperience'

/**
 * Mock the Sanity image helpers so component rendering stays hermetic.
 *
 * `urlForImage` in production returns a chainable builder backed by the
 * Sanity HTTP client. In tests we don't want to assert on CDN-transform
 * URL shape — only that the component wires up the logo + alt props
 * correctly — so we substitute a fake builder whose chain terminates in a
 * predictable URL and keep `altForImage` semantically equivalent to the
 * real helper.
 */
jest.mock('../../lib/sanity/image', () => {
  type FakeBuilder = {
    width: (n: number) => FakeBuilder
    height: (n: number) => FakeBuilder
    fit: (mode: string) => FakeBuilder
    auto: (mode: string) => FakeBuilder
    url: () => string
  }
  const builder: FakeBuilder = {
    width: () => builder,
    height: () => builder,
    fit: () => builder,
    auto: () => builder,
    url: () => 'https://cdn.test/logo.png',
  }
  return {
    urlForImage: () => builder,
    altForImage: (
      logo: { alt?: string } | undefined,
      fallback: string,
    ): string =>
      logo && typeof logo.alt === 'string' && logo.alt.trim().length > 0
        ? logo.alt
        : fallback,
  }
})

const logoRef: WorkExperienceLogo = {
  _type: 'image',
  asset: { _ref: 'image-abc-100x100-png', _type: 'reference' },
} as unknown as WorkExperienceLogo

const entry = (
  overrides: Partial<WorkExperienceEntry> = {},
): WorkExperienceEntry => ({
  _id: 'workExperienceEntry-acme',
  company: 'Acme Inc.',
  href: 'https://acme.example.com',
  logo: logoRef,
  date: 'Jan. 2020 - Dec. 2022',
  title: 'Senior Engineer',
  description: 'Built things, broke things, fixed things.',
  tools: ['TypeScript', 'React', 'Node'],
  order: 0,
  ...overrides,
})

describe('WorkExperience', () => {
  describe('render', () => {
    it('renders the section landmark when entries exist', () => {
      const { container } = render(<WorkExperience data={[entry()]} />)
      const section = container.querySelector('section#work')
      expect(section).not.toBeNull()
      expect(section).toHaveClass('portfolio-section')
    })

    it('renders the "Experience" heading at the top of the section', () => {
      render(<WorkExperience data={[entry()]} />)
      expect(
        screen.getByRole('heading', { level: 2, name: /experience/i }),
      ).toBeInTheDocument()
    })

    it('renders nothing when data prop is undefined', () => {
      const { container } = render(<WorkExperience />)
      expect(container).toBeEmptyDOMElement()
    })

    it('renders nothing when data is an empty array', () => {
      const { container } = render(<WorkExperience data={[]} />)
      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('list rendering', () => {
    it('renders one entry heading per data row', () => {
      const data = [
        entry({ _id: 'a', title: 'Engineer I', company: 'A' }),
        entry({ _id: 'b', title: 'Engineer II', company: 'B' }),
        entry({ _id: 'c', title: 'Engineer III', company: 'C' }),
      ]
      render(<WorkExperience data={data} />)
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3)
    })

    it('renders the date string for each entry', () => {
      const data = [
        entry({ _id: 'a', date: 'Feb. 2024 - Feb. 2026' }),
        entry({ _id: 'b', date: 'Aug. 2018 - Jan. 2024' }),
      ]
      render(<WorkExperience data={data} />)
      expect(screen.getByText('Feb. 2024 - Feb. 2026')).toBeInTheDocument()
      expect(screen.getByText('Aug. 2018 - Jan. 2024')).toBeInTheDocument()
    })

    it('renders the description text for each entry', () => {
      render(
        <WorkExperience
          data={[entry({ description: 'Led platform migration.' })]}
        />,
      )
      expect(screen.getByText('Led platform migration.')).toBeInTheDocument()
    })

    it('preserves the order of entries as passed in (no client re-sort)', () => {
      const data = [
        entry({ _id: 'a', title: 'Third', order: 99 }),
        entry({ _id: 'b', title: 'First', order: 1 }),
        entry({ _id: 'c', title: 'Second', order: 2 }),
      ]
      render(<WorkExperience data={data} />)
      const titles = screen
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent || '')
      // Heading text contains the title plus the trailing " ↗" arrow glyph.
      expect(titles[0]).toMatch(/^Third/)
      expect(titles[1]).toMatch(/^First/)
      expect(titles[2]).toMatch(/^Second/)
    })

    it('falls back to href as React key when _id is missing', () => {
      const fixture = [
        {
          company: 'Legacy Co',
          href: 'https://legacy.example.com',
          logo: logoRef,
          date: '2010',
          title: 'Legacy Engineer',
          description: 'Before Sanity.',
          tools: ['Perl'],
          order: 0,
        } as unknown as WorkExperienceEntry,
      ]
      render(<WorkExperience data={fixture} />)
      expect(
        screen.getByRole('heading', { level: 3, name: /Legacy Engineer/i }),
      ).toBeInTheDocument()
    })
  })

  describe('tech stack display', () => {
    it('renders one list item per tool in the stack', () => {
      render(
        <WorkExperience
          data={[entry({ tools: ['TypeScript', 'Go', 'Postgres'] })]}
        />,
      )
      const list = screen.getByRole('list', { name: /technologies used/i })
      expect(within(list).getAllByRole('listitem')).toHaveLength(3)
    })

    it('renders each tool string as visible text', () => {
      render(
        <WorkExperience data={[entry({ tools: ['React', 'GraphQL', 'AWS'] })]} />,
      )
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('GraphQL')).toBeInTheDocument()
      expect(screen.getByText('AWS')).toBeInTheDocument()
    })

    it('preserves the order of tools as authored', () => {
      render(
        <WorkExperience
          data={[entry({ tools: ['Tailwind', 'React', 'TypeScript'] })]}
        />,
      )
      const list = screen.getByRole('list', { name: /technologies used/i })
      const text = within(list)
        .getAllByRole('listitem')
        .map((li) => li.textContent)
      expect(text).toEqual(['Tailwind', 'React', 'TypeScript'])
    })

    it('labels each tech stack list for assistive tech', () => {
      const data = [
        entry({ _id: 'a', tools: ['React'] }),
        entry({ _id: 'b', tools: ['Go'] }),
      ]
      render(<WorkExperience data={data} />)
      const lists = screen.getAllByRole('list', { name: /technologies used/i })
      expect(lists).toHaveLength(2)
    })

    it('renders an empty pill list when an entry has no tools', () => {
      render(<WorkExperience data={[entry({ tools: [] })]} />)
      const list = screen.getByRole('list', { name: /technologies used/i })
      expect(within(list).queryAllByRole('listitem')).toHaveLength(0)
    })

    it('scopes tool pills to their parent entry', () => {
      const data = [
        entry({
          _id: 'a',
          title: 'Alpha',
          company: 'A',
          tools: ['React', 'Vue'],
        }),
        entry({
          _id: 'b',
          title: 'Beta',
          company: 'B',
          tools: ['Go', 'Python'],
        }),
      ]
      render(<WorkExperience data={data} />)
      const alphaHeading = screen.getByRole('heading', {
        level: 3,
        name: /Alpha/,
      })
      const alphaCard = alphaHeading.closest('.group') as HTMLElement
      const alphaTools = within(alphaCard)
        .getAllByRole('listitem')
        .map((li) => li.textContent)
      expect(alphaTools).toEqual(['React', 'Vue'])
    })
  })

  describe('logo + link wiring', () => {
    it('renders the company logo as an img with src from urlForImage', () => {
      render(<WorkExperience data={[entry({ company: 'Acme Inc.' })]} />)
      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', 'https://cdn.test/logo.png')
    })

    it('falls back to "<company> logo" as alt when logo has no alt field', () => {
      render(<WorkExperience data={[entry({ company: 'FallbackCo' })]} />)
      const img = screen.getByRole('img', { name: 'FallbackCo logo' })
      expect(img).toBeInTheDocument()
    })

    it('uses the authored alt text when present on the logo', () => {
      const customLogo = {
        ...logoRef,
        alt: 'Custom Logo Caption',
      } as WorkExperienceLogo
      render(<WorkExperience data={[entry({ logo: customLogo })]} />)
      expect(
        screen.getByRole('img', { name: 'Custom Logo Caption' }),
      ).toBeInTheDocument()
    })

    it('renders the title as a link with the entry href', () => {
      render(
        <WorkExperience
          data={[
            entry({
              title: 'Staff Engineer',
              company: 'Acme Inc.',
              href: 'https://acme.example.com/about',
            }),
          ]}
        />,
      )
      const link = screen.getByRole('link', {
        name: /Staff Engineer at Acme Inc\. \(opens in new tab\)/i,
      })
      expect(link).toHaveAttribute('href', 'https://acme.example.com/about')
    })

    it('opens role links in a new tab with safe rel attribute', () => {
      render(<WorkExperience data={[entry()]} />)
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')
    })

    it('includes an aria-hidden arrow glyph inside the title link', () => {
      const { container } = render(<WorkExperience data={[entry()]} />)
      const arrow = container.querySelector('a [aria-hidden="true"]')
      expect(arrow).not.toBeNull()
      expect(arrow?.textContent).toMatch(/↗/)
    })
  })
})
