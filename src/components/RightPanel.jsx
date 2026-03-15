import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { getMidiInfo } from '../data/midiDb'
import { analyzeChain, buildBoardProfile } from '../data/insightsEngine'
import './RightPanel.css'

const SEV_CONFIG = {
  good:    { icon: '✓', cls: 'good' },
  tip:     { icon: 'i', cls: 'tip' },
  warning: { icon: '!', cls: 'warning' },
  info:    { icon: '·', cls: 'info' },
}

function buildSystemPrompt(profile, insights) {
  const insightsSummary = insights.length
    ? insights.map(i => `[${i.severity.toUpperCase()}] ${i.title}: ${i.message}`).join('\n')
    : 'No issues detected.'

  return `You are an expert guitar pedalboard consultant and experienced sound engineer with deep knowledge of effects signal chains, tone shaping, and music. You give practical, specific, and enthusiastic advice.

Current board: "${profile.boardName}"
Guitar: ${profile.guitarName}
Amp setup: ${profile.ampSetup}

Signal chain (${profile.pedalCount} pedals):
${profile.chainSummary}

Tonal sections on this board: ${profile.sections.join(', ') || 'none detected'}

Current automated insights:
${insightsSummary}

Help the user build and improve their pedalboard. Give specific, actionable recommendations. Reference real pedal models when suggesting alternatives. Consider their guitar and amp setup. Be encouraging — mention what's working well before addressing issues.`
}

export default function RightPanel({
  pedal, onClose, imgBasePedal,
  placedPedals, guitarContext,
  style,
}) {
  const [tab, setTab] = useState('insights')
  const [apiKey, setApiKey] = useState(() => {
    try { return localStorage.getItem('midi-gemini-apikey') ?? '' } catch { return '' }
  })
  const [showApiKey, setShowApiKey] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  // Switch to MIDI tab when a pedal is selected
  useEffect(() => {
    if (pedal) setTab('midi')
  }, [pedal?.id])

  const insights = useMemo(() => analyzeChain(placedPedals, guitarContext), [placedPedals, guitarContext])
  const profile  = useMemo(() => buildBoardProfile(placedPedals, guitarContext), [placedPedals, guitarContext])

  const warnings = insights.filter(i => i.severity === 'warning').length
  const good     = insights.filter(i => i.severity === 'good').length

  const saveApiKey = useCallback((k) => {
    setApiKey(k)
    try { localStorage.setItem('midi-gemini-apikey', k) } catch {}
  }, [])

  const sendMessage = useCallback(async () => {
    const text = inputText.trim()
    if (!text || loading) return
    if (!apiKey) { setShowApiKey(true); return }

    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setLoading(true)

    const history = [...messages, userMsg]
    const systemPrompt = profile
      ? buildSystemPrompt(profile, insights)
      : 'You are an expert guitar pedalboard consultant.'

    try {
      const geminiContents = history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: geminiContents,
          }),
        }
      )
      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      const assistantText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '(no response)'
      setMessages(prev => [...prev, { role: 'assistant', content: assistantText }])
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant', content: `Error: ${err.message}. Check your Gemini API key.`,
      }])
    } finally {
      setLoading(false)
    }
  }, [inputText, loading, apiKey, messages, profile, insights])

  return (
    <div className="right-panel" style={style}>

      {/* Tabs */}
      <div className="rp-tabs">
        <button
          className={`rp-tab${tab === 'midi' ? ' active' : ''}`}
          onClick={() => setTab('midi')}
        >
          MIDI
          {pedal && <span className="rp-tab-dot" />}
        </button>
        <button
          className={`rp-tab${tab === 'insights' ? ' active' : ''}`}
          onClick={() => setTab('insights')}
        >
          Insights
          {warnings > 0 && <span className="rp-tab-badge warn">{warnings}</span>}
          {warnings === 0 && good > 0 && <span className="rp-tab-badge ok">{good}</span>}
        </button>
        <button
          className={`rp-tab${tab === 'ai' ? ' active' : ''}`}
          onClick={() => setTab('ai')}
        >
          AI
        </button>
      </div>

      {/* ── MIDI Tab ── */}
      {tab === 'midi' && (
        <div className="rp-body">
          {!pedal ? (
            <div className="rp-empty">
              <div className="rp-empty-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="3" y="8" width="26" height="16" rx="4" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="10" cy="13" r="2" fill="currentColor" opacity="0.6"/>
                  <circle cx="16" cy="13" r="2" fill="currentColor" opacity="0.6"/>
                  <circle cx="22" cy="13" r="2" fill="currentColor" opacity="0.6"/>
                  <circle cx="10" cy="20" r="2" fill="currentColor" opacity="0.3"/>
                  <circle cx="16" cy="20" r="2" fill="currentColor" opacity="0.3"/>
                  <circle cx="22" cy="20" r="2" fill="currentColor" opacity="0.3"/>
                </svg>
              </div>
              <p className="rp-empty-title">Select a pedal</p>
              <p className="rp-empty-sub">Click any pedal on the board to see its MIDI setup guide for the Morningstar MC6 Pro.</p>
            </div>
          ) : (
            <MidiContent pedal={pedal} imgBasePedal={imgBasePedal} onClose={onClose} />
          )}
        </div>
      )}

      {/* ── Insights Tab ── */}
      {tab === 'insights' && (
        <div className="rp-body rp-insights-body">
          {insights.length === 0 ? (
            <div className="rp-empty">
              <div className="rp-empty-icon" style={{ color: '#10b981' }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 16l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="rp-empty-title">All good!</p>
              <p className="rp-empty-sub">
                {placedPedals.length === 0
                  ? 'Add pedals to your board and come back for signal chain analysis.'
                  : 'No signal chain issues detected. Switch to AI Assistant for personalised recommendations.'}
              </p>
            </div>
          ) : (
            <div className="rp-chips">
              {insights.map(insight => {
                const cfg = SEV_CONFIG[insight.severity] ?? SEV_CONFIG.info
                return (
                  <div key={insight.id} className={`rp-chip rp-chip--${cfg.cls}`}>
                    <span className="rp-chip-icon">{cfg.icon}</span>
                    <div className="rp-chip-body">
                      <span className="rp-chip-title">{insight.title}</span>
                      <span className="rp-chip-msg">{insight.message}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── AI Tab ── */}
      {tab === 'ai' && (
        <div className="rp-ai">
          {(!apiKey || showApiKey) && (
            <div className="rp-apikey">
              <span className="rp-apikey-label">Gemini API key</span>
              <input
                type="password"
                className="rp-apikey-input"
                placeholder="AIza..."
                value={apiKey}
                onChange={e => saveApiKey(e.target.value)}
              />
              {apiKey && <button className="rp-apikey-done" onClick={() => setShowApiKey(false)}>Done</button>}
              <a className="rp-apikey-link" href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
                Free key ↗
              </a>
            </div>
          )}
          {apiKey && !showApiKey && (
            <div className="rp-apikey-set">
              <span>Gemini key set</span>
              <button className="rp-change-key" onClick={() => setShowApiKey(true)}>Change</button>
            </div>
          )}

          <div className="rp-messages">
            {messages.length === 0 && (
              <div className="rp-welcome">
                <p>Ask your pedalboard expert anything:</p>
                <div className="rp-suggestions">
                  {['What sound does this board produce?', 'What pedal should I add next?', 'Is my signal chain optimal?', 'Suggest improvements for my rig'].map(s => (
                    <button key={s} className="rp-suggestion" onClick={() => setInputText(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`rp-msg rp-msg--${m.role}`}>
                <span className="rp-msg-role">{m.role === 'user' ? 'You' : 'AI'}</span>
                <span className="rp-msg-text">{m.content}</span>
              </div>
            ))}
            {loading && (
              <div className="rp-msg rp-msg--assistant">
                <span className="rp-msg-role">AI</span>
                <span className="rp-msg-text rp-typing">Thinking…</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="rp-input-row">
            <input
              className="rp-input"
              placeholder={apiKey ? 'Ask about your board…' : 'Add Gemini API key above to chat'}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              disabled={!apiKey || loading}
            />
            <button className="rp-send" onClick={sendMessage} disabled={!inputText.trim() || !apiKey || loading}>↑</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── MIDI Content ── */
function MidiContent({ pedal, imgBasePedal, onClose }) {
  const bodyRef = useRef(null)
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [pedal?.id])

  const info = getMidiInfo(pedal.brand, pedal.name)
  const fullName = `${pedal.brand} ${pedal.name}`

  return (
    <>
      <div className="rp-midi-header">
        <img
          src={`${imgBasePedal}${pedal.image}`}
          alt={fullName}
          className="rp-pedal-img"
          onError={(e) => { e.target.style.display = 'none' }}
        />
        <div className="rp-pedal-info">
          <div className="rp-brand">{pedal.brand}</div>
          <div className="rp-name">{pedal.name}</div>
        </div>
        <button className="rp-close" onClick={onClose} title="Deselect">×</button>
      </div>

      <div className="rp-midi-status">
        {info.hasMidi === true  && <span className="rp-badge rp-badge--yes">MIDI Capable</span>}
        {info.hasMidi === false && <span className="rp-badge rp-badge--no">No MIDI</span>}
        {info.hasMidi === null  && <span className="rp-badge rp-badge--unknown">MIDI Unknown</span>}
        <span className="rp-controller-label">MC6 Pro Guide</span>
      </div>

      <div className="rp-midi-body" ref={bodyRef}>
        {info.hasMidi !== true && (
          <div className="rp-no-midi">
            <div className="rp-no-midi-icon">⚡</div>
            <p>{info.noMidiNote}</p>
          </div>
        )}

        {info.hasMidi === true && (
          <>
            <MidiSection icon="🔌" title="MIDI Connection">
              <p className="rp-text">{info.connection}</p>
              <div className="rp-callout rp-callout--info">
                <strong>Tip:</strong> The MC6 Pro outputs 5-pin DIN MIDI. Most modern pedals use 3.5 mm TRS Type A.
                Use a <strong>5-pin DIN female → 3.5 mm TRS (Type A)</strong> cable or adapter.
              </div>
            </MidiSection>

            <MidiSection icon="📡" title="1 — Set the MIDI Receive Channel">
              <p className="rp-text">{info.channelSetup}</p>
              <div className="rp-callout rp-callout--warn">
                Both the pedal and the MC6 Pro must be set to the <strong>same MIDI channel</strong>.
                Choose any channel 1–16 (default: channel 1).
              </div>
            </MidiSection>

            {info.presetInfo && (
              <MidiSection icon="💾" title="Preset System">
                <p className="rp-text">{info.presetInfo}</p>
                {info.pcRange && (
                  <div className="rp-kv">
                    <span className="rp-kv-label">PC Range</span>
                    <code className="rp-code">{info.pcRange}</code>
                  </div>
                )}
              </MidiSection>
            )}

            {info.savingPreset?.length > 0 && (
              <MidiSection icon="🎛" title="2 — Save a Preset on the Pedal">
                <MidiSteps steps={info.savingPreset} />
              </MidiSection>
            )}

            {info.mc6ProSetup?.length > 0 && (
              <MidiSection icon="🎹" title="3 — Configure the MC6 Pro">
                <MidiSteps steps={info.mc6ProSetup} accent />
                <div className="rp-callout rp-callout--info" style={{ marginTop: 12 }}>
                  <strong>MC6 Pro Editor:</strong> Use the web editor at{' '}
                  <a href="https://editor.morningstar.io" target="_blank" rel="noreferrer">
                    editor.morningstar.io
                  </a>{' '}
                  for the easiest preset configuration experience.
                </div>
              </MidiSection>
            )}

            {info.ccNotes && (
              <MidiSection icon="🎚" title="CC Control Notes">
                <p className="rp-text">{info.ccNotes}</p>
              </MidiSection>
            )}

            {info.notes && (
              <MidiSection icon="📝" title="Additional Notes">
                <p className="rp-text">{info.notes}</p>
              </MidiSection>
            )}

            <MidiSection icon="⚙️" title="MC6 Pro Quick Reference">
              <div className="rp-ref-grid">
                <RefItem label="Enter Edit Mode" value="Long-press any footswitch on the MC6 Pro" />
                <RefItem label="Add Message" value='In preset editor → "+ Add Message"' />
                <RefItem label="Recall Preset (PC)" value="Message Type = PC → set PC Number + Channel" />
                <RefItem label="Control Parameter (CC)" value="Message Type = CC → set CC Number + Value + Channel" />
                <RefItem label="Tap Tempo" value="Message Type = CC → CC 64, Value 127 (on most pedals)" />
                <RefItem label="Bypass Toggle" value="Message Type = CC → check pedal's CC map for bypass CC" />
                <RefItem label="Save Preset" value="Press Save in editor, or long-press footswitch and select Save" />
              </div>
            </MidiSection>
          </>
        )}
      </div>
    </>
  )
}

function MidiSection({ icon, title, children }) {
  return (
    <div className="rp-section">
      <h4 className="rp-section-title">
        <span className="rp-section-icon">{icon}</span>
        {title}
      </h4>
      <div className="rp-section-body">{children}</div>
    </div>
  )
}

function MidiSteps({ steps, accent = false }) {
  return (
    <ol className={`rp-steps${accent ? ' rp-steps--accent' : ''}`}>
      {steps.map((step, i) => (
        <li key={i} className="rp-step">
          <span className="rp-step-num">{i + 1}</span>
          <span className="rp-step-text">{step}</span>
        </li>
      ))}
    </ol>
  )
}

function RefItem({ label, value }) {
  return (
    <div className="rp-ref-item">
      <span className="rp-ref-label">{label}</span>
      <span className="rp-ref-value">{value}</span>
    </div>
  )
}
