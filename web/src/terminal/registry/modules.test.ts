import { describe, expect, it } from 'vitest'
import { findTerminalModule, TERMINAL_MODULES } from './modules'

describe('terminal module registry', () => {
  it('contains all existing modules and the workstation route', () => {
    expect(TERMINAL_MODULES).toHaveLength(9)
    expect(TERMINAL_MODULES.map((module) => module.path)).toEqual(expect.arrayContaining(['/','/research/new','/runs','/reports','/sources','/models','/telegram','/health','/workspace']))
  })

  it('resolves report detail routes to the reports module', () => {
    expect(findTerminalModule('/reports/RP-2602')?.id).toBe('reports')
  })
})
