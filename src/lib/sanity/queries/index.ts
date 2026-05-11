/**
 * Barrel export for every GROQ query + result type used by the App
 * Router pages. Centralised here so page-level fetches can do:
 *
 *   import { profileQuery, type ProfileData } from '@/lib/sanity/queries'
 *
 * rather than reaching into each per-section module.
 *
 * Note on Hobbies: the legacy site had a Hobbies section, but the
 * Next.js migration drops that section entirely per the migration
 * spec. No `hobbies` query / type is exported here, and no
 * corresponding schema exists in sanity/schemas/.
 */

export { profileQuery, type ProfileData } from './profile'
export { skillsQuery, type SkillGroup } from './skills'
export {
  workExperienceQuery,
  type WorkExperienceEntry,
  type WorkExperienceLogo,
} from './workExperience'
export { rolesQuery, type RoleEntry } from './roles'
export { footerQuery, type FooterData, type FooterLink } from './footer'
