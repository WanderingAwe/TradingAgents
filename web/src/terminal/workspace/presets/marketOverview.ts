import type { WorkspacePreset } from '../types'

export const marketOverviewPreset: WorkspacePreset = {
  id: 'market-overview',
  label: 'Market Overview',
  description: 'Watchlist, illustrative charts and live-demo research status.',
  panels: [
    { id: 'market-watchlist', kind: 'watchlist', title: 'Watchlist' },
    { id: 'market-chart-nifty', kind: 'chart', title: 'NIFTY 50 · DEMO', symbol: 'NIFTY 50', referenceId: 'market-watchlist', direction: 'right' },
    { id: 'market-chart-reliance', kind: 'chart', title: 'RELIANCE.NS · DEMO', symbol: 'RELIANCE.NS', referenceId: 'market-chart-nifty', direction: 'right' },
    { id: 'market-activity', kind: 'researchActivity', title: 'Research Activity', referenceId: 'market-watchlist', direction: 'below' },
    { id: 'market-reports', kind: 'reports', title: 'Reports', referenceId: 'market-activity', direction: 'within' },
  ],
}
