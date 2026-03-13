import { getMidiInfo } from '../data/midiDb'
import { useEffect, useRef } from 'react'
import './MidiPanel.css'

export default function MidiPanel({ open, pedal, onClose, imgBasePedal }) {
  const bodyRef = useRef(null)

  // Scroll to top whenever the selected pedal changes
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [pedal?.id])

  if (!pedal) return <div className={`midi-panel ${open ? 'open' : ''}`} />

  const info = getMidiInfo(pedal.brand, pedal.name)
  const fullName = `${pedal.brand} ${pedal.name}`

  return (
    <div className={`midi-panel ${open ? 'open' : ''}`}>
      {/* Header */}
      <div className="mp-header">
        <div className="mp-header-left">
          <img
            src={`${imgBasePedal}${pedal.image}`}
            alt={fullName}
            className="mp-pedal-img"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div className="mp-pedal-info">
            <div className="mp-brand">{pedal.brand}</div>
            <div className="mp-name">{pedal.name}</div>
          </div>
        </div>
        <button className="mp-close" onClick={onClose} title="Close">×</button>
      </div>

      {/* MIDI badge */}
      <div className="mp-status-bar">
        {info.hasMidi === true && (
          <span className="mp-badge midi-yes">MIDI Capable</span>
        )}
        {info.hasMidi === false && (
          <span className="mp-badge midi-no">No MIDI</span>
        )}
        {info.hasMidi === null && (
          <span className="mp-badge midi-unknown">MIDI Unknown</span>
        )}
        <span className="mp-controller">Morningstar MC6 Pro Guide</span>
      </div>

      <div className="mp-body" ref={bodyRef}>
        {/* ── No MIDI or unknown ── */}
        {info.hasMidi !== true && (
          <div className="mp-no-midi">
            <div className="mp-no-midi-icon">⚡</div>
            <p>{info.noMidiNote}</p>
          </div>
        )}

        {/* ── Has MIDI ── */}
        {info.hasMidi === true && (
          <>
            {/* Connection */}
            <Section icon="🔌" title="MIDI Connection">
              <p className="mp-text">{info.connection}</p>
              <div className="mp-callout info">
                <strong>Tip:</strong> The MC6 Pro outputs 5-pin DIN MIDI. Most modern pedals use 3.5 mm TRS Type A.
                Use a <strong>5-pin DIN female → 3.5 mm TRS (Type A)</strong> cable or adapter.
              </div>
            </Section>

            {/* Channel setup */}
            <Section icon="📡" title="1 — Set the MIDI Receive Channel">
              <p className="mp-text">{info.channelSetup}</p>
              <div className="mp-callout warning">
                Both the pedal and the MC6 Pro must be set to the <strong>same MIDI channel</strong>.
                Choose any channel 1–16 (default: channel 1).
              </div>
            </Section>

            {/* Preset info */}
            {info.presetInfo && (
              <Section icon="💾" title="Preset System">
                <p className="mp-text">{info.presetInfo}</p>
                {info.pcRange && (
                  <div className="mp-kv">
                    <span className="mp-kv-label">PC Range</span>
                    <code className="mp-code">{info.pcRange}</code>
                  </div>
                )}
              </Section>
            )}

            {/* Saving a preset */}
            {info.savingPreset?.length > 0 && (
              <Section icon="🎛" title="2 — Save a Preset on the Pedal">
                <Steps steps={info.savingPreset} />
              </Section>
            )}

            {/* MC6 Pro setup */}
            {info.mc6ProSetup?.length > 0 && (
              <Section icon="🎹" title="3 — Configure the MC6 Pro">
                <Steps steps={info.mc6ProSetup} accent />
                <div className="mp-callout info" style={{ marginTop: 12 }}>
                  <strong>MC6 Pro Editor:</strong> Use the web editor at{' '}
                  <a href="https://editor.morningstar.io" target="_blank" rel="noreferrer">
                    editor.morningstar.io
                  </a>{' '}
                  for the easiest preset configuration experience.
                </div>
              </Section>
            )}

            {/* CC notes */}
            {info.ccNotes && (
              <Section icon="🎚" title="CC Control Notes">
                <p className="mp-text">{info.ccNotes}</p>
              </Section>
            )}

            {/* Notes */}
            {info.notes && (
              <Section icon="📝" title="Additional Notes">
                <p className="mp-text">{info.notes}</p>
              </Section>
            )}

            {/* MC6 Pro quick reference */}
            <Section icon="⚙️" title="MC6 Pro Quick Reference">
              <div className="mp-ref-grid">
                <RefItem label="Enter Edit Mode" value="Long-press any footswitch on the MC6 Pro" />
                <RefItem label="Add Message" value='In preset editor → "+ Add Message"' />
                <RefItem label="Recall Preset (PC)" value="Message Type = PC → set PC Number + Channel" />
                <RefItem label="Control Parameter (CC)" value="Message Type = CC → set CC Number + Value + Channel" />
                <RefItem label="Tap Tempo" value="Message Type = CC → CC 64, Value 127 (on most pedals)" />
                <RefItem label="Bypass Toggle" value="Message Type = CC → check pedal's CC map for bypass CC" />
                <RefItem label="Save Preset" value="Press Save in editor, or long-press footswitch and select Save" />
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  )
}

function Section({ icon, title, children }) {
  return (
    <div className="mp-section">
      <h4 className="mp-section-title">
        <span className="mp-section-icon">{icon}</span>
        {title}
      </h4>
      <div className="mp-section-body">{children}</div>
    </div>
  )
}

function Steps({ steps, accent = false }) {
  return (
    <ol className={`mp-steps ${accent ? 'accent' : ''}`}>
      {steps.map((step, i) => (
        <li key={i} className="mp-step">
          <span className="mp-step-num">{i + 1}</span>
          <span className="mp-step-text">{step}</span>
        </li>
      ))}
    </ol>
  )
}

function RefItem({ label, value }) {
  return (
    <div className="mp-ref-item">
      <span className="mp-ref-label">{label}</span>
      <span className="mp-ref-value">{value}</span>
    </div>
  )
}
