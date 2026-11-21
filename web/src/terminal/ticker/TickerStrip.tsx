export interface DemoTicker {
  symbol: string
  name: string
  value: string
  change: string
  tone: 'positive' | 'negative' | 'neutral'
}

const DEMO_TICKERS: DemoTicker[] = [
  { symbol: 'NIFTY 50', name: 'DEMO', value: '24,712.40', change: '+0.42%', tone: 'positive' },
  { symbol: 'SENSEX', name: 'DEMO', value: '81,124.60', change: '+0.38%', tone: 'positive' },
  { symbol: 'RELIANCE.NS', name: 'DEMO', value: '2,986.40', change: '-0.18%', tone: 'negative' },
  { symbol: 'INFY.NS', name: 'DEMO', value: '1,482.20', change: '+0.64%', tone: 'positive' },
  { symbol: 'AAPL', name: 'DEMO', value: '224.18', change: '+0.21%', tone: 'positive' },
]

export function TickerStrip() {
  return (
    <div className="terminal-ticker" aria-label="Demo market ticker strip">
      <span className="terminal-ticker-label">DEMO TAPE</span>
      <div className="terminal-ticker-items">
        {[...DEMO_TICKERS, ...DEMO_TICKERS].map((ticker, index) => (
          <span className="terminal-ticker-item" key={`${ticker.symbol}-${index}`}>
            <strong>{ticker.symbol}</strong>
            <span>{ticker.value}</span>
            <b className={`terminal-change-${ticker.tone}`}>{ticker.change}</b>
            <small>{ticker.name}</small>
          </span>
        ))}
      </div>
    </div>
  )
}
