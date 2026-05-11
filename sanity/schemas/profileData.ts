import { defineType, defineField } from 'sanity'

/**
 * ProfileData
 *
 * Singleton document that powers the Profile hero section.
 * Mirrors legacy hardcoded content in src/components/Profile/index.jsx:
 *   - name, title (subtitle)
 *   - "Open to new opportunities" status badge
 *   - multi-paragraph tagline / bio
 *   - external resume link
 *
 * Notes:
 * - This is a singleton: editors should keep exactly one ProfileData
 *   document. The GROQ query at build time selects the first match.
 * - `tagline` is plain text with line breaks rather than portable text
 *   to keep the Tailwind hero markup simple and SSG-friendly.
 * - `openToWork` toggles the visibility of the availability pill; when
 *   false the badge is suppressed entirely in the rendered component.
 */
export const profileData = defineType({
  name: 'profileData',
  title: 'Profile Data',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      description: 'Headline name displayed at the top of the hero (e.g. "Steven Jimenez").',
      validation: (Rule) => Rule.required().min(1).max(120),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Role subtitle under the name (e.g. "Senior Software Engineer").',
      validation: (Rule) => Rule.required().min(1).max(120),
    }),
    defineField({
      name: 'openToWork',
      title: 'Open To Work',
      type: 'boolean',
      description: 'When true, renders the "Open to new opportunities" availability badge.',
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'openToWorkLabel',
      title: 'Open To Work Label',
      type: 'string',
      description: 'Text rendered inside the availability badge when openToWork is true.',
      initialValue: 'Open to new opportunities',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline / Bio',
      type: 'text',
      rows: 6,
      description: 'Hero tagline / short bio. Line breaks are preserved in render.',
      validation: (Rule) => Rule.required().min(10).max(1200),
    }),
    defineField({
      name: 'resumeUrl',
      title: 'Resume URL',
      type: 'url',
      description: 'External link to the full résumé (opens in a new tab).',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'resumeLabel',
      title: 'Resume Link Label',
      type: 'string',
      description: 'Text rendered on the résumé call-to-action button.',
      initialValue: 'View Full Résumé',
      validation: (Rule) => Rule.required().min(1).max(80),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'Primary contact email surfaced as a mailto link (optional).',
      validation: (Rule) =>
        Rule.email().error('Must be a valid email address.'),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || '(unnamed profile)',
        subtitle: subtitle || '(no title)',
      }
    },
  },
})

export default profileData
