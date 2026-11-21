import { describe, expect, it } from 'vitest'
import { parseTerminalCommand } from './parser'
import { createTerminalCommandRegistry } from './registry'

describe('terminal command parser', () => {
  it('parses navigation commands safely', () => {
    expect(parseTerminalCommand('NEW RESEARCH')).toEqual({ type: 'navigate', target: 'new-research' })
    expect(parseTerminalCommand('/runs')).toEqual({ type: 'navigate', target: 'active-runs' })
    expect(parseTerminalCommand('WORKSPACE')).toEqual({ type: 'navigate', target: 'workspace' })
  })

  it('recognizes help and unknown commands', () => {
    expect(parseTerminalCommand('HELP')).toEqual({ type: 'help' })
    expect(parseTerminalCommand('TRADE')).toEqual({ type: 'unknown', input: 'TRADE' })
  })

  it('does not execute or parse API or data operations', () => {
    expect(parseTerminalCommand('LIVE API')).toEqual({ type: 'unknown', input: 'LIVE API' })
  })

  it('navigates through the command registry without invoking services', () => {
    const navigated: string[] = []
    const commands = createTerminalCommandRegistry((path) => navigated.push(path))
    commands.execute(parseTerminalCommand('WORKSPACE'))
    expect(navigated).toEqual(['/workspace'])
  })
})
