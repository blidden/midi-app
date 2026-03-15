/**
 * Curated list of popular guitars and amps.
 * wiki: Wikipedia article title used to fetch a thumbnail via the Wikipedia REST API.
 */

export const POPULAR_GUITARS = [
  // ── Fender Electric ──────────────────────────────────────────────────────
  { id: 'fender-strat',              brand: 'Fender',       name: 'Stratocaster',                type: 'electric', wiki: 'Fender_Stratocaster' },
  { id: 'fender-strat-hss',          brand: 'Fender',       name: 'Stratocaster HSS',            type: 'electric', wiki: 'Fender_Stratocaster' },
  { id: 'fender-tele',               brand: 'Fender',       name: 'Telecaster',                  type: 'electric', wiki: 'Fender_Telecaster' },
  { id: 'fender-tele-thinline',      brand: 'Fender',       name: 'Telecaster Thinline',         type: 'electric', wiki: 'Fender_Telecaster' },
  { id: 'fender-jazzmaster',         brand: 'Fender',       name: 'Jazzmaster',                  type: 'electric', wiki: 'Fender_Jazzmaster' },
  { id: 'fender-jaguar',             brand: 'Fender',       name: 'Jaguar',                      type: 'electric', wiki: 'Fender_Jaguar' },
  { id: 'fender-jaguar-trad-ii-mij', brand: 'Fender',       name: 'Jaguar Traditional II (MIJ)', type: 'electric', wiki: 'Fender_Jaguar' },
  { id: 'fender-jaguar-hh',          brand: 'Fender',       name: 'Jaguar HH',                   type: 'electric', wiki: 'Fender_Jaguar' },
  { id: 'fender-duo-sonic',          brand: 'Fender',       name: 'Duo-Sonic',                   type: 'electric', wiki: 'Fender_Duo-Sonic' },
  { id: 'fender-mustang',            brand: 'Fender',       name: 'Mustang',                     type: 'electric', wiki: 'Fender_Mustang' },
  { id: 'fender-mustang-90',         brand: 'Fender',       name: 'Mustang 90',                  type: 'electric', wiki: 'Fender_Mustang' },
  { id: 'fender-offset-special',     brand: 'Fender',       name: 'Offset Special',              type: 'electric', wiki: 'Fender_Jazzmaster' },

  // ── Gibson Electric ───────────────────────────────────────────────────────
  { id: 'gibson-lp',                 brand: 'Gibson',       name: 'Les Paul Standard',           type: 'electric', wiki: 'Gibson_Les_Paul' },
  { id: 'gibson-lp-custom',          brand: 'Gibson',       name: 'Les Paul Custom',             type: 'electric', wiki: 'Gibson_Les_Paul' },
  { id: 'gibson-lp-junior',          brand: 'Gibson',       name: 'Les Paul Junior',             type: 'electric', wiki: 'Gibson_Les_Paul_Junior' },
  { id: 'gibson-lp-special',         brand: 'Gibson',       name: 'Les Paul Special',            type: 'electric', wiki: 'Gibson_Les_Paul_Junior' },
  { id: 'gibson-sg',                 brand: 'Gibson',       name: 'SG Standard',                 type: 'electric', wiki: 'Gibson_SG' },
  { id: 'gibson-sg-special',         brand: 'Gibson',       name: 'SG Special',                  type: 'electric', wiki: 'Gibson_SG' },
  { id: 'gibson-es335',              brand: 'Gibson',       name: 'ES-335',                      type: 'electric', wiki: 'Gibson_ES-335' },
  { id: 'gibson-es339',              brand: 'Gibson',       name: 'ES-339',                      type: 'electric', wiki: 'Gibson_ES-335' },
  { id: 'gibson-es175',              brand: 'Gibson',       name: 'ES-175',                      type: 'electric', wiki: 'Gibson_ES-175' },
  { id: 'gibson-flying-v',           brand: 'Gibson',       name: 'Flying V',                    type: 'electric', wiki: 'Gibson_Flying_V' },
  { id: 'gibson-explorer',           brand: 'Gibson',       name: 'Explorer',                    type: 'electric', wiki: 'Gibson_Explorer' },

  // ── PRS ───────────────────────────────────────────────────────────────────
  { id: 'prs-custom24',              brand: 'PRS',          name: 'Custom 24',                   type: 'electric', wiki: 'Paul_Reed_Smith_Guitars' },
  { id: 'prs-custom22',              brand: 'PRS',          name: 'Custom 22',                   type: 'electric', wiki: 'Paul_Reed_Smith_Guitars' },
  { id: 'prs-silver-sky',            brand: 'PRS',          name: 'Silver Sky',                  type: 'electric', wiki: 'Paul_Reed_Smith_Silver_Sky' },
  { id: 'prs-se-custom24',           brand: 'PRS',          name: 'SE Custom 24',                type: 'electric', wiki: 'Paul_Reed_Smith_Guitars' },
  { id: 'prs-ce24',                  brand: 'PRS',          name: 'CE 24',                       type: 'electric', wiki: 'Paul_Reed_Smith_Guitars' },

  // ── Gretsch ───────────────────────────────────────────────────────────────
  { id: 'gretsch-6120',              brand: 'Gretsch',      name: 'G6120 Chet Atkins',           type: 'electric', wiki: 'Gretsch' },
  { id: 'gretsch-white-falcon',      brand: 'Gretsch',      name: 'White Falcon',                type: 'electric', wiki: 'Gretsch' },
  { id: 'gretsch-5420t',             brand: 'Gretsch',      name: 'G5420T Electromatic',         type: 'electric', wiki: 'Gretsch' },
  { id: 'gretsch-jets',              brand: 'Gretsch',      name: 'Jet Firebird',                type: 'electric', wiki: 'Gretsch' },

  // ── Rickenbacker ──────────────────────────────────────────────────────────
  { id: 'rick-360',                  brand: 'Rickenbacker', name: '360',                         type: 'electric', wiki: 'Rickenbacker_guitar' },
  { id: 'rick-330',                  brand: 'Rickenbacker', name: '330',                         type: 'electric', wiki: 'Rickenbacker_guitar' },
  { id: 'rick-620',                  brand: 'Rickenbacker', name: '620',                         type: 'electric', wiki: 'Rickenbacker_guitar' },

  // ── Ibanez ────────────────────────────────────────────────────────────────
  { id: 'ibanez-rg',                 brand: 'Ibanez',       name: 'RG Series',                   type: 'electric', wiki: 'Ibanez_RG' },
  { id: 'ibanez-az',                 brand: 'Ibanez',       name: 'AZ Series',                   type: 'electric', wiki: 'Ibanez' },
  { id: 'ibanez-jm',                 brand: 'Ibanez',       name: 'JM Series',                   type: 'electric', wiki: 'Ibanez' },
  { id: 'ibanez-artcore',            brand: 'Ibanez',       name: 'Artcore AS93',                type: 'electric', wiki: 'Ibanez' },
  { id: 'ibanez-s-series',           brand: 'Ibanez',       name: 'S Series',                    type: 'electric', wiki: 'Ibanez_S_series' },

  // ── Other Electric ────────────────────────────────────────────────────────
  { id: 'schecter-c1',               brand: 'Schecter',     name: 'C-1 Hellraiser',              type: 'electric', wiki: 'Schecter_Guitar_Research' },
  { id: 'esp-ec1000',                brand: 'ESP',          name: 'LTD EC-1000',                 type: 'electric', wiki: 'ESP_Guitars' },
  { id: 'epiphone-lp',               brand: 'Epiphone',     name: 'Les Paul Standard',           type: 'electric', wiki: 'Epiphone' },
  { id: 'epiphone-casino',           brand: 'Epiphone',     name: 'Casino',                      type: 'electric', wiki: 'Epiphone_Casino' },
  { id: 'musicman-luke',             brand: 'Music Man',    name: 'Luke',                        type: 'electric', wiki: 'Music_Man_(guitar)' },
  { id: 'musicman-majesty',          brand: 'Music Man',    name: 'Majesty',                     type: 'electric', wiki: 'Music_Man_(guitar)' },
  { id: 'suhr-modern',               brand: 'Suhr',         name: 'Modern',                      type: 'electric', wiki: 'Suhr_Guitars' },
  { id: 'suhr-classic-t',            brand: 'Suhr',         name: 'Classic T',                   type: 'electric', wiki: 'Suhr_Guitars' },
  { id: 'g-l-asat',                  brand: 'G&L',          name: 'ASAT Classic',                type: 'electric', wiki: 'G%26L_Musical_Instruments' },
  { id: 'g-l-legacy',                brand: 'G&L',          name: 'Legacy',                      type: 'electric', wiki: 'G%26L_Musical_Instruments' },
  { id: 'danelectro-59',             brand: 'Danelectro',   name: '59 Original',                 type: 'electric', wiki: 'Danelectro' },
  { id: 'reverend-charger',          brand: 'Reverend',     name: 'Charger 390',                 type: 'electric', wiki: 'Reverend_Guitars' },
  { id: 'telecaster-custom',         brand: 'Fender',       name: 'Telecaster Custom',           type: 'electric', wiki: 'Fender_Telecaster' },

  // ── Bass ──────────────────────────────────────────────────────────────────
  { id: 'fender-pbass',              brand: 'Fender',       name: 'Precision Bass',              type: 'bass',     wiki: 'Fender_Precision_Bass' },
  { id: 'fender-jbass',              brand: 'Fender',       name: 'Jazz Bass',                   type: 'bass',     wiki: 'Fender_Jazz_Bass' },
  { id: 'fender-jbass-mij',          brand: 'Fender',       name: 'Jazz Bass (MIJ)',              type: 'bass',     wiki: 'Fender_Jazz_Bass' },
  { id: 'gibson-thunderbird',        brand: 'Gibson',       name: 'Thunderbird Bass',            type: 'bass',     wiki: 'Gibson_Thunderbird' },
  { id: 'rick-4003',                 brand: 'Rickenbacker', name: '4003 Bass',                   type: 'bass',     wiki: 'Rickenbacker_4001' },
  { id: 'musicman-stingray',         brand: 'Music Man',    name: 'StingRay',                    type: 'bass',     wiki: 'Music_Man_StingRay' },
  { id: 'musicman-stingray5',        brand: 'Music Man',    name: 'StingRay 5',                  type: 'bass',     wiki: 'Music_Man_StingRay' },
  { id: 'warwick-corvette',          brand: 'Warwick',      name: 'Corvette',                    type: 'bass',     wiki: 'Warwick_bass_guitars' },
  { id: 'warwick-streamer',          brand: 'Warwick',      name: 'Streamer Stage I',            type: 'bass',     wiki: 'Warwick_bass_guitars' },
  { id: 'hofner-500',                brand: 'Höfner',       name: '500/1 Violin Bass',           type: 'bass',     wiki: 'H%C3%B6fner_500/1' },

  // ── Acoustic ──────────────────────────────────────────────────────────────
  { id: 'martin-d28',                brand: 'Martin',       name: 'D-28',                        type: 'acoustic', wiki: 'Martin_D-28' },
  { id: 'martin-000-15m',            brand: 'Martin',       name: '000-15M',                     type: 'acoustic', wiki: 'C._F._Martin_%26_Company' },
  { id: 'taylor-314ce',              brand: 'Taylor',       name: '314ce',                       type: 'acoustic', wiki: 'Taylor_Guitars' },
  { id: 'taylor-gs-mini',            brand: 'Taylor',       name: 'GS Mini',                     type: 'acoustic', wiki: 'Taylor_Guitars' },
  { id: 'taylor-214ce',              brand: 'Taylor',       name: '214ce',                       type: 'acoustic', wiki: 'Taylor_Guitars' },
  { id: 'gibson-j45',                brand: 'Gibson',       name: 'J-45',                        type: 'acoustic', wiki: 'Gibson_J-45' },
  { id: 'gibson-j200',               brand: 'Gibson',       name: 'J-200',                       type: 'acoustic', wiki: 'Gibson_J-200' },
  { id: 'guild-d55',                 brand: 'Guild',        name: 'D-55',                        type: 'acoustic', wiki: 'Guild_Guitars' },
]

export const POPULAR_AMPS = [
  // ── Fender ────────────────────────────────────────────────────────────────
  { id: 'fender-twin',      brand: 'Fender',      name: 'Twin Reverb',             wiki: 'Fender_Twin' },
  { id: 'fender-deluxe',    brand: 'Fender',      name: 'Deluxe Reverb',           wiki: 'Fender_Deluxe_Reverb' },
  { id: 'fender-blues-jr',  brand: 'Fender',      name: 'Blues Junior',            wiki: 'Fender_Blues_Junior' },
  { id: 'fender-princeton', brand: 'Fender',      name: 'Princeton Reverb',        wiki: 'Fender_Princeton' },
  { id: 'fender-super',     brand: 'Fender',      name: 'Super Reverb',            wiki: 'Fender_Super_Reverb' },
  // ── Marshall ──────────────────────────────────────────────────────────────
  { id: 'marshall-plexi',   brand: 'Marshall',    name: 'JTM45 / Plexi',           wiki: 'Marshall_JTM45' },
  { id: 'marshall-jcm800',  brand: 'Marshall',    name: 'JCM800',                  wiki: 'Marshall_JCM800' },
  { id: 'marshall-jcm2000', brand: 'Marshall',    name: 'JCM2000 DSL',             wiki: 'Marshall_Amplification' },
  { id: 'marshall-dsl',     brand: 'Marshall',    name: 'DSL40CR',                 wiki: 'Marshall_Amplification' },
  { id: 'marshall-origin',  brand: 'Marshall',    name: 'Origin 20',               wiki: 'Marshall_Amplification' },
  // ── Vox ───────────────────────────────────────────────────────────────────
  { id: 'vox-ac30',         brand: 'Vox',         name: 'AC30',                    wiki: 'Vox_AC30' },
  { id: 'vox-ac15',         brand: 'Vox',         name: 'AC15',                    wiki: 'Vox_AC15' },
  { id: 'vox-ac4',          brand: 'Vox',         name: 'AC4',                     wiki: 'Vox_amplifiers' },
  // ── Orange ────────────────────────────────────────────────────────────────
  { id: 'orange-rockerverb',brand: 'Orange',      name: 'Rockerverb 50',           wiki: 'Orange_amplifiers' },
  { id: 'orange-tt',        brand: 'Orange',      name: 'Tiny Terror',             wiki: 'Orange_amplifiers' },
  { id: 'orange-or15',      brand: 'Orange',      name: 'OR15',                    wiki: 'Orange_amplifiers' },
  // ── Mesa Boogie ───────────────────────────────────────────────────────────
  { id: 'mesa-rectifier',   brand: 'Mesa Boogie', name: 'Dual Rectifier',          wiki: 'Mesa_Boogie' },
  { id: 'mesa-markv',       brand: 'Mesa Boogie', name: 'Mark V',                  wiki: 'Mesa_Boogie' },
  { id: 'mesa-mark-iv',     brand: 'Mesa Boogie', name: 'Mark IV',                 wiki: 'Mesa_Boogie' },
  { id: 'mesa-fillmore',    brand: 'Mesa Boogie', name: 'Fillmore 25',             wiki: 'Mesa_Boogie' },
  // ── Other ─────────────────────────────────────────────────────────────────
  { id: 'blackstar-ht5',    brand: 'Blackstar',   name: 'HT-5',                    wiki: 'Blackstar_Amplification' },
  { id: 'blackstar-ht20',   brand: 'Blackstar',   name: 'HT-20R MkII',             wiki: 'Blackstar_Amplification' },
  { id: 'roland-jc120',     brand: 'Roland',      name: 'JC-120 Jazz Chorus',      wiki: 'Roland_Jazz_Chorus' },
  { id: 'peavey-5150',      brand: 'Peavey',      name: '5150',                    wiki: 'Peavey_5150' },
  { id: 'dr-z-maz',         brand: 'Dr. Z',       name: 'MAZ 18 Jr',               wiki: 'Dr._Z_Amplification' },
  { id: 'hiwatt-dr103',     brand: 'Hiwatt',      name: 'DR103',                   wiki: 'Hiwatt' },
  { id: 'laney-lionheart',  brand: 'Laney',       name: 'Lionheart L20H',          wiki: 'Laney_Amplification' },
  { id: 'bad-cat-cub',      brand: 'Bad Cat',     name: 'Cub III',                 wiki: 'Bad_Cat_Amplifiers' },
  { id: 'two-rock-custom',  brand: 'Two-Rock',    name: 'Custom Reverb Sig.',      wiki: 'Two-Rock_Amplifiers' },
  // ── Amp sim / Ampless ─────────────────────────────────────────────────────
  { id: 'fractal-fm3',      brand: 'Fractal',     name: 'FM3',                     wiki: 'Fractal_Audio_Systems',   isAmpless: true },
  { id: 'fractal-fm9',      brand: 'Fractal',     name: 'FM9',                     wiki: 'Fractal_Audio_Systems',   isAmpless: true },
  { id: 'neural-quad',      brand: 'Neural DSP',  name: 'Quad Cortex',             wiki: 'Neural_DSP_Technologies', isAmpless: true },
  { id: 'line6-helix',      brand: 'Line 6',      name: 'Helix',                   wiki: 'Line_6_Helix',            isAmpless: true },
  { id: 'line6-hx-stomp',   brand: 'Line 6',      name: 'HX Stomp',                wiki: 'Line_6_Helix',            isAmpless: true },
  { id: 'kemper-profiler',  brand: 'Kemper',      name: 'Profiler',                wiki: 'Kemper_Profiler',         isAmpless: true },
  { id: 'strymon-iridium',  brand: 'Strymon',     name: 'Iridium',                 wiki: 'Strymon',                 isAmpless: true },
  { id: 'boss-ir2',         brand: 'Boss',        name: 'IR-2 Amp & Cabinet',      wiki: 'Boss_Corporation',        isAmpless: true },
  { id: 'ampless-di',       brand: '',            name: 'Ampless / Direct (DI)',   wiki: null,                      isAmpless: true },
]
