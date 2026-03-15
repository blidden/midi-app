import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Sidebar from './components/Sidebar'
import PedalboardCanvas from './components/PedalboardCanvas'
import RightPanel from './components/RightPanel'
import './App.css'

const IMG_BASE_PEDAL = 'https://pedalplayground.com/public/images/pedals/'
const IMG_BASE_BOARD = 'https://pedalplayground.com/public/images/pedalboards/'

const THEMES = [
  { id: 'light',       name: 'Light',       swatch: '#eeeef0' },
  { id: 'dark',        name: 'Dark',        swatch: '#0f0f11' },
  { id: 'dracula',     name: 'Dracula',     swatch: '#282a36' },
  { id: 'monokai',     name: 'Monokai',     swatch: '#272822' },
  { id: 'nord',        name: 'Nord',        swatch: '#2e3440' },
  { id: 'tokyo-night', name: 'Tokyo Night', swatch: '#1a1b26' },
]

function getInitialTheme() {
  try {
    const saved = localStorage.getItem('midi-app-theme')
    if (saved && THEMES.some(t => t.id === saved)) return saved
  } catch {}
  return 'light'
}

/* ── SVG Logo ── */
function AppLogo() {
  return (
    <svg className="header-logo-svg" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <rect x="1" y="5" width="24" height="16" rx="4" strokeWidth="1.6" stroke="currentColor"/>
      <circle cx="7.5" cy="11" r="2" fill="currentColor"/>
      <circle cx="13" cy="11" r="2" fill="currentColor"/>
      <circle cx="18.5" cy="11" r="2" fill="currentColor"/>
      <rect x="6" y="15.5" width="3" height="2.5" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="11.5" y="15.5" width="3" height="2.5" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="17" y="15.5" width="3" height="2.5" rx="1" fill="currentColor" opacity="0.5"/>
      <path d="M10 1.5 L13 4.5 L16 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5"/>
    </svg>
  )
}

export default function App() {
  const [pedalboardsData, setPedalboardsData] = useState([])
  const [pedals,          setPedals]          = useState([])
  const [boards,          setBoards]          = useState([{
    id: 1, name: 'Board 1',
    hardwareBoard: null, placedPedals: [],
    psuId: null, viewOffset: null, nextPedalId: 1,
  }])
  const [activeBoardId,   setActiveBoardId]   = useState(1)
  const [nextBoardId,     setNextBoardId]     = useState(2)
  const [editingBoardId,  setEditingBoardId]  = useState(null)
  const [selectedPedal,   setSelectedPedal]   = useState(null)
  const [midiPanelOpen,   setMidiPanelOpen]   = useState(false)
  const [selectedPedalIds,setSelectedPedalIds]= useState(new Set())
  const [theme,           setTheme]           = useState(getInitialTheme)
  const [showThemePicker, setShowThemePicker] = useState(false)
  const [guitarContext,   setGuitarContext]   = useState({ guitar: null, amp: null, useAmp: true })

  // Resizable panels
  const [sidebarWidth,    setSidebarWidth]    = useState(272)
  const [rightWidth,      setRightWidth]      = useState(320)

  const loadInputRef    = useRef(null)
  const themePickerRef  = useRef(null)
  const sidebarResizing = useRef(null)
  const rightResizing   = useRef(null)

  // Active board derived
  const activeBoard = useMemo(
    () => boards.find(b => b.id === activeBoardId) ?? boards[0],
    [boards, activeBoardId]
  )
  const placedPedals  = activeBoard.placedPedals
  const selectedBoard = activeBoard.hardwareBoard
  const selectedPsuId = activeBoard.psuId

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('midi-app-theme', theme) } catch {}
  }, [theme])

  // Close theme picker on outside click
  useEffect(() => {
    const handler = (e) => {
      if (themePickerRef.current && !themePickerRef.current.contains(e.target)) {
        setShowThemePicker(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Panel resize logic
  useEffect(() => {
    const onMove = (e) => {
      if (sidebarResizing.current) {
        const { startX, startWidth } = sidebarResizing.current
        setSidebarWidth(Math.max(200, Math.min(480, startWidth + (e.clientX - startX))))
      }
      if (rightResizing.current) {
        const { startX, startWidth } = rightResizing.current
        setRightWidth(Math.max(240, Math.min(600, startWidth - (e.clientX - startX))))
      }
    }
    const onUp = () => {
      sidebarResizing.current = null
      rightResizing.current = null
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [])

  const startSidebarResize = useCallback((e) => {
    e.preventDefault()
    sidebarResizing.current = { startX: e.clientX, startWidth: sidebarWidth }
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'ew-resize'
  }, [sidebarWidth])

  const startRightResize = useCallback((e) => {
    e.preventDefault()
    rightResizing.current = { startX: e.clientX, startWidth: rightWidth }
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'ew-resize'
  }, [rightWidth])

  // Load data
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/pedals.json`).then(r => r.json()).then(setPedals).catch(console.error)
    fetch(`${import.meta.env.BASE_URL}data/pedalboards.json`).then(r => r.json()).then(data => {
      setPedalboardsData(data)
      setBoards(prev => prev.map(b =>
        b.hardwareBoard ? b : { ...b, hardwareBoard: data[0] ?? null }
      ))
    }).catch(console.error)
  }, [])

  // ── Board helper ──────────────────────────────────────────────────────────
  const updateActive = useCallback((fn) => {
    setBoards(prev => prev.map(b => b.id === activeBoardId ? fn(b) : b))
  }, [activeBoardId])

  // ── Board CRUD ────────────────────────────────────────────────────────────
  const addBoard = useCallback(() => {
    const id = nextBoardId
    const defHardware = pedalboardsData[0] ?? null
    setBoards(prev => [...prev, {
      id, name: `Board ${id}`,
      hardwareBoard: defHardware, placedPedals: [],
      psuId: null, viewOffset: null, nextPedalId: 1,
    }])
    setActiveBoardId(id)
    setNextBoardId(n => n + 1)
    setSelectedPedal(null); setMidiPanelOpen(false); setSelectedPedalIds(new Set())
  }, [nextBoardId, pedalboardsData])

  const deleteBoard = useCallback((id) => {
    setBoards(prev => {
      if (prev.length === 1) return prev
      const next = prev.filter(b => b.id !== id)
      if (activeBoardId === id) setActiveBoardId(next[next.length - 1].id)
      return next
    })
    setSelectedPedal(null); setMidiPanelOpen(false); setSelectedPedalIds(new Set())
  }, [activeBoardId])

  const renameBoard = useCallback((id, name) => {
    setBoards(prev => prev.map(b => b.id === id ? { ...b, name } : b))
  }, [])

  const switchBoard = useCallback((id) => {
    setActiveBoardId(id)
    setSelectedPedal(null); setMidiPanelOpen(false); setSelectedPedalIds(new Set())
  }, [])

  // ── Pedal operations ──────────────────────────────────────────────────────
  const addPedal = useCallback((pedal) => {
    updateActive(b => {
      const id = b.nextPedalId
      return {
        ...b,
        nextPedalId: id + 1,
        placedPedals: [...b.placedPedals, {
          id, brand: pedal.Brand, name: pedal.Name, image: pedal.Image,
          widthIn: pedal.Width, heightIn: pedal.Height,
          xIn: 0.5 + ((id - 1) % 5) * 3.2,
          yIn: 0.4 + Math.floor((id - 1) / 5) * 4.5,
        }],
      }
    })
  }, [updateActive])

  const moveGroupFromStarts = useCallback((groupStarts, dxIn, dyIn) => {
    updateActive(b => ({
      ...b,
      placedPedals: b.placedPedals.map(p => {
        const start = groupStarts.get(p.id)
        if (!start) return p
        return { ...p, xIn: start.xIn + dxIn, yIn: start.yIn + dyIn }
      }),
    }))
  }, [updateActive])

  const removePedal = useCallback((id) => {
    updateActive(b => ({ ...b, placedPedals: b.placedPedals.filter(p => p.id !== id) }))
    setSelectedPedalIds(prev => { const s = new Set(prev); s.delete(id); return s })
    if (selectedPedal?.id === id) { setSelectedPedal(null); setMidiPanelOpen(false) }
  }, [updateActive, selectedPedal])

  const clearBoard = useCallback(() => {
    updateActive(b => ({ ...b, placedPedals: [], nextPedalId: 1 }))
    setSelectedPedal(null); setMidiPanelOpen(false); setSelectedPedalIds(new Set())
  }, [updateActive])

  const reorderPedals = useCallback((fromIndex, toIndex) => {
    updateActive(b => {
      const arr = [...b.placedPedals]
      const [moved] = arr.splice(fromIndex, 1)
      arr.splice(toIndex, 0, moved)
      return { ...b, placedPedals: arr }
    })
  }, [updateActive])

  // ── Selection ─────────────────────────────────────────────────────────────
  const handlePedalClick = useCallback((pedal) => {
    setSelectedPedalIds(new Set([pedal.id]))
    setSelectedPedal(pedal)
    setMidiPanelOpen(true)
  }, [])

  const handleShiftClick = useCallback((pedal) => {
    setSelectedPedalIds(prev => {
      const s = new Set(prev)
      if (s.has(pedal.id)) { s.delete(pedal.id) } else { s.add(pedal.id) }
      return s
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    setSelectedPedalIds(new Set(placedPedals.map(p => p.id)))
  }, [placedPedals])

  const handleCanvasClick = useCallback(() => {
    setSelectedPedalIds(new Set())
    setSelectedPedal(null)
    setMidiPanelOpen(false)
  }, [])

  const closePanel = useCallback(() => { setMidiPanelOpen(false); setSelectedPedal(null) }, [])

  // ── Keyboard: Delete removes selected pedals ───────────────────────────────
  const selectedPedalIdsRef = useRef(selectedPedalIds)
  selectedPedalIdsRef.current = selectedPedalIds
  const removePedalRef = useRef(removePedal)
  removePedalRef.current = removePedal

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const ids = selectedPedalIdsRef.current
        if (ids.size > 0) ids.forEach(id => removePedalRef.current(id))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // ── PSU + hardware board ───────────────────────────────────────────────────
  const handleSelectPsu   = useCallback((id) => updateActive(b => ({ ...b, psuId: id })), [updateActive])
  const handleSelectBoard = useCallback((hw) => updateActive(b => ({ ...b, hardwareBoard: hw })), [updateActive])

  // ── View offset ───────────────────────────────────────────────────────────
  const handleViewOffsetChange = useCallback((x, y) => {
    updateActive(b => ({ ...b, viewOffset: { x, y } }))
  }, [updateActive])

  const handleResetView = useCallback(() => {
    updateActive(b => ({ ...b, viewOffset: { x: 0, y: 0 } }))
  }, [updateActive])

  // ── Save / Load ───────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    const data = { version: 2, boards, activeBoardId, nextBoardId, guitarContext }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href = url; a.download = 'pedalboard.json'
    a.click(); URL.revokeObjectURL(url)
  }, [boards, activeBoardId, nextBoardId, guitarContext])

  const handleLoadFile = useCallback((e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.version === 2) {
          setBoards(data.boards ?? [])
          setActiveBoardId(data.activeBoardId ?? data.boards?.[0]?.id ?? 1)
          setNextBoardId(data.nextBoardId ?? 2)
          if (data.guitarContext) {
            // Migrate: add useAmp default if missing
            setGuitarContext({ useAmp: true, ...data.guitarContext })
          }
        } else if (data.version === 1) {
          const migrated = [{
            id: 1, name: 'Board 1',
            hardwareBoard: data.board ?? null,
            placedPedals: data.pedals ?? [],
            psuId: data.psuId ?? null,
            viewOffset: data.viewOffset ?? null,
            nextPedalId: data.nextId ?? 1,
          }]
          setBoards(migrated); setActiveBoardId(1); setNextBoardId(2)
        } else { alert('Unrecognised save file format.'); return }
        setSelectedPedal(null); setMidiPanelOpen(false); setSelectedPedalIds(new Set())
      } catch { alert('Failed to parse save file.') }
      e.target.value = ''
    }
    reader.readAsText(file)
  }, [])

  const currentTheme = THEMES.find(t => t.id === theme) ?? THEMES[0]

  return (
    <div className="app-layout">
      <header className="app-header">

        {/* Brand */}
        <div className="app-header-brand">
          <AppLogo />
          <span className="header-title">Pedalboard</span>
        </div>

        {/* Board tabs — live in the header */}
        <div className="header-boards">
          {boards.map(b => (
            <div
              key={b.id}
              className={`header-tab${b.id === activeBoardId ? ' active' : ''}`}
              onClick={() => switchBoard(b.id)}
            >
              {editingBoardId === b.id ? (
                <input
                  className="header-tab-input"
                  value={b.name}
                  onChange={e => renameBoard(b.id, e.target.value)}
                  onBlur={() => setEditingBoardId(null)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === 'Escape') setEditingBoardId(null)
                    e.stopPropagation()
                  }}
                  onClick={e => e.stopPropagation()}
                  autoFocus
                />
              ) : (
                <span onDoubleClick={e => { e.stopPropagation(); setEditingBoardId(b.id) }}>
                  {b.name}
                </span>
              )}
              {boards.length > 1 && (
                <button
                  className="header-tab-close"
                  onClick={e => { e.stopPropagation(); deleteBoard(b.id) }}
                  title="Delete board"
                >×</button>
              )}
            </div>
          ))}
          <button className="header-tab-add" onClick={addBoard} title="New board">+</button>
        </div>

        {/* Actions */}
        <div className="header-actions">
          <button className="header-btn header-btn-save" onClick={handleSave}>↓ Save</button>
          <label className="header-btn">
            ↑ Load
            <input ref={loadInputRef} type="file" accept=".json"
              style={{ display: 'none' }} onChange={handleLoadFile} />
          </label>

          {/* Theme picker */}
          <div className="theme-picker-wrap" ref={themePickerRef}>
            <button
              className="header-btn header-btn-theme"
              onClick={() => setShowThemePicker(v => !v)}
              title="Change theme"
            >
              <span className="theme-swatch" style={{ background: currentTheme.swatch }} />
              {currentTheme.name}
            </button>
            {showThemePicker && (
              <div className="theme-dropdown">
                <div className="theme-dropdown-label">Theme</div>
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    className={`theme-option${t.id === theme ? ' active' : ''}`}
                    onClick={() => { setTheme(t.id); setShowThemePicker(false) }}
                  >
                    <span className="theme-option-swatch" style={{ background: t.swatch }} />
                    {t.name}
                    {t.id === theme && <span className="theme-option-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="app-body">
        {/* Left sidebar */}
        <Sidebar
          pedals={pedals} pedalboards={pedalboardsData} selectedBoard={selectedBoard}
          onSelectBoard={handleSelectBoard} onAddPedal={addPedal}
          placedPedals={placedPedals} onRemovePedal={removePedal}
          onClearBoard={clearBoard} onReorderPedals={reorderPedals}
          imgBaseBoard={IMG_BASE_BOARD}
          selectedPsuId={selectedPsuId} onSelectPsu={handleSelectPsu}
          guitarContext={guitarContext} onGuitarContextChange={setGuitarContext}
          style={{ width: sidebarWidth }}
        />

        {/* Sidebar resize handle */}
        <div className="panel-resize-handle" onMouseDown={startSidebarResize} />

        {/* Canvas area */}
        <main className="app-main">
          <div className="canvas-scroll-area">
            {selectedBoard ? (
              <PedalboardCanvas
                key={activeBoardId}
                board={selectedBoard} placedPedals={placedPedals}
                selectedPedalIds={selectedPedalIds} midiPedalId={selectedPedal?.id ?? null}
                onMoveGroupFromStarts={moveGroupFromStarts}
                onPedalClick={handlePedalClick} onShiftClick={handleShiftClick}
                onSelectAll={handleSelectAll} onCanvasClick={handleCanvasClick}
                onRemovePedal={removePedal}
                imgBaseBoard={IMG_BASE_BOARD} imgBasePedal={IMG_BASE_PEDAL}
                savedViewOffset={activeBoard.viewOffset}
                onViewOffsetChange={handleViewOffsetChange}
              />
            ) : (
              <div className="empty-state">Loading pedalboards…</div>
            )}
          </div>

          <button className="canvas-reset-btn" onClick={handleResetView}>⌖ Reset View</button>
          <div className="canvas-shortcut-hint">
            Space to pan · Shift+click multi-select · Delete to remove · Ctrl+scroll to zoom
          </div>
        </main>

        {/* Right panel resize handle */}
        <div className="panel-resize-handle" onMouseDown={startRightResize} />

        {/* Right panel: MIDI + Insights + AI */}
        <RightPanel
          pedal={midiPanelOpen ? selectedPedal : null}
          onClose={closePanel}
          imgBasePedal={IMG_BASE_PEDAL}
          placedPedals={placedPedals}
          guitarContext={guitarContext}
          style={{ width: rightWidth }}
        />
      </div>
    </div>
  )
}
