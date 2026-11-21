import type { SerializedDockview } from 'dockview-react'
import { WORKSPACE_COMPONENT_IDS } from './panelRegistry'
import { DEFAULT_WORKSPACE_PRESET } from './presets'
import type { WorkspacePresetId } from './types'

export const WORKSPACE_LAYOUT_VERSION = 1
const ACTIVE_PRESET_KEY = 'tradingagents.workspace.active.v1'
const LAYOUT_KEY_PREFIX = 'tradingagents.workspace.layout.v1.'

export interface WorkspaceStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)

export function isWorkspacePresetId(value: unknown): value is WorkspacePresetId {
  return value === 'market-overview' || value === 'research-desk'
}

export function isValidWorkspaceLayout(value: unknown): value is SerializedDockview {
  if (!isRecord(value) || !isRecord(value.grid) || !isRecord(value.grid.root) || !isRecord(value.panels)) return false
  const grid = value.grid
  if (typeof grid.width !== 'number' || !Number.isFinite(grid.width) || typeof grid.height !== 'number' || !Number.isFinite(grid.height)) return false
  const entries = Object.entries(value.panels)
  if (entries.length === 0 || entries.length > 40) return false
  const ids = new Set<string>()
  for (const [id, rawPanel] of entries) {
    if (!isRecord(rawPanel) || rawPanel.id !== id || ids.has(id)) return false
    if (typeof rawPanel.contentComponent !== 'string' || !WORKSPACE_COMPONENT_IDS.has(rawPanel.contentComponent)) return false
    if (rawPanel.params !== undefined) {
      if (!isRecord(rawPanel.params)) return false
      const keys = Object.keys(rawPanel.params)
      if (keys.some((key) => key !== 'symbol')) return false
      if (rawPanel.params.symbol !== undefined && (typeof rawPanel.params.symbol !== 'string' || rawPanel.params.symbol.length > 40)) return false
    }
    ids.add(id)
  }
  return true
}

function layoutKey(preset: WorkspacePresetId) {
  return `${LAYOUT_KEY_PREFIX}${preset}`
}

export function loadPresetLayout(preset: WorkspacePresetId, storage: WorkspaceStorage): SerializedDockview | null {
  try {
    const raw = storage.getItem(layoutKey(preset))
    if (!raw) return null
    const envelope: unknown = JSON.parse(raw)
    if (!isRecord(envelope) || envelope.version !== WORKSPACE_LAYOUT_VERSION || envelope.preset !== preset || !isValidWorkspaceLayout(envelope.layout)) return null
    return envelope.layout
  } catch {
    return null
  }
}

export function savePresetLayout(preset: WorkspacePresetId, layout: SerializedDockview, storage: WorkspaceStorage): boolean {
  if (!isValidWorkspaceLayout(layout)) return false
  try {
    storage.setItem(layoutKey(preset), JSON.stringify({ version: WORKSPACE_LAYOUT_VERSION, preset, layout }))
    return true
  } catch {
    return false
  }
}

export function loadActivePreset(storage: WorkspaceStorage): WorkspacePresetId {
  try {
    const raw = storage.getItem(ACTIVE_PRESET_KEY)
    return isWorkspacePresetId(raw) ? raw : DEFAULT_WORKSPACE_PRESET
  } catch {
    return DEFAULT_WORKSPACE_PRESET
  }
}

export function saveActivePreset(preset: WorkspacePresetId, storage: WorkspaceStorage): void {
  try {
    storage.setItem(ACTIVE_PRESET_KEY, preset)
  } catch {
    // Workspace remains usable when browser storage is unavailable.
  }
}
