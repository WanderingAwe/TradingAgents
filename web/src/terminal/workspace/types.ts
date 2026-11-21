import type { Direction } from 'dockview-react'

export type WorkspacePresetId = 'market-overview' | 'research-desk'
export type WorkspacePanelKind = 'watchlist' | 'chart' | 'researchActivity' | 'reports'

export interface WorkspacePanelSpec {
  id: string
  kind: WorkspacePanelKind
  title: string
  symbol?: string
  referenceId?: string
  direction?: Direction
}

export interface WorkspacePreset {
  id: WorkspacePresetId
  label: string
  description: string
  panels: WorkspacePanelSpec[]
}
