import { describe, expect, it } from 'vitest'
import { getWorkspacePanelDefinition, WORKSPACE_COMPONENT_IDS, WORKSPACE_PANEL_REGISTRY } from './panelRegistry'
import { nextPanelInstance } from './instances'

describe('workspace panel registry', () => {
  it('registers the four supported demo panel types', () => {
    expect(WORKSPACE_PANEL_REGISTRY.map((entry) => entry.kind)).toEqual(['watchlist', 'chart', 'researchActivity', 'reports'])
    expect(getWorkspacePanelDefinition('chart')?.component).toBe('chart')
    expect(WORKSPACE_COMPONENT_IDS.has('reports')).toBe(true)
  })

  it('generates unique chart panel ids for multiple instances', () => {
    const api = { panels: [{ id: 'chart-reliance-ns-1' }, { id: 'chart-reliance-ns-2' }] }
    expect(nextPanelInstance(api as never, 'chart', 'RELIANCE.NS').id).toBe('chart-reliance-ns-3')
  })
})
