import {
  getSystemStatus as fetchSystemStatus,
  type SystemStatus,
} from './api'

export interface ComponentStatus {
  name: string
  status: 'connected' | 'disconnected' | 'not_configured' | 'degraded'
  detail: string
}

export interface SystemStatusResult {
  statuses: ComponentStatus[]
  loading: boolean
  error: string | null
  backendReachable: boolean
}

let cachedStatus: SystemStatus | null = null
let cacheTime = 0
const CACHE_TTL_MS = 30_000

export async function getSystemStatus(): Promise<SystemStatusResult> {
  const now = Date.now()
  if (cachedStatus && now - cacheTime < CACHE_TTL_MS) {
    return buildResult(cachedStatus, false, null)
  }

  try {
    const status = await fetchSystemStatus()
    cachedStatus = status
    cacheTime = now
    return buildResult(status, false, null)
  } catch (error) {
    return buildResult(
      {
        backend: 'disconnected',
        database: 'disconnected',
        research_execution: 'not_configured',
        market_data: 'not_configured',
        news_integration: 'not_configured',
        telegram_integration: 'not_configured',
        maritime_data: 'not_configured',
        aviation_data: 'not_configured',
        environment: 'unknown',
      },
      false,
      error instanceof Error ? error.message : 'Failed to reach backend',
    )
  }
}

export async function getFreshSystemStatus(): Promise<SystemStatusResult> {
  cachedStatus = null
  cacheTime = 0
  return getSystemStatus()
}

function buildResult(
  status: SystemStatus,
  loading: boolean,
  error: string | null,
): SystemStatusResult {
  const statuses: ComponentStatus[] = [
    {
      name: 'Backend API',
      status: status.backend,
      detail: `Environment: ${status.environment}`,
    },
    {
      name: 'Database',
      status: status.database,
      detail: status.database === 'connected' ? 'Database reachable' : 'Database unavailable',
    },
    {
      name: 'Research execution',
      status: status.research_execution,
      detail: 'TradingAgents worker not yet connected',
    },
    {
      name: 'Market data',
      status: status.market_data,
      detail: 'No market data feed configured',
    },
    {
      name: 'News integration',
      status: status.news_integration,
      detail: 'No news provider connected',
    },
    {
      name: 'Telegram integration',
      status: status.telegram_integration,
      detail: 'Telegram notifications not configured',
    },
    {
      name: 'Maritime data',
      status: status.maritime_data,
      detail: 'Maritime AIS feed not configured',
    },
    {
      name: 'Aviation data',
      status: status.aviation_data,
      detail: 'Aviation feed not configured',
    },
  ]

  return {
    statuses,
    loading,
    error,
    backendReachable: status.backend === 'connected',
  }
}
