import type { WorkspacePanelKind } from './types'

export interface WorkspacePanelDefinition {
  kind: WorkspacePanelKind
  component: string
  label: string
  description: string
  allowsMultiple: boolean
}

export const WORKSPACE_PANEL_REGISTRY: readonly WorkspacePanelDefinition[] = [
  { kind: 'watchlist', component: 'watchlist', label: 'Watchlist', description: 'Tracked demo instruments', allowsMultiple: true },
  { kind: 'chart', component: 'chart', label: 'Chart', description: 'Illustrative chart data', allowsMultiple: true },
  { kind: 'researchActivity', component: 'researchActivity', label: 'Research Activity', description: 'Demo job statuses', allowsMultiple: true },
  { kind: 'reports', component: 'reports', label: 'Reports', description: 'Illustrative report list', allowsMultiple: true },
]

export function getWorkspacePanelDefinition(kind: WorkspacePanelKind): WorkspacePanelDefinition | undefined {
  return WORKSPACE_PANEL_REGISTRY.find((definition) => definition.kind === kind)
}

export const WORKSPACE_COMPONENT_IDS = new Set(WORKSPACE_PANEL_REGISTRY.map((definition) => definition.component))
