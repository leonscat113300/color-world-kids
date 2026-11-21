'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useApp, buzz } from '@/lib/store'
import { makeT, type TKey } from '@/lib/i18n'
import { templatesByCategory, templateById, type ColoringTemplate } from '@/lib/templates'
import { initAudio, sfx, playVoice } from '@/lib/sound'
import { DifficultyDots } from './Fx'
import { TemplatePreview } from './TemplatePreview'
import { cn } from '@/lib/utils'

export function DrawingPicker() {
  const { lang, pickerCategory, go, openTemplate, settings } = useApp()
  const t = makeT(lang)
  const [diff, setDiff] = useState<0 | 1 | 2 | 3>(0)
  const cat = templateById('free-draw') && pickerCategory ? pickerCategory : 'animals'

  // Rango always greets the kid in the picker with the "pick a drawing" line
  useEffect(() => {
    const to = setTimeout(() => playVoice(lang, 'rPick', settings.voice), 550)
    return () => clearTimeout(to)
  }, [cat])

  const list = useMemo(() => {
    const all = templatesByCategory(cat)
    return diff === 0 ? all : all.filter((tpl) => tpl.difficulty === diff)
  }, [cat, diff])

  const categoryMeta = useMemo(() => {
    const c = (templatesByCategory(cat)[0] as ColoringTemplate | undefined)?.category ?? cat
    return c
  }, [cat])

  const diffLabel = (d: 1 | 2 | 3): string => t((d === 1 ? 'easy' : d === 2 ? 'medium' : 'hard') as TKey)

  const openTpl = (id: string) => {
    initAudio()
    sfx.pop()
    buzz(settings.vibration)
    openTemplate(id)
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden pb-28">
      <div className="mx-auto w-full max-w-3xl px-4 pt-5">
        {/* header: back at the corner — the star chip no longer sits here */}
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.85, x: -4 }}
            onClick={() => {
              sfx.close()
              go('categories')
            }}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border-[3px] border-[#35445B]/15 bg-white shadow-[0_4px_0_rgba(53,68,91,0.12)] rtl:rotate-180"
            aria-label={t('back')}
          >
            <ArrowRight className="h-6 w-6 text-[#35445B]" />
          </motion.button>
          <h1 className="min-w-0 flex-1 truncate text-lg font-black text-[#35445B] sm:text-xl">
            {t('chooseDrawing')}
          </h1>
        </div>

        {/* difficulty filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          {([0, 1, 2, 3] as const).map((d) => (
            <motion.button
              key={d}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                sfx.tap()
                setDiff(d)
              }}
              className={cn(
                'rounded-full border-[3px] px-4 py-1.5 text-sm font-black transition-colors',
                diff === d
                  ? 'border-[#35445B]/20 bg-[#FFD65A] text-[#35445B] shadow-[0_3px_0_rgba(53,68,91,0.15)]'
                  : 'border-[#35445B]/10 bg-white text-[#35445B]/55'
              )}
            >
              {d === 0 ? t('all') : diffLabel(d)}
            </motion.button>
          ))}
        </div>

        {/* grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {list.map((tpl, i) => (
            <motion.button
              key={tpl.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.03, 0.4), type: 'spring', stiffness: 300, damping: 22 }}
              whileTap={{ scale: 0.92, rotate: -1 }}
              whileHover={{ y: -3 }}
              onClick={() => openTpl(tpl.id)}
              className="relative rounded-[1.4rem] border-[3px] border-[#35445B]/10 bg-white p-2 shadow-[0_5px_0_rgba(53,68,91,0.1)]"
            >
              <TemplatePreview
                svg={tpl.svg}
                className="aspect-square w-full rounded-xl border-2 border-[#35445B]/5 bg-white"
              />
              <div className="mt-1.5 flex items-center justify-between gap-1 px-0.5">
                <span className="min-w-0 truncate text-xs font-black text-[#35445B]">
                  {lang === 'fa' ? tpl.fa : tpl.en}
                </span>
                <DifficultyDots level={tpl.difficulty} label={diffLabel(tpl.difficulty)} />
              </div>
            </motion.button>
          ))}
        </div>

        {list.length === 0 && (
          <p className="mt-10 text-center text-base font-bold text-[#35445B]/50">{t('oops')}</p>
        )}
      </div>
      <span className="sr-only">{categoryMeta}</span>
    </div>
  )
}
