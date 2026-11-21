import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Card, PageHeader } from '../components/ui'

export function AIModels() {
  const [provider, setProvider] = useState('OpenRouter demo')
  const [quick, setQuick] = useState('Demonstration quick model')
  const [deep, setDeep] = useState('Demonstration research model')
  return <><PageHeader eyebrow="Model configuration" title="AI models" description="Preview-only provider and research profile configuration."/><div className="settings-layout"><Card className="settings-card"><div className="section-heading"><h2>Provider</h2><span className="status status-demo"><i/>Demo only</span></div><label><span>Provider</span><select value={provider} onChange={(event) => setProvider(event.target.value)}><option>OpenRouter demo</option><option>Ollama demo</option><option>Azure demo</option></select></label><label><span>Availability</span><input value="Not connected — credential collection disabled" readOnly /></label><div className="callout"><ShieldCheck size={16}/><span>API credentials are never collected or displayed in Phase 1.</span></div></Card><Card className="settings-card"><div className="section-heading"><h2>Model profiles</h2></div><label><span>Quick research model</span><select value={quick} onChange={(event) => setQuick(event.target.value)}><option>Demonstration quick model</option></select></label><label><span>Deep research model</span><select value={deep} onChange={(event) => setDeep(event.target.value)}><option>Demonstration research model</option></select></label><button className="button button-primary" onClick={() => toast.success('Demonstration model preferences saved')}>Save demo preferences</button></Card></div></>
}
