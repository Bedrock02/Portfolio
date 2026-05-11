import React from 'react'
import { render, screen, within } from '@testing-library/react'

import Roles from './index'
import type { RoleEntry } from '../../lib/sanity/queries/roles'

const role = (overrides: Partial<RoleEntry> = {}): RoleEntry => ({
  _id: 'role-1',
  title: 'Full-Stack Engineer',
  icon: 'code',
  description: 'Ship end-to-end product features.',
  tools: ['React', 'TypeScript'],
  audience: ['Startups'],
  order: 0,
  ...overrides,
})

describe('Roles', () => {
  describe('render — empty / missing data', () => {
    it('returns null when data prop is undefined', () => {
      const { container } = render(<Roles />)
      expect(container).toBeEmptyDOMElement()
    })

    it('returns null when data prop is null', () => {
      const { container } = render(<Roles data={null} />)
      expect(container).toBeEmptyDOMElement()
    })

    it('returns null when data is an empty array', () => {
      const { container } = render(<Roles data={[]} />)
      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('render — section + headline', () => {
    it('renders the About headline when data exists', () => {
      render(<Roles data={[role()]} />)
      expect(
        screen.getByRole('heading', { level: 2, name: /about/i })
      ).toBeInTheDocument()
    })

    it('renders the about section with the anchor id', () => {
      const { container } = render(<Roles data={[role()]} />)
      const section = container.querySelector('section#about')
      expect(section).not.toBeNull()
    })

    it('retains the portfolio-section JS hook for the IntersectionObserver', () => {
      const { container } = render(<Roles data={[role()]} />)
      const section = container.querySelector('section#about')
      expect(section).toHaveClass('portfolio-section')
    })

    it('renders the role grid with an accessible label', () => {
      render(<Roles data={[role()]} />)
      expect(
        screen.getByRole('list', { name: /^roles$/i })
      ).toBeInTheDocument()
    })
  })

  describe('render — role card data from Sanity', () => {
    it('renders one card per RoleEntry', () => {
      const roles = [
        role({ _id: 'a', title: 'Frontend' }),
        role({ _id: 'b', title: 'Backend' }),
        role({ _id: 'c', title: 'DevOps' }),
      ]
      render(<Roles data={roles} />)
      const list = screen.getByRole('list', { name: /^roles$/i })
      const cards = within(list)
        .getAllByRole('listitem')
        .filter((el) => el.tagName === 'ARTICLE')
      expect(cards).toHaveLength(3)
    })

    it('renders the title from Sanity for each card', () => {
      render(<Roles data={[role({ title: 'Custom Role Title' })]} />)
      expect(
        screen.getByRole('heading', { level: 3, name: 'Custom Role Title' })
      ).toBeInTheDocument()
    })

    it('renders the description text from Sanity', () => {
      render(
        <Roles data={[role({ description: 'A unique role description.' })]} />
      )
      expect(
        screen.getByText('A unique role description.')
      ).toBeInTheDocument()
    })

    it('renders each tool as a list item under the card', () => {
      render(
        <Roles
          data={[
            role({
              title: 'Engineer',
              tools: ['Go', 'Python', 'AWS'],
            }),
          ]}
        />
      )
      const tools = screen.getByRole('list', { name: /tools for engineer/i })
      const items = within(tools).getAllByRole('listitem')
      expect(items).toHaveLength(3)
      expect(items.map((li) => li.textContent)).toEqual([
        'Go',
        'Python',
        'AWS',
      ])
    })

    it('renders each audience tag as a list item under the card', () => {
      render(
        <Roles
          data={[
            role({
              title: 'Engineer',
              audience: ['Startups', 'Enterprise teams'],
            }),
          ]}
        />
      )
      const tags = screen.getByRole('list', { name: /audience for engineer/i })
      expect(within(tags).getAllByRole('listitem')).toHaveLength(2)
      expect(screen.getByText('Startups')).toBeInTheDocument()
      expect(screen.getByText('Enterprise teams')).toBeInTheDocument()
    })

    it('omits the tools list when tools array is empty', () => {
      render(<Roles data={[role({ title: 'Engineer', tools: [] })]} />)
      expect(
        screen.queryByRole('list', { name: /tools for engineer/i })
      ).not.toBeInTheDocument()
    })

    it('omits the audience list when audience array is empty', () => {
      render(<Roles data={[role({ title: 'Engineer', audience: [] })]} />)
      expect(
        screen.queryByRole('list', { name: /audience for engineer/i })
      ).not.toBeInTheDocument()
    })

    it('uses _id as the stable React key (no console error on re-render)', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const roles = [
        role({ _id: 'one', title: 'One' }),
        role({ _id: 'two', title: 'Two' }),
      ]
      const { rerender } = render(<Roles data={roles} />)
      rerender(<Roles data={[...roles].reverse()} />)
      expect(spy).not.toHaveBeenCalledWith(
        expect.stringContaining('unique "key"'),
        expect.anything()
      )
      spy.mockRestore()
    })

    it('renders cards in the order provided by the Sanity query (no client re-sort)', () => {
      const roles = [
        role({ _id: 'first', title: 'Alpha', order: 5 }),
        role({ _id: 'second', title: 'Beta', order: 1 }),
        role({ _id: 'third', title: 'Gamma', order: 99 }),
      ]
      render(<Roles data={roles} />)
      const titles = screen
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent)
      expect(titles).toEqual(['Alpha', 'Beta', 'Gamma'])
    })
  })

  describe('icon mapping', () => {
    it('renders an SVG glyph for known icon identifiers', () => {
      render(<Roles data={[role({ icon: 'code' })]} />)
      const wrapper = screen.getByTestId('role-icon-code')
      expect(wrapper.querySelector('svg')).not.toBeNull()
    })

    it('renders the literal icon string when identifier is unmapped', () => {
      render(<Roles data={[role({ icon: 'unknown-icon' })]} />)
      const wrapper = screen.getByTestId('role-icon-unknown-icon')
      expect(wrapper.querySelector('svg')).toBeNull()
      expect(wrapper).toHaveTextContent('unknown-icon')
    })

    it('renders distinct icon wrappers for each unique role icon', () => {
      render(
        <Roles
          data={[
            role({ _id: 'a', icon: 'code' }),
            role({ _id: 'b', icon: 'server' }),
            role({ _id: 'c', icon: 'laptop' }),
          ]}
        />
      )
      expect(screen.getByTestId('role-icon-code')).toBeInTheDocument()
      expect(screen.getByTestId('role-icon-server')).toBeInTheDocument()
      expect(screen.getByTestId('role-icon-laptop')).toBeInTheDocument()
    })
  })
})
