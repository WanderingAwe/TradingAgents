import { marketOverviewPreset } from './marketOverview'
import { researchDeskPreset } from './researchDesk'
import type { WorkspacePreset, WorkspacePresetId } from '../types'

export const WORKSPACE_PRESETS: Record<WorkspacePresetId, WorkspacePreset> = {
  'market-overview': marketOverviewPreset,
  'research-desk': researchDeskPreset,
}

export const DEFAULT_WORKSPACE_PRESET: WorkspacePresetId = 'market-overview'
