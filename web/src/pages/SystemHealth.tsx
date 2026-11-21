import { useEffect, useState } from 'react'
import { CheckCircle2, CircleDashed, AlertCircle, RefreshCw } from 'lucide-react'
import { getFreshSystemStatus, getSystemStatus, type ComponentStatus, type SystemStatusResult } from '../services/systemService'
import { Card, PageHeader, StatusBadge, Button } from '../components/ui'

export function SystemHealth() {
  const [result, setResult] = useState<SystemStatusResult | null>(null)

  useEffect(() => {
    let mounted = true
    getSystemStatus().then((data) => {
      if (mounted) setResult(data)
    })
    return () => {
      mounted = false
    }
  }, [])

  const refresh = () => {
    getFreshSystemStatus().then((data) => {
      setResult(data)
    })
  }

  if (!result) {
    return (
      <>
        <PageHeader
          eyebrow="Operations"
          title="System health"
          description="Component availability without implying unimplemented integrations are live."
        />
        <Card>
          <div className="health-table">
            <div className="health-table-head">
              <span>Component</span>
              <span>Status</span>
              <span>Detail</span>
            </div>
            <div className="health-row health-row-loading">
              <span>Loading system status…</span>
              <span>-</span>
              <span>Connecting to backend API</span>
            </div>
          </div>
        </Card>
      </>
    )
  }

  if (result.error && !result.backendReachable) {
    return (
      <>
        <PageHeader
          eyebrow="Operations"
          title="System health"
          description="Component availability without implying unimplemented integrations are live."
        />
        <Card>
          <div className="health-table">
            <div className="health-table-head">
              <span>Component</span>
              <span>Status</span>
              <span>Detail</span>
            </div>
            <div className="health-row health-row-error">
              <span>
                <AlertCircle size={17} />
                Backend API
              </span>
              <StatusBadge status="disconnected" />
              <p>{result.error}</p>
            </div>
            <div className="health-row health-row-actions">
              <span />
              <Button onClick={refresh} variant="ghost">
                <RefreshCw size={17} />
                Retry
              </Button>
              <span>Backend unreachable at /api/v1</span>
            </div>
          </div>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="System health"
        description="Component availability without implying unimplemented integrations are live."
      />
      <Card>
        <div className="health-table">
          <div className="health-table-head">
            <span>Component</span>
            <span>Status</span>
            <span>Detail</span>
          </div>
          {result.statuses.map((item: ComponentStatus) => (
            <div className="health-row" key={item.name}>
              <span>
                {item.status === 'connected' ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <CircleDashed size={17} />
                )}
                <strong>{item.name}</strong>
              </span>
              <StatusBadge status={item.status} />
              <p>{item.detail}</p>
            </div>
          ))}
          <div className="health-row health-row-actions">
            <span />
            <Button onClick={refresh} variant="ghost">
              <RefreshCw size={17} />
              Refresh
            </Button>
            <span>
              {result.backendReachable ? 'Backend reachable' : 'Backend unreachable'}
            </span>
          </div>
        </div>
      </Card>
    </>
  )
}
