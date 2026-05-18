export interface SanityMark {
  _key: string
  _type: 'link'
  href: string
  blank?: boolean
}

export interface SanitySpan {
  _key: string
  _type: 'span'
  text: string
  marks: string[]
}

export interface SanityHardBreak {
  _key: string
  _type: 'hardBreak'
}

export interface SanityBlock {
  _key: string
  _type: 'block'
  style: 'normal'
  children: (SanitySpan | SanityHardBreak)[]
  markDefs: SanityMark[]
}

export interface AboutSummary {
  summary: SanityBlock[]
}

export const aboutQuery = /* groq */ `
  *[_type == "aboutSummary"][0]{
    summary
  }
`

export default aboutQuery
