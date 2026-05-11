import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * SkillGroup
 *
 * One skill category rendered in the Skills section grid.
 * Mirrors the legacy `skillGroups` shape in src/components/Skills/index.jsx:
 *   { category, skills[] }
 *
 * Notes:
 * - `category` is the heading shown above the skill pill list
 *   (e.g. "Frontend", "Frameworks", "AI Tools").
 * - `skills` are short display strings rendered as pills inside the group.
 * - `order` drives ascending sort in GROQ queries at build time so editors
 *   can reorder groups independent of name.
 */
export const skillGroup = defineType({
  name: 'skillGroup',
  title: 'Skill Group',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Heading shown above the skill pill list (e.g. "Frontend").',
      validation: (Rule) => Rule.required().min(1).max(80),
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      description: 'Short display strings rendered as pills inside the group.',
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
      description: 'Lower number = displayed first. Drives GROQ orderAsc sort.',
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
      title: 'category',
      skill0: 'skills.0',
      skill1: 'skills.1',
      skill2: 'skills.2',
    },
    prepare({ title, skill0, skill1, skill2 }) {
      const sample = [skill0, skill1, skill2].filter(Boolean).join(', ')
      return {
        title: title || '(untitled group)',
        subtitle: sample || '(no skills)',
      }
    },
  },
})

export default skillGroup
