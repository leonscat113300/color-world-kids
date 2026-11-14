// Kid-friendly Web Audio sound engine: synthesized SFX + background music loop.
'use client'

let ctx: AudioContext | null = null
let master: GainNode | null = null
let musicGain: GainNode | null = null
let sfxGain: GainNode | null = null
let musicTimer: ReturnType<typeof setInterval> | null = null
let nextNoteTime = 0
let musicWanted = false
let sfxWanted = true
let sfxVol = 0.8

export function initAudio() {
  if (typeof window === 'undefined') return
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 1
    master.connect(ctx.destination)
    musicGain = ctx.createGain()
    musicGain.gain.value = 0.055
    musicGain.connect(master)
    sfxGain = ctx.createGain()
    sfxGain.gain.value = sfxWanted ? sfxVol : 0
    sfxGain.connect(master)
    if (musicWanted) startMusic()
  }
  if (ctx.state === 'suspended') void ctx.resume()
}

export function setMusicEnabled(on: boolean) {
  musicWanted = on
  if (!ctx) return
  if (on) startMusic()
  else stopMusic()
}

export function setSfxEnabled(on: boolean, volume = sfxVol) {
  sfxWanted = on
  sfxVol = volume
  if (sfxGain && ctx) {
    sfxGain.gain.setTargetAtTime(on ? volume : 0, ctx.currentTime, 0.02)
  }
}

function tone(opts: {
  freq: number
  to?: number
  dur: number
  type?: OscillatorType
  gain?: number
  at?: number
  dest?: GainNode | null
}) {
  if (!ctx || !sfxGain) return
  const { freq, to, dur, type = 'sine', gain = 0.12, at = 0, dest } = opts
  const t0 = ctx.currentTime + at
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(30, to), t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g)
  g.connect(dest ?? sfxGain)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

function marimba(freq: number, at: number, gain = 0.5, dest?: GainNode | null) {
  tone({ freq, dur: 0.32, type: 'sine', gain, at, dest })
  tone({ freq: freq * 2, dur: 0.14, type: 'sine', gain: gain * 0.28, at, dest })
  tone({ freq: freq * 3.01, dur: 0.06, type: 'sine', gain: gain * 0.1, at, dest })
}

function noise(dur: number, filterFreq: number, gain = 0.08, at = 0, type: BiquadFilterType = 'lowpass') {
  if (!ctx || !sfxGain) return
  const t0 = ctx.currentTime + at
  const len = Math.max(1, Math.floor(ctx.sampleRate * dur))
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  const f = ctx.createBiquadFilter()
  f.type = type
  f.frequency.value = filterFreq
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, t0)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(f)
  f.connect(g)
  g.connect(sfxGain)
  src.start(t0)
  src.stop(t0 + dur + 0.02)
}

export const sfx = {
  tap() {
    tone({ freq: 640, to: 780, dur: 0.08, type: 'sine', gain: 0.1 })
  },
  pop() {
    tone({ freq: 300, to: 90, dur: 0.09, type: 'triangle', gain: 0.14 })
    noise(0.03, 2500, 0.05)
  },
  pick() {
    tone({ freq: 880, to: 980, dur: 0.06, gain: 0.08 })
  },
  fill() {
    noise(0.14, 900, 0.09)
    tone({ freq: 520, to: 240, dur: 0.16, type: 'triangle', gain: 0.1 })
    tone({ freq: 1250, dur: 0.1, gain: 0.06, at: 0.1 })
  },
  brush() {
    noise(0.08, 1600, 0.035, 0, 'bandpass')
  },
  sticker() {
    tone({ freq: 300, to: 100, dur: 0.08, type: 'triangle', gain: 0.12 })
    tone({ freq: 1046, dur: 0.12, gain: 0.09, at: 0.06 })
  },
  undo() {
    tone({ freq: 500, to: 300, dur: 0.12, type: 'sine', gain: 0.09 })
  },
  redo() {
    tone({ freq: 300, to: 500, dur: 0.12, type: 'sine', gain: 0.09 })
  },
  open() {
    tone({ freq: 420, to: 640, dur: 0.14, gain: 0.08 })
  },
  close() {
    tone({ freq: 520, to: 320, dur: 0.14, gain: 0.08 })
  },
  error() {
    tone({ freq: 330, dur: 0.14, type: 'triangle', gain: 0.09 })
    tone({ freq: 280, dur: 0.18, type: 'triangle', gain: 0.09, at: 0.14 })
  },
  success() {
    ;[523, 659, 784, 1047].forEach((f, i) => marimba(f, i * 0.09, 0.16))
  },
  achievement() {
    ;[523, 659, 784, 1047, 1319].forEach((f, i) => marimba(f, i * 0.08, 0.15))
    tone({ freq: 1568, dur: 0.4, gain: 0.05, at: 0.45 })
  },
}

// ------------------------------------------------------------- music loop
// Cheerful pentatonic marimba loop, scheduled ahead of time.
const MELODY: (number | null)[] = [
  523, null, 659, 784, null, 880, 784, null,
  659, null, 784, 523, null, 587, 659, null,
  784, null, 880, 1046, null, 880, 784, null,
  659, 587, 523, null, 659, null, 523, null,
]
const BASS: (number | null)[] = [
  131, null, null, null, 196, null, null, null,
  165, null, null, null, 220, null, null, null,
  131, null, null, null, 196, null, null, null,
  175, null, null, null, 131, null, null, null,
]
const STEP = 0.23

function scheduler() {
  if (!ctx || !musicGain) return
  const ahead = 0.35
  while (nextNoteTime < ctx.currentTime + ahead) {
    const step = Math.round((nextNoteTime - musicStartTime) / STEP) % MELODY.length
    const m = MELODY[step]
    const b = BASS[step]
    if (m) marimba(m, nextNoteTime - ctx.currentTime, 0.5, musicGain)
    if (b) tone({ freq: b, dur: 0.4, type: 'triangle', gain: 0.55, at: nextNoteTime - ctx.currentTime, dest: musicGain })
    nextNoteTime += STEP
  }
}

let musicStartTime = 0

function startMusic() {
  if (!ctx || !musicGain || musicTimer) return
  musicStartTime = ctx.currentTime + 0.1
  nextNoteTime = musicStartTime
  musicTimer = setInterval(scheduler, 120)
}

function stopMusic() {
  if (musicTimer) {
    clearInterval(musicTimer)
    musicTimer = null
  }
}

// ------------------------------------------------------------- voice lines
const voiceCache = new Map<string, HTMLAudioElement>()

export function playVoice(lang: 'fa' | 'en', key: string, enabled: boolean) {
  if (!enabled || typeof window === 'undefined') return
  const id = `${lang}/${key}`
  let a = voiceCache.get(id)
  if (!a) {
    a = new Audio(`/voice/${lang}/${key}.mp3`)
    a.volume = 0.9
    voiceCache.set(id, a)
  }
  try {
    a.currentTime = 0
  } catch {
    /* noop */
  }
  a.play().catch(() => {
    /* file missing or autoplay blocked — silent fallback */
  })
}
