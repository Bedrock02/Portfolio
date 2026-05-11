/**
 * Sanity data mock fixtures for the WorkExperience component.
 *
 * Why this file exists
 * --------------------
 * The `workExperienceQuery` GROQ result is consumed by
 * `src/components/WorkExperience/index.tsx` and exercised by
 * `WorkExperience.test.tsx`. Multiple sibling tests (page-level SSG
 * fetch, Layout integration, future visual regression tests) need the
 * same shape of mock data. Re-declaring the factory inline in each test
 * file drifts. This module is the single source of truth.
 *
 * Location
 * --------
 * Lives under `__mocks__/sanity/` rather than `src/__fixtures__/` so
 * the file stays outside the Jest coverage glob
 * (`src/components/**`) and never lowers the 80% threshold.
 *
 * Hobbies note
 * ------------
 * The Hobbies component and its `data.js` were dropped entirely per the
 * Seed constraint "Hobbies section dropped entirely" (AC 9). No Hobbies
 * fixture is provided — the section no longer exists in the migration
 * target. If a future Seed revives it, add a sibling `hobbies.ts`
 * fixture here.
 */
import type {
  WorkExperienceEntry,
  WorkExperienceLogo,
} from '../../src/lib/sanity/queries/workExperience'

/**
 * Canonical Sanity `image` asset reference used by every fixture entry.
 *
 * The shape mirrors what `workExperienceQuery` returns after GROQ
 * resolves the `logo` projection — an `_type: 'image'` object with an
 * `asset` reference. Cast through `unknown` because
 * `@sanity/image-url`'s `SanityImageObject` carries optional fields the
 * component does not consume in tests.
 */
export const mockLogoRef: WorkExperienceLogo = {
  _type: 'image',
  asset: { _ref: 'image-abc-100x100-png', _type: 'reference' },
} as unknown as WorkExperienceLogo

/**
 * Build a single mock `WorkExperienceEntry`. Defaults are filled in for
 * every required field so callers only have to override what they care
 * about for the assertion under test.
 *
 * Example:
 *
 *   render(<WorkExperience data={[mockWorkEntry({ title: 'Staff Eng' })]} />)
 */
export function mockWorkEntry(
  overrides: Partial<WorkExperienceEntry> = {},
): WorkExperienceEntry {
  return {
    _id: 'workExperienceEntry-acme',
    company: 'Acme Inc.',
    href: 'https://acme.example.com',
    logo: mockLogoRef,
    date: 'Jan. 2020 - Dec. 2022',
    title: 'Senior Engineer',
    description: 'Built things, broke things, fixed things.',
    tools: ['TypeScript', 'React', 'Node'],
    order: 0,
    ...overrides,
  }
}

/**
 * A small, realistic timeline used by snapshot / list-rendering tests.
 *
 * Three entries, ordered by `order asc` to match the GROQ sort applied
 * by `workExperienceQuery`. Distinct `_id`, `company`, `title`, `date`,
 * and `tools` values so assertions can distinguish entries without
 * ambiguity.
 */
export const mockWorkExperienceList: WorkExperienceEntry[] = [
  mockWorkEntry({
    _id: 'workExperienceEntry-first',
    company: 'Pioneer Labs',
    href: 'https://pioneer.example.com',
    date: 'Aug. 2018 - Jan. 2020',
    title: 'Software Engineer',
    description: 'Shipped v1 of the platform.',
    tools: ['Python', 'Django', 'Postgres'],
    order: 1,
  }),
  mockWorkEntry({
    _id: 'workExperienceEntry-second',
    company: 'Acme Inc.',
    href: 'https://acme.example.com',
    date: 'Jan. 2020 - Dec. 2022',
    title: 'Senior Engineer',
    description: 'Led platform migration to Kubernetes.',
    tools: ['TypeScript', 'React', 'Node', 'Kubernetes'],
    order: 2,
  }),
  mockWorkEntry({
    _id: 'workExperienceEntry-third',
    company: 'Lattice Co.',
    href: 'https://lattice.example.com',
    date: 'Feb. 2024 - Feb. 2026',
    title: 'Staff Engineer',
    description: 'Architecture and platform leadership.',
    tools: ['Go', 'gRPC', 'AWS'],
    order: 3,
  }),
]

/**
 * Empty result — the shape returned by `workExperienceQuery` when no
 * `workExperienceEntry` documents have been authored yet. Useful for
 * verifying the component's empty-state branch.
 */
export const mockWorkExperienceEmpty: WorkExperienceEntry[] = []

/**
 * Hobbies fixture intentionally omitted.
 *
 * The Hobbies section was removed in Sub-AC 9 per the Seed constraint
 * "Hobbies section dropped entirely". No Sanity document type was
 * authored for it (see `sanity/schemas/` — only WorkExperienceEntry,
 * RoleEntry, FooterData, SkillGroup, ProfileData exist).
 */
