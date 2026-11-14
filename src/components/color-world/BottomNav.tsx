'use client'

import { motion } from 'framer-motion'
import { Home, Palette, Images, Gift, Settings } from 'lucide-react'
import { useApp, buzz } from '@/lib/store'
import { makeT, type TKey } from '@/lib/i18n'
import { initAudio, sfx } from '@/lib/sound'
import { cn } from '@/lib/utils'
import type { Screen } from '@/lib/store'

const ITEMS: { screen: Screen; icon: typeof Home; key: TKey; color: string }[] = [
  { screen: 'home', icon: Home, key: 'navHome', color: '#FFD65A' },
  { screen: 'categories', icon: Palette, key: 'navColoring', color: '#FF91B8' },
  { screen: 'gallery', icon: Images, key: 'navMyArt', color: '#8DDEB0' },
  { screen: 'rewards', icon: Gift, key: 'navRewards', color: '#FFAA62' },
  { screen: 'settings', icon: Settings, key: 'navSettings', color: '#B9A0F5' },
]

export function BottomNav() {
  const { screen, go, lang, settings } = useApp()
  const t = makeT(lang)

  const nav = (s: Screen) => {
    if (s === screen) return
    initAudio()
    sfx.tap()
    buzz(settings.vibration)
    go(s)
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-2xl"
      aria-label={t('navHome')}
    >
      {/* white bar hugs the very bottom of the screen — safe-area padding sits
          inside the white background so there is never a gap below it */}
      <div className="flex items-stretch justify-between gap-1 rounded-t-[1.6rem] border-x-[3px] border-t-[3px] border-[#35445B]/15 bg-white/95 px-2 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] shadow-[0_-6px_24px_rgba(53,68,91,0.12)] backdrop-blur">
        {ITEMS.map((it) => {
          const active = screen === it.screen
          const Icon = it.icon
          return (
            <motion.button
              key={it.screen}
              whileTap={{ scale: 0.88 }}
              onClick={() => nav(it.screen)}
              className={cn(
                'relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 pb-2 pt-1.5',
                active ? 'text-[#35445B]' : 'text-[#35445B]/45'
              )}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <motion.span
                  layoutId="navPill"
                  className="absolute inset-x-1 top-0 -z-10 h-[calc(100%-0.25rem)] rounded-2xl"
                  style={{ backgroundColor: `${it.color}55` }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.span
                animate={active ? { y: [0, -4, 0] } : { y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Icon className="h-6 w-6" strokeWidth={active ? 2.6 : 2} style={{ color: active ? '#35445B' : undefined }} />
              </motion.span>
              <span className="truncate text-[10px] font-bold sm:text-xs">{t(it.key)}</span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
