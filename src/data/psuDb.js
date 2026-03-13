export const psuDb = [
  {
    id: 'strymon-zuma-r300',
    brand: 'Strymon',
    name: 'Zuma R300',
    totalMa: 3000,
    outputs: [
      { label: 'A–E (×5)', voltage: 9, mA: 300, count: 5, isolated: true },
      { label: 'F–G (×2)', voltage: 12, mA: 300, count: 2, isolated: true },
      { label: 'H–I (×2)', voltage: 18, mA: 300, count: 2, isolated: true },
      { label: 'J (×1)', voltage: 'variable', mA: 300, count: 1, isolated: true, note: '9–18V variable' },
    ],
  },
  {
    id: 'strymon-ojai-r30',
    brand: 'Strymon',
    name: 'Ojai R30',
    totalMa: 1500,
    outputs: [
      { label: 'A–E (×5)', voltage: 9, mA: 300, count: 5, isolated: true },
    ],
  },
  {
    id: 'strymon-ojai',
    brand: 'Strymon',
    name: 'Ojai (Original)',
    totalMa: 1000,
    outputs: [
      { label: '1–5 (×5)', voltage: 9, mA: 200, count: 5, isolated: false },
    ],
  },
  {
    id: 'cioks-dc7',
    brand: 'Cioks',
    name: 'DC7',
    totalMa: 3310,
    outputs: [
      { label: '1–4 (×4)', voltage: 9, mA: 660, count: 4, isolated: true },
      { label: '5 (×1)', voltage: 12, mA: 250, count: 1, isolated: true },
      { label: '6 (×1)', voltage: 18, mA: 250, count: 1, isolated: true },
      { label: '7 (×1)', voltage: 'variable', mA: 660, count: 1, isolated: true, note: '5–15V variable' },
    ],
  },
  {
    id: 'cioks-super8',
    brand: 'Cioks',
    name: 'Super 8',
    totalMa: 5280,
    outputs: [
      { label: '1–8 (×8)', voltage: 'variable', mA: 660, count: 8, isolated: true, note: '5–15V each, 1A total' },
    ],
  },
  {
    id: 'truetone-cs12',
    brand: 'Truetone',
    name: '1 Spot Pro CS12',
    totalMa: 3000,
    outputs: [
      { label: 'A–B (×2)', voltage: 9, mA: 250, count: 2, isolated: true },
      { label: 'C–D (×2)', voltage: 9, mA: 500, count: 2, isolated: true },
      { label: 'E–F (×2)', voltage: 9, mA: 100, count: 2, isolated: false },
      { label: 'G–H (×2)', voltage: 12, mA: 200, count: 2, isolated: true },
      { label: 'I–J (×2)', voltage: 'variable', mA: 400, count: 2, isolated: true, note: '9–24V' },
      { label: 'K–L (×2)', voltage: 18, mA: 100, count: 2, isolated: true },
    ],
  },
  {
    id: 'truetone-cs6',
    brand: 'Truetone',
    name: '1 Spot Pro CS6',
    totalMa: 1200,
    outputs: [
      { label: 'A–D (×4)', voltage: 9, mA: 200, count: 4, isolated: true },
      { label: 'E (×1)', voltage: 9, mA: 450, count: 1, isolated: true },
      { label: 'F (×1)', voltage: 'variable', mA: 400, count: 1, isolated: true, note: '9–24V' },
    ],
  },
  {
    id: 'voodoolab-pp2plus',
    brand: 'Voodoo Lab',
    name: 'Pedal Power 2 Plus',
    totalMa: 1000,
    outputs: [
      { label: '1–4 (×4)', voltage: 9, mA: 100, count: 4, isolated: true },
      { label: '5–6 (×2)', voltage: 9, mA: 100, count: 2, isolated: true },
      { label: '7–8 (×2)', voltage: 'variable', mA: 400, count: 2, isolated: true, note: '4.5–9.6V adjustable' },
    ],
  },
  {
    id: 'voodoolab-pp3',
    brand: 'Voodoo Lab',
    name: 'Pedal Power 3 Plus',
    totalMa: 2250,
    outputs: [
      { label: '1–4 (×4)', voltage: 9, mA: 250, count: 4, isolated: true },
      { label: '5–6 (×2)', voltage: 12, mA: 250, count: 2, isolated: true },
      { label: '7–8 (×2)', voltage: 'variable', mA: 250, count: 2, isolated: true, note: '4.5–12V' },
    ],
  },
  {
    id: 'walrus-aetos-8',
    brand: 'Walrus Audio',
    name: 'Aetos 8-Output',
    totalMa: 3100,
    outputs: [
      { label: '1–5 (×5)', voltage: 9, mA: 300, count: 5, isolated: true },
      { label: '6 (×1)', voltage: 9, mA: 500, count: 1, isolated: true },
      { label: '7 (×1)', voltage: 12, mA: 500, count: 1, isolated: true },
      { label: '8 (×1)', voltage: 18, mA: 500, count: 1, isolated: true },
    ],
  },
  {
    id: 'mxr-iso-brick',
    brand: 'MXR',
    name: 'M238 ISO-Brick',
    totalMa: 2200,
    outputs: [
      { label: '1–2 (×2)', voltage: 9, mA: 100, count: 2, isolated: true },
      { label: '3–4 (×2)', voltage: 9, mA: 300, count: 2, isolated: true },
      { label: '5–6 (×2)', voltage: 9, mA: 450, count: 2, isolated: true },
      { label: '7–8 (×2)', voltage: 18, mA: 250, count: 2, isolated: true },
      { label: '9–10 (×2)', voltage: 'variable', mA: 250, count: 2, isolated: true, note: '6–15V' },
    ],
  },
  {
    id: 'fender-engine-room-lvl8',
    brand: 'Fender',
    name: 'Engine Room LVL8',
    totalMa: 2800,
    outputs: [
      { label: '1–4 (×4)', voltage: 9, mA: 300, count: 4, isolated: true },
      { label: '5–6 (×2)', voltage: 9, mA: 500, count: 2, isolated: true },
      { label: '7 (×1)', voltage: 12, mA: 300, count: 1, isolated: true },
      { label: '8 (×1)', voltage: 18, mA: 300, count: 1, isolated: true },
    ],
  },
  {
    id: 'eventide-powermax',
    brand: 'Eventide',
    name: 'PowerMAX',
    totalMa: 1500,
    outputs: [
      { label: 'A (×1)', voltage: 9, mA: 500, count: 1, isolated: true },
      { label: 'B–E (×4)', voltage: 9, mA: 250, count: 4, isolated: true },
    ],
  },
  {
    id: 'boss-psa120s',
    brand: 'Boss',
    name: 'PSA-120S (Daisy Chain)',
    totalMa: 500,
    outputs: [
      { label: 'Main (×1)', voltage: 9, mA: 500, count: 1, isolated: false, note: 'Non-isolated — use with daisy chain cable' },
    ],
  },
]

export function getPsuById(id) {
  return psuDb.find(p => p.id === id) ?? null
}

export function getPsuOutputCount(psu) {
  return psu.outputs.reduce((sum, o) => sum + o.count, 0)
}
