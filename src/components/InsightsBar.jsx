import { useState, useMemo, useRef, useCallback } from 'react'
import { analyzeChain, buildBoardProfile } from '../data/insightsEngine'
import './InsightsBar.css'

const SEV_CONFIG = {
  good:    { icon: '✓', cls: 'good' },
  tip:     { icon: 'i', cls: 'tip' },
  warning: { icon: '!', cls: 'warning' },
  info:    { icon: '·', cls: 'info' },
}

const GUITAR_TYPES = ['electric', 'acoustic', 'bass']
const AMP_TYPES    = [{ id: 'amp', label: 'Amp' }, { id: 'ampless', label: 'Ampless / DI' }]
const GENRES = ['blues', 'rock', 'metal', 'jazz', 'country', 'funk', 'shoegaze', 'ambient', 'pop']

function buildSystemPrompt(profile, insights) {
  const insightsSummary = insights.length
    ? insights.map(i => `[${i.severity.toUpperCase()}] ${i.title}: ${i.message}`).join('\n')
    : 'No issues detected.'

  return `You are an expert guitar pedalboard consultant and experienced sound engineer with deep knowledge of effects signal chains, tone shaping, and music genres. You give practical, specific, and enthusiastic advice.

Current board: "${profile.boardName}"
Guitar type: ${profile.guitarType}
Setup: ${profile.ampType === 'ampless' ? 'Ampless/direct (needs cab sim)' : 'Into an amplifier'}
Genres/styles: ${profile.genres}

Signal chain (${profile.pedalCount} pedals):
${profile.chainSummary}

Tonal sections on this board: ${profile.sections.join(', ') || 'none detected'}

Current automated insights:
${insightsSummary}

Help the user build and improve their pedalboard. Give specific, actionable recommendations. Reference real pedal models when suggesting alternatives. Consider their guitar type, amp setup, and genres. Be encouraging — mention what's working well before addressing issues.`
}

export default function InsightsBar({ placedPedals, guitarContext, onGuitarContextChange }) {
  const [collapsed,    setCollapsed]    = useState(false)
  const [tab,          setTab]          = useState('insights')   // 'insights' | 'profile' | 'ai'
  const [apiKey,       setApiKey]       = useState(() => {
    try { return localStorage.getItem('midi-ai-apikey') ?? '' } catch { return '' }
  })
  const [showApiKey,   setShowApiKey]   = useState(false)
  const [messages,     setMessages]     = useState([])
  const [inputText,    setInputText]    = useState('')
  const [loading,      setLoading]      = useState(false)
  const chatEndRef = useRef(null)

  const insights = useMemo(
    () => analyzeChain(placedPedals, guitarContext),
    [placedPedals, guitarContext]
  )
  const profile = useMemo(
    () => buildBoardProfile(placedPedals, guitarContext),
    [placedPedals, guitarContext]
  )

  const warnings = insights.filter(i => i.severity === 'warning').length
  const good     = insights.filter(i => i.severity === 'good').length

  const saveApiKey = useCallback((k) => {
    setApiKey(k)
    try { localStorage.setItem('midi-ai-apikey', k) } catch {}
  }, [])

  const toggleGenre = useCallback((genre) => {
    onGuitarContextChange(prev => {
      const genres = prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
      return { ...prev, genres }
    })
  }, [onGuitarContextChange])

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
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: systemPrompt,
          messages: history,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      const assistantText = data.content?.[0]?.text ?? '(no response)'
      setMessages(prev => [...prev, { role: 'assistant', content: assistantText }])
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant', content: `Error: ${err.message}. Check your API key.`,
      }])
    } finally {
      setLoading(false)
    }
  }, [inputText, loading, apiKey, messages, profile, insights])

  if (placedPedals.length === 0 && insights.length === 0) return null

  return (
    <div className={`insights-bar${collapsed ? ' collapsed' : ''}`}>
      {/* Header */}
      <div className="insights-header">
        <div className="insights-header-left" onClick={() => setCollapsed(c => !c)}>
          <span className="insights-title">Guitar Insights</span>
          {insights.length > 0 && <span className="insights-total-badge">{insights.length}</span>}
          {warnings > 0 && <span className="insights-warn-badge">{warnings} warning{warnings !== 1 ? 's' : ''}</span>}
          {good > 0 && <span className="insights-good-badge">{good} good</span>}
          <span className="insights-toggle">{collapsed ? '▲' : '▼'}</span>
        </div>
        {!collapsed && (
          <div className="insights-tabs">
            {[['insights', 'Insights'], ['profile', 'Guitar Profile'], ['ai', '✦ AI Assistant']].map(([id, label]) => (
              <button
                key={id}
                className={`insights-tab${tab === id ? ' active' : ''}`}
                onClick={() => setTab(id)}
              >{label}</button>
            ))}
          </div>
        )}
      </div>

      {!collapsed && tab === 'insights' && (
        <div className="insights-chips">
          {insights.length === 0 ? (
            <div className="insights-empty">
              <span>Looks great — no signal chain issues detected.</span>
              {guitarContext.guitarType && (
                <span> Add more pedals or switch to the AI tab for personalised recommendations.</span>
              )}
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

      {!collapsed && tab === 'profile' && (
        <div className="insights-profile">
          <div className="profile-row">
            <span className="profile-label">Guitar</span>
            <div className="profile-pills">
              {GUITAR_TYPES.map(t => (
                <button
                  key={t}
                  className={`profile-pill${guitarContext.guitarType === t ? ' active' : ''}`}
                  onClick={() => onGuitarContextChange(prev => ({ ...prev, guitarType: prev.guitarType === t ? null : t }))}
                >{t}</button>
              ))}
            </div>
          </div>
          <div className="profile-row">
            <span className="profile-label">Setup</span>
            <div className="profile-pills">
              {AMP_TYPES.map(({ id, label }) => (
                <button
                  key={id}
                  className={`profile-pill${guitarContext.ampType === id ? ' active' : ''}`}
                  onClick={() => onGuitarContextChange(prev => ({ ...prev, ampType: id }))}
                >{label}</button>
              ))}
            </div>
          </div>
          <div className="profile-row profile-row--genres">
            <span className="profile-label">Genres</span>
            <div className="profile-pills">
              {GENRES.map(g => (
                <button
                  key={g}
                  className={`profile-pill${guitarContext.genres.includes(g) ? ' active' : ''}`}
                  onClick={() => toggleGenre(g)}
                >{g}</button>
              ))}
            </div>
          </div>
          {profile && (
            <div className="profile-summary">
              <strong>{profile.pedalCount} pedal{profile.pedalCount !== 1 ? 's' : ''}</strong>
              {profile.sections.length > 0 && ` · ${profile.sections.join(' → ')}`}
              {guitarContext.guitarType && ` · ${guitarContext.guitarType}`}
              {` · ${guitarContext.ampType === 'ampless' ? 'ampless/DI' : 'into amp'}`}
              {guitarContext.genres.length > 0 && ` · ${guitarContext.genres.join(', ')}`}
            </div>
          )}
        </div>
      )}

      {!collapsed && tab === 'ai' && (
        <div className="insights-ai">
          {/* API key setup */}
          {(!apiKey || showApiKey) && (
            <div className="ai-apikey">
              <span className="ai-apikey-label">Anthropic API key</span>
              <input
                type="password"
                className="ai-apikey-input"
                placeholder="sk-ant-..."
                value={apiKey}
                onChange={e => saveApiKey(e.target.value)}
              />
              {apiKey && (
                <button className="ai-apikey-done" onClick={() => setShowApiKey(false)}>Done</button>
              )}
              <a className="ai-apikey-link" href="https://console.anthropic.com" target="_blank" rel="noreferrer">
                Get key ↗
              </a>
            </div>
          )}
          {apiKey && !showApiKey && (
            <div className="ai-apikey-set">
              <span>API key set</span>
              <button className="ai-change-key" onClick={() => setShowApiKey(true)}>Change</button>
            </div>
          )}

          {/* Chat messages */}
          <div className="ai-messages">
            {messages.length === 0 && (
              <div className="ai-welcome">
                <p>Ask your guitar expert anything about your board:</p>
                <div className="ai-suggestions">
                  {['What sound does this board produce?', 'What pedal should I add next?', 'How do I set this up for blues?', 'Is my signal chain optimal?'].map(s => (
                    <button key={s} className="ai-suggestion" onClick={() => setInputText(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ai-msg--${m.role}`}>
                <span className="ai-msg-role">{m.role === 'user' ? 'You' : '✦'}</span>
                <span className="ai-msg-text">{m.content}</span>
              </div>
            ))}
            {loading && (
              <div className="ai-msg ai-msg--assistant">
                <span className="ai-msg-role">✦</span>
                <span className="ai-msg-text ai-typing">Thinking…</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="ai-input-row">
            <input
              className="ai-input"
              placeholder={apiKey ? 'Ask about your board…' : 'Add API key above to chat'}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              disabled={!apiKey || loading}
            />
            <button className="ai-send" onClick={sendMessage} disabled={!inputText.trim() || !apiKey || loading}>
              ↑
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
