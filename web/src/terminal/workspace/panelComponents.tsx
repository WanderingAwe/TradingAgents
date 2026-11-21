import type { FunctionComponent } from 'react'
import type { IDockviewPanelProps } from 'dockview-react'
import { ChartPanel, ReportsPanel, ResearchActivityPanel, WatchlistPanel } from '../../features/workspace/panels/PanelViews'

export const WORKSPACE_PANEL_COMPONENTS: Record<string, FunctionComponent<IDockviewPanelProps>> = {
  watchlist: WatchlistPanel,
  chart: ChartPanel,
  researchActivity: ResearchActivityPanel,
  reports: ReportsPanel,
}
