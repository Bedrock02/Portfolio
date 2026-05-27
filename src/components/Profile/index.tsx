import React from 'react'

interface ProfileData {
  name: string
  title: string
  tagline?: string
  resumeUrl?: string
  resumeLabel?: string
  openToWork?: boolean
  openToWorkLabel?: string
  contactEmail?: string
}

interface ProfileProps {
  data?: ProfileData | null
}

const Profile = ({ data }: ProfileProps): JSX.Element | null => {
  if (!data) return null

  const {
    name,
    title,
    tagline,
    resumeUrl,
    resumeLabel,
    openToWork,
    openToWorkLabel,
    contactEmail,
  } = data

  const taglineNodes = (tagline || '')
    .split(/\n/)
    .reduce<React.ReactNode[]>((acc, line, idx, arr) => {
      acc.push(<React.Fragment key={`${idx}-${line}`}>{line}</React.Fragment>)
      if (idx < arr.length - 1) acc.push(<br key={`br-${idx}`} />)
      return acc
    }, [])

  return (
    <div className="mb-12">
      <h1 className="mb-12 text-[2.8rem] font-bold leading-[1.1] text-sky-200">{name}</h1>
      <h2 className="mb-12 text-[1.1rem] font-medium tracking-wide text-purple-700">{title}</h2>
      {openToWork ? (
        <div
          className="mb-12 inline-flex items-center gap-2 rounded-full border border-navy-600/40 bg-navy-600/10 px-3 py-1 text-[0.78rem] font-semibold tracking-wide text-sky-200"
          aria-label={openToWorkLabel || 'Open to new opportunities'}
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 animate-pulse rounded-full bg-green-500"
          />
          <span>{openToWorkLabel || 'Open to new opportunities'}</span>
        </div>
      ) : null}
      <p className="mb-12 max-w-[320px] text-[0.95rem] leading-[1.7] text-slate-500">
        {taglineNodes}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {resumeUrl ? (
          <a
            className="inline-block rounded border border-navy-600 px-5 py-2.5 text-[0.85rem] font-semibold tracking-wider text-sky-200 no-underline transition-colors duration-200 ease-in-out hover:border-sky-200 hover:bg-navy-600/20"
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${resumeLabel || 'View Full Résumé'} (opens in new tab)`}
          >
            {resumeLabel || 'View Full Résumé'} <span aria-hidden="true">↗</span>
          </a>
        ) : null}
        {contactEmail ? (
          <a
            className="inline-flex items-center gap-2 rounded border border-navy-600 px-5 py-2.5 text-[0.85rem] font-semibold tracking-wider text-sky-200 no-underline transition-colors duration-200 ease-in-out hover:border-sky-200 hover:bg-navy-600/20"
            href={`mailto:${contactEmail}`}
            aria-label={`Email ${name || 'me'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Contact
          </a>
        ) : null}
      </div>
    </div>
  )
}

export default Profile
