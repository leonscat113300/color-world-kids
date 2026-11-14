'use client'

import { useEffect } from 'react'
import { useApp, backTargetOf, syncHistory, type Screen } from '@/lib/store'
import { makeT } from '@/lib/i18n'
import { initAudio, setMusicEnabled, setSfxEnabled } from '@/lib/sound'
import { toast } from '@/hooks/use-toast'
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

/** Minimal shape of the @capacitor/app plugin when the APK build has it. */
interface CapAppPlugin {
  addListener: (
    event: 'backButton',
    cb: () => void,
  ) => Promise<{ remove?: () => void } | undefined>
  exitApp?: () => Promise<void>
}

export function ColorWorldApp() {
  const screen = useApp((s) => s.screen)
  const lang = useApp((s) => s.lang)
  const settings = useApp((s) => s.settings)

  // direction + language
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'
  }, [lang])

  // ---------------------------------------------------------------- back button
  // Hardware / browser back navigates inside the app instead of quitting it.
  useEffect(() => {
    // seed the tiny 2-entry history stack: [app-start entry, current entry]
    try {
      if (window.history.state?.screen == null) {
        window.history.pushState({ screen: useApp.getState().screen }, '')
      } else {
        syncHistory(useApp.getState().screen)
      }
    } catch {
      /* history API unavailable */
    }

    // Browser / WebView without the Capacitor App plugin:
    // back pops to the app-start entry → walk to the semantic parent (or stay).
    const onPop = (e: PopStateEvent) => {
      const st = (e.state as { screen?: Screen } | null)?.screen
      if (st) {
        // forward button or re-entry into a known screen
        useApp.setState({ screen: st })
        return
      }
      const { screen: cur, editing } = useApp.getState()
      const target = backTargetOf(cur, editing) ?? cur
      useApp.setState({ screen: target })
      try {
        window.history.pushState({ screen: target }, '')
      } catch {
        /* noop */
      }
    }
    window.addEventListener('popstate', onPop)

    // Capacitor APK (with @capacitor/app installed): native listener drives the
    // in-app back navigation; on root screens double-press exits the app.
    let disposed = false
    let removeNative: (() => void) | undefined
    void Promise.resolve()
      .then(async () => {
        const capApp = (
          window as unknown as { Capacitor?: { Plugins?: { App?: CapAppPlugin } } }
        ).Capacitor?.Plugins?.App
        if (!capApp?.addListener || disposed) return
        let lastBackAt = 0
        try {
          const handle = await capApp.addListener('backButton', () => {
            const { screen: cur, editing, lang: lng } = useApp.getState()
            const back = backTargetOf(cur, editing)
            if (back) {
              useApp.setState({ screen: back })
              syncHistory(back)
              return
            }
            // root screen → double-press to exit
            const now = Date.now()
            if (now - lastBackAt < 2200) {
              void capApp.exitApp?.()
            } else {
              lastBackAt = now
              toast({ description: makeT(lng)('exitHint') })
            }
          })
          removeNative = () => {
            try {
              handle?.remove?.()
            } catch {
              /* noop */
            }
          }
        } catch {
          /* plugin missing in this build — history fallback covers it */
        }
      })
      .catch(() => {
        /* noop */
      })

    return () => {
      disposed = true
      window.removeEventListener('popstate', onPop)
      removeNative?.()
    }
  }, [])

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
