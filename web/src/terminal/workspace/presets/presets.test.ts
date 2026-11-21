import { describe, expect, it } from 'vitest'
import { WORKSPACE_PRESETS } from './index'

describe('workspace presets', () => {
  it('provides both requested default layouts', () => {
    expect(Object.keys(WORKSPACE_PRESETS)).toEqual(['market-overview', 'research-desk'])
    expect(WORKSPACE_PRESETS['market-overview'].panels.length).toBeGreaterThan(1)
    expect(WORKSPACE_PRESETS['research-desk'].panels.length).toBeGreaterThan(1)
  })

  it('uses unique panel ids within each preset', () => {
    for (const preset of Object.values(WORKSPACE_PRESETS)) {
      const ids = preset.panels.map((panel) => panel.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })
})
