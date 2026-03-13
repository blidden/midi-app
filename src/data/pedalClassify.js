// Effect type classification by brand + name pattern matching.
// Patterns are tried in order; first match wins.

const TYPE_PATTERNS = [
  { type: 'tuner',       rx: /\btuner\b|polytune|pitchblack|\btu-\d|\btu\d\b/i },
  { type: 'wah',         rx: /\bwah\b|cry\s*baby|dunlop gcb/i },
  { type: 'compressor',  rx: /compress|compressor|\bcomp\b|sustain|leveling amp|diamond comp|cali76|darkglass hyper/i },
  { type: 'fuzz',        rx: /\bfuzz\b|big\s*muff|tone\s*bender|rams?\s*head|violet wand|purple rain|silicon fuzz/i },
  { type: 'octave',      rx: /\boctave\b|octafuzz|octavio|\bpog\b|\bhog\b|micro\s*pog|bass\s*octave|octron/i },
  { type: 'pitch',       rx: /\bpitch\b|harmonist|harmony|whammy|pitch\s*shifter|pitchfactor|polyphonic/i },
  { type: 'overdrive',   rx: /overdrive|\bod\b|tube\s*screamer|\bts\d\b|klon\b|klone|blues?\s*driver|bluesbreaker|timmy|morning glory|zendrive|dumble/i },
  { type: 'distortion',  rx: /distortion|\bdist\b|metal\b|\brat\b|\bds-\d|high\s*gain|proco|fulltone ocd/i },
  { type: 'boost',       rx: /\bboost\b|clean boost|ep\s*booster|spark\s*booster/i },
  { type: 'filter',      rx: /\bfilter\b|envelope|auto.?wah|q-tron|mutron|meatball|bassballs/i },
  { type: 'chorus',      rx: /\bchorus\b|\bce-\d|\bce\d\b|small\s*clone|julia\b/i },
  { type: 'flanger',     rx: /\bflanger\b|flange\b|\bbf-\d/i },
  { type: 'phaser',      rx: /\bphaser?\b|small\s*stone|\bph-\d|phase\s*90/i },
  { type: 'tremolo',     rx: /\btremolo\b|\btrem\b|super\s*trem|el\s*cap.*trem/i },
  { type: 'vibrato',     rx: /\bvibrato\b|uni.?vibe|rotary|leslie|vibrato\s*machine/i },
  { type: 'modulation',  rx: /\bmod\b|modulation|mobius|warped\s*vinyl|habit\b|deco\b|ola\b|strymon\s+deco|flint\b|zelzah\b/i },
  { type: 'looper',      rx: /\bloop(er)?\b|\bditto\b|\brc-\d|\brc\d\b/i },
  { type: 'delay',       rx: /\bdelay\b|\becho\b|tape\s*echo|timeline\b|el\s+capistan|brigadier|memory\s*(man|boy|lane)|slapback|dd-\d|echoplex|dark\s*world.*delay|nemesis\b/i },
  { type: 'reverb',      rx: /\breverb\b|\bverb\b|big\s*sky|flint\b|cloudburst|shimmer|hall\s*of\s*fame|blue\s*sky|spring\b|room\b|plate\b|nightsky|ventris|collider.*reverb/i },
  { type: 'amp',         rx: /\biridium\b|amp\s*(sim|in|modeler)|cab\s*(sim|ir)|preamp|amp\s+head|helix.*amp|kemper|quadcortex/i },
  { type: 'multi',       rx: /\bh9\b|h90\b|helix\b|hx\s*(effects|stomp)|axe.?fx|kemper|quad\s*cortex|ampero|zoom\s*g|boss\s+gt/i },
  { type: 'volume',      rx: /\bvolume\b|\bvol\b\s*pedal|expression\s*pedal|ernie\s*ball\s*vol/i },
  { type: 'eq',          rx: /\beq\b|equalizer|graphic\s*eq|parametric\s*eq|mxr\s+10|boss\s+ge/i },
]

export function classifyPedal(brand, name) {
  const combined = `${brand} ${name}`
  for (const { type, rx } of TYPE_PATTERNS) {
    if (rx.test(combined)) return type
  }
  return 'unknown'
}

export const TYPE_META = {
  tuner:       { label: 'Tuner',       color: '#475569' },
  wah:         { label: 'Wah/Filter',  color: '#db2777' },
  compressor:  { label: 'Compressor',  color: '#059669' },
  fuzz:        { label: 'Fuzz',        color: '#991b1b' },
  octave:      { label: 'Octave',      color: '#0284c7' },
  pitch:       { label: 'Pitch',       color: '#0891b2' },
  overdrive:   { label: 'Overdrive',   color: '#d97706' },
  distortion:  { label: 'Distortion',  color: '#dc2626' },
  boost:       { label: 'Boost',       color: '#ca8a04' },
  filter:      { label: 'Filter',      color: '#9333ea' },
  chorus:      { label: 'Chorus',      color: '#7c3aed' },
  flanger:     { label: 'Flanger',     color: '#6d28d9' },
  phaser:      { label: 'Phaser',      color: '#5b21b6' },
  tremolo:     { label: 'Tremolo',     color: '#4338ca' },
  vibrato:     { label: 'Vibrato',     color: '#3730a3' },
  modulation:  { label: 'Modulation',  color: '#4f46e5' },
  looper:      { label: 'Looper',      color: '#64748b' },
  delay:       { label: 'Delay',       color: '#0369a1' },
  reverb:      { label: 'Reverb',      color: '#1d4ed8' },
  amp:         { label: 'Amp Sim',     color: '#b45309' },
  multi:       { label: 'Multi-FX',    color: '#6b7280' },
  volume:      { label: 'Volume',      color: '#94a3b8' },
  eq:          { label: 'EQ',          color: '#65a30d' },
  unknown:     { label: 'Unknown',     color: '#52525b' },
}
