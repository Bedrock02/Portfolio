import type { SchemaTypeDefinition } from 'sanity'

import { footerData } from './footerData'
import { profileData } from './profileData'
import { aboutSummary } from './roleEntry'
import { skillGroup } from './skillGroup'
import { workExperienceEntry } from './workExperienceEntry'

/**
 * Central schema registry consumed by `sanity.config.ts`.
 *
 * Order is the Studio sidebar order. Singletons (profileData, footerData)
 * come first, followed by collection-style document types.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  profileData,
  footerData,
  workExperienceEntry,
  aboutSummary,
  skillGroup,
]

export default schemaTypes
