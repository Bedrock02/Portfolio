import About from '../components/About'
import Chat from '../components/Chat'
import Skills from '../components/Skills'
import WorkExperience from '../components/WorkExperience'
import {
  sanityClient,
  aboutQuery,
  skillsQuery,
  workExperienceQuery,
  type AboutSummary,
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
 * Rendering strategy: Server Component with `revalidate` so page re-fetches from Sanity every hour automatically.
 * Publish in Sanity Studio -> live within 60 minutes, no redeploy needed.
 */
export const revalidate = 3600

export default async function HomePage(): Promise<JSX.Element> {
  let about: AboutSummary | null = null
  let skills: SkillGroup[] = []
  let work: WorkExperienceEntry[] = []
  try {
    const [aboutResult, skillsResult, workResult] = await Promise.all([
      sanityClient.fetch<AboutSummary | null>(aboutQuery),
      sanityClient.fetch<SkillGroup[] | null>(skillsQuery),
      sanityClient.fetch<WorkExperienceEntry[] | null>(workExperienceQuery),
    ])
    about = aboutResult ?? null
    skills = skillsResult ?? []
    work = workResult ?? []
  } catch {
    about = null
    skills = []
    work = []
  }

  return (
    <>
      <Chat />
      <About data={about} />
      <Skills data={skills} />
      <WorkExperience data={work} />
    </>
  )
}
