'use client'

import { useEffect } from 'react'
import { useApp } from '@/lib/store'
import { initAudio, setMusicEnabled, setSfxEnabled } from '@/lib/sound'
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

const NAV_SCREENS = ['home', 'categories', 'gallery', 'rewards', 'settings']
// star chip lives at top-center of the main screens only (never over the coloring tools)
const STAR_SCREENS = ['home', 'categories', 'gallery', 'rewards', 'settings']

export function ColorWorldApp() {
  const screen = useApp((s) => s.screen)
  const lang = useApp((s) => s.lang)
  const settings = useApp((s) => s.settings)

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
    </div>
  )
}
