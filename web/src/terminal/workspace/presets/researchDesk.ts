import type { WorkspacePreset } from '../types'

export const researchDeskPreset: WorkspacePreset = {
  id: 'research-desk',
  label: 'Research Desk',
  description: 'Run activity and reports beside an illustrative security chart.',
  panels: [
    { id: 'desk-activity', kind: 'researchActivity', title: 'Research Activity' },
    { id: 'desk-reports', kind: 'reports', title: 'Reports', referenceId: 'desk-activity', direction: 'within' },
    { id: 'desk-chart-reliance', kind: 'chart', title: 'RELIANCE.NS · DEMO', symbol: 'RELIANCE.NS', referenceId: 'desk-activity', direction: 'right' },
    { id: 'desk-watchlist', kind: 'watchlist', title: 'Watchlist', referenceId: 'desk-chart-reliance', direction: 'below' },
  ],
}
