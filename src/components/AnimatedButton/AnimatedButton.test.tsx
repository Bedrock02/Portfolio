import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AnimatedButton from './index'

describe('AnimatedButton', () => {
  const defaultProps = {
    title: 'Resume',
    iconName: '↗',
    onClick: jest.fn(),
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    it('renders a button element', () => {
      render(<AnimatedButton {...defaultProps} />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('renders button with type="button" to avoid form submit', () => {
      render(<AnimatedButton {...defaultProps} />)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    })

    it('renders the title text', () => {
      render(<AnimatedButton {...defaultProps} title="Download CV" iconName="↓" />)
      expect(screen.getByText('Download CV')).toBeInTheDocument()
    })

    it('renders the iconName glyph', () => {
      render(<AnimatedButton {...defaultProps} title="Contact" iconName="✉" />)
      expect(screen.getByText('✉')).toBeInTheDocument()
    })

    it('marks the icon span as aria-hidden for screen readers', () => {
      const { container } = render(<AnimatedButton {...defaultProps} />)
      const hidden = container.querySelector('[aria-hidden="true"]')
      expect(hidden).not.toBeNull()
      expect(hidden).toHaveTextContent(defaultProps.iconName)
    })
  })

  describe('props', () => {
    it('renders different titles for different instances', () => {
      const { rerender } = render(
        <AnimatedButton title="First" iconName="A" onClick={jest.fn()} />
      )
      expect(screen.getByText('First')).toBeInTheDocument()

      rerender(<AnimatedButton title="Second" iconName="B" onClick={jest.fn()} />)
      expect(screen.queryByText('First')).not.toBeInTheDocument()
      expect(screen.getByText('Second')).toBeInTheDocument()
    })

    it('renders different iconName values', () => {
      const { rerender } = render(
        <AnimatedButton title="t" iconName="↗" onClick={jest.fn()} />
      )
      expect(screen.getByText('↗')).toBeInTheDocument()

      rerender(<AnimatedButton title="t" iconName="★" onClick={jest.fn()} />)
      expect(screen.queryByText('↗')).not.toBeInTheDocument()
      expect(screen.getByText('★')).toBeInTheDocument()
    })

    it('does not invoke onClick during mount', () => {
      const handler = jest.fn()
      render(<AnimatedButton title="t" iconName="i" onClick={handler} />)
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('interaction', () => {
    it('invokes onClick when the button is clicked', () => {
      const handler = jest.fn()
      render(<AnimatedButton title="Click me" iconName=">" onClick={handler} />)

      fireEvent.click(screen.getByRole('button'))

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('invokes onClick once per click across multiple clicks', () => {
      const handler = jest.fn()
      render(<AnimatedButton title="Click" iconName=">" onClick={handler} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)

      expect(handler).toHaveBeenCalledTimes(3)
    })

    it('does not call onClick if the button is not interacted with', () => {
      const handler = jest.fn()
      render(<AnimatedButton title="Idle" iconName="i" onClick={handler} />)
      expect(handler).not.toHaveBeenCalled()
    })

    it('passes a click event object to the handler', () => {
      const handler = jest.fn()
      render(<AnimatedButton title="Evt" iconName="e" onClick={handler} />)

      fireEvent.click(screen.getByRole('button'))

      expect(handler).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }))
    })
  })
})
