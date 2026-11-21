import { describe, expect, it } from 'vitest'
import { isTypingTarget, TERMINAL_SHORTCUTS } from './keyboard'

describe('terminal keyboard manager', () => {
  it('defines palette, command and escape shortcuts', () => {
    expect(TERMINAL_SHORTCUTS.map((shortcut) => shortcut.id)).toEqual(['palette', 'command', 'escape'])
  })

  it('does not regard null text targets as typing targets', () => {
    expect(isTypingTarget(null)).toBe(false)
  })

  it('does not regard a plain object as a typing target', () => {
    expect(isTypingTarget({} as EventTarget)).toBe(false)
  })
})
