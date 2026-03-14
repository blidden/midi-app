import { classifyPedal } from './pedalClassify'

// severity: 'good' | 'tip' | 'warning' | 'info'
export function analyzeChain(placedPedals, ctx = {}) {
  if (placedPedals.length < 2) return []

  const guitar = ctx.guitar ?? null
  const amp    = ctx.amp    ?? null

  const guitarType = guitar?.type ?? null
  const isAmpless  = amp?.isAmpless === true
  const isAcoustic = guitarType === 'acoustic'
  const isBass     = guitarType === 'bass'

  const chain = placedPedals.map((p, i) => ({
    ...p, type: classifyPedal(p.brand, p.name), pos: i,
  }))

  const insights = []
  const types = chain.map(p => p.type)

  const firstOf = (...tl) => { for (let i = 0; i < types.length; i++) if (tl.includes(types[i])) return i; return -1 }
  const lastOf  = (...tl) => { for (let i = types.length - 1; i >= 0; i--) if (tl.includes(types[i])) return i; return -1 }
  const allOf   = (...tl) => chain.filter(p => tl.includes(p.type))
  const countOf = (...tl) => allOf(...tl).length
  const has     = (...tl) => firstOf(...tl) !== -1

  const driveTypes = ['overdrive', 'distortion', 'boost', 'fuzz']
  const modTypes   = ['chorus', 'flanger', 'phaser', 'tremolo', 'vibrato', 'modulation']

  // ── Tuner placement ──────────────────────────────────────────────────
  if (has('tuner') && firstOf('tuner') !== 0)
    insights.push({ id: 'tuner-first', severity: 'warning', title: 'Tuner position',
      message: 'Tuner should be the very first pedal so it sees a clean, uncoloured signal for accurate tuning.' })

  // ── Fuzz early ───────────────────────────────────────────────────────
  const fuzzIdx = firstOf('fuzz')
  const firstNonFuzzDrive = firstOf(...driveTypes.filter(t => t !== 'fuzz'))
  if (fuzzIdx >= 0 && firstNonFuzzDrive >= 0 && fuzzIdx > firstNonFuzzDrive)
    insights.push({ id: 'fuzz-early', severity: 'tip', title: 'Fuzz before other drives',
      message: 'Fuzz pedals are impedance-sensitive. Running fuzz before buffered or other drive pedals gives the classic vintage response and avoids tone-sucking.' })

  // ── Wah before/after drives ──────────────────────────────────────────
  const wahIdx = firstOf('wah', 'filter')
  if (wahIdx >= 0 && has(...driveTypes) && wahIdx > firstOf(...driveTypes))
    insights.push({ id: 'wah-before-drive', severity: 'tip', title: 'Wah before drives',
      message: 'Wah before overdrive gives the classic expressive vowel sound. After drives produces a funkier, more saturated sweep — intentional but unconventional.' })

  // ── Compressor ───────────────────────────────────────────────────────
  const compIdx = firstOf('compressor')
  if (compIdx >= 0 && has(...driveTypes)) {
    if (compIdx > firstOf(...driveTypes))
      insights.push({ id: 'comp-after-drive', severity: 'warning', title: 'Compressor after drives',
        message: 'Compressor is after your drives. Before drives, it evens input dynamics for consistent gain. After drives, it squashes the distorted signal — can kill dynamics and feel.' })
    else
      insights.push({ id: 'comp-before-drive-good', severity: 'good', title: 'Compressor → Drive',
        message: 'Classic Nashville setup — tight attack, consistent level, and smooth sustain into the gain stage.' })
  }

  // ── Modulation after drives ──────────────────────────────────────────
  if (has(...modTypes) && has(...driveTypes)) {
    const firstMod = firstOf(...modTypes)
    const lastDrive = lastOf(...driveTypes)
    if (firstMod < lastDrive)
      insights.push({ id: 'mod-before-drive', severity: 'tip', title: 'Modulation before drives',
        message: 'Standard practice puts modulation after drives — the drive saturates the modulated signal. Before drives, modulation feeds an unusual texture into the gain stage.' })
  }

  // ── Delay → Reverb order ─────────────────────────────────────────────
  if (has('delay') && has('reverb')) {
    if (lastOf('delay') > firstOf('reverb'))
      insights.push({ id: 'reverb-before-delay', severity: 'warning', title: 'Reverb before Delay',
        message: 'Delay → Reverb is the standard: each repeat gets bathed in reverb. Reversed, reverb tails feed into the delay — can be lush but risks a washy, undefined sound.' })
    else
      insights.push({ id: 'delay-reverb-order-good', severity: 'good', title: 'Delay → Reverb',
        message: 'Classic signal chain order. Each delay repeat blooms into the reverb for huge, defined ambience.' })
  }

  // ── Reverb into drives ───────────────────────────────────────────────
  if (has('reverb') && has(...driveTypes) && lastOf('reverb') < lastOf(...driveTypes))
    insights.push({ id: 'reverb-before-drive', severity: 'warning', title: 'Reverb into drives',
      message: 'Reverbs are before drive pedals, forcing reverb tails into distortion — extremely washy. Usually only intentional for shoegaze.' })

  // ── Amp sim at end ───────────────────────────────────────────────────
  const ampIdx = lastOf('amp')
  if (ampIdx >= 0 && ampIdx < types.length - 1) {
    const afterAmp = chain.slice(ampIdx + 1).filter(p => !['looper', 'volume', 'tuner'].includes(p.type))
    if (afterAmp.length > 0)
      insights.push({ id: 'effects-after-amp', severity: 'warning', title: 'Effects after amp sim',
        message: `${afterAmp.map(p => p.name).join(', ')} come after your amp sim. Drive before the sim is natural; time-based FX after work like an FX loop — but drive after the sim can sound thin.` })
  }

  // ── Ampless: needs IR/cab sim ────────────────────────────────────────
  if (isAmpless && !has('amp', 'ir'))
    insights.push({ id: 'ampless-no-ir', severity: 'warning', title: 'Ampless — no IR/cab sim',
      message: 'Going direct without a cab sim or amp sim will sound thin and piercing through FOH or IEMs. Add an IR loader (Strymon Iridium, Two Notes Torpedo, Walrus ACS1) before your DI.' })

  // ── Acoustic-specific ────────────────────────────────────────────────
  if (isAcoustic && has(...driveTypes))
    insights.push({ id: 'acoustic-drive', severity: 'tip', title: 'Drive on acoustic',
      message: 'Heavy drives can sound harsh on acoustic. Light overdrive or a clean boost works well for attack and presence, but heavy distortion competes with the instrument\'s natural resonance.' })

  // ── Bass-specific ────────────────────────────────────────────────────
  if (isBass && has('distortion', 'fuzz'))
    insights.push({ id: 'bass-low-end', severity: 'tip', title: 'Preserving low end',
      message: 'Bass distortion can thin your low end. Consider a wet/dry blend or parallel loop to keep clean bass under the dirt. Darkglass, EBS, and Aguilar pedals handle this natively.' })

  // ── Multi-reverb/delay ───────────────────────────────────────────────
  if (countOf('reverb') >= 2)
    insights.push({ id: 'multi-reverb', severity: 'info', title: `${countOf('reverb')} reverb pedals`,
      message: 'Stacking reverbs creates deep soundscapes. Try one short/room and one long/shimmer for layered space, or run them in parallel.' })

  if (countOf('delay') >= 2)
    insights.push({ id: 'multi-delay', severity: 'info', title: `${countOf('delay')} delay pedals`,
      message: 'Two delays can create incredible spread. Dotted-eighth + quarter note for the U2/Edge sound, or slapback + long for rockabilly + ambient layers.' })

  // ── Drive stacking ───────────────────────────────────────────────────
  if (countOf(...driveTypes) >= 3)
    insights.push({ id: 'drive-stack', severity: 'info', title: `${countOf(...driveTypes)} gain stages`,
      message: 'Ensure each stage has a distinct character: low-gain → medium-gain → high-gain or clean boost → OD → fuzz for layered harmonics.' })

  // ── Great pairings ───────────────────────────────────────────────────
  if (has('octave') && has('fuzz') && firstOf('octave') < firstOf('fuzz'))
    insights.push({ id: 'octave-into-fuzz', severity: 'good', title: 'Octave → Fuzz',
      message: 'Hendrix-approved. Octave into fuzz creates wild harmonic overtones — a psychedelic rock staple. The fuzz saturates the octave signal for maximum aggression.' })

  if (has(...driveTypes) && has('reverb'))
    insights.push({ id: 'drive-reverb', severity: 'good', title: 'Drive + Reverb',
      message: 'One of the most universally satisfying pairings. The reverb gives the drive body, dimension, and space — from subtle sparkle to full shoegaze wash.' })

  if (has('delay') && has('reverb'))
    insights.push({ id: 'delay-reverb-pair', severity: 'good', title: 'Delay + Reverb',
      message: 'The holy grail of ambient tone. Together they create massive, ethereal soundscapes — from subtle depth to the sound of playing inside a cathedral.' })

  if (has('compressor') && has(...driveTypes) && has('reverb'))
    insights.push({ id: 'comp-drive-reverb', severity: 'good', title: 'Comp + Drive + Reverb',
      message: 'The classic performance-ready setup: compressor tightens dynamics, drive adds colour and sustain, reverb lifts everything into the mix.' })

  return insights
}

// Build a profile object for AI context
export function buildBoardProfile(placedPedals, ctx = {}, boardName = 'My Board') {
  const guitar = ctx.guitar ?? null
  const amp    = ctx.amp    ?? null

  const guitarName = guitar
    ? `${guitar.brand} ${guitar.name} (${guitar.type})`
    : 'Not specified'

  const ampSetup = amp
    ? (amp.isAmpless ? `${amp.name} (ampless/direct)` : `${amp.brand} ${amp.name}`)
    : 'Not specified'

  const chain = placedPedals.map(p => ({ ...p, type: classifyPedal(p.brand, p.name) }))
  const has = (...tl) => chain.some(p => tl.includes(p.type))

  const driveTypes = ['overdrive', 'distortion', 'boost', 'fuzz']
  const modTypes   = ['chorus', 'flanger', 'phaser', 'tremolo', 'vibrato', 'modulation']

  const sections = []
  if (has(...driveTypes))   sections.push('drive/gain')
  if (has(...modTypes))     sections.push('modulation')
  if (has('delay'))         sections.push('delay')
  if (has('reverb'))        sections.push('reverb')
  if (has('compressor'))    sections.push('compression')
  if (has('amp', 'ir'))     sections.push('amp simulation')

  return {
    boardName, guitarName, ampSetup,
    pedalCount: placedPedals.length,
    chainSummary: chain.map((p, i) => `${i + 1}. ${p.brand} ${p.name} (${p.type})`).join('\n'),
    sections,
  }
}
