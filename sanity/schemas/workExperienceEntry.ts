import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * WorkExperienceEntry
 *
 * One employment record rendered in the Experience timeline section.
 * Mirrors the legacy `src/components/WorkExperience/data.js` shape:
 *   { image, href, company, date, title, description, tools[] }
 *
 * Notes:
 * - `date` is a free-text range string (e.g. "Feb. 2024 - Feb. 2026", "2015 - 2018").
 *   Stored as a single string to preserve the existing display contract.
 * - `order` drives newest-first sort in GROQ queries at build time.
 */
export const workExperienceEntry = defineType({
  name: 'workExperienceEntry',
  title: 'Work Experience Entry',
  type: 'document',
  fields: [
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(120),
    }),
    defineField({
      name: 'href',
      title: 'Company URL',
      type: 'url',
      description: 'External link opened from the role title.',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['http', 'https'],
          allowRelative: false,
        }),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Accessible description. Defaults to "<company> logo" if blank.',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dates',
      title: 'Dates',
      type: 'string',
      description: 'Free-text range, e.g. "Feb. 2024 - Feb. 2026" or "2015 - 2018".',
      validation: (Rule) => Rule.required().min(4).max(60),
    }),
    defineField({
      name: 'title',
      title: 'Role Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(120),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.required().min(20).max(2000),
    }),
    defineField({
      name: 'tools',
      title: 'Tech Stack',
      type: 'array',
      description: 'Technologies / tools used. Rendered as pill list.',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower number = displayed first. Use to manually pin order independent of dates.',
      validation: (Rule) => Rule.required().integer(),
    }),
  ],
  orderings: [
    {
      title: 'Sort Order, Ascending',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'company',
      media: 'logo',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || '(untitled role)',
        subtitle: subtitle || '(no company)',
        media,
      }
    },
  },
})

export default workExperienceEntry
