import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * FooterData
 *
 * Singleton document that powers the footer / sidebar social link list.
 * Mirrors the legacy linkData array in src/components/Footer/data.js:
 *   { href, iconName, ariaLabel }
 *
 * Notes:
 * - This is a singleton: editors should keep exactly one FooterData
 *   document. The GROQ query at build time selects the first match.
 * - `links` are rendered as icon buttons; `iconName` keys into the
 *   component's icon map (e.g. "github", "linkedin", "rss", "strava",
 *   "mail").
 * - `href` accepts both `http(s)://` and `mailto:` URIs so the email
 *   link in linkData migrates cleanly.
 * - `copyright` is optional text rendered beneath the link row (e.g.
 *   "© 2026 Steven Jimenez").
 */
export const footerData = defineType({
  name: 'footerData',
  title: 'Footer Data',
  type: 'document',
  fields: [
    defineField({
      name: 'links',
      title: 'Social Links',
      type: 'array',
      description: 'Icon-button social links rendered in the footer / sidebar.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          title: 'Social Link',
          fields: [
            defineField({
              name: 'href',
              title: 'URL',
              type: 'url',
              description: 'Target URL. Supports http(s):// and mailto: schemes.',
              validation: (Rule) =>
                Rule.required().uri({
                  scheme: ['http', 'https', 'mailto'],
                  allowRelative: false,
                }),
            }),
            defineField({
              name: 'iconName',
              title: 'Icon Name',
              type: 'string',
              description:
                'Icon identifier mapped by the component (e.g. "github", "linkedin", "rss", "strava", "mail").',
              validation: (Rule) => Rule.required().min(1).max(60),
            }),
            defineField({
              name: 'ariaLabel',
              title: 'ARIA Label',
              type: 'string',
              description: 'Accessible label for screen readers (e.g. "GitHub profile").',
              validation: (Rule) => Rule.required().min(1).max(120),
            }),
            defineField({
              name: 'order',
              title: 'Sort Order',
              type: 'number',
              description: 'Lower number = displayed first within the link row.',
              validation: (Rule) => Rule.required().integer(),
            }),
          ],
          preview: {
            select: {
              title: 'ariaLabel',
              subtitle: 'href',
              icon: 'iconName',
            },
            prepare({ title, subtitle, icon }) {
              return {
                title: title || '(no label)',
                subtitle: [icon, subtitle].filter(Boolean).join(' — ') || '(no url)',
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright Text',
      type: 'string',
      description: 'Optional copyright line rendered beneath the link row.',
      validation: (Rule) => Rule.max(200),
    }),
  ],
  preview: {
    select: {
      link0: 'links.0.iconName',
      link1: 'links.1.iconName',
      link2: 'links.2.iconName',
      copyright: 'copyright',
    },
    prepare({ link0, link1, link2, copyright }) {
      const icons = [link0, link1, link2].filter(Boolean).join(', ')
      return {
        title: 'Footer Data',
        subtitle: icons ? `links: ${icons}` : copyright || '(empty footer)',
      }
    },
  },
})

export default footerData
