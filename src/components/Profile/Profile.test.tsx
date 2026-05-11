import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'

import Profile from './index'

const profile = (overrides: Record<string, unknown> = {}) => ({
  name: 'Steven Jimenez',
  title: 'Senior Software Engineer',
  tagline: 'I build resilient systems.\nBackend-first, full-stack capable.',
  resumeUrl: 'https://example.com/resume.pdf',
  resumeLabel: 'View Full Résumé',
  openToWork: true,
  openToWorkLabel: 'Open to new opportunities',
  contactEmail: 'hi@example.com',
  ...overrides,
})

describe('Profile', () => {
  describe('render — null guards', () => {
    it('returns null when data prop is undefined', () => {
      const { container } = render(<Profile />)
      expect(container).toBeEmptyDOMElement()
    })

    it('returns null when data prop is null', () => {
      const { container } = render(<Profile data={null} />)
      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('render — Sanity field projection', () => {
    it('renders the name from Sanity as the page heading', () => {
      render(<Profile data={profile({ name: 'Ada Lovelace' })} />)
      expect(
        screen.getByRole('heading', { level: 1, name: 'Ada Lovelace' })
      ).toBeInTheDocument()
    })

    it('renders the title from Sanity as the secondary heading', () => {
      render(<Profile data={profile({ title: 'Distinguished Engineer' })} />)
      expect(
        screen.getByRole('heading', { level: 2, name: 'Distinguished Engineer' })
      ).toBeInTheDocument()
    })

    it('renders the tagline text from Sanity', () => {
      render(
        <Profile data={profile({ tagline: 'Single-line tagline only.' })} />
      )
      expect(screen.getByText('Single-line tagline only.')).toBeInTheDocument()
    })

    it('splits multi-line tagline on \\n into <br />-separated fragments', () => {
      const { container } = render(
        <Profile
          data={profile({ tagline: 'First line.\nSecond line.\nThird line.' })}
        />
      )
      const paragraph = container.querySelector('p')
      expect(paragraph).not.toBeNull()
      expect(paragraph?.querySelectorAll('br')).toHaveLength(2)
      expect(paragraph?.textContent).toContain('First line.')
      expect(paragraph?.textContent).toContain('Second line.')
      expect(paragraph?.textContent).toContain('Third line.')
    })

    it('tolerates an empty tagline without throwing', () => {
      const { container } = render(<Profile data={profile({ tagline: '' })} />)
      const paragraph = container.querySelector('p')
      expect(paragraph).not.toBeNull()
      expect(paragraph?.querySelectorAll('br')).toHaveLength(0)
    })

    it('tolerates an undefined tagline without throwing', () => {
      const { container } = render(
        <Profile data={profile({ tagline: undefined })} />
      )
      expect(container.querySelector('p')).not.toBeNull()
    })
  })

  describe('openToWork badge', () => {
    it('renders the badge when openToWork is true', () => {
      render(<Profile data={profile({ openToWork: true })} />)
      expect(
        screen.getByLabelText('Open to new opportunities')
      ).toBeInTheDocument()
    })

    it('uses the custom openToWorkLabel from Sanity when provided', () => {
      render(
        <Profile
          data={profile({
            openToWork: true,
            openToWorkLabel: 'Actively interviewing',
          })}
        />
      )
      expect(screen.getByLabelText('Actively interviewing')).toBeInTheDocument()
      expect(screen.getByText('Actively interviewing')).toBeInTheDocument()
    })

    it('falls back to default badge label when openToWorkLabel is empty', () => {
      render(
        <Profile data={profile({ openToWork: true, openToWorkLabel: '' })} />
      )
      expect(
        screen.getByLabelText('Open to new opportunities')
      ).toBeInTheDocument()
    })

    it('suppresses the badge entirely when openToWork is false', () => {
      render(<Profile data={profile({ openToWork: false })} />)
      expect(
        screen.queryByLabelText('Open to new opportunities')
      ).not.toBeInTheDocument()
    })
  })

  describe('resume CTA', () => {
    it('renders the résumé anchor when resumeUrl is set', () => {
      render(
        <Profile
          data={profile({ resumeUrl: 'https://example.com/cv.pdf' })}
        />
      )
      const anchor = screen.getByRole('link', { name: /view full résumé/i })
      expect(anchor).toHaveAttribute('href', 'https://example.com/cv.pdf')
    })

    it('opens the résumé link in a new tab with safe rel', () => {
      render(<Profile data={profile()} />)
      const anchor = screen.getByRole('link', { name: /view full résumé/i })
      expect(anchor).toHaveAttribute('target', '_blank')
      expect(anchor).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('uses the resumeLabel from Sanity for the visible CTA text', () => {
      render(<Profile data={profile({ resumeLabel: 'Download CV' })} />)
      expect(
        screen.getByRole('link', { name: /download cv/i })
      ).toBeInTheDocument()
    })

    it('falls back to default résumé label when resumeLabel is empty', () => {
      render(<Profile data={profile({ resumeLabel: '' })} />)
      expect(
        screen.getByRole('link', { name: /view full résumé/i })
      ).toBeInTheDocument()
    })

    it('omits the résumé CTA entirely when resumeUrl is missing', () => {
      render(<Profile data={profile({ resumeUrl: '' })} />)
      expect(
        screen.queryByRole('link', { name: /view full résumé/i })
      ).not.toBeInTheDocument()
    })
  })

  describe('contact email', () => {
    it('renders a mailto link when contactEmail is set', () => {
      render(
        <Profile data={profile({ contactEmail: 'hello@stevenj.dev' })} />
      )
      const anchor = screen.getByRole('link', { name: /email steven jimenez/i })
      expect(anchor).toHaveAttribute('href', 'mailto:hello@stevenj.dev')
      expect(anchor).toHaveTextContent('hello@stevenj.dev')
    })

    it('omits the email link when contactEmail is missing', () => {
      render(<Profile data={profile({ contactEmail: undefined })} />)
      expect(
        screen.queryByRole('link', { name: /email/i })
      ).not.toBeInTheDocument()
    })

    it('uses "me" as the aria label fallback when name is empty', () => {
      render(
        <Profile
          data={profile({ name: '', contactEmail: 'me@example.com' })}
        />
      )
      expect(
        screen.getByRole('link', { name: 'Email me' })
      ).toBeInTheDocument()
    })
  })
})
