import { describe, expect, it } from 'vitest'
import type { SerializedDockview } from 'dockview-react'
import { isValidWorkspaceLayout, loadActivePreset, loadPresetLayout, savePresetLayout, WORKSPACE_LAYOUT_VERSION } from './persistence'

class MemoryStorage {
  values = new Map<string, string>()
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, value) }
}

const sampleLayout = {
  grid: { root: { type: 'branch', data: [] }, height: 600, width: 900, orientation: 'HORIZONTAL' },
  panels: { watchlist: { id: 'watchlist', contentComponent: 'watchlist' } },
} as unknown as SerializedDockview

describe('workspace layout persistence', () => {
  it('saves and restores versioned preset layouts independently', () => {
    const storage = new MemoryStorage()
    expect(savePresetLayout('market-overview', sampleLayout, storage)).toBe(true)
    expect(loadPresetLayout('market-overview', storage)).toEqual(sampleLayout)
    expect(loadPresetLayout('research-desk', storage)).toBeNull()
  })

  it('falls back for invalid, outdated or malformed stored layouts', () => {
    const storage = new MemoryStorage()
    storage.setItem('tradingagents.workspace.layout.v1.market-overview', JSON.stringify({ version: 0, preset: 'market-overview', layout: sampleLayout }))
    expect(loadPresetLayout('market-overview', storage)).toBeNull()
    storage.setItem('tradingagents.workspace.layout.v1.market-overview', '{')
    expect(loadPresetLayout('market-overview', storage)).toBeNull()
    storage.setItem('tradingagents.workspace.active.v1', 'unknown')
    expect(loadActivePreset(storage)).toBe('market-overview')
    expect(WORKSPACE_LAYOUT_VERSION).toBe(1)
  })

  it('rejects unknown components, mismatched panel ids, and layouts with no panels', () => {
    expect(isValidWorkspaceLayout({ ...sampleLayout, panels: {} })).toBe(false)
    expect(isValidWorkspaceLayout({ ...sampleLayout, panels: { bad: { id: 'bad', contentComponent: 'broker' } } })).toBe(false)
    expect(isValidWorkspaceLayout({ ...sampleLayout, panels: { bad: { id: 'other', contentComponent: 'watchlist' } } })).toBe(false)
  })
})
