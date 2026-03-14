/**
 * Curated list of popular guitars and amps.
 * wiki: Wikipedia article title used to fetch a thumbnail via the Wikipedia REST API.
 */

export const POPULAR_GUITARS = [
  // ── Electric ─────────────────────────────────────────────────────────────
  { id: 'fender-strat',     brand: 'Fender',      name: 'Stratocaster',        type: 'electric', wiki: 'Fender_Stratocaster' },
  { id: 'fender-tele',      brand: 'Fender',      name: 'Telecaster',          type: 'electric', wiki: 'Fender_Telecaster' },
  { id: 'fender-jazzmaster',brand: 'Fender',      name: 'Jazzmaster',          type: 'electric', wiki: 'Fender_Jazzmaster' },
  { id: 'fender-jaguar',    brand: 'Fender',      name: 'Jaguar',              type: 'electric', wiki: 'Fender_Jaguar' },
  { id: 'fender-duo-sonic', brand: 'Fender',      name: 'Duo-Sonic',           type: 'electric', wiki: 'Fender_Duo-Sonic' },
  { id: 'gibson-lp',        brand: 'Gibson',      name: 'Les Paul Standard',   type: 'electric', wiki: 'Gibson_Les_Paul' },
  { id: 'gibson-sg',        brand: 'Gibson',      name: 'SG Standard',         type: 'electric', wiki: 'Gibson_SG' },
  { id: 'gibson-es335',     brand: 'Gibson',      name: 'ES-335',              type: 'electric', wiki: 'Gibson_ES-335' },
  { id: 'gibson-flying-v',  brand: 'Gibson',      name: 'Flying V',            type: 'electric', wiki: 'Gibson_Flying_V' },
  { id: 'gibson-lp-junior', brand: 'Gibson',      name: 'Les Paul Junior',     type: 'electric', wiki: 'Gibson_Les_Paul_Junior' },
  { id: 'prs-custom24',     brand: 'PRS',         name: 'Custom 24',           type: 'electric', wiki: 'Paul_Reed_Smith_Guitars' },
  { id: 'prs-silver-sky',   brand: 'PRS',         name: 'Silver Sky',          type: 'electric', wiki: 'Paul_Reed_Smith_Silver_Sky' },
  { id: 'gretsch-6120',     brand: 'Gretsch',     name: 'G6120 Chet Atkins',   type: 'electric', wiki: 'Gretsch' },
  { id: 'rick-360',         brand: 'Rickenbacker',name: '360',                 type: 'electric', wiki: 'Rickenbacker_guitar' },
  { id: 'ibanez-rg',        brand: 'Ibanez',      name: 'RG Series',           type: 'electric', wiki: 'Ibanez_RG' },
  { id: 'schecter-c1',      brand: 'Schecter',    name: 'C-1 Hellraiser',      type: 'electric', wiki: 'Schecter_Guitar_Research' },
  { id: 'esp-ec1000',       brand: 'ESP',         name: 'LTD EC-1000',         type: 'electric', wiki: 'ESP_Guitars' },
  { id: 'epiphone-lp',      brand: 'Epiphone',    name: 'Les Paul Standard',   type: 'electric', wiki: 'Epiphone' },
  { id: 'musicman-luke',    brand: 'Music Man',   name: 'Luke',                type: 'electric', wiki: 'Music_Man_(guitar)' },
  { id: 'offset-mustang',   brand: 'Fender',      name: 'Mustang',             type: 'electric', wiki: 'Fender_Mustang' },
  // ── Bass ──────────────────────────────────────────────────────────────────
  { id: 'fender-pbass',     brand: 'Fender',      name: 'Precision Bass',      type: 'bass',     wiki: 'Fender_Precision_Bass' },
  { id: 'fender-jbass',     brand: 'Fender',      name: 'Jazz Bass',           type: 'bass',     wiki: 'Fender_Jazz_Bass' },
  { id: 'gibson-thunderbird',brand: 'Gibson',     name: 'Thunderbird Bass',    type: 'bass',     wiki: 'Gibson_Thunderbird' },
  { id: 'rick-4003',        brand: 'Rickenbacker',name: '4003 Bass',           type: 'bass',     wiki: 'Rickenbacker_4001' },
  { id: 'musicman-stingray',brand: 'Music Man',   name: 'StingRay',            type: 'bass',     wiki: 'Music_Man_StingRay' },
  { id: 'warwick-corvette', brand: 'Warwick',     name: 'Corvette',            type: 'bass',     wiki: 'Warwick_bass_guitars' },
  // ── Acoustic ──────────────────────────────────────────────────────────────
  { id: 'martin-d28',       brand: 'Martin',      name: 'D-28',                type: 'acoustic', wiki: 'Martin_D-28' },
  { id: 'taylor-314ce',     brand: 'Taylor',      name: '314ce',               type: 'acoustic', wiki: 'Taylor_Guitars' },
  { id: 'gibson-j45',       brand: 'Gibson',      name: 'J-45',                type: 'acoustic', wiki: 'Gibson_J-45' },
  { id: 'guild-d55',        brand: 'Guild',       name: 'D-55',                type: 'acoustic', wiki: 'Guild_Guitars' },
  { id: 'taylor-gs-mini',   brand: 'Taylor',      name: 'GS Mini',             type: 'acoustic', wiki: 'Taylor_Guitars' },
]

export const POPULAR_AMPS = [
  // ── Fender ────────────────────────────────────────────────────────────────
  { id: 'fender-twin',      brand: 'Fender',      name: 'Twin Reverb',         wiki: 'Fender_Twin' },
  { id: 'fender-deluxe',    brand: 'Fender',      name: 'Deluxe Reverb',       wiki: 'Fender_Deluxe_Reverb' },
  { id: 'fender-blues-jr',  brand: 'Fender',      name: 'Blues Junior',        wiki: 'Fender_Blues_Junior' },
  { id: 'fender-princeton', brand: 'Fender',      name: 'Princeton Reverb',    wiki: 'Fender_Princeton' },
  // ── Marshall ──────────────────────────────────────────────────────────────
  { id: 'marshall-plexi',   brand: 'Marshall',    name: 'JTM45 / Plexi',       wiki: 'Marshall_JTM45' },
  { id: 'marshall-jcm800',  brand: 'Marshall',    name: 'JCM800',              wiki: 'Marshall_JCM800' },
  { id: 'marshall-dsl',     brand: 'Marshall',    name: 'DSL40CR',             wiki: 'Marshall_Amplification' },
  // ── Vox ───────────────────────────────────────────────────────────────────
  { id: 'vox-ac30',         brand: 'Vox',         name: 'AC30',                wiki: 'Vox_AC30' },
  { id: 'vox-ac15',         brand: 'Vox',         name: 'AC15',                wiki: 'Vox_AC15' },
  // ── Orange ────────────────────────────────────────────────────────────────
  { id: 'orange-rockerverb',brand: 'Orange',      name: 'Rockerverb 50',       wiki: 'Orange_amplifiers' },
  { id: 'orange-tt',        brand: 'Orange',      name: 'Tiny Terror',         wiki: 'Orange_amplifiers' },
  // ── Mesa Boogie ───────────────────────────────────────────────────────────
  { id: 'mesa-rectifier',   brand: 'Mesa Boogie', name: 'Dual Rectifier',      wiki: 'Mesa_Boogie' },
  { id: 'mesa-markv',       brand: 'Mesa Boogie', name: 'Mark V',              wiki: 'Mesa_Boogie' },
  // ── Other ─────────────────────────────────────────────────────────────────
  { id: 'blackstar-ht5',    brand: 'Blackstar',   name: 'HT-5',               wiki: 'Blackstar_Amplification' },
  { id: 'roland-jc120',     brand: 'Roland',      name: 'JC-120 Jazz Chorus',  wiki: 'Roland_Jazz_Chorus' },
  { id: 'peavey-5150',      brand: 'Peavey',      name: '5150',                wiki: 'Peavey_5150' },
  { id: 'dr-z-maz',         brand: 'Dr. Z',       name: 'MAZ 18 Jr',           wiki: 'Dr._Z_Amplification' },
  // ── Amp sim / Ampless ─────────────────────────────────────────────────────
  { id: 'fractal-fm3',      brand: 'Fractal',     name: 'FM3',                 wiki: 'Fractal_Audio_Systems',    isAmpless: true },
  { id: 'neural-quad',      brand: 'Neural DSP',  name: 'Quad Cortex',         wiki: 'Neural_DSP_Technologies',  isAmpless: true },
  { id: 'strymon-iridium',  brand: 'Strymon',     name: 'Iridium (Amp Sim)',   wiki: 'Strymon',                  isAmpless: true },
  { id: 'ampless-di',       brand: '',            name: 'Ampless / Direct (DI)',wiki: null,                       isAmpless: true },
]
