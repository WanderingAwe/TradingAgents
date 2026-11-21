/**
 * Typed API client for the Trading Terminal backend.
 *
 * All requests use the relative /api/v1 base path, which the Vite dev proxy
 * forwards to the FastAPI backend in development. In production, the frontend
 * is expected to be served from the same origin as the backend or behind a
 * reverse proxy that routes /api/v1 accordingly.
 *
 * The client is intentionally dependency-free (uses native fetch) so it can be
 * reused by Market, News, Global Intelligence, Research and Portfolio modules
 * without adding frontend packages.
 */

const API_BASE = '/api/v1'

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public requestId: string | null,
    public details: Record<string, unknown> | null,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${path}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  const requestId = response.headers.get('x-request-id') ?? null

  if (!response.ok) {
    let body: { error?: string; message?: string; details?: unknown } = {}
    try {
      body = (await response.json()) as { error?: string; message?: string; details?: unknown }
    } catch {
      // Non-JSON error response; use status text as message
    }
    throw new ApiError(
      response.status,
      body.error ?? 'request_failed',
      body.message ?? response.statusText,
      requestId,
      body.details as Record<string, unknown> | null,
    )
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T
  }

  return (await response.json()) as T
}

export { ApiError }

export interface Instrument {
  id: number
  symbol: string
  name: string
  exchange: string
  instrument_type: string
  currency: string
  country_code: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DataSource {
  id: number
  source_code: string
  name: string
  provider: string
  source_type: string
  is_active: boolean
  source_url: string | null
  terms_url: string | null
  created_at: string
  updated_at: string
}

export interface Observation {
  id: number
  data_source_id: number | null
  instrument_id: number | null
  observation_type: string
  observed_at: string
  published_at: string | null
  retrieved_at: string
  numeric_value: number | null
  text_value: string | null
  unit: string | null
  currency: string | null
  external_reference: string | null
  source_url: string | null
  raw_payload: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface PaginationMeta {
  page: number
  page_size: number
  total: number
  total_pages: number
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
}

export interface HealthLive {
  status: string
}

export interface HealthReady {
  status: string
  database: string
}

export interface SystemStatus {
  backend: 'connected' | 'disconnected' | 'not_configured' | 'degraded'
  database: 'connected' | 'disconnected' | 'not_configured' | 'degraded'
  research_execution: 'connected' | 'disconnected' | 'not_configured' | 'degraded'
  market_data: 'connected' | 'disconnected' | 'not_configured' | 'degraded'
  news_integration: 'connected' | 'disconnected' | 'not_configured' | 'degraded'
  telegram_integration: 'connected' | 'disconnected' | 'not_configured' | 'degraded'
  maritime_data: 'connected' | 'disconnected' | 'not_configured' | 'degraded'
  aviation_data: 'connected' | 'disconnected' | 'not_configured' | 'degraded'
  environment: string
}

/** GET /api/v1/health/live */
export async function getHealthLive(): Promise<HealthLive> {
  return request<HealthLive>('/health/live')
}

/** GET /api/v1/health/ready */
export async function getHealthReady(): Promise<HealthReady> {
  return request<HealthReady>('/health/ready')
}

/** GET /api/v1/system/status */
export async function getSystemStatus(): Promise<SystemStatus> {
  return request<SystemStatus>('/system/status')
}

/** GET /api/v1/instruments */
export async function getInstruments(params?: {
  exchange?: string
  instrument_type?: string
  is_active?: boolean
  limit?: number
  offset?: number
}): Promise<Instrument[]> {
  const qs = new URLSearchParams()
  if (params?.exchange) qs.set('exchange', params.exchange)
  if (params?.instrument_type) qs.set('instrument_type', params.instrument_type)
  if (params?.is_active !== undefined) qs.set('is_active', String(params.is_active))
  if (params?.limit !== undefined) qs.set('limit', String(params.limit))
  if (params?.offset !== undefined) qs.set('offset', String(params.offset))
  const query = qs.toString() ? `?${qs.toString()}` : ''
  return request<Instrument[]>(`/instruments${query}`)
}

/** GET /api/v1/instruments/{id} */
export async function getInstrument(id: number): Promise<Instrument> {
  return request<Instrument>(`/instruments/${id}`)
}

/** POST /api/v1/instruments */
export async function createInstrument(body: {
  symbol: string
  name: string
  exchange: string
  instrument_type?: string
  currency?: string
  country_code?: string
  is_active?: boolean
}): Promise<Instrument> {
  return request<Instrument>('/instruments', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/** GET /api/v1/data-sources */
export async function getDataSources(params?: {
  source_type?: string
  is_active?: boolean
  limit?: number
  offset?: number
}): Promise<DataSource[]> {
  const qs = new URLSearchParams()
  if (params?.source_type) qs.set('source_type', params.source_type)
  if (params?.is_active !== undefined) qs.set('is_active', String(params.is_active))
  if (params?.limit !== undefined) qs.set('limit', String(params.limit))
  if (params?.offset !== undefined) qs.set('offset', String(params.offset))
  const query = qs.toString() ? `?${qs.toString()}` : ''
  return request<DataSource[]>(`/data-sources${query}`)
}

/** GET /api/v1/data-sources/{id} */
export async function getDataSource(id: number): Promise<DataSource> {
  return request<DataSource>(`/data-sources/${id}`)
}

/** POST /api/v1/data-sources */
export async function createDataSource(body: {
  source_code: string
  name: string
  provider: string
  source_type: string
  is_active?: boolean
  source_url?: string | null
  terms_url?: string | null
}): Promise<DataSource> {
  return request<DataSource>('/data-sources', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/** GET /api/v1/observations */
export async function getObservations(params?: {
  data_source_id?: number
  instrument_id?: number
  observation_type?: string
  observed_from?: string
  observed_to?: string
  limit?: number
  offset?: number
}): Promise<Observation[]> {
  const qs = new URLSearchParams()
  if (params?.data_source_id !== undefined) qs.set('data_source_id', String(params.data_source_id))
  if (params?.instrument_id !== undefined) qs.set('instrument_id', String(params.instrument_id))
  if (params?.observation_type) qs.set('observation_type', params.observation_type)
  if (params?.observed_from) qs.set('observed_from', params.observed_from)
  if (params?.observed_to) qs.set('observed_to', params.observed_to)
  if (params?.limit !== undefined) qs.set('limit', String(params.limit))
  if (params?.offset !== undefined) qs.set('offset', String(params.offset))
  const query = qs.toString() ? `?${qs.toString()}` : ''
  return request<Observation[]>(`/observations${query}`)
}

/** GET /api/v1/observations/{id} */
export async function getObservation(id: number): Promise<Observation> {
  return request<Observation>(`/observations/${id}`)
}

/** POST /api/v1/observations */
export async function createObservation(body: {
  data_source_id?: number | null
  instrument_id?: number | null
  observation_type: string
  observed_at: string
  published_at?: string | null
  numeric_value?: number | null
  text_value?: string | null
  unit?: string | null
  currency?: string | null
  external_reference?: string | null
  source_url?: string | null
  raw_payload?: Record<string, unknown> | null
}): Promise<Observation> {
  return request<Observation>('/observations', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
