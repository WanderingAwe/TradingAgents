import { describe, expect, it } from 'vitest'
import { advanceDemoJobs, submitDemoResearch } from './researchService'

describe('demo research service', () => {
  it('creates a queued job without contacting an external service', () => {
    const job = submitDemoResearch({
      market: 'India',
      exchange: 'NSE',
      symbol: 'INFY.NS',
      analysisDate: '2026-11-18',
      profile: 'Standard',
      analysts: ['Market', 'Fundamentals'],
    })

    expect(job.symbol).toBe('INFY.NS')
    expect(job.status).toBe('Queued')
    expect(job.stage).toBe('Queued')
  })

  it('advances the demonstration lifecycle', () => {
    submitDemoResearch({
      market: 'Global',
      exchange: 'NASDAQ',
      symbol: 'MSFT',
      analysisDate: '2026-11-18',
      profile: 'Deep',
      analysts: ['Market'],
    })
    const jobs = advanceDemoJobs()
    expect(jobs.length).toBeGreaterThan(0)
  })
})
