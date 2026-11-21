import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { submitDemoResearch } from '../services/researchService'
import { Card, PageHeader } from '../components/ui'

export function NewResearch() {
  const navigate = useNavigate()
  const [market, setMarket] = useState<'India' | 'Global'>('India')
  const [exchange, setExchange] = useState('NSE')
  const [symbol, setSymbol] = useState('RELIANCE')
  const [analysisDate, setAnalysisDate] = useState('2026-11-18')
  const [profile, setProfile] = useState<'Standard' | 'Deep'>('Standard')
  const [analysts, setAnalysts] = useState(['Market', 'Fundamentals', 'News', 'Sentiment'])

  const toggleAnalyst = (value: string) => setAnalysts((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value])

  return (
    <>
      <PageHeader eyebrow="Research request" title="New research" description="Create a simulated research job from the available demonstration inputs." />
      <form className="research-form" onSubmit={(event) => {
        event.preventDefault()
        if (!symbol.trim()) { toast.error('Enter a company or symbol'); return }
        if (!analysisDate) { toast.error('Choose an analysis date'); return }
        if (analysts.length === 0) { toast.error('Select at least one analyst'); return }
        submitDemoResearch({ market, exchange, symbol, analysisDate, profile, analysts })
        toast.success('Demonstration research job created')
        navigate({ to: '/runs' })
      }}>
        <Card className="form-card">
          <div className="form-section"><span className="step-number">01</span><div><h2>Instrument</h2><p>Choose a market and exchange for the demo request.</p></div></div>
          <div className="form-grid">
            <label><span>Market</span><select value={market} onChange={(event) => { const value = event.target.value as 'India' | 'Global'; setMarket(value); setExchange(value === 'India' ? 'NSE' : 'NASDAQ') }}><option>India</option><option>Global</option></select></label>
            <label><span>Exchange</span><select value={exchange} onChange={(event) => setExchange(event.target.value)}>{market === 'India' ? <><option>NSE</option><option>BSE</option></> : <><option>NASDAQ</option><option>NYSE</option><option>HKEX</option><option>LSE</option><option>JPX</option></>}</select></label>
            <label className="span-2"><span>Company or symbol</span><input value={symbol} onChange={(event) => setSymbol(event.target.value)} placeholder="e.g. RELIANCE.NS or Reliance Industries" /></label>
            <label><span>Analysis date</span><input type="date" value={analysisDate} onChange={(event) => setAnalysisDate(event.target.value)} /></label>
          </div>
        </Card>
        <Card className="form-card">
          <div className="form-section"><span className="step-number">02</span><div><h2>Research profile</h2><p>Select the simulated depth and analyst coverage.</p></div></div>
          <div className="profile-options">
            {(['Standard', 'Deep'] as const).map((option) => <button type="button" key={option} className={profile === option ? 'profile-option selected' : 'profile-option'} onClick={() => setProfile(option)}><strong>{option}</strong><span>{option === 'Standard' ? 'Balanced coverage with core analysts.' : 'Extended debate and risk review.'}</span></button>)}
          </div>
          <div className="analyst-grid">
            {['Market', 'Fundamentals', 'News', 'Sentiment'].map((analyst) => <label className="check-option" key={analyst}><input type="checkbox" checked={analysts.includes(analyst)} onChange={() => toggleAnalyst(analyst)} /><span>{analyst}</span></label>)}
          </div>
        </Card>
        <div className="form-actions"><span><ShieldCheck size={15}/>Demo submission only. No live research engine or API call.</span><button className="button button-primary" type="submit">Create demo job <ArrowRight size={16}/></button></div>
      </form>
    </>
  )
}
