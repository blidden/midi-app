import { useState, useMemo, useRef, useEffect } from 'react'
import { psuDb, getPsuOutputCount } from '../data/psuDb'
import { getEstimatedMa } from '../data/pedalPower'
import { POPULAR_GUITARS, POPULAR_AMPS } from '../data/guitarDb'
import './Sidebar.css'

export default function Sidebar({
  pedals, pedalboards, selectedBoard, onSelectBoard,
  onAddPedal, placedPedals, onRemovePedal, onClearBoard, onReorderPedals,
  imgBaseBoard, selectedPsuId, onSelectPsu,
  guitarContext, onGuitarContextChange,
  style,
}) {
  const [pedalSearch,   setPedalSearch]   = useState('')
  const [showPedal,     setShowPedal]     = useState(false)
  const [boardSearch,   setBoardSearch]   = useState('')
  const [showBoard,     setShowBoard]     = useState(false)
  const [psuSearch,     setPsuSearch]     = useState('')
  const [showPsu,       setShowPsu]       = useState(false)
  const [guitarSearch,  setGuitarSearch]  = useState('')
  const [showGuitar,    setShowGuitar]    = useState(false)
  const [ampSearch,     setAmpSearch]     = useState('')
  const [showAmp,       setShowAmp]       = useState(false)
  const [guitarThumb,   setGuitarThumb]   = useState(null)
  const [ampThumb,      setAmpThumb]      = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const dragFromIdx = useRef(null)
  const pedalRef  = useRef(null)
  const boardRef  = useRef(null)
  const psuRef    = useRef(null)
  const guitarRef = useRef(null)
  const ampRef    = useRef(null)

  const selectedGuitar = guitarContext?.guitar ?? null
  const selectedAmp    = guitarContext?.amp    ?? null
  const useAmp         = guitarContext?.useAmp ?? true

  // Close all dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (pedalRef.current  && !pedalRef.current.contains(e.target))  setShowPedal(false)
      if (boardRef.current  && !boardRef.current.contains(e.target))  setShowBoard(false)
      if (psuRef.current    && !psuRef.current.contains(e.target))    setShowPsu(false)
      if (guitarRef.current && !guitarRef.current.contains(e.target)) setShowGuitar(false)
      if (ampRef.current    && !ampRef.current.contains(e.target))    setShowAmp(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Wikipedia thumbnail for selected guitar
  useEffect(() => {
    if (!selectedGuitar?.wiki) { setGuitarThumb(null); return }
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(selectedGuitar.wiki)}`)
      .then(r => r.json())
      .then(d => setGuitarThumb(d.thumbnail?.source ?? null))
      .catch(() => setGuitarThumb(null))
  }, [selectedGuitar?.wiki])

  // Wikipedia thumbnail for selected amp
  useEffect(() => {
    if (!selectedAmp?.wiki) { setAmpThumb(null); return }
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(selectedAmp.wiki)}`)
      .then(r => r.json())
      .then(d => setAmpThumb(d.thumbnail?.source ?? null))
      .catch(() => setAmpThumb(null))
  }, [selectedAmp?.wiki])

  const filteredGuitars = useMemo(() => {
    const q = guitarSearch.toLowerCase().trim()
    const src = q ? POPULAR_GUITARS.filter(g => `${g.brand} ${g.name}`.toLowerCase().includes(q)) : POPULAR_GUITARS
    return src.slice(0, 40)
  }, [guitarSearch])

  const filteredAmps = useMemo(() => {
    const q = ampSearch.toLowerCase().trim()
    const src = q ? POPULAR_AMPS.filter(a => `${a.brand} ${a.name}`.toLowerCase().includes(q)) : POPULAR_AMPS
    return src.slice(0, 40)
  }, [ampSearch])

  const filteredPedals = useMemo(() => {
    const q = pedalSearch.toLowerCase().trim()
    if (!q) return []
    return pedals.filter(p => `${p.Brand} ${p.Name}`.toLowerCase().includes(q)).slice(0, 40)
  }, [pedals, pedalSearch])

  const filteredBoards = useMemo(() => {
    const q = boardSearch.toLowerCase().trim()
    const src = q
      ? pedalboards.filter(b => `${b.Brand} ${b.Name}`.toLowerCase().includes(q))
      : pedalboards
    return src.slice(0, 40)
  }, [pedalboards, boardSearch])

  const filteredPsus = useMemo(() => {
    const q = psuSearch.toLowerCase().trim()
    return q ? psuDb.filter(p => `${p.brand} ${p.name}`.toLowerCase().includes(q)) : psuDb
  }, [psuSearch])

  const selectedPsu = useMemo(() => psuDb.find(p => p.id === selectedPsuId) ?? null, [selectedPsuId])

  const psuAnalysis = useMemo(() => {
    if (!selectedPsu) return null
    const totalOutputs = getPsuOutputCount(selectedPsu)
    const pedalCount   = placedPedals.length
    const estMa = placedPedals.reduce((sum, p) => sum + getEstimatedMa(p.brand, p.name), 0)
    return {
      pedalCount, totalOutputs, outputsOk: pedalCount <= totalOutputs,
      estMa, totalMa: selectedPsu.totalMa, powerOk: estMa <= selectedPsu.totalMa,
      hasHighVoltage: selectedPsu.outputs.some(o => typeof o.voltage === 'number' && o.voltage > 9),
    }
  }, [selectedPsu, placedPedals])

  // Drag-reorder handlers
  const onDragStart = (e, i) => { dragFromIdx.current = i; e.dataTransfer.effectAllowed = 'move' }
  const onDragOver  = (e, i) => { e.preventDefault(); setDragOverIndex(i) }
  const onDrop      = (e, i) => {
    e.preventDefault()
    if (dragFromIdx.current !== null && dragFromIdx.current !== i) onReorderPedals(dragFromIdx.current, i)
    dragFromIdx.current = null; setDragOverIndex(null)
  }
  const onDragEnd = () => { dragFromIdx.current = null; setDragOverIndex(null) }

  const isBoardActive = (b) => selectedBoard?.Name === b.Name && selectedBoard?.Brand === b.Brand

  return (
    <aside className="sidebar" style={style}>

      {/* ── Guitar ── */}
      <section className="sidebar-section">
        <h3 className="section-title">Guitar</h3>
        <div className="search-wrap" ref={guitarRef}>
          <input
            className="search-input"
            placeholder={selectedGuitar ? `${selectedGuitar.brand} ${selectedGuitar.name}` : 'Search guitars…'}
            value={guitarSearch}
            onChange={e => { setGuitarSearch(e.target.value); setShowGuitar(true) }}
            onFocus={() => setShowGuitar(true)}
          />
          {showGuitar && (
            <div className="pedal-dropdown">
              {selectedGuitar && (
                <button className="pedal-dropdown-item psu-clear-item"
                  onMouseDown={() => { onGuitarContextChange({ ...guitarContext, guitar: null }); setGuitarSearch(''); setShowGuitar(false) }}>
                  <span className="pdrop-name">— No guitar selected —</span>
                </button>
              )}
              {filteredGuitars.map(g => (
                <button key={g.id}
                  className={`pedal-dropdown-item${g.id === selectedGuitar?.id ? ' active' : ''}`}
                  onMouseDown={() => { onGuitarContextChange({ ...guitarContext, guitar: g }); setGuitarSearch(''); setShowGuitar(false) }}
                >
                  <span className="pdrop-brand">{g.brand} · {g.type}</span>
                  <span className="pdrop-name">{g.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {selectedGuitar && (
          <div className="gear-selected">
            {guitarThumb && <img src={guitarThumb} alt={selectedGuitar.name} className="gear-thumb" />}
            <div className="gear-info">
              <span className="gear-brand">{selectedGuitar.brand}</span>
              <span className="gear-name">{selectedGuitar.name}</span>
              <span className="gear-type">{selectedGuitar.type}</span>
            </div>
          </div>
        )}
      </section>

      {/* ── Amp / Rig ── */}
      <section className="sidebar-section">
        <div className="section-title-row">
          <h3 className="section-title">Amp / Rig</h3>
          <div className="amp-toggle">
            <button
              className={`amp-toggle-btn${useAmp ? ' active' : ''}`}
              onClick={() => onGuitarContextChange({ ...guitarContext, useAmp: true })}
            >With Amp</button>
            <button
              className={`amp-toggle-btn${!useAmp ? ' active' : ''}`}
              onClick={() => onGuitarContextChange({ ...guitarContext, useAmp: false, amp: null })}
            >Ampless</button>
          </div>
        </div>

        {useAmp && (
          <>
            <div className="search-wrap" ref={ampRef} style={{ marginTop: 8 }}>
              <input
                className="search-input"
                placeholder={selectedAmp ? `${selectedAmp.brand} ${selectedAmp.name}`.trim() : 'Search amps…'}
                value={ampSearch}
                onChange={e => { setAmpSearch(e.target.value); setShowAmp(true) }}
                onFocus={() => setShowAmp(true)}
              />
              {showAmp && (
                <div className="pedal-dropdown">
                  {selectedAmp && (
                    <button className="pedal-dropdown-item psu-clear-item"
                      onMouseDown={() => { onGuitarContextChange({ ...guitarContext, amp: null }); setAmpSearch(''); setShowAmp(false) }}>
                      <span className="pdrop-name">— No amp selected —</span>
                    </button>
                  )}
                  {filteredAmps.filter(a => !a.isAmpless).map(a => (
                    <button key={a.id}
                      className={`pedal-dropdown-item${a.id === selectedAmp?.id ? ' active' : ''}`}
                      onMouseDown={() => { onGuitarContextChange({ ...guitarContext, amp: a }); setAmpSearch(''); setShowAmp(false) }}
                    >
                      <span className="pdrop-brand">{a.brand}</span>
                      <span className="pdrop-name">{a.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedAmp && (
              <div className="gear-selected">
                {ampThumb && <img src={ampThumb} alt={selectedAmp.name} className="gear-thumb" />}
                <div className="gear-info">
                  <span className="gear-brand">{selectedAmp.brand}</span>
                  <span className="gear-name">{selectedAmp.name}</span>
                </div>
              </div>
            )}
          </>
        )}

        {!useAmp && (
          <div className="ampless-badge">
            <span className="ampless-dot" />
            Direct / Ampless signal path
          </div>
        )}
      </section>

      {/* ── Pedalboard ── */}
      <section className="sidebar-section">
        <h3 className="section-title">Pedalboard</h3>
        <div className="search-wrap" ref={boardRef}>
          <input
            className="search-input"
            placeholder={selectedBoard ? `${selectedBoard.Brand} ${selectedBoard.Name}` : 'Search boards…'}
            value={boardSearch}
            onChange={e => { setBoardSearch(e.target.value); setShowBoard(true) }}
            onFocus={() => setShowBoard(true)}
          />
          {showBoard && (
            <div className="pedal-dropdown">
              {filteredBoards.map((b, i) => (
                <button key={i}
                  className={`pedal-dropdown-item${isBoardActive(b) ? ' active' : ''}`}
                  onMouseDown={() => { onSelectBoard(b); setBoardSearch(''); setShowBoard(false) }}
                >
                  <span className="pdrop-brand">{b.Brand}</span>
                  <span className="pdrop-name">{b.Name} — {b.Width}"×{b.Height}"</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {selectedBoard && (
          <div className="selected-dim">
            {selectedBoard.Width}" × {selectedBoard.Height}"
          </div>
        )}
      </section>

      {/* ── Power Supply ── */}
      <section className="sidebar-section">
        <h3 className="section-title">Power Supply</h3>
        <div className="search-wrap" ref={psuRef}>
          <input
            className="search-input"
            placeholder={selectedPsu ? `${selectedPsu.brand} ${selectedPsu.name}` : 'Search power supplies…'}
            value={psuSearch}
            onChange={e => { setPsuSearch(e.target.value); setShowPsu(true) }}
            onFocus={() => setShowPsu(true)}
          />
          {showPsu && (
            <div className="pedal-dropdown">
              {selectedPsuId && (
                <button className="pedal-dropdown-item psu-clear-item"
                  onMouseDown={() => { onSelectPsu(null); setPsuSearch(''); setShowPsu(false) }}>
                  <span className="pdrop-name">— No PSU selected —</span>
                </button>
              )}
              {filteredPsus.map(psu => (
                <button key={psu.id}
                  className={`pedal-dropdown-item${psu.id === selectedPsuId ? ' active' : ''}`}
                  onMouseDown={() => { onSelectPsu(psu.id); setPsuSearch(''); setShowPsu(false) }}
                >
                  <span className="pdrop-brand">{psu.brand}</span>
                  <span className="pdrop-name">{psu.name} · {getPsuOutputCount(psu)} outputs · {psu.totalMa}mA</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {psuAnalysis && placedPedals.length > 0 && (
          <div className="psu-analysis">
            <div className={`psu-row ${psuAnalysis.outputsOk ? 'ok' : 'warn'}`}>
              <span className="psu-label">Outlets</span>
              <span className="psu-value">{psuAnalysis.pedalCount} / {psuAnalysis.totalOutputs}</span>
              <span className="psu-icon">{psuAnalysis.outputsOk ? '✓' : '!'}</span>
            </div>
            <div className={`psu-row ${psuAnalysis.powerOk ? 'ok' : 'warn'}`}>
              <span className="psu-label">Current</span>
              <span className="psu-value">~{psuAnalysis.estMa}mA / {psuAnalysis.totalMa}mA</span>
              <span className="psu-icon">{psuAnalysis.powerOk ? '✓' : '!'}</span>
            </div>
            {psuAnalysis.hasHighVoltage && (
              <p className="psu-note">⚠ Has 18V+ outputs — verify each pedal's voltage</p>
            )}
          </div>
        )}
        {selectedPsu && placedPedals.length === 0 && (
          <p className="psu-note psu-note-info">Add pedals to see power analysis</p>
        )}
      </section>

      {/* ── Add Pedal ── */}
      <section className="sidebar-section">
        <h3 className="section-title">Add Pedal</h3>
        <div className="search-wrap" ref={pedalRef}>
          <input
            className="search-input"
            placeholder="Search 8,000+ pedals…"
            value={pedalSearch}
            onChange={e => { setPedalSearch(e.target.value); setShowPedal(true) }}
            onFocus={() => setShowPedal(true)}
          />
          {showPedal && filteredPedals.length > 0 && (
            <div className="pedal-dropdown">
              {filteredPedals.map((p, i) => (
                <button key={i} className="pedal-dropdown-item"
                  onMouseDown={() => { onAddPedal(p); setPedalSearch(''); setShowPedal(false) }}>
                  <span className="pdrop-brand">{p.Brand}</span>
                  <span className="pdrop-name">{p.Name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Signal Chain ── */}
      {placedPedals.length > 0 && (
        <section className="sidebar-section sidebar-section-scroll">
          <h3 className="section-title">
            Signal Chain
            <span className="count-badge">{placedPedals.length}</span>
            <button className="clear-btn" onClick={onClearBoard}>Clear</button>
          </h3>
          <p className="chain-hint">Guitar → pedals → Amp · Drag ⠿ to reorder</p>
          <div className="placed-list">
            {placedPedals.map((p, i) => (
              <div key={p.id}
                className={`placed-item${dragOverIndex === i ? ' drag-over' : ''}`}
                draggable
                onDragStart={(e) => onDragStart(e, i)}
                onDragOver={(e)  => onDragOver(e, i)}
                onDrop={(e)      => onDrop(e, i)}
                onDragEnd={onDragEnd}
              >
                <span className="drag-handle" title="Drag to reorder">⠿</span>
                <span className="chain-num">{i + 1}</span>
                <span className="placed-name">{p.brand} {p.name}</span>
                <button className="remove-btn" onClick={() => onRemovePedal(p.id)} title="Remove">×</button>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="sidebar-footer">
        <span className="footer-hints">Shift+click: multi-select · Ctrl+A: all · Drag: move group</span>
      </div>
    </aside>
  )
}
