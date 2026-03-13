/**
 * Comprehensive MIDI database for guitar effects pedals.
 * Instructions are tailored to the Morningstar MC6 Pro MIDI controller.
 *
 * Structure per entry:
 *   hasMidi       – whether the pedal/brand supports MIDI
 *   connection    – physical MIDI connection type
 *   channelSetup  – how to set the MIDI receive channel on the pedal
 *   presetInfo    – how presets work on the pedal
 *   savingPreset  – step-by-step: dial a sound and save it to a preset slot
 *   mc6ProSetup   – step-by-step: configure MC6 Pro to recall that preset
 *   pcRange       – valid PC number range
 *   ccNotes       – notable CC assignments (optional)
 *   notes         – extra accuracy tips / caveats
 */

// ─── Brand-level entries ─────────────────────────────────────────────────────

const brandDb = {

  // ── STRYMON ──────────────────────────────────────────────────────────────
  'Strymon': {
    hasMidi: true,
    connection:
      'Newer pedals (Iridium, Cloudburst, BigSky MX, El Capistan v2, Flint v2, Deco v2, Zelzah, Nightsky, Volante, Dig v2): 3.5 mm TRS MIDI (Type A standard) — Tip = MIDI signal. ' +
      'Older flagships (BigSky v1, Timeline, El Capistan v1, Mobius, Lex, Brigadier): 5-pin DIN MIDI In / MIDI Out / MIDI Thru on the rear panel.',
    channelSetup:
      'Hold the VALUE encoder while powering on to enter Global Settings. ' +
      'Rotate the encoder to navigate to "MIDI CH" and select channel 1–16. Press the encoder to confirm, then reboot.',
    presetInfo:
      'Strymon pedals store 100–300 presets depending on the model, organised into Banks (A–Z on older units) or numbered banks on newer units. ' +
      'MIDI PC numbers are 0-indexed: PC 0 = Preset 1, PC 1 = Preset 2, etc.',
    savingPreset: [
      'Dial in your desired tone using the knobs and footswitches.',
      'On older units (BigSky, Timeline, El Capistan, Mobius): hold footswitch B until the display flashes, rotate the VALUE encoder to choose a preset slot, then press footswitch B again to confirm.',
      'On newer units (Iridium, Cloudburst, BigSky MX, etc.): hold the right footswitch until the display prompts "SAVE", turn the encoder to select the slot, then press the encoder or footswitch to confirm.',
      'The preset is now stored and will respond to its corresponding MIDI PC number.',
    ],
    mc6ProSetup: [
      'Physically connect: MC6 Pro MIDI Out → Strymon MIDI In. For TRS-MIDI pedals use a 5-pin DIN female to 3.5 mm TRS Type A cable (e.g. Disaster Area TRS cable or Strymon MIDI EXP cable). For 5-pin DIN units use a standard MIDI cable.',
      'On the Strymon, enter Global Settings (hold VALUE on boot) and confirm the MIDI channel (e.g. channel 1).',
      'Open the Morningstar Editor at editor.morningstar.io (or use the MC6 Pro\'s physical controls: long-press any footswitch to enter Edit mode).',
      'Select the Bank and Preset you want to assign, then choose a footswitch (A–F).',
      'Press "+ Add Message" and set: Message Type = PC (Program Change).',
      'Set PC Number = [your saved preset slot − 1]. Example: to recall Preset 3, set PC = 2.',
      'Set MIDI Channel = [the channel configured on your Strymon, e.g. 1].',
      'Set the Action to "Press" (triggers on footswitch press).',
      'Save the MC6 Pro preset. The LED colour can be configured for visual feedback.',
    ],
    pcRange: '0–127 (maps to preset slots 1–128). Most Strymon pedals have more preset slots addressable via bank-select CC.',
    ccNotes:
      'CC 102 (value 0) = Tap Tempo. CC 103 = Bypass toggle. CC 137–141 control expression on many models. ' +
      'Refer to the specific pedal\'s MIDI Implementation Chart in its manual for the full CC map.',
    notes:
      'The Strymon Conduit adds full MIDI routing, conversion (TRS↔DIN), and USB-MIDI. ' +
      'PC numbers shown in Strymon\'s display are 1-indexed; MIDI always uses 0-indexed numbers. ' +
      'Some models (Iridium, BigSky MX) support Bank Select (CC 0 + CC 32) to access all preset banks over MIDI.',
  },

  // ── CHASE BLISS AUDIO ────────────────────────────────────────────────────
  'Chase Bliss': {
    hasMidi: true,
    connection:
      '3.5 mm TRS MIDI (Type A) via the "EXP / MIDI" input jack on the pedal. ' +
      'Use a 5-pin DIN female to 3.5 mm TRS Type A cable to connect from the MC6 Pro\'s 5-pin MIDI Out.',
    channelSetup:
      'Open the bottom panel to access the internal DIP switches. ' +
      'Switches 1–4 set the MIDI receive channel (binary: SW1=1, SW2=2, SW3=4, SW4=8). ' +
      'Example: channel 3 = SW1 ON, SW2 ON, SW3 OFF, SW4 OFF. Refer to your pedal\'s manual for the exact DIP layout.',
    presetInfo:
      'Each unique MIDI channel the DIP switches are set to corresponds to one saved state (preset). ' +
      'Newer models (Blooper, Habit, Generation Loss MKII, Preamp MKII) support up to 127 presets via PC messages on a single fixed channel.',
    savingPreset: [
      'Set the DIP switches inside the pedal to the desired MIDI channel for this preset (this determines which PC number recalls it).',
      'Dial in your tone — set all knobs, toggle switches, and ramp settings to the desired position.',
      'Hold both footswitches simultaneously. The status LED will blink to confirm the preset has been saved.',
      'Repeat with different DIP switch positions to save additional presets to other MIDI channels.',
      'On newer models (Blooper, Habit): the pedal stores presets internally; consult the manual for the save gesture specific to that model.',
    ],
    mc6ProSetup: [
      'Set the MIDI channel on the Chase Bliss pedal via internal DIP switches (see Channel Setup above).',
      'Connect: MC6 Pro MIDI Out → Chase Bliss EXP/MIDI jack (3.5 mm TRS Type A adapter required).',
      'In the Morningstar Editor, open your desired Bank/Preset and select a footswitch.',
      'Add a message: Message Type = PC, PC Number = 0 (for standard DIP-switch models, PC 0 recalls the saved state on that channel).',
      'Set MIDI Channel = [the channel set by the DIP switches, e.g. 3].',
      'For newer models with full PC recall: set PC Number = [preset slot number, 0-indexed].',
      'Save the MC6 Pro preset.',
    ],
    pcRange:
      '0 (recall saved preset on that MIDI channel) for classic DIP-switch models. ' +
      '0–127 for newer models (Blooper, Habit, Generation Loss MKII) which map PC directly to preset slots.',
    ccNotes:
      'CC messages can control any knob parameter in real-time. ' +
      'CC 122 = All Notes Off (panic). ' +
      'Expression input and MIDI share the same jack — a splitter is needed to use both simultaneously.',
    notes:
      'Chase Bliss pedals use the EXP jack for MIDI; you cannot run an expression pedal at the same time without a TRS splitter/merger. ' +
      'Always update firmware — Chase Bliss regularly ships MIDI improvements. ' +
      'The "RAMP" feature stores auto-swell curves as part of the preset.',
  },

  // ── SOURCE AUDIO ─────────────────────────────────────────────────────────
  'Source Audio': {
    hasMidi: true,
    connection:
      '3.5 mm TRS MIDI (Type A) jack on the pedal (labeled "MIDI" or "EXP/MIDI" depending on model). ' +
      'Some models (Collider, Ventris, Nemesis) also have a full-size 3.5 mm stereo jack labeled "CONTROL" which accepts MIDI via the Neuro Hub.',
    channelSetup:
      'Use the free Neuro app (iOS / Android / Windows / Mac) connected via USB or Bluetooth. ' +
      'Navigate to Pedal Settings → MIDI → MIDI Channel. Alternatively, some pedals allow channel selection via a tap sequence on the footswitches — consult your pedal\'s Quick Start Guide.',
    presetInfo:
      'Source Audio pedals store up to 128 presets (accessible via PC 0–127). ' +
      'Presets are created and named in the Neuro app and written to the pedal\'s internal memory.',
    savingPreset: [
      'Connect the pedal to a phone or computer running the free Source Audio Neuro app via the USB port.',
      'In the Neuro app, dial in your sound using the on-screen controls (or adjust the physical knobs — the app mirrors them in real time).',
      'Tap the Save icon (floppy disk) in the Neuro app.',
      'Name the preset and assign it to a numbered slot (0–127).',
      'Tap "Send to Pedal". The preset is now stored and addressable via MIDI PC.',
    ],
    mc6ProSetup: [
      'Create and save presets to numbered slots in the Neuro app (see Saving a Preset above).',
      'Set the pedal\'s MIDI receive channel in the Neuro app: Pedal Settings → MIDI → MIDI Channel.',
      'Connect: MC6 Pro MIDI Out → Source Audio 3.5 mm MIDI In (TRS Type A adapter required).',
      'In the Morningstar Editor, select your Bank/Preset and a footswitch.',
      'Add a message: Message Type = PC.',
      'Set PC Number = [the slot number you assigned in the Neuro app, 0-indexed].',
      'Set MIDI Channel = [the channel configured in the Neuro app].',
      'Save the MC6 Pro preset.',
    ],
    pcRange: '0–127',
    ccNotes:
      'Source Audio pedals have extensive CC control. ' +
      'CC 0 (value 127) = Preset Bank MSB, CC 32 = Bank LSB for banks beyond 128 presets. ' +
      'Individual parameter CCs are documented in the full MIDI Implementation Chart in the pedal\'s manual.',
    notes:
      'The Neuro app is essential for creating and managing presets. ' +
      'Source Audio pedals support MIDI over USB too, so the MC6 Pro can optionally route MIDI through a computer running the Neuro app.',
  },

  // ── WALRUS AUDIO ─────────────────────────────────────────────────────────
  'Walrus Audio': {
    hasMidi: true,
    connection:
      'MAKO Series (ACS1, ACS1 MKII, D1, D1 MKII, M1, M1 MKII, R1, R1 MK2): dedicated 3.5 mm TRS MIDI In and MIDI Out jacks (Type A standard). ' +
      'Older Walrus pedals (Slö, Lore, Julianna, Julia V2, Fathom, Ages, Eras, Monument V2, etc.) use 3.5 mm TRS Type A for MIDI. ' +
      'Some Walrus power supplies (Canvas) pass MIDI over a proprietary connector — not standard MIDI.',
    channelSetup:
      'MAKO Series: hold both footswitches simultaneously to enter the Settings menu. Navigate to "MIDI" → "MIDI Channel" and select 1–16. ' +
      'Older Walrus pedals: hold the preset footswitch and power on, or consult the specific pedal\'s manual for MIDI channel selection.',
    presetInfo:
      'MAKO ACS1 stores up to 175 presets. D1, M1, R1 store up to 100 presets each. ' +
      'Other MIDI-enabled Walrus pedals (Slö, Lore, etc.) store 128 presets. ' +
      'PC numbers are 0-indexed: PC 0 = Preset 1.',
    savingPreset: [
      'Dial in your desired tone.',
      'MAKO Series: hold the preset footswitch until the display shows a slot list, turn the encoder to select a slot, then press the encoder to save.',
      'Older Walrus pedals: long-press the Save/Write footswitch. The preset LED will flash to confirm. Consult your model\'s manual for the exact gesture.',
      'The preset is now stored and will respond to its MIDI PC number.',
    ],
    mc6ProSetup: [
      'Connect: MC6 Pro MIDI Out (5-pin DIN) → 5-pin to 3.5 mm TRS Type A adapter → Walrus Audio MIDI In (3.5 mm TRS).',
      'On the pedal, enter Settings to confirm the MIDI channel (see Channel Setup).',
      'In the Morningstar Editor, select your Bank/Preset and footswitch.',
      'Add message: Message Type = PC.',
      'Set PC Number = [preset slot − 1]. Example: to recall slot 5, set PC = 4.',
      'Set MIDI Channel = [the channel set on the Walrus pedal].',
      'Save the MC6 Pro preset.',
    ],
    pcRange: '0–127 (MAKO Series); 0–127 (MIDI-enabled Walrus pedals)',
    ccNotes:
      'MAKO Series supports CC for per-parameter control (knob values, bypass, tempo). ' +
      'CC 102 = Bypass toggle on many models. Full CC map is in the MAKO Series MIDI Implementation document on Walrus Audio\'s website.',
    notes:
      'Always check for the latest firmware — Walrus Audio regularly adds MIDI features via firmware updates. ' +
      'Not all Walrus pedals have MIDI; the Iron Horse, Deep Six, Julia, and other analog-focused pedals do not have MIDI.',
  },

  // ── EVENTIDE ─────────────────────────────────────────────────────────────
  'Eventide': {
    hasMidi: true,
    connection:
      'H9 / H9 Core / H9 Max: 3.5 mm TRS MIDI In (Type A) on the side panel. ' +
      'H90: 3.5 mm TRS MIDI In (Type A) AND 5-pin DIN MIDI In/Out on the rear.',
    channelSetup:
      'H9: Use the free H9 Control app (iOS / Mac / Windows) → MIDI Settings → MIDI Receive Channel. ' +
      'H90: Press the System button → navigate to MIDI → Set Receive Channel.',
    presetInfo:
      'H9 stores up to 99 user presets plus 99 factory presets (total 198, addressable via PC). ' +
      'H90 stores up to 500 Programs (dual-algorithm preset chains). ' +
      'PC numbers are 0-indexed on the H9; H90 follows Program numbering starting at 0.',
    savingPreset: [
      'H9: Dial in your sound using the knob and the H9 Control app.',
      'In H9 Control: tap "Save" (or press the knob on the pedal until "Save" appears) → name the preset → assign it to a slot number (1–99).',
      'H90: Adjust the two algorithm blocks to taste. Press the PROGRAM button → hold it to open Save → name the Program and select a slot.',
      'Note the slot number — you will use [slot − 1] as the PC number.',
    ],
    mc6ProSetup: [
      'H9: Connect MC6 Pro MIDI Out → H9 3.5 mm MIDI In (Type A adapter from 5-pin to 3.5 mm TRS).',
      'H90: Connect MC6 Pro MIDI Out → H90 MIDI In (5-pin DIN or 3.5 mm TRS Type A).',
      'Set the MIDI receive channel on the Eventide (see Channel Setup).',
      'In the Morningstar Editor, select your Bank/Preset and footswitch.',
      'Add message: Message Type = PC.',
      'Set PC Number = [preset slot − 1].',
      'Set MIDI Channel = [the Eventide\'s receive channel].',
      'Save the MC6 Pro preset.',
    ],
    pcRange: 'H9: 0–98 (maps to user presets 1–99). H90: 0–499.',
    ccNotes:
      'H9: CC 43 = Bypass toggle; CC 71–79 map to the 9 algorithm parameters. ' +
      'H90: extensive CC mapping — consult the H90 MIDI Implementation Chart on Eventide\'s support page.',
    notes:
      'H9 Control app (iOS/Mac/Windows) is essential for preset management and deep MIDI configuration. ' +
      'H90 supports two simultaneous algorithms; you can set independent MIDI channels for each "routing slot".',
  },

  // ── UNIVERSAL AUDIO (UAFX) ───────────────────────────────────────────────
  'Universal Audio': {
    hasMidi: true,
    connection:
      '3.5 mm TRS MIDI In (Type A) — added via firmware update on all UAFX pedals (Astra, Starlight, Dream \'65, Golden Age, Ruby, Heavenly, Evermore, Del-Verb, Galaxy, OX Stomp, Woodrow, Lion, Orion, etc.). ' +
      'Ensure firmware is updated to the latest version; early firmware versions did not include MIDI support.',
    channelSetup:
      'Open the UAFX Control app (iOS / Android) → connect to pedal via Bluetooth → Pedal Settings → MIDI → MIDI Receive Channel. ' +
      'Alternatively: hold the right footswitch while powering on to access onboard MIDI channel setup.',
    presetInfo:
      'Each UAFX pedal stores up to 128 presets, managed and named in the UAFX Control app. ' +
      'Presets are sent to specific numbered slots and recalled via PC.',
    savingPreset: [
      'Connect the pedal to your phone via Bluetooth and open the UAFX Control app.',
      'Dial in your sound using the app\'s on-screen controls or the physical knobs (app mirrors the pedal).',
      'Tap the Save icon in the app → name the preset → assign it to a numbered slot (0–127).',
      'Tap "Save to Pedal". The preset is written to onboard memory.',
    ],
    mc6ProSetup: [
      'Update the UAFX pedal firmware to the latest version using the UAFX Control app.',
      'In the UAFX Control app: Pedal Settings → MIDI → enable MIDI → set MIDI Receive Channel (e.g. channel 1).',
      'Connect: MC6 Pro MIDI Out (5-pin DIN) → 5-pin to 3.5 mm TRS Type A cable → UAFX MIDI In (3.5 mm TRS).',
      'In the Morningstar Editor, select your Bank/Preset and footswitch.',
      'Add message: Message Type = PC.',
      'Set PC Number = [the slot number you saved the preset to in the UAFX app, 0-indexed].',
      'Set MIDI Channel = [the receive channel set in the UAFX app].',
      'Save the MC6 Pro preset.',
    ],
    pcRange: '0–127',
    ccNotes:
      'UAFX pedals support CC for per-knob parameter control. ' +
      'CC 64 = Bypass toggle on most UAFX pedals. Full CC map is in the UAFX Control app under MIDI Implementation.',
    notes:
      'MIDI is only available on UAFX pedals with updated firmware — check the UAFX Control app for firmware version. ' +
      'Presets must be created in the UAFX Control app before they can be recalled via MIDI.',
  },

  // ── BOSS ─────────────────────────────────────────────────────────────────
  'Boss': {
    hasMidi: true,
    connection:
      'BOSS 200-series (DD-200, MD-200, RV-200, OD-200, SY-200): 3.5 mm TRS MIDI In/Out (Type A). ' +
      'BOSS 500-series (DD-500, MD-500, RV-500, OC-5, SY-300) and GX-100: 5-pin DIN MIDI In/Out. ' +
      'RC-500: 3.5 mm TRS MIDI (Type A).',
    channelSetup:
      'Hold both footswitches simultaneously on boot to enter System mode. Navigate to "MIDI CH" and set 1–16. ' +
      'On some models: hold the right footswitch alone to access System/Settings menu.',
    presetInfo:
      'BOSS 200-series: 99 memories (presets). BOSS 500-series: 99–200 memories depending on model. ' +
      'PC numbers are generally 0-indexed (PC 0 = Memory 1), but some BOSS models use 1-indexed PC — check your specific model\'s manual.',
    savingPreset: [
      'Dial in your desired tone.',
      '200-series: hold the right footswitch until "WRITE" appears on the display. Turn the knob to select a memory number (1–99). Press the right footswitch again to confirm.',
      '500-series: press the WRITE button → select destination memory → press WRITE again to confirm.',
      'Note the memory number — use [memory number − 1] as the PC number (for 0-indexed models).',
    ],
    mc6ProSetup: [
      '200-series: Connect MC6 Pro MIDI Out → 5-pin to 3.5 mm TRS Type A adapter → BOSS MIDI In (3.5 mm).',
      '500-series / GX-100: Connect MC6 Pro MIDI Out → BOSS MIDI In (5-pin DIN cable).',
      'Enter System mode on the BOSS pedal and set the MIDI receive channel.',
      'In the Morningstar Editor, select your Bank/Preset and footswitch.',
      'Add message: Message Type = PC.',
      'Set PC Number = [memory number − 1] for 0-indexed models, or [memory number] for 1-indexed — check the manual.',
      'Set MIDI Channel = [the channel set on the BOSS pedal].',
      'Save the MC6 Pro preset.',
    ],
    pcRange: '0–98 (200-series, 99 memories); 0–127 or 0–199 depending on model.',
    ccNotes:
      'BOSS pedals typically support CC for bypass (CC 80 on many units), tap tempo (CC 64), and per-parameter control. ' +
      'Full CC implementation charts are available in each model\'s manual PDF on boss.info.',
    notes:
      'BOSS 200-series TRS MIDI is Type A standard. Some older BOSS devices (GT-10, GS-10) use non-standard pinouts — always confirm before connecting. ' +
      'The GX-100 supports full MIDI control of every block parameter via CC.',
  },

  // ── MERIS ────────────────────────────────────────────────────────────────
  'Meris': {
    hasMidi: true,
    connection:
      '3.5 mm TRS MIDI (Type A) via the "EXP" jack on all Meris pedals (Mercury7, Polymoon, Enzo, Enzo X, Hedra, LVX, Ottobit Jr., Polybeam). ' +
      'Important: the EXP jack is shared between expression pedal and MIDI — you cannot use both simultaneously without a TRS splitter.',
    channelSetup:
      'Enter Alt mode: hold the left footswitch and turn the leftmost knob. ' +
      'Refer to the specific pedal\'s manual for the exact Alt-mode control that sets MIDI channel (it varies per pedal model). ' +
      'LVX: MIDI channel is set via the LVX app or the onboard encoder.',
    presetInfo:
      'Mercury7, Polymoon, Enzo, Hedra: 16 preset slots (PC 0–15). ' +
      'LVX: 128 preset slots (PC 0–127). ' +
      'Ottobit Jr., Polybeam: 16 presets.',
    savingPreset: [
      'Dial in your desired tone.',
      'Mercury7 / Polymoon / Enzo / Hedra: hold both footswitches simultaneously until the status LED flashes. The current state is saved to the current preset slot.',
      'To save to a different slot, first recall that slot via PC, then hold both footswitches to overwrite it with your new settings.',
      'LVX: press the SAVE button in the LVX app or use the onboard encoder → save to a numbered slot (0–127).',
    ],
    mc6ProSetup: [
      'Set the MIDI channel on the Meris pedal via Alt mode (see Channel Setup).',
      'Connect: MC6 Pro MIDI Out (5-pin) → 5-pin to 3.5 mm TRS Type A cable → Meris EXP jack.',
      'Note: you cannot use an expression pedal at the same time unless you use a TRS MIDI splitter (e.g. Meris MIDI I/O).',
      'In the Morningstar Editor, select your Bank/Preset and footswitch.',
      'Add message: Message Type = PC.',
      'Set PC Number = [preset slot, 0-indexed; 0–15 for most Meris pedals; 0–127 for LVX].',
      'Set MIDI Channel = [the channel configured on the Meris pedal].',
      'Save the MC6 Pro preset.',
    ],
    pcRange: '0–15 (Mercury7, Polymoon, Enzo, Hedra); 0–127 (LVX)',
    ccNotes:
      'Every knob and toggle on Meris pedals maps to a specific CC number. ' +
      'Mercury7: CC 0 = Decay, CC 1 = Mix, CC 4 = Pre-Delay, CC 5 = ModSpeed, etc. ' +
      'Full CC maps are in each pedal\'s MIDI Implementation PDF on meris.us.',
    notes:
      'The Meris MIDI I/O accessory ($49) splits the EXP jack so you can use expression and MIDI simultaneously. ' +
      'Meris also offers a dedicated TRS-to-MIDI breakout box.',
  },

  // ── EMPRESS EFFECTS ──────────────────────────────────────────────────────
  'Empress': {
    hasMidi: true,
    connection:
      'ZOIA, Echosystem, Reverb, Tape Delay, Tremolo2, Compressor MKII, Buffer+: 3.5 mm TRS MIDI (Type A). ' +
      'ZOIA Euroburo: Eurorack CV gate (not standard MIDI over TRS).',
    channelSetup:
      'ZOIA: System → MIDI Settings → MIDI Channel. ' +
      'Echosystem / Reverb / Tape Delay: hold both footswitches to enter Utility menu → MIDI Channel → set 1–16.',
    presetInfo:
      'ZOIA: 64 patch slots (PC 0–63). Each patch is a complete programmable signal chain. ' +
      'Echosystem / Reverb / Tape Delay: 128 presets (PC 0–127).',
    savingPreset: [
      'Dial in your sound (or build a patch on ZOIA).',
      'ZOIA: navigate to the Patch Library on the touchscreen → tap Save → name and assign to a slot (0–63).',
      'Echosystem / Reverb: hold the right footswitch until "SAVE" appears → select a destination slot → hold footswitch again to confirm.',
      'The preset/patch slot number is what you will reference via MIDI PC.',
    ],
    mc6ProSetup: [
      'Connect: MC6 Pro MIDI Out (5-pin) → 5-pin to 3.5 mm TRS Type A cable → Empress MIDI In.',
      'Set the MIDI channel on the Empress pedal (see Channel Setup).',
      'In the Morningstar Editor, select your Bank/Preset and footswitch.',
      'Add message: Message Type = PC.',
      'Set PC Number = [patch/preset slot, 0-indexed].',
      'Set MIDI Channel = [the Empress MIDI channel].',
      'Save the MC6 Pro preset.',
    ],
    pcRange: '0–63 (ZOIA); 0–127 (Echosystem, Reverb, Tape Delay)',
    ccNotes:
      'ZOIA: most module parameters are controllable via CC. ' +
      'Echosystem: CC 80 = Bypass toggle; CC 92 = Tap Tempo. Full CC charts in Empress manuals.',
    notes:
      'ZOIA patches often contain complex multi-effect signal chains — PC changes recall entire patch configurations. ' +
      'Empress firmware updates can add new MIDI features; check the Empress GitHub page for the latest.',
  },

  // ── LINE 6 ───────────────────────────────────────────────────────────────
  'Line 6': {
    hasMidi: true,
    connection:
      'HX Stomp / HX Stomp XL: 3.5 mm TRS MIDI In/Out (Type A). ' +
      'POD Go / POD Go Wireless: 3.5 mm TRS MIDI In (Type A). ' +
      'DL4 MkII: 3.5 mm TRS MIDI In/Out (Type A).',
    channelSetup:
      'HX Stomp: Global Settings (hold ☰ to access) → MIDI/Tempo → MIDI Base Channel. Default is channel 1. ' +
      'POD Go: Global Settings → MIDI → MIDI Channel. ' +
      'DL4 MkII: Global Settings → MIDI → MIDI Channel.',
    presetInfo:
      'HX Stomp: 128 presets per Setlist, 8 Setlists (total 1024 presets). Each preset can have up to 8 Snapshots. ' +
      'POD Go: 128 presets. ' +
      'DL4 MkII: 32 Memory slots (PC 0–31) across all delay types.',
    savingPreset: [
      'HX Stomp: dial in your signal chain → press the upper-right knob (labeled ⊙) to enter Save mode → name the preset → choose a destination slot → press Save.',
      'Alternatively use HX Edit app (free, Mac/Windows) to build and save presets visually.',
      'POD Go: press the joystick → save preset → choose slot.',
      'DL4 MkII: hold the Reverse footswitch to save current settings to an internal memory slot (follow display prompts).',
    ],
    mc6ProSetup: [
      'Connect: MC6 Pro MIDI Out (5-pin) → 5-pin to 3.5 mm TRS Type A cable → HX Stomp MIDI In (3.5 mm TRS).',
      'Set the MIDI base channel on HX Stomp in Global Settings.',
      'In the Morningstar Editor, select your Bank/Preset and footswitch.',
      'Add message: Message Type = PC.',
      'Set PC Number = [preset slot number within the Setlist, 0-indexed].',
      'Set MIDI Channel = [the HX Stomp base channel].',
      'Save the MC6 Pro preset.',
      'Tip: you can also add a CC 69 (value 0–7) message on the same footswitch to select a specific Snapshot within that preset.',
    ],
    pcRange: '0–127 (selects preset within the current Setlist)',
    ccNotes:
      'CC 69 (value 0–7) = Snapshot select within the current preset. ' +
      'CC 49 = Bypass individual blocks (block index encoded in value). ' +
      'Full MIDI reference at line6.com → HX Stomp MIDI Reference Guide (PDF).',
    notes:
      'HX Edit (free Mac/Windows app) is the most efficient way to build presets and configure MIDI. ' +
      'HX Stomp supports MIDI Clock In for syncing delay/modulation tempo.',
  },

  // ── HOLOGRAM ELECTRONICS ─────────────────────────────────────────────────
  'Hologram Electronics': {
    hasMidi: true,
    connection:
      'Microcosm: 3.5 mm TRS MIDI In (Type A) on the rear panel. ' +
      'Chroma Console: 3.5 mm TRS MIDI In (Type A). ' +
      'Dream Sequence: 3.5 mm TRS MIDI In (Type A). ' +
      'Infinite Jets: no MIDI (analog pedal).',
    channelSetup:
      'Microcosm: hold the A and B buttons simultaneously while powering on to enter MIDI Settings. Navigate to "MIDI CH" and set channel 1–16 using the encoder.',
    presetInfo:
      'Microcosm: 8 preset banks × 8 loops = 64 preset slots total. ' +
      'Chroma Console: 100 preset slots.',
    savingPreset: [
      'Microcosm: select your loop/effect combination, dial in the controls.',
      'Hold the footswitch until the display shows "SAVE" → select a bank (A–H) and slot (1–8) → press footswitch to confirm.',
      'Chroma Console: adjust controls → hold the Preset button → select a slot → release to save.',
    ],
    mc6ProSetup: [
      'Connect: MC6 Pro MIDI Out (5-pin) → 5-pin to 3.5 mm TRS Type A cable → Hologram MIDI In.',
      'Set the MIDI channel on the Hologram pedal (see Channel Setup).',
      'In the Morningstar Editor, select your Bank/Preset and footswitch.',
      'Add message: Message Type = PC.',
      'Set PC Number = [preset slot, 0-indexed. Microcosm: 0–63; Chroma Console: 0–99].',
      'Set MIDI Channel = [the Hologram\'s receive channel].',
      'Save the MC6 Pro preset.',
    ],
    pcRange: '0–63 (Microcosm); 0–99 (Chroma Console)',
    ccNotes:
      'Microcosm: CC 93 = Blend knob; CC 10 = Modify knob. Full CC list in Hologram\'s MIDI guide on their website.',
    notes:
      'Infinite Jets is an analog pedal and does not have MIDI. ' +
      'Hologram posts full MIDI implementation charts on their product pages at hologramelectronics.com.',
  },

  // ── GFI SYSTEM ───────────────────────────────────────────────────────────
  'GFI System': {
    hasMidi: true,
    connection: '3.5 mm TRS MIDI (Type A) In/Out on the rear panel.',
    channelSetup:
      'Hold both footswitches on boot to enter System/Setup menu → navigate to MIDI Channel → select 1–16.',
    presetInfo: '100 preset slots (PC 0–99) on most GFI System pedals.',
    savingPreset: [
      'Dial in your sound.',
      'Hold the right footswitch until the display shows save options.',
      'Select a destination slot (1–100) and confirm.',
    ],
    mc6ProSetup: [
      'Connect: MC6 Pro MIDI Out → 5-pin to 3.5 mm TRS Type A → GFI MIDI In.',
      'Set MIDI channel on GFI pedal.',
      'In Morningstar Editor: Message Type = PC, PC Number = [slot − 1], MIDI Channel = [GFI channel].',
      'Save.',
    ],
    pcRange: '0–99',
    notes: 'GFI System pedals are known for extensive MIDI implementation with full CC parameter control.',
  },

  // ── KEELEY ───────────────────────────────────────────────────────────────
  'Keeley': {
    hasMidi: true,
    connection:
      'Select Keeley pedals with MIDI (30ms Double Tracker, Halo, Compressor Pro, Omni Reverb, Bassist Limiting Amplifier): ' +
      '3.5 mm TRS MIDI (Type A) — check your specific model\'s spec sheet, as not all Keeley pedals have MIDI.',
    channelSetup:
      'Varies by model. Typically: hold the Save button while powering on to access MIDI Settings, then set the MIDI channel.',
    presetInfo: 'Typically 128 preset slots (PC 0–127) on MIDI-capable Keeley pedals.',
    savingPreset: [
      'Dial in your sound.',
      'Hold the Save button (or follow your specific model\'s save gesture) until the LED blinks.',
      'Select a slot number and confirm.',
    ],
    mc6ProSetup: [
      'Confirm your Keeley model has MIDI — check the spec sheet on keeleypedals.com.',
      'Connect: MC6 Pro MIDI Out → 5-pin to 3.5 mm TRS Type A → Keeley MIDI In.',
      'Set MIDI channel on the pedal.',
      'In Morningstar Editor: Message Type = PC, PC Number = [slot − 1], MIDI Channel = [Keeley channel].',
      'Save.',
    ],
    pcRange: '0–127',
    notes: 'Not all Keeley pedals have MIDI. Verify your specific model before purchasing a MIDI cable.',
  },

  // ── MERIS (alias) ─────────────────────────────────────────────────────────
  // (handled above under 'Meris')

  // ── RED PANDA ─────────────────────────────────────────────────────────────
  'Red Panda': {
    hasMidi: true,
    connection:
      'Particle v2, Context v2, Bitmap 2, Tensor: 3.5 mm TRS MIDI (Type A) In. ' +
      'Raster 2: 3.5 mm TRS MIDI In/Out.',
    channelSetup:
      'Hold the footswitch while powering on to enter Setup mode → navigate to MIDI Channel → set 1–16 using the encoder.',
    presetInfo: '128 preset slots on most Red Panda MIDI pedals (PC 0–127).',
    savingPreset: [
      'Dial in your sound.',
      'Long-press the encoder or preset footswitch until "SAVE" appears.',
      'Select a destination slot (0–127) and confirm.',
    ],
    mc6ProSetup: [
      'Connect: MC6 Pro MIDI Out → 5-pin to 3.5 mm TRS Type A → Red Panda MIDI In.',
      'Set MIDI channel on the pedal.',
      'In Morningstar Editor: Message Type = PC, PC Number = [slot number, 0-indexed], MIDI Channel = [Red Panda channel].',
      'Save.',
    ],
    pcRange: '0–127',
    notes: 'Red Panda pedals have excellent MIDI implementation documentation on their website at redpandalab.com.',
  },

  // ── ALEXANDER PEDALS ─────────────────────────────────────────────────────
  'Alexander': {
    hasMidi: true,
    connection: '3.5 mm TRS MIDI (Type A) In on rear panel.',
    channelSetup:
      'Most Alexander pedals: power on while holding the Mode button to enter Setup → MIDI Channel → set 1–16.',
    presetInfo: '128 preset slots (PC 0–127) on most Alexander MIDI pedals.',
    savingPreset: [
      'Dial in your sound.',
      'Long-press the preset footswitch until the display shows save options.',
      'Select a slot and confirm.',
    ],
    mc6ProSetup: [
      'Connect: MC6 Pro MIDI Out → 5-pin to 3.5 mm TRS Type A → Alexander MIDI In.',
      'Set MIDI channel on pedal.',
      'In Morningstar Editor: Message Type = PC, PC Number = [slot, 0-indexed], MIDI Channel = [Alexander channel].',
      'Save.',
    ],
    pcRange: '0–127',
    notes: 'Alexander pedals (Neo Series especially) have robust MIDI and can also receive CC for per-knob control.',
  },

  // ── PIGTRONIX ─────────────────────────────────────────────────────────────
  'Pigtronix': {
    hasMidi: true,
    connection:
      'Infinity Looper, Infinity 2, Echolution 3, Space Rip, FAT Drive (select models): 5-pin DIN MIDI In/Out. ' +
      'Some Pigtronix pedals use 3.5 mm TRS. Verify with your model\'s manual.',
    channelSetup: 'MIDI Channel is set via onboard button combination at boot — consult your model\'s manual.',
    presetInfo: '128 presets on Echolution 3 and similar multi-function units.',
    savingPreset: [
      'Dial in your sound.',
      'Follow model-specific save procedure (usually hold a Save button until LED confirms).',
    ],
    mc6ProSetup: [
      'Connect: MC6 Pro MIDI Out → Pigtronix MIDI In (5-pin DIN or TRS depending on model).',
      'Set MIDI channel on pedal.',
      'In Morningstar Editor: Message Type = PC, PC Number = [slot − 1], MIDI Channel = [Pigtronix channel].',
      'Save.',
    ],
    pcRange: '0–127',
    notes: 'The Infinity Looper has a particularly detailed MIDI implementation for loop recording/playback control.',
  },

  // ── TC ELECTRONIC ─────────────────────────────────────────────────────────
  'TC Electronic': {
    hasMidi: true,
    connection:
      'MIDI-capable TC Electronic pedals (Flashback 2, Hall of Fame 2, Quintessence, Brainwaves, alter ego, 2290): ' +
      '3.5 mm TRS MIDI (Type A) via the "MASH / MIDI" input. ' +
      'Note: older TC pedals (ND-1, G-Major) use 5-pin DIN.',
    channelSetup:
      'Toneprint-based pedals: MIDI channel is set via the TonePrint app (iOS / Android / Desktop) → Device Settings → MIDI Channel.',
    presetInfo:
      '3 TonePrint preset slots (PC 0–2) on most TC Electronic single-function pedals. ' +
      'Some pedals support 128 presets via TonePrint (Flashback 2, Hall of Fame 2 have 3 onboard; more via app).',
    savingPreset: [
      'Use the TonePrint app to load or create a preset.',
      'Beam the TonePrint to the pedal (tap "Beam to Pedal" in the app with pedal cable connected to phone\'s headphone jack or via Bluetooth).',
      'The preset is stored in one of the 3 TonePrint slots on the pedal.',
    ],
    mc6ProSetup: [
      'Set MIDI channel via TonePrint app.',
      'Connect: MC6 Pro MIDI Out → 5-pin to 3.5 mm TRS Type A → TC Electronic MIDI In.',
      'In Morningstar Editor: Message Type = PC.',
      'Set PC Number = 0, 1, or 2 (select among the 3 TonePrint preset slots).',
      'Set MIDI Channel = [the TC pedal\'s MIDI channel].',
      'Save.',
    ],
    pcRange: '0–2 (3 TonePrint slots on most models)',
    ccNotes: 'CC 80 = Bypass toggle on most TC Electronic MIDI pedals.',
    notes:
      'TC Electronic\'s MIDI implementation is intentionally minimal on most pedals (only 3 TonePrint slots). ' +
      'The TonePrint app is required to configure and beam presets.',
  },

  // ── MORNINGSTAR ───────────────────────────────────────────────────────────
  'Morningstar': {
    hasMidi: false,
    noMidiNote:
      'Morningstar pedals (MC3, MC4 Pro, MC6 MKII, MC6 Pro, MC8) ARE MIDI controllers — they send MIDI messages to other pedals. ' +
      'They do not receive MIDI presets in the same way as effects pedals. ' +
      'Use editor.morningstar.io to configure what MIDI messages each footswitch sends.',
  },

  // ── ELECTRO-HARMONIX ──────────────────────────────────────────────────────
  'Electro-Harmonix': {
    hasMidi: true,
    connection:
      'EHX pedals with MIDI (HOG2, HOG, SuperEgo+, 45000 Looper, 95000 Looper, 8 Step Program, Pitch Fork+): ' +
      '5-pin DIN MIDI In on rear panel. Most standard EHX distortions, overdrives, and analog effects do NOT have MIDI.',
    channelSetup:
      'Typically set via DIP switches on the PCB or via a setup mode at boot. Consult your specific EHX model\'s manual.',
    presetInfo: 'Varies by model. HOG2: 100 presets. SuperEgo+: program-change recall of effect settings.',
    savingPreset: [
      'Follow your specific EHX model\'s save procedure — varies significantly between models.',
      'HOG2: select harmonic blend → hold footswitch to save to preset slot.',
    ],
    mc6ProSetup: [
      'Connect: MC6 Pro MIDI Out (5-pin DIN) → EHX MIDI In (5-pin DIN).',
      'Set MIDI channel on EHX pedal.',
      'In Morningstar Editor: Message Type = PC, PC Number = [preset slot − 1], MIDI Channel = [EHX channel].',
      'Save.',
    ],
    pcRange: 'Varies by model (HOG2: 0–99; others vary)',
    notes: 'Most EHX analog pedals (Big Muff, Soul Food, Nano series) do not have MIDI. Only verify MIDI on EHX units with dedicated MIDI jacks.',
  },

  // ── JHS ───────────────────────────────────────────────────────────────────
  'JHS': {
    hasMidi: false,
    noMidiNote:
      'Most JHS pedals are analog and do not have MIDI. ' +
      'The JHS Colour Box v2 has a remote jack but not standard MIDI. ' +
      'If a specific JHS model you own has a MIDI jack, consult JHS\'s documentation for that limited-run unit.',
  },

  // ── MOOG ─────────────────────────────────────────────────────────────────
  'Moog': {
    hasMidi: true,
    connection:
      'MF-104M Analog Delay, MF-108M Cluster Flux, MF-105M Bass MuRF: 5-pin DIN MIDI In. ' +
      'Most other Moog MF (Moogerfooger) pedals use CV/gate, not standard MIDI.',
    channelSetup: 'Set via a front-panel MIDI channel knob (on MF units that support it) or MIDI Setup mode.',
    presetInfo: 'Moogerfooger units generally do not store presets — MIDI controls parameters in real-time via CC.',
    savingPreset: [
      'Moogerfooger pedals do not have traditional preset storage.',
      'Instead, program your MC6 Pro to send multiple CC messages to recreate a sound on demand.',
    ],
    mc6ProSetup: [
      'Connect: MC6 Pro MIDI Out (5-pin DIN) → Moog MIDI In (5-pin DIN).',
      'Set MIDI channel on the Moog unit.',
      'In Morningstar Editor: add CC messages (not PC) to set specific knob values.',
      'CC numbers map to the Moog\'s front-panel controls — see the MIDI CC map in the specific Moogerfooger manual.',
      'Stack multiple CC messages on a single footswitch press to set all parameters simultaneously.',
    ],
    pcRange: 'N/A (no preset storage; use CC messages)',
    notes: 'Moogerfooger pedals are CC-based, not PC-based. Use the MC6 Pro\'s multi-message capability to send several CC values simultaneously.',
  },
}

// ─── Model-level overrides ───────────────────────────────────────────────────
// For specific pedal names that differ from their brand defaults

const modelOverrides = {
  // Strymon pedals that do NOT have MIDI
  'Strymon Mini Switch':    { hasMidi: false, noMidiNote: 'The Strymon Mini Switch is a passive switching accessory, not an effect pedal — it has no MIDI.' },
  'Strymon Multiswitch':    { hasMidi: false, noMidiNote: 'The Strymon Multiswitch is a remote footswitch for Strymon pedals, not a MIDI device.' },
  'Strymon Multiswitch Plus':{ hasMidi: false, noMidiNote: 'The Strymon Multiswitch Plus is a remote footswitch accessory, not a MIDI device.' },
  'Strymon Ojai':           { hasMidi: false, noMidiNote: 'Strymon Ojai is a power supply — it has no MIDI.' },
  'Strymon Ojai R30':       { hasMidi: false, noMidiNote: 'Strymon Ojai R30 is a power supply — it has no MIDI.' },
  'Strymon Zuma':           { hasMidi: false, noMidiNote: 'Strymon Zuma is a power supply — it has no MIDI.' },
  'Strymon Zuma R300':      { hasMidi: false, noMidiNote: 'Strymon Zuma R300 is a power supply — it has no MIDI.' },
  'Strymon PS-124':         { hasMidi: false, noMidiNote: 'The PS-124 is a Strymon patch splitter accessory — no MIDI.' },
  'Strymon PCH':            { hasMidi: false, noMidiNote: 'Strymon PCH is a power conditioner/hub — no MIDI.' },
  'Strymon Brig':           { hasMidi: false, noMidiNote: 'Strymon Brig is a power supply — it has no MIDI.' },
  'Strymon OB.1':           { hasMidi: false, noMidiNote: 'The Strymon OB.1 is a compressor/boost pedal — it does not have MIDI on its own (though it can be controlled via expression).' },
  // Strymon Conduit is a MIDI device but a router, not an effect
  'Strymon Conduit': {
    hasMidi: true,
    connection: '5-pin DIN MIDI In/Out AND 3.5 mm TRS MIDI In/Out (Type A and Type B). USB-MIDI.',
    channelSetup: 'The Conduit is a MIDI router/converter. It passes and converts MIDI between TRS, DIN, and USB formats.',
    presetInfo: 'The Conduit does not store effect presets — it routes MIDI signals.',
    savingPreset: ['The Conduit does not process audio or store effect presets. Use it to convert MIDI formats between the MC6 Pro and your other pedals.'],
    mc6ProSetup: [
      'Connect MC6 Pro MIDI Out (5-pin DIN) → Strymon Conduit MIDI In.',
      'The Conduit can then distribute MIDI to multiple downstream pedals (TRS, DIN, USB) simultaneously.',
    ],
    pcRange: 'N/A (pass-through device)',
    notes: 'The Conduit is ideal for running MIDI to multiple Strymon pedals from a single MC6 Pro output.',
  },

  // Walrus non-MIDI pedals
  'Walrus Audio Aetos':     { hasMidi: false, noMidiNote: 'Walrus Audio Aetos is a power supply — no MIDI.' },
  'Walrus Audio Canvas Power 15': { hasMidi: false, noMidiNote: 'Canvas Power 15 is a power supply — no MIDI.' },
  'Walrus Audio Canvas Power 22': { hasMidi: false, noMidiNote: 'Canvas Power 22 is a power supply — no MIDI.' },
  'Walrus Audio Canvas Power 5':  { hasMidi: false, noMidiNote: 'Canvas Power 5 is a power supply — no MIDI.' },
  'Walrus Audio Canvas Power 8':  { hasMidi: false, noMidiNote: 'Canvas Power 8 is a power supply — no MIDI.' },
  'Walrus Audio Canvas Power HP': { hasMidi: false, noMidiNote: 'Canvas Power HP is a power supply — no MIDI.' },
  'Walrus Audio Canvas Tuner':    { hasMidi: false, noMidiNote: 'Canvas Tuner is a polyphonic tuner — it does not have MIDI.' },
  'Walrus Audio Canvas Mono':     { hasMidi: false, noMidiNote: 'Canvas Mono is an audio interface/utility — no MIDI.' },
  'Walrus Audio Canvas Stereo':   { hasMidi: false, noMidiNote: 'Canvas Stereo is an audio interface/utility — no MIDI.' },
  'Walrus Audio Canvas Re-Amp':   { hasMidi: false, noMidiNote: 'Canvas Re-Amp is a re-amping utility — no MIDI.' },
  'Walrus Audio Canvas Clock':    { hasMidi: false, noMidiNote: 'Canvas Clock is a clock utility — no MIDI.' },
  'Walrus Audio Canvas Line Isolator': { hasMidi: false, noMidiNote: 'Canvas Line Isolator is a utility — no MIDI.' },
  'Walrus Audio Canvas Volume Pedal':  { hasMidi: false, noMidiNote: 'Canvas Volume Pedal is a passive volume control — no MIDI.' },
  'Walrus Audio Canvas Rehearsal': { hasMidi: false, noMidiNote: 'Canvas Rehearsal is a utility/connectivity device — no MIDI.' },
}

// ─── Lookup function ──────────────────────────────────────────────────────────

/**
 * Returns MIDI instructions for a given pedal.
 * @param {string} brand
 * @param {string} name
 * @returns {object} instruction object
 */
export function getMidiInfo(brand, name) {
  const fullName = `${brand} ${name}`

  // 1. Check model-level overrides first
  for (const [key, info] of Object.entries(modelOverrides)) {
    if (fullName.toLowerCase().includes(key.toLowerCase()) ||
        name.toLowerCase().includes(key.toLowerCase())) {
      return info
    }
  }

  // 2. Try brand-level match (partial, case-insensitive)
  for (const [brandKey, info] of Object.entries(brandDb)) {
    if (brand.toLowerCase().includes(brandKey.toLowerCase()) ||
        brandKey.toLowerCase().includes(brand.toLowerCase())) {
      return info
    }
  }

  // 3. No MIDI information available
  return {
    hasMidi: null, // unknown
    noMidiNote:
      'MIDI information for this specific pedal is not in our database. ' +
      'Check the manufacturer\'s website or manual for MIDI specifications. ' +
      'If it has a MIDI In jack (3.5 mm TRS or 5-pin DIN), it likely accepts Program Change (PC) messages to recall presets.',
  }
}

export { brandDb, modelOverrides }
