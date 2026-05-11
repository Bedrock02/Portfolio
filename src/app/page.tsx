import Chat from '../components/Chat'
import Roles from '../components/Roles'
import Skills from '../components/Skills'
import WorkExperience from '../components/WorkExperience'
import {
  sanityClient,
  skillsQuery,
  workExperienceQuery,
  type SkillGroup,
  type WorkExperienceEntry,
} from '../lib/sanity'

/**
 * Single-page index route for the portfolio.
 *
 * This is the only content route in the App Router — `/` renders every
 * section stacked under a sticky sidebar nav. The legacy Gatsby site
 * used the same single-page layout (`src/pages/index.jsx`); the
 * migration preserves both the section ordering and the anchor IDs that
 * the sidebar `Header` nav targets.
 *
 * Section / anchor ordering (must match `src/components/Header/index.tsx`
 * `navItems` so active-state highlighting works):
 *   1. Chat             → `#chat`
 *   2. Roles (About)    → `#about`
 *   3. Skills           → `#skills`
 *   4. Work Experience  → `#work`
 *
 * Hobbies is intentionally absent — the migration drops it entirely.
 *
 * Rendering strategy: Server Component with `force-static` so the data
 * fetches resolve at build time (SSG). Sanity credentials never reach
 * the bundle, and Vercel serves a pure static HTML payload at request
 * time. The two GROQ queries are issued in parallel; either one
 * returning `null` is degraded to an empty array so unauthored content
 * just hides its section rather than crashing the build.
 */
export const dynamic = 'force-static'

export default async function HomePage(): Promise<JSX.Element> {
  let skills: SkillGroup[] = []
  let work: WorkExperienceEntry[] = []
  try {
    const [skillsResult, workResult] = await Promise.all([
      sanityClient.fetch<SkillGroup[] | null>(skillsQuery),
      sanityClient.fetch<WorkExperienceEntry[] | null>(workExperienceQuery),
    ])
    skills = skillsResult ?? []
    work = workResult ?? []
  } catch {
    skills = []
    work = []
  }

  return (
    <>
      <Chat />
      <Roles />
      <Skills data={skills} />
      <WorkExperience data={work} />
    </>
  )
}
