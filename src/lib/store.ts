'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Lang } from './i18n'
import { setMusicEnabled, setSfxEnabled } from './sound'

export type Screen =
  | 'studio'
  | 'splash'
  | 'language'
  | 'name'
  | 'home'
  | 'categories'
  | 'picker'
  | 'coloring'
  | 'gallery'
  | 'rewards'
  | 'settings'
  | 'parents'

export interface Settings {
  music: boolean
  sfx: boolean
  sfxVolume: number
  voice: boolean
  vibration: boolean
  quality: 'high' | 'low'
  sharing: boolean
}

/** Reference to a saved artwork being re-opened for editing. */
export interface EditRef {
  id: number
  title: string
  templateId: string
  state: string
}

// ------------------------------------------------------------ back navigation
// The app is a single page without URL routes, so the phone's hardware back
// button (and the browser back button) would normally leave the app at once.
// We keep a tiny 2-entry history stack — [app-start entry, current entry] —
// and walk the semantic screen tree instead:
//   • every screen change just replaces the top entry (stack never grows)
//   • on popstate (back pressed) we re-push the semantic parent screen
//   • Capacitor APK builds additionally register a native backButton listener
const ONBOARDING_SCREENS: Screen[] = ['studio', 'splash', 'language', 'name']

export const isOnboardingScreen = (s: Screen): boolean => ONBOARDING_SCREENS.includes(s)

const BACK_MAP: Partial<Record<Screen, Screen>> = {
  categories: 'home',
  picker: 'categories',
  gallery: 'home',
  rewards: 'home',
  settings: 'home',
  parents: 'settings',
}

/** Semantic parent of a screen — what the hardware back button should show. */
export function backTargetOf(screen: Screen, editing: EditRef | null): Screen | null {
  if (screen === 'coloring') return editing ? 'gallery' : 'picker'
  return BACK_MAP[screen] ?? null
}

/** Point the top history entry at the given screen (never grows the stack). */
export function syncHistory(s: Screen): void {
  if (typeof window === 'undefined') return
  try {
    if (window.history.state?.screen === s) return
    window.history.replaceState({ screen: s }, '')
  } catch {
    /* history API unavailable — ignore */
  }
}

interface AppState {
  screen: Screen
  lang: Lang
  langChosen: boolean
  nameChosen: boolean
  kidName: string
  starTotal: number | null
  settings: Settings
  pickerCategory: string
  currentTemplateId: string | null
  editing: EditRef | null
  go: (s: Screen) => void
  setLang: (l: Lang) => void
  setKidName: (n: string) => void
  setStarTotal: (n: number) => void
  updateSettings: (p: Partial<Settings>) => void
  openPicker: (cat: string) => void
  openTemplate: (id: string) => void
  openEdit: (ref: EditRef) => void
  clearEdit: () => void
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      screen: 'studio',
      lang: 'fa',
      langChosen: false,
      nameChosen: false,
      kidName: '',
      starTotal: null,
      settings: {
        music: true,
        sfx: true,
        sfxVolume: 0.8,
        voice: true,
        vibration: true,
        quality: 'high',
        sharing: true,
      },
      pickerCategory: 'animals',
      currentTemplateId: null,
      editing: null,
      go: (s) => {
        set({ screen: s })
        syncHistory(s)
      },
      setLang: (l) => set({ lang: l, langChosen: true }),
      setKidName: (n) => set({ kidName: n.trim().slice(0, 20), nameChosen: true }),
      setStarTotal: (n) => set({ starTotal: n }),
      updateSettings: (p) =>
        set((st) => {
          const next = { ...st.settings, ...p }
          setMusicEnabled(next.music)
          setSfxEnabled(next.sfx, next.sfxVolume)
          return { settings: next }
        }),
      openPicker: (cat) => {
        set({ pickerCategory: cat, screen: 'picker' })
        syncHistory('picker')
      },
      openTemplate: (id) => {
        set({ currentTemplateId: id, editing: null, screen: 'coloring' })
        syncHistory('coloring')
      },
      openEdit: (ref) => {
        set({ currentTemplateId: ref.templateId || 'free-draw', editing: ref, screen: 'coloring' })
        syncHistory('coloring')
      },
      clearEdit: () => set({ editing: null }),
    }),
    {
      name: 'color-world',
      version: 1,
      migrate: (persisted, version) => {
        const p = persisted as Partial<AppState> | undefined
        if (p?.settings && version < 1) {
          // one-time upgrade: sharing used to ship disabled, which made the
          // share button in «نقاشی‌های من» look broken — enable it for everyone
          p.settings = { ...p.settings, sharing: true }
        }
        return p as AppState
      },
      partialize: (s) => ({
        lang: s.lang,
        langChosen: s.langChosen,
        nameChosen: s.nameChosen,
        kidName: s.kidName,
        settings: s.settings,
      }),
    }
  )
)

export const buzz = (enabled: boolean, ms = 12) => {
  if (enabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(ms)
    } catch {
      /* noop */
    }
  }
}
