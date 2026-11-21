import { useState } from 'react'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { Card, PageHeader, StatusBadge } from '../components/ui'

export function Telegram() {
  const [preference, setPreference] = useState('Summary and PDF')
  const [enabled, setEnabled] = useState(false)
  return <><PageHeader eyebrow="Notification delivery" title="Telegram" description="Future delivery configuration with all actions disabled in demo mode."/><div className="settings-layout"><Card className="settings-card"><div className="section-heading"><h2>Connection</h2><StatusBadge status="Not connected"/></div><label><span>Bot status</span><input value="No Telegram integration configured" readOnly /></label><label><span>Operator chat</span><input value="Not configured" readOnly /></label><label className="toggle-row"><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} /><span>Enable notification preference</span></label></Card><Card className="settings-card"><div className="section-heading"><h2>Delivery preference</h2></div><label><span>Notification content</span><select value={preference} onChange={(event) => setPreference(event.target.value)}><option>Summary only</option><option>Summary and PDF</option></select></label><button className="button button-secondary" onClick={() => toast.info('Demonstration only — no Telegram message was sent')}><Send size={16}/>Send demo test notification</button></Card></div><Card><div className="card-heading"><div><span className="eyebrow">History</span><h2>Delivery history</h2></div></div><div className="empty-state"><strong>No delivery history</strong><span>Telegram delivery is not implemented in this phase.</span></div></Card></>
}
