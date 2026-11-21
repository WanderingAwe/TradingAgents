import { useCallback, useEffect, useRef, useState } from 'react'
import { DockviewReact, themeDark } from 'dockview-react'
import type { DockviewApi, DockviewReadyEvent } from 'dockview-react'
import 'dockview-react/dist/styles/dockview.css'
import { toast } from 'sonner'
import { WORKSPACE_PANEL_COMPONENTS } from '../../terminal/workspace/panelComponents'
import { WORKSPACE_PANEL_REGISTRY } from '../../terminal/workspace/panelRegistry'
import { WORKSPACE_PRESETS } from '../../terminal/workspace/presets'
import { addPanelSpec, applyWorkspacePreset, nextPanelInstance } from '../../terminal/workspace/instances'
import { loadActivePreset, loadPresetLayout, saveActivePreset, savePresetLayout } from '../../terminal/workspace/persistence'
import { useWorkspaceStore } from '../../terminal/workspace/workspaceStore'
import type { WorkspacePanelKind, WorkspacePresetId } from '../../terminal/workspace/types'

const LAYOUT_SAVE_DELAY = 180

export function WorkspacePage() {
  const apiRef = useRef<DockviewApi | null>(null)
  const layoutSubscription = useRef<{ dispose: () => void } | null>(null)
  const saveTimer = useRef<number | null>(null)
  const suppressSave = useRef(false)
  const activePreset = useWorkspaceStore((state) => state.activePreset)
  const setActivePreset = useWorkspaceStore((state) => state.setActivePreset)
  const [placement, setPlacement] = useState<'right' | 'below' | 'within'>('right')
  const [ready, setReady] = useState(false)

  const persistCurrentLayout = useCallback((preset: WorkspacePresetId, api: DockviewApi) => {
    const layout = api.toJSON()
    if (!savePresetLayout(preset, layout, window.localStorage)) {
      toast.error('Layout could not be saved in this browser')
    }
  }, [])

  const onReady = useCallback((event: DockviewReadyEvent) => {
    const api = event.api
    apiRef.current = api
    const preset = loadActivePreset(window.localStorage)
    setActivePreset(preset)
    const saved = loadPresetLayout(preset, window.localStorage)
    let restored = false
    if (saved) {
      try {
        api.fromJSON(saved, { reuseExistingPanels: false })
        restored = true
      } catch {
        api.clear()
      }
    }
    if (!restored) {
      applyWorkspacePreset(api, WORKSPACE_PRESETS[preset])
      persistCurrentLayout(preset, api)
    }
    setReady(true)

    layoutSubscription.current?.dispose()
    layoutSubscription.current = api.onDidLayoutChange(() => {
      if (suppressSave.current) return
      if (saveTimer.current !== null) window.clearTimeout(saveTimer.current)
      saveTimer.current = window.setTimeout(() => persistCurrentLayout(useWorkspaceStore.getState().activePreset, api), LAYOUT_SAVE_DELAY)
    })
  }, [persistCurrentLayout, setActivePreset])

  useEffect(() => () => {
    if (saveTimer.current !== null) window.clearTimeout(saveTimer.current)
    layoutSubscription.current?.dispose()
    layoutSubscription.current = null
  }, [])

  const switchPreset = (preset: WorkspacePresetId) => {
    const api = apiRef.current
    if (!api || preset === activePreset) return
    persistCurrentLayout(activePreset, api)
    suppressSave.current = true
    const stored = loadPresetLayout(preset, window.localStorage)
    let restored = false
    if (stored) {
      try {
        api.fromJSON(stored, { reuseExistingPanels: false })
        restored = true
      } catch {
        api.clear()
      }
    }
    if (!restored) applyWorkspacePreset(api, WORKSPACE_PRESETS[preset])
    setActivePreset(preset)
    saveActivePreset(preset, window.localStorage)
    persistCurrentLayout(preset, api)
    window.setTimeout(() => { suppressSave.current = false }, 0)
  }

  const addPanel = (kind: WorkspacePanelKind, symbol?: string) => {
    const api = apiRef.current
    if (!api) return
    const spec = nextPanelInstance(api, kind, symbol)
    const activeId = api.activePanel?.id
    if (activeId) {
      spec.referenceId = activeId
      spec.direction = placement
    }
    if (addPanelSpec(api, spec)) {
      api.getPanel(spec.id)?.api.setActive()
      toast.success(`${spec.title} panel added`)
    }
  }

  const resetLayout = () => {
    const api = apiRef.current
    if (!api) return
    suppressSave.current = true
    applyWorkspacePreset(api, WORKSPACE_PRESETS[activePreset])
    persistCurrentLayout(activePreset, api)
    window.setTimeout(() => { suppressSave.current = false }, 0)
    toast.success(`${WORKSPACE_PRESETS[activePreset].label} layout reset`)
  }

  const saveLayout = () => {
    const api = apiRef.current
    if (!api) return
    persistCurrentLayout(activePreset, api)
    saveActivePreset(activePreset, window.localStorage)
    toast.success(`${WORKSPACE_PRESETS[activePreset].label} layout saved`)
  }

  return (
    <div className="workstation-page">
      <div className="workstation-toolbar">
        <div className="workstation-title"><span className="workstation-kicker">WORKSPACE / DEMO</span><strong>Multi-Panel Workstation</strong></div>
        <div className="workstation-controls">
          <label className="workspace-placement"><span>ADD POSITION</span><select value={placement} onChange={(event) => setPlacement(event.target.value as typeof placement)}><option value="right">Split right</option><option value="below">Split below</option><option value="within">Tab group</option></select></label>
          <details className="workspace-add-menu"><summary>ADD PANEL</summary><div className="workspace-add-options">{WORKSPACE_PANEL_REGISTRY.map((definition) => definition.kind === 'chart' ? <div className="workspace-add-chart" key={definition.kind}><span>CHART · DEMO SYMBOL</span><button onClick={() => addPanel('chart', 'NIFTY 50')}>NIFTY 50</button><button onClick={() => addPanel('chart', 'RELIANCE.NS')}>RELIANCE.NS</button></div> : <button key={definition.kind} onClick={() => addPanel(definition.kind)}>{definition.label.toUpperCase()}</button>)}</div></details>
          <div className="workspace-preset-switch" role="group" aria-label="Workspace presets">{Object.values(WORKSPACE_PRESETS).map((preset) => <button key={preset.id} className={activePreset === preset.id ? 'active' : ''} onClick={() => switchPreset(preset.id)}>{preset.label.toUpperCase()}</button>)}</div>
          <button className="workspace-save" onClick={saveLayout}>SAVE LAYOUT</button>
          <button className="workspace-reset" onClick={resetLayout}>RESET LAYOUT</button>
          <span className="workspace-save-status">{ready ? 'LAYOUT SAVED LOCALLY' : 'RESTORING LAYOUT'}</span>
        </div>
      </div>
      <div className="workstation-dockview" aria-label="Dockable research workstation">
        <DockviewReact components={WORKSPACE_PANEL_COMPONENTS} theme={themeDark} onReady={onReady} watermarkComponent={() => <div className="workspace-watermark">ADD PANEL TO START · DEMO DATA ONLY</div>} />
      </div>
      <div className="workstation-footer"><span>LAYOUTS: LOCAL UI PREFERENCES ONLY</span><span>NO MARKET FEED · NO BACKEND · NO RESEARCH EXECUTION</span></div>
    </div>
  )
}
