import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react'
import './PedalboardCanvas.css'

const PX_PER_INCH = 42

export default function PedalboardCanvas({
  board, placedPedals, selectedPedalIds, midiPedalId,
  onMoveGroupFromStarts, onPedalClick, onShiftClick,
  onSelectAll, onCanvasClick, onRemovePedal,
  imgBaseBoard, imgBasePedal, savedViewOffset, onViewOffsetChange,
}) {
  const viewportRef   = useRef(null)
  const draggingRef   = useRef(null)
  const viewOffsetRef = useRef({ x: 24, y: 24 })
  const spaceRef      = useRef(false)
  const centeredRef   = useRef(false)
  // Always-fresh refs
  const placedRef   = useRef(placedPedals)
  const selectedRef = useRef(selectedPedalIds)
  const boardRef    = useRef(board)
  placedRef.current   = placedPedals
  selectedRef.current = selectedPedalIds
  boardRef.current    = board

  const [boardImgLoaded, setBoardImgLoaded] = useState(false)
  const [viewOffset,     setViewOffset]     = useState({ x: 24, y: 24 })
  const [spaceActive,    setSpaceActive]    = useState(false)
  const [scale,          setScale]          = useState(1)
  const scaleRef = useRef(1)

  const boardW = Math.round(board.Width  * PX_PER_INCH)
  const boardH = Math.round(board.Height * PX_PER_INCH)

  // Center board on first mount
  useLayoutEffect(() => {
    if (centeredRef.current || savedViewOffset != null) return
    const el = viewportRef.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    if (width === 0 || height === 0) return
    centeredRef.current = true
    const cx = Math.round(Math.max((width  - boardW) / 2, 24))
    const cy = Math.round(Math.max((height - boardH) / 2, 24))
    viewOffsetRef.current = { x: cx, y: cy }
    setViewOffset({ x: cx, y: cy })
  }, [boardW, boardH, savedViewOffset])

  // Restore view offset from save/board-switch
  useEffect(() => {
    if (savedViewOffset != null) {
      centeredRef.current = true
      viewOffsetRef.current = savedViewOffset
      setViewOffset(savedViewOffset)
    }
  }, [savedViewOffset])

  // Keyboard: Ctrl+A, Escape, Space
  useEffect(() => {
    const onDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault()
        spaceRef.current = true
        setSpaceActive(true)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') { e.preventDefault(); onSelectAll() }
      if (e.key === 'Escape') onCanvasClick()
    }
    const onUp = (e) => {
      if (e.code === 'Space') { spaceRef.current = false; setSpaceActive(false) }
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup',   onUp)
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp) }
  }, [onSelectAll, onCanvasClick])

  // Zoom helpers
  const applyZoom = useCallback((newScale, pivotX, pivotY) => {
    const oldScale = scaleRef.current
    const clampedScale = Math.max(0.25, Math.min(3, newScale))
    const ratio = clampedScale / oldScale
    const newOffsetX = pivotX - (pivotX - viewOffsetRef.current.x) * ratio
    const newOffsetY = pivotY - (pivotY - viewOffsetRef.current.y) * ratio
    scaleRef.current = clampedScale
    setScale(clampedScale)
    viewOffsetRef.current = { x: newOffsetX, y: newOffsetY }
    setViewOffset({ x: newOffsetX, y: newOffsetY })
  }, [])

  // Ctrl/Cmd + scroll to zoom
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const handler = (e) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const pivotX = e.clientX - rect.left
      const pivotY = e.clientY - rect.top
      const delta = e.deltaY < 0 ? 1.1 : 1 / 1.1
      applyZoom(scaleRef.current * delta, pivotX, pivotY)
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [applyZoom])

  const zoomIn  = useCallback(() => {
    const el = viewportRef.current
    const rect = el?.getBoundingClientRect()
    applyZoom(scaleRef.current * 1.2, rect ? rect.width / 2 : 0, rect ? rect.height / 2 : 0)
  }, [applyZoom])

  const zoomOut = useCallback(() => {
    const el = viewportRef.current
    const rect = el?.getBoundingClientRect()
    applyZoom(scaleRef.current / 1.2, rect ? rect.width / 2 : 0, rect ? rect.height / 2 : 0)
  }, [applyZoom])

  const zoomReset = useCallback(() => {
    scaleRef.current = 1
    setScale(1)
  }, [])

  const startPan = useCallback((e) => {
    draggingRef.current = {
      type: 'pan',
      startMouseX: e.clientX, startMouseY: e.clientY,
      startOffsetX: viewOffsetRef.current.x,
      startOffsetY: viewOffsetRef.current.y,
      moved: false,
    }
    viewportRef.current?.classList.add('panning')
  }, [])

  // Window-level move + up
  useEffect(() => {
    const onMove = (e) => {
      const d = draggingRef.current
      if (!d) return
      const dx = e.clientX - d.startMouseX
      const dy = e.clientY - d.startMouseY
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) d.moved = true
      if (!d.moved) return

      if (d.type === 'pan') {
        const nx = d.startOffsetX + dx
        const ny = d.startOffsetY + dy
        viewOffsetRef.current = { x: nx, y: ny }
        setViewOffset({ x: nx, y: ny })
      } else if (d.type === 'pedal') {
        const b   = d.board
        const rawDX = dx / PX_PER_INCH
        const rawDY = dy / PX_PER_INCH
        let maxLeft = Infinity, maxRight = Infinity, maxUp = Infinity, maxDown = Infinity
        for (const [, s] of d.groupStarts) {
          maxLeft  = Math.min(maxLeft,  s.xIn)
          maxRight = Math.min(maxRight, b.Width  - s.xIn - s.widthIn)
          maxUp    = Math.min(maxUp,    s.yIn)
          maxDown  = Math.min(maxDown,  b.Height - s.yIn - s.heightIn)
        }
        const cdX = Math.max(-maxLeft, Math.min(maxRight, rawDX))
        const cdY = Math.max(-maxUp,   Math.min(maxDown,  rawDY))
        onMoveGroupFromStarts(d.groupStarts, cdX, cdY)
      }
    }

    const onUp = (e) => {
      const d = draggingRef.current
      if (!d) return
      if (d.type === 'pan') {
        if (!d.moved) onCanvasClick()
        else {
          const fx = d.startOffsetX + (e.clientX - d.startMouseX)
          const fy = d.startOffsetY + (e.clientY - d.startMouseY)
          viewOffsetRef.current = { x: fx, y: fy }
          onViewOffsetChange(fx, fy)
        }
        viewportRef.current?.classList.remove('panning')
      } else if (d.type === 'pedal') {
        if (!d.moved && !e.shiftKey) onPedalClick(d.clickPedal)
      }
      draggingRef.current = null
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [onMoveGroupFromStarts, onPedalClick, onCanvasClick, onViewOffsetChange])

  // Viewport (background) mousedown → always pan
  const handleViewportMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    startPan(e)
  }, [startPan])

  // Board background mousedown → pan
  const handleBoardMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    startPan(e)
  }, [startPan])

  // Pedal mousedown
  const handlePedalMouseDown = useCallback((e, pedal) => {
    if (e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()

    if (spaceRef.current) { startPan(e); return }

    const ids       = selectedRef.current
    const allPedals = placedRef.current
    const b         = boardRef.current
    const inGroup   = ids.has(pedal.id)
    const groupStarts = new Map()

    if (inGroup && ids.size > 1) {
      for (const p of allPedals)
        if (ids.has(p.id))
          groupStarts.set(p.id, { xIn: p.xIn, yIn: p.yIn, widthIn: p.widthIn, heightIn: p.heightIn })
    } else {
      groupStarts.set(pedal.id, { xIn: pedal.xIn, yIn: pedal.yIn, widthIn: pedal.widthIn, heightIn: pedal.heightIn })
    }

    draggingRef.current = {
      type: 'pedal',
      startMouseX: e.clientX, startMouseY: e.clientY,
      groupStarts,
      board: { Width: b.Width, Height: b.Height },
      moved: false,
      clickPedal: pedal,
    }
    if (e.shiftKey) onShiftClick(pedal)
  }, [onShiftClick, startPan])

  return (
    <div
      ref={viewportRef}
      className={`canvas-viewport${spaceActive ? ' space-pan' : ''}`}
      onMouseDown={handleViewportMouseDown}
    >
      <div className="canvas-zoom-controls">
        <button className="zoom-btn" onClick={zoomIn}  title="Zoom in (Ctrl+scroll)">+</button>
        <span   className="zoom-label">{Math.round(scale * 100)}%</span>
        <button className="zoom-btn" onClick={zoomOut} title="Zoom out (Ctrl+scroll)">−</button>
        <button className="zoom-btn zoom-btn-reset" onClick={zoomReset} title="Reset zoom">⊙</button>
      </div>

      <div
        className="canvas-outer"
        style={{ transform: `translate(${viewOffset.x}px, ${viewOffset.y}px) scale(${scale})`, transformOrigin: '0 0' }}
      >
        <div
          className="canvas-board"
          style={{ width: boardW, height: boardH }}
          onMouseDown={handleBoardMouseDown}
        >
          <img
            src={`${imgBaseBoard}${board.Image}`}
            alt={board.Name}
            className="board-bg"
            onLoad={() => setBoardImgLoaded(true)}
            onError={() => setBoardImgLoaded(true)}
            draggable={false}
          />

          {boardImgLoaded && placedPedals.map(pedal => {
            const pw = Math.round(pedal.widthIn * PX_PER_INCH)
            const ph = Math.round(pedal.heightIn * PX_PER_INCH)
            const px = Math.round(pedal.xIn     * PX_PER_INCH)
            const py = Math.round(pedal.yIn     * PX_PER_INCH)
            const isSelected = selectedPedalIds.has(pedal.id)
            const isMidi     = pedal.id === midiPedalId

            return (
              <div
                key={pedal.id}
                className={`placed-pedal${isSelected ? ' selected' : ''}`}
                style={{ left: px, top: py, width: pw, height: ph }}
                onMouseDown={(e) => handlePedalMouseDown(e, pedal)}
                title={`${pedal.brand} ${pedal.name}\nClick for MIDI · Shift+click · Drag to move`}
              >
                <img
                  src={`${imgBasePedal}${pedal.image}`}
                  alt={pedal.name}
                  className="pedal-img"
                  draggable={false}
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="pedal-fallback" style={{ display: 'none' }}>
                  <span>{pedal.brand}</span>
                  <span>{pedal.name}</span>
                </div>
                <button
                  className="pedal-remove"
                  onMouseDown={(e) => { e.stopPropagation(); onRemovePedal(pedal.id) }}
                  title="Remove pedal"
                >×</button>
                {isMidi && <div className="pedal-selected-indicator"><span>MIDI</span></div>}
              </div>
            )
          })}

          {placedPedals.length === 0 && boardImgLoaded && (
            <div className="board-empty-hint">
              Search for pedals in the sidebar and add them to your board
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
