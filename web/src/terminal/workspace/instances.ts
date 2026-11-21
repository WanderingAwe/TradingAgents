import type { DockviewApi } from 'dockview-react'
import { getWorkspacePanelDefinition } from './panelRegistry'
import type { WorkspacePanelKind, WorkspacePanelSpec, WorkspacePreset } from './types'

export function nextPanelInstance(api: Pick<DockviewApi, 'panels'>, kind: WorkspacePanelKind, symbol?: string): WorkspacePanelSpec {
  const base = kind === 'chart' ? `chart-${(symbol ?? 'demo').toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : kind
  const used = new Set(api.panels.map((panel) => panel.id))
  let suffix = 1
  while (used.has(`${base}-${suffix}`)) suffix += 1
  const id = `${base}-${suffix}`
  const title = kind === 'chart' ? `${symbol ?? 'DEMO SERIES'} · DEMO` : getWorkspacePanelDefinition(kind)?.label ?? kind
  return { id, kind, title, ...(symbol ? { symbol } : {}) }
}

export function addPanelSpec(api: DockviewApi, spec: WorkspacePanelSpec) {
  const definition = getWorkspacePanelDefinition(spec.kind)
  if (!definition || api.getPanel(spec.id)) return false
  const position = spec.referenceId && spec.direction
    ? { referencePanel: spec.referenceId, direction: spec.direction }
    : undefined
  api.addPanel({
    id: spec.id,
    component: definition.component,
    title: spec.title,
    ...(spec.symbol ? { params: { symbol: spec.symbol } } : {}),
    ...(position ? { position } : {}),
  })
  return true
}

export function applyWorkspacePreset(api: DockviewApi, preset: WorkspacePreset) {
  api.clear()
  for (const spec of preset.panels) addPanelSpec(api, spec)
}
