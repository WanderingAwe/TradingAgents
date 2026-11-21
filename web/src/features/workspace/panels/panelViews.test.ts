import { describe, expect, it } from 'vitest'
import { WORKSPACE_PANEL_COMPONENTS } from '../../../terminal/workspace/panelComponents'

describe('workspace panel renderers', () => {
  it('provides a renderer for every initial panel type', () => {
    expect(Object.keys(WORKSPACE_PANEL_COMPONENTS).sort()).toEqual(['chart', 'reports', 'researchActivity', 'watchlist'])
  })
})
