import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { Layout } from './components/Layout'
import { Overview } from './pages/Overview'
import { NewResearch } from './pages/NewResearch'
import { ActiveRuns } from './pages/ActiveRuns'
import { ReportsLibrary } from './pages/ReportsLibrary'
import { ReportDetail } from './pages/ReportDetail'
import { DataSources } from './pages/DataSources'
import { AIModels } from './pages/AIModels'
import { Telegram } from './pages/Telegram'
import { SystemHealth } from './pages/SystemHealth'
import { getTheme, setTheme } from './lib/theme'
import './styles.css'
import './styles/terminal.css'

setTheme(getTheme())

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } })
const WorkspacePage = lazy(() => import('./features/workspace/WorkspacePage').then((module) => ({ default: module.WorkspacePage })))

const rootRoute = createRootRoute({
  component: () => <Layout><Suspense fallback={<div className="workstation-loading">Loading workstation module…</div>}><Outlet /></Suspense></Layout>,
})

const overviewRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Overview })
const newResearchRoute = createRoute({ getParentRoute: () => rootRoute, path: '/research/new', component: NewResearch })
const runsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/runs', component: ActiveRuns })
const reportsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/reports', component: ReportsLibrary })
const reportDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/reports/$reportId', component: ReportDetail })
const sourcesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/sources', component: DataSources })
const modelsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/models', component: AIModels })
const telegramRoute = createRoute({ getParentRoute: () => rootRoute, path: '/telegram', component: Telegram })
const healthRoute = createRoute({ getParentRoute: () => rootRoute, path: '/health', component: SystemHealth })
const workspaceRoute = createRoute({ getParentRoute: () => rootRoute, path: '/workspace', component: WorkspacePage })

const routeTree = rootRoute.addChildren([overviewRoute, newResearchRoute, runsRoute, reportsRoute, reportDetailRoute, sourcesRoute, modelsRoute, telegramRoute, healthRoute, workspaceRoute])
const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  </StrictMode>,
)
