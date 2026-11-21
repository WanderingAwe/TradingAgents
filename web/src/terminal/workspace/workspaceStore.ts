import { create } from 'zustand'
import { DEFAULT_WORKSPACE_PRESET } from './presets'
import type { WorkspacePresetId } from './types'

interface WorkspaceUiState {
  activePreset: WorkspacePresetId
  setActivePreset: (preset: WorkspacePresetId) => void
}

export const useWorkspaceStore = create<WorkspaceUiState>((set) => ({
  activePreset: DEFAULT_WORKSPACE_PRESET,
  setActivePreset: (activePreset) => set({ activePreset }),
}))
