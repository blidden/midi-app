import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { analyzeChain, buildBoardProfile } from '../data/insightsEngine'
import './InsightsBar.css'

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

export default function InsightsBar({ placedPedals, guitarContext }) {
  const [collapsed,    setCollapsed]    = useState(false)
  const [tab,          setTab]          = useState('insights')
  const [apiKey,       setApiKey]       = useState(() => {
    try { return localStorage.getItem('midi-gemini-apikey') ?? '' } catch { return '' }
  })
  const [showApiKey,   setShowApiKey]   = useState(false)
  const [messages,     setMessages]     = useState([])
  const [inputText,    setInputText]    = useState('')
  const [loading,      setLoading]      = useState(false)
  const [panelHeight,  setPanelHeight]  = useState(260)
  const chatEndRef  = useRef(null)
  const resizingRef = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      if (!resizingRef.current) return
      const { startY, startHeight } = resizingRef.current
      setPanelHeight(Math.max(40, Math.min(600, startHeight - (e.clientY - startY))))
    }
    const onUp = () => { resizingRef.current = null }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [])

  const startResize = useCallback((e) => {
    e.preventDefault()
    resizingRef.current = { startY: e.clientY, startHeight: panelHeight }
  }, [panelHeight])

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

  if (placedPedals.length === 0 && insights.length === 0) return null

  return (
    <div
      className={`insights-bar${collapsed ? ' collapsed' : ''}`}
      style={collapsed ? undefined : { height: panelHeight }}
    >
      {!collapsed && <div className="insights-resize-handle" onMouseDown={startResize} />}

      <div className="insights-header">
        <div className="insights-header-left" onClick={() => setCollapsed(c => !c)}>
          <span className="insights-title">Chain Analysis</span>
          {insights.length > 0 && <span className="insights-total-badge">{insights.length}</span>}
          {warnings > 0 && <span className="insights-warn-badge">{warnings} warning{warnings !== 1 ? 's' : ''}</span>}
          {good > 0 && <span className="insights-good-badge">{good} good</span>}
          <span className="insights-toggle">{collapsed ? '▲' : '▼'}</span>
        </div>
        {!collapsed && (
          <div className="insights-tabs">
            {[['insights', 'Insights'], ['ai', 'AI Assistant']].map(([id, label]) => (
              <button key={id} className={`insights-tab${tab === id ? ' active' : ''}`} onClick={() => setTab(id)}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {!collapsed && tab === 'insights' && (
        <div className="insights-chips">
          {insights.length === 0 ? (
            <div className="insights-empty">
              No signal chain issues detected.
              {guitarContext?.guitar && ' Switch to AI Assistant for personalised recommendations.'}
            </div>
          ) : insights.map(insight => {
            const cfg = SEV_CONFIG[insight.severity] ?? SEV_CONFIG.info
            return (
              <div key={insight.id} className={`insight-chip insight-chip--${cfg.cls}`}>
                <span className="chip-icon">{cfg.icon}</span>
                <div className="chip-body">
                  <span className="chip-title">{insight.title}</span>
                  <span className="chip-msg">{insight.message}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!collapsed && tab === 'ai' && (
        <div className="insights-ai">
          {(!apiKey || showApiKey) && (
            <div className="ai-apikey">
              <span className="ai-apikey-label">Gemini API key</span>
              <input
                type="password"
                className="ai-apikey-input"
                placeholder="AIza..."
                value={apiKey}
                onChange={e => saveApiKey(e.target.value)}
              />
              {apiKey && <button className="ai-apikey-done" onClick={() => setShowApiKey(false)}>Done</button>}
              <a className="ai-apikey-link" href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
                Free key ↗
              </a>
            </div>
          )}
          {apiKey && !showApiKey && (
            <div className="ai-apikey-set">
              <span>Gemini key set</span>
              <button className="ai-change-key" onClick={() => setShowApiKey(true)}>Change</button>
            </div>
          )}

          <div className="ai-messages">
            {messages.length === 0 && (
              <div className="ai-welcome">
                <p>Ask your pedalboard expert anything:</p>
                <div className="ai-suggestions">
                  {['What sound does this board produce?', 'What pedal should I add next?', 'Is my signal chain optimal?', 'Suggest improvements for my rig'].map(s => (
                    <button key={s} className="ai-suggestion" onClick={() => setInputText(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ai-msg--${m.role}`}>
                <span className="ai-msg-role">{m.role === 'user' ? 'You' : 'AI'}</span>
                <span className="ai-msg-text">{m.content}</span>
              </div>
            ))}
            {loading && (
              <div className="ai-msg ai-msg--assistant">
                <span className="ai-msg-role">AI</span>
                <span className="ai-msg-text ai-typing">Thinking…</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="ai-input-row">
            <input
              className="ai-input"
              placeholder={apiKey ? 'Ask about your board…' : 'Add Gemini API key above to chat'}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              disabled={!apiKey || loading}
            />
            <button className="ai-send" onClick={sendMessage} disabled={!inputText.trim() || !apiKey || loading}>↑</button>
          </div>
        </div>
      )}
    </div>
  )
}
