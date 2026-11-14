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
        sharing: false,
      },
      pickerCategory: 'animals',
      currentTemplateId: null,
      editing: null,
      go: (s) => set({ screen: s }),
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
      openPicker: (cat) => set({ pickerCategory: cat, screen: 'picker' }),
      openTemplate: (id) => set({ currentTemplateId: id, editing: null, screen: 'coloring' }),
      openEdit: (ref) =>
        set({ currentTemplateId: ref.templateId || 'free-draw', editing: ref, screen: 'coloring' }),
      clearEdit: () => set({ editing: null }),
    }),
    {
      name: 'color-world',
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
