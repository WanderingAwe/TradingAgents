import { CheckCircle2, CircleDashed } from 'lucide-react'
import { getSystemStatus } from '../services/systemService'
import { Card, PageHeader, StatusBadge } from '../components/ui'

export function SystemHealth() {
  const statuses = getSystemStatus()
  return <><PageHeader eyebrow="Operations" title="System health" description="Component availability without implying unimplemented integrations are live."/><Card><div className="health-table"><div className="health-table-head"><span>Component</span><span>Status</span><span>Detail</span></div>{statuses.map((item) => <div className="health-row" key={item.name}><span>{item.status === 'Online' ? <CheckCircle2 size={17}/> : <CircleDashed size={17}/>}<strong>{item.name}</strong></span><StatusBadge status={item.status}/><p>{item.detail}</p></div>)}</div></Card></>
}
