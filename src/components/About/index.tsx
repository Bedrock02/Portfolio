import React from 'react'
import type { AboutSummary, SanityBlock, SanityHardBreak, SanityMark, SanitySpan } from '../../lib/sanity/queries/about'

export interface AboutProps {
  data?: AboutSummary | null
}

const renderSpan = (span: SanitySpan, markDefs: SanityMark[]): React.ReactNode => {
  let node: React.ReactNode = span.text

  for (const mark of span.marks) {
    if (mark === 'strong') {
      node = <strong key={`${span._key}-strong`}>{node}</strong>
    } else if (mark === 'em') {
      node = <em key={`${span._key}-em`}>{node}</em>
    } else {
      const def = markDefs.find((m) => m._key === mark)
      if (def?._type === 'link') {
        node = (
          <a
            key={`${span._key}-link`}
            href={def.href}
            target={def.blank !== false ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="underline text-sky-200 transition-colors duration-200 hover:text-purple-300"
          >
            {node}
          </a>
        )
      }
    }
  }

  return node
}

const isHardBreak = (child: SanitySpan | SanityHardBreak): child is SanityHardBreak =>
  child._type === 'hardBreak'

const renderBlock = (block: SanityBlock): React.ReactNode => (
  <p key={block._key} className="text-[0.9rem] leading-[1.7] text-slate-500">
    {block.children.map((child) =>
      isHardBreak(child) ? (
        <br key={child._key} />
      ) : (
        <React.Fragment key={child._key}>
          {renderSpan(child, block.markDefs)}
        </React.Fragment>
      )
    )}
  </p>
)

const About = ({ data }: AboutProps): React.JSX.Element | null => {
  if (!data?.summary?.length) return null

  return (
    <section id="about" className="portfolio-section pb-[100px]">
      <h2 className="mb-8 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-sky-200">
        About
      </h2>
      <div className="space-y-5">
        {data.summary.map(renderBlock)}
      </div>
    </section>
  )
}

export default About
