'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useApp, buzz } from '@/lib/store'
import { makeT, tf } from '@/lib/i18n'
import { CATEGORIES, templatesByCategory, categoryPreview } from '@/lib/templates'
import { initAudio, sfx } from '@/lib/sound'
import { FloatingDecor } from './Fx'
import { TemplatePreview } from './TemplatePreview'

export function CategoriesPage() {
  const { lang, openPicker, go } = useApp()
  const t = makeT(lang)

  const open = (id: string) => {
    initAudio()
    sfx.pop()
    buzz(true)
    openPicker(id)
  }

  const back = () => {
    initAudio()
    sfx.close()
    buzz(true)
    go('home')
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden pb-28">
      <FloatingDecor />
      <div className="relative mx-auto w-full max-w-2xl px-4">
        {/* top row: back at the corner, star chip floats at the center above */}
        <div className="flex items-center justify-between pt-3">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={back}
            className="grid h-11 w-11 place-items-center rounded-2xl border-[3px] border-[#35445B]/15 bg-white shadow-[0_4px_0_rgba(53,68,91,0.12)] rtl:rotate-180"
            aria-label={t('back')}
          >
            <ArrowRight className="h-6 w-6 text-[#35445B]" />
          </motion.button>
          <span className="h-11 w-11 shrink-0" aria-hidden />
        </div>
        <h1 className="mt-2 text-center text-2xl font-black text-[#35445B]">{t('chooseCategory')}</h1>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 18, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
              whileTap={{ scale: 0.93, rotate: i % 2 ? 1.5 : -1.5 }}
              whileHover={{ y: -4 }}
              onClick={() => open(cat.id)}
              className="relative overflow-hidden rounded-[1.8rem] border-[3px] border-[#35445B]/10 bg-white p-3 pb-3.5 text-center shadow-[0_6px_0_rgba(53,68,91,0.1)]"
              style={{ backgroundColor: `${cat.color}26` }}
            >
              <TemplatePreview
                svg={categoryPreview(cat.id).svg}
                className="mx-auto aspect-square w-full max-w-[170px] rounded-2xl border-[3px] border-white bg-white p-1.5 shadow-[0_4px_0_rgba(53,68,91,0.08)]"
              />
              <span className="mt-2.5 block truncate text-sm font-black text-[#35445B]">
                {lang === 'fa' ? cat.fa : cat.en}
              </span>
              <span className="mt-0.5 block text-[11px] font-bold text-[#35445B]/50">
                {tf(t, 'drawingsCount', templatesByCategory(cat.id).length, lang)}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      {/* allow settings access from here too */}
      <button className="sr-only" onClick={() => go('settings')}>
        {t('settingsTitle')}
      </button>
    </div>
  )
}
