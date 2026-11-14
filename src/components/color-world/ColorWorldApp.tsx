'use client'

import { useEffect, useState } from 'react'
import { useApp, type Screen } from '@/lib/store'
import { initAudio, setMusicEnabled, setSfxEnabled } from '@/lib/sound'
import { initBackButton, exitApp, useBackBlock } from '@/lib/back-button'
import { makeT } from '@/lib/i18n'
import { Splash, StudioIntro, LanguageSelect, NameAsk } from './Intro'
import { BottomNav } from './BottomNav'
import { HomePage } from './HomePage'
import { CategoriesPage } from './CategoriesPage'
import { DrawingPicker } from './DrawingPicker'
import { ColoringPage } from './ColoringPage'
import { GalleryPage } from './GalleryPage'
import { RewardsPage } from './RewardsPage'
import { SettingsPage, ParentsPage } from './SettingsPage'
import { StarChip } from './Fx'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'

const NAV_SCREENS = ['home', 'categories', 'gallery', 'rewards', 'settings']
// star chip lives at top-center of the main screens only (never over the coloring tools)
const STAR_SCREENS = ['home', 'categories', 'gallery', 'rewards', 'settings']

/** Where the hardware back button (no dialog open) should land. */
function backTarget(s: Screen): Screen | null {
  switch (s) {
    case 'coloring':
      // back from the studio: to the gallery when editing a saved artwork, else to the picker
      return useApp.getState().editing ? 'gallery' : 'picker'
    case 'picker':
      return 'categories'
    case 'categories':
    case 'gallery':
    case 'rewards':
    case 'settings':
      return 'home'
    case 'parents':
      return 'settings'
    default:
      return null // studio/splash/language/name/home — handled separately
  }
}

export function ColorWorldApp() {
  const screen = useApp((s) => s.screen)
  const lang = useApp((s) => s.lang)
  const settings = useApp((s) => s.settings)
  const [confirmExit, setConfirmExit] = useState(false)
  const t = makeT(lang)

  // direction + language
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'
  }, [lang])

  // audio settings sync + first-gesture unlock
  useEffect(() => {
    setMusicEnabled(settings.music)
    setSfxEnabled(settings.sfx, settings.sfxVolume)
    const unlock = () => initAudio()
    window.addEventListener('pointerdown', unlock, { once: true })
    return () => window.removeEventListener('pointerdown', unlock)
  }, [])

  // animation quality gate
  useEffect(() => {
    document.documentElement.classList.toggle('fx-low', settings.quality === 'low')
  }, [settings.quality])

  // Android hardware back button: close dialogs first (blocker stack), then
  // climb up one screen level; on home show the friendly exit confirmation
  // instead of letting the app close suddenly.
  useEffect(
    () =>
      initBackButton(() => {
        const st = useApp.getState()
        if (st.screen === 'home') {
          setConfirmExit(true)
          return
        }
        const target = backTarget(st.screen)
        if (target) {
          if (st.screen === 'coloring') st.clearEdit()
          st.go(target)
        }
        // onboarding screens (studio/splash/language/name) ignore back
      }),
    []
  )

  // while the exit dialog is open, back closes the dialog itself
  useBackBlock(confirmExit, () => {
    setConfirmExit(false)
    return true
  })

  let page: React.ReactNode = null
  switch (screen) {
    case 'studio':
      page = <StudioIntro />
      break
    case 'splash':
      page = <Splash />
      break
    case 'language':
      page = <LanguageSelect />
      break
    case 'name':
      page = <NameAsk />
      break
    case 'categories':
      page = <CategoriesPage />
      break
    case 'picker':
      page = <DrawingPicker />
      break
    case 'coloring':
      page = <ColoringPage />
      break
    case 'gallery':
      page = <GalleryPage />
      break
    case 'rewards':
      page = <RewardsPage />
      break
    case 'settings':
      page = <SettingsPage />
      break
    case 'parents':
      page = <ParentsPage />
      break
    default:
      page = <HomePage />
  }

  return (
    <div className="relative min-h-dvh bg-gradient-to-b from-[#A8DDFB] via-[#C9EBFD] to-[#EAF7FF]">
      {page}
      {STAR_SCREENS.includes(screen) && <StarChip />}
      {NAV_SCREENS.includes(screen) && <BottomNav />}

      {/* friendly exit confirmation — the game never closes suddenly */}
      <Dialog open={confirmExit} onOpenChange={(o) => !o && setConfirmExit(false)}>
        <DialogContent className="max-w-xs rounded-[1.8rem] border-[3px] border-[#35445B]/10 bg-white p-5 text-center">
          <DialogHeader className="items-center">
            <DialogTitle className="text-base font-black text-[#35445B]">{t('exitTitle')}</DialogTitle>
            <DialogDescription className="text-sm font-bold text-[#35445B]/60">
              {t('exitText')}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex justify-center gap-2">
            <button
              onClick={() => exitApp()}
              className="rounded-2xl bg-[#FF91B8] px-6 py-2.5 text-sm font-black text-[#35445B] shadow-[0_3px_0_rgba(53,68,91,0.18)]"
            >
              {t('yes')}
            </button>
            <button
              onClick={() => setConfirmExit(false)}
              className="rounded-2xl bg-[#35445B]/10 px-6 py-2.5 text-sm font-black text-[#35445B]"
            >
              {t('no')}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
