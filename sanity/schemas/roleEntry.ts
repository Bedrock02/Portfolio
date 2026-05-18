import { defineType, defineField, defineArrayMember } from 'sanity'

// Singleton — one document only. GROQ: *[_type == "aboutSummary"][0]
export const aboutSummary = defineType({
  name: 'aboutSummary',
  title: 'About Summary',
  type: 'document',
  fields: [
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'array',
      description: 'Multi-paragraph bio. Supports inline links via the link annotation.',
      of: [
        defineArrayMember({
          type: 'block',
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({ scheme: ['http', 'https', 'mailto'] }),
                  }),
                  defineField({
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: true,
                  }),
                ],
              }),
            ],
          },
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {},
    prepare() {
      return { title: 'About Summary' }
    },
  },
})

export default aboutSummary
