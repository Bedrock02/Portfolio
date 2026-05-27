import React from 'react'
import { render, screen, within } from '@testing-library/react'

import Skills from './index'
import type { SkillGroup } from '../../lib/sanity/queries/skills'

/**
 * Factory for `SkillGroup` fixtures. Keeps tests readable when they only
 * care about overriding a single field — defaults cover a realistic
 * single-pill group so the component has something to render.
 */
const group = (overrides: Partial<SkillGroup> = {}): SkillGroup => ({
  _id: 'skillGroup-frontend',
  category: 'Frontend',
  skills: ['TypeScript'],
  order: 0,
  ...overrides,
})

describe('Skills', () => {
  describe('render', () => {
    it('renders the section landmark when groups exist', () => {
      const { container } = render(<Skills data={[group()]} />)
      const section = container.querySelector('section#skills')
      expect(section).not.toBeNull()
      expect(section).toHaveClass('portfolio-section')
    })

    it('renders the "Skills" heading at the top of the section', () => {
      render(<Skills data={[group()]} />)
      expect(
        screen.getByRole('heading', { level: 2, name: /skills/i }),
      ).toBeInTheDocument()
    })

    it('renders one heading per skill group category', () => {
      const data = [
        group({ _id: 'g1', category: 'Frontend', skills: ['React'] }),
        group({ _id: 'g2', category: 'Backend', skills: ['Go'] }),
        group({ _id: 'g3', category: 'AI Tools', skills: ['Claude'] }),
      ]
      render(<Skills data={data} />)
      expect(
        screen.getByRole('heading', { level: 3, name: 'Frontend' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { level: 3, name: 'Backend' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { level: 3, name: 'AI Tools' }),
      ).toBeInTheDocument()
    })

    it('renders nothing when data prop is undefined', () => {
      const { container } = render(<Skills />)
      expect(container).toBeEmptyDOMElement()
    })

    it('renders nothing when data is an empty array', () => {
      const { container } = render(<Skills data={[]} />)
      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('list rendering', () => {
    it('renders one list per skill group', () => {
      const data = [
        group({ _id: 'g1', category: 'Frontend', skills: ['React'] }),
        group({ _id: 'g2', category: 'Backend', skills: ['Go'] }),
      ]
      render(<Skills data={data} />)
      expect(screen.getAllByRole('list')).toHaveLength(2)
    })

    it('renders one list item per skill string within a group', () => {
      const data = [
        group({
          _id: 'g1',
          category: 'Frontend',
          skills: ['React', 'TypeScript', 'Tailwind'],
        }),
      ]
      render(<Skills data={data} />)
      expect(screen.getAllByRole('listitem')).toHaveLength(3)
    })

    it('renders the literal skill text for every pill', () => {
      const data = [
        group({
          _id: 'g1',
          category: 'Frontend',
          skills: ['React', 'TypeScript', 'Tailwind'],
        }),
      ]
      render(<Skills data={data} />)
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      expect(screen.getByText('Tailwind')).toBeInTheDocument()
    })

    it('scopes skill pills to their parent group', () => {
      const data = [
        group({ _id: 'g1', category: 'Frontend', skills: ['React', 'Vue'] }),
        group({ _id: 'g2', category: 'Backend', skills: ['Go', 'Python'] }),
      ]
      render(<Skills data={data} />)
      const frontendHeading = screen.getByRole('heading', {
        level: 3,
        name: 'Frontend',
      })
      const card = frontendHeading.parentElement as HTMLElement
      const items = within(card).getAllByRole('listitem')
      const text = items.map((li) => li.textContent)
      expect(text).toEqual(['React', 'Vue'])
    })

    it('preserves the order of groups as passed in (no client re-sort)', () => {
      const data = [
        group({ _id: 'g3', category: 'AI Tools', skills: ['Claude'], order: 99 }),
        group({ _id: 'g1', category: 'Frontend', skills: ['React'], order: 1 }),
        group({ _id: 'g2', category: 'Backend', skills: ['Go'], order: 2 }),
      ]
      render(<Skills data={data} />)
      const headings = screen
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent)
      expect(headings).toEqual(['AI Tools', 'Frontend', 'Backend'])
    })

    it('preserves the order of skills within a group', () => {
      const data = [
        group({
          _id: 'g1',
          category: 'Frontend',
          skills: ['Tailwind', 'React', 'TypeScript'],
        }),
      ]
      render(<Skills data={data} />)
      const text = screen.getAllByRole('listitem').map((li) => li.textContent)
      expect(text).toEqual(['Tailwind', 'React', 'TypeScript'])
    })

    it('renders an empty pill list when a group has no skills', () => {
      const data = [group({ _id: 'g1', category: 'Empty', skills: [] })]
      render(<Skills data={data} />)
      expect(
        screen.getByRole('heading', { level: 3, name: 'Empty' }),
      ).toBeInTheDocument()
      expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    })

    it('handles a single group with a single skill', () => {
      render(
        <Skills
          data={[group({ _id: 'g1', category: 'Solo', skills: ['Only'] })]}
        />,
      )
      expect(screen.getByText('Solo')).toBeInTheDocument()
      expect(screen.getByText('Only')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
    })

    it('falls back to category as React key when _id is missing', () => {
      // Cast through `unknown` so the test fixture intentionally omits `_id`
      // even though the production type marks it as required.
      const fixture = [
        { category: 'Legacy', skills: ['A', 'B'], order: 0 } as unknown as SkillGroup,
      ]
      // Render under `act` by way of RTL; if the fallback throws, this fails.
      render(<Skills data={fixture} />)
      expect(
        screen.getByRole('heading', { level: 3, name: 'Legacy' }),
      ).toBeInTheDocument()
    })
  })
})
