export interface ComponentStatus {
  name: string
  status: 'Online' | 'Demo' | 'Not implemented' | 'Not connected'
  detail: string
}

export function getSystemStatus(): ComponentStatus[] {
  return [
    { name: 'Frontend', status: 'Online', detail: 'Research Studio is available in this browser.' },
    { name: 'Demo data', status: 'Demo', detail: 'Fixtures and simulated lifecycle only.' },
    { name: 'FastAPI backend', status: 'Not implemented', detail: 'No application API is connected.' },
    { name: 'Research worker', status: 'Not implemented', detail: 'TradingAgentsGraph is not called by the frontend.' },
    { name: 'PostgreSQL', status: 'Not implemented', detail: 'No database integration exists.' },
    { name: 'Telegram', status: 'Not connected', detail: 'No Telegram message can be sent from this demo.' },
  ]
}
