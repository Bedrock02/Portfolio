import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * RoleEntry
 *
 * One role card rendered in the About / Roles section grid.
 * Mirrors the legacy roleCard structure in src/components/Roles
 * (icon, title, descriptive text, tool stack, audience tags).
 *
 * Notes:
 * - `icon` stores the icon identifier (e.g. semantic-ui icon name or
 *   lucide key). Rendered by the component's icon map.
 * - `tools` are short tech identifiers shown as icon pills under the role.
 * - `audience` lists target audience descriptors (e.g. "Startups",
 *   "Enterprise teams").
 * - `order` drives ascending sort in GROQ queries at build time.
 */
export const roleEntry = defineType({
  name: 'roleEntry',
  title: 'Role Entry',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Role Title',
      type: 'string',
      description: 'Headline for the role card (e.g. "Full-Stack Engineer").',
      validation: (Rule) => Rule.required().min(1).max(120),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon identifier rendered by the component icon map (e.g. "code", "laptop").',
      validation: (Rule) => Rule.required().min(1).max(60),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Short blurb describing the role.',
      validation: (Rule) => Rule.required().min(10).max(600),
    }),
    defineField({
      name: 'tools',
      title: 'Tools',
      type: 'array',
      description: 'Tech identifiers rendered as icon pills under the role.',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
    defineField({
      name: 'audience',
      title: 'Audience',
      type: 'array',
      description: 'Target audience tags (e.g. "Startups", "Enterprise teams").',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.min(0).unique(),
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
      title: 'title',
      subtitle: 'icon',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || '(untitled role)',
        subtitle: subtitle ? `icon: ${subtitle}` : '(no icon)',
      }
    },
  },
})

export default roleEntry
