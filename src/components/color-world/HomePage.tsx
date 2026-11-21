'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { Palette, Settings as SettingsIcon, Images, Dices, Pencil, Brush, Star } from 'lucide-react'
import { useApp, buzz } from '@/lib/store'
import { makeT, tf } from '@/lib/i18n'
import { CATEGORIES, templatesByCategory, categoryPreview, dailyTemplate, randomTemplate, templateById } from '@/lib/templates'
import { initAudio, sfx, playVoice } from '@/lib/sound'
import { Rango, SpeechBubble } from './Rango'
import { FloatingDecor } from './Fx'
import { TemplatePreview } from './TemplatePreview'

export function HomePage() {
  const { go, lang, settings, openPicker, openTemplate, kidName } = useApp()
  const t = makeT(lang)

  useEffect(() => {
    playVoice(lang, 'rReady', settings.voice)
  }, [lang, settings.voice])

  const daily = useMemo(() => dailyTemplate(), [])

  const goColoring = () => {
    initAudio()
    sfx.open()
    buzz(settings.vibration)
    go('categories')
  }

  const openCategory = (catId: string) => {
    initAudio()
    sfx.pop()
    buzz(settings.vibration)
    openPicker(catId)
  }

  const openDaily = () => {
    initAudio()
    sfx.pop()
    buzz(settings.vibration)
    playVoice(lang, 'rReady', settings.voice)
    openTemplate(daily.id)
  }

  const openRandom = () => {
    initAudio()
    sfx.pop()
    buzz(settings.vibration)
    openTemplate(randomTemplate().id)
  }

  const openFree = () => {
    initAudio()
    sfx.pop()
    buzz(settings.vibration)
    openTemplate('free-draw')
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden pb-28">
      <FloatingDecor dense />

      {/* settings — always top-left corner */}
      <motion.button
        whileTap={{ scale: 0.85, rotate: -12 }}
        onClick={() => {
          initAudio()
          sfx.tap()
          go('settings')
        }}
        className="fixed left-3 top-3 z-50 grid h-10 w-10 place-items-center rounded-2xl border-[3px] border-[#35445B]/15 bg-white/95 shadow-[0_4px_0_rgba(53,68,91,0.12)] backdrop-blur"
        aria-label={t('settingsTitle')}
      >
        <SettingsIcon className="h-5 w-5 text-[#B9A0F5]" />
      </motion.button>

      {/* header with Rango — extra top padding on mobile keeps the speech bubble clear of the star chip */}
      <header className="mx-auto flex w-full max-w-2xl items-end gap-2 px-4 pt-28 sm:pt-16">
        <div className="relative shrink-0">
          <Rango mood="wave" size={104} />
          <SpeechBubble
            text={t('rReady')}
            visible
            className="absolute -top-12 start-[88px] w-max max-w-[220px]"
          />
        </div>
        <div className="min-w-0 flex-1 pb-2">
          <h1 className="truncate text-xl font-black text-[#35445B] sm:text-2xl">
            {kidName ? t('helloName').replace('{n}', kidName) : t('greeting')}
          </h1>
          <p className="mt-0.5 truncate text-sm font-bold text-[#35445B]/60">
            {kidName ? t('helloNameSub').replace('{n}', kidName) : t('homeSub')}
          </p>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-2xl space-y-7 px-4 pt-4">
        {/* big CTA */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={goColoring}
          className="group relative flex w-full items-center gap-4 overflow-hidden rounded-[2rem] border-[3px] border-[#35445B]/10 bg-gradient-to-br from-[#FFE38A] to-[#FFD65A] p-5 text-start shadow-[0_8px_0_rgba(53,68,91,0.14)]"
        >
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/85 shadow-inner">
            <Brush className="h-9 w-9 text-[#FFAA62]" strokeWidth={2.4} />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-black text-[#35445B] sm:text-xl">{t('startColoring')}</span>
            <span className="mt-0.5 block truncate text-sm font-bold text-[#35445B]/60">{t('slogan')}</span>
          </span>
          <motion.span
            className="absolute -right-3 -top-3 h-14 w-14 rounded-full bg-[#FF91B8]/50"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.span
            className="absolute -bottom-4 start-[38%] h-10 w-10 rounded-full bg-[#8DDEB0]/50"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </motion.button>

        {/* categories */}
        <section aria-label={t('categoriesTitle')}>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-black text-[#35445B]">
            <Palette className="h-5 w-5 text-[#FF91B8]" />
            {t('categoriesTitle')}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((cat, i) => {
              const count = templatesByCategory(cat.id).length
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  whileTap={{ scale: 0.94, rotate: -1 }}
                  onClick={() => openCategory(cat.id)}
                  className="relative overflow-hidden rounded-[1.5rem] border-[3px] border-[#35445B]/10 bg-white p-3 text-start shadow-[0_5px_0_rgba(53,68,91,0.1)]"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-1.5"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div className="flex items-center gap-2.5">
                    <span
                      className="tpl-preview-box grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border-2 border-[#35445B]/10"
                      style={{ backgroundColor: `${cat.color}33` }}
                    >
                      <TemplatePreview svg={categoryPreview(cat.id).svg} className="h-full w-full p-1" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black text-[#35445B]">
                        {lang === 'fa' ? cat.fa : cat.en}
                      </span>
                      <span className="mt-0.5 block text-xs font-bold text-[#35445B]/50">
                        {tf(t, 'drawingsCount', count, lang)}
                      </span>
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </section>

        {/* quick actions */}
        <section className="grid grid-cols-3 gap-3" aria-label={t('myArtQuick')}>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              initAudio()
              sfx.tap()
              go('gallery')
            }}
            className="flex flex-col items-center gap-1.5 rounded-[1.4rem] border-[3px] border-[#35445B]/10 bg-white py-4 shadow-[0_5px_0_rgba(53,68,91,0.1)]"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#8DDEB0]/40">
              <Images className="h-6 w-6 text-[#35445B]" />
            </span>
            <span className="px-1 text-center text-xs font-black text-[#35445B]">{t('myArtQuick')}</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={openRandom}
            className="flex flex-col items-center gap-1.5 rounded-[1.4rem] border-[3px] border-[#35445B]/10 bg-white py-4 shadow-[0_5px_0_rgba(53,68,91,0.1)]"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#78C8F8]/40">
              <Dices className="h-6 w-6 text-[#35445B]" />
            </span>
            <span className="px-1 text-center text-xs font-black text-[#35445B]">{t('randomDrawing')}</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={openFree}
            className="flex flex-col items-center gap-1.5 rounded-[1.4rem] border-[3px] border-[#35445B]/10 bg-white py-4 shadow-[0_5px_0_rgba(53,68,91,0.1)]"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#FFAA62]/40">
              <Pencil className="h-6 w-6 text-[#35445B]" />
            </span>
            <span className="px-1 text-center text-xs font-black text-[#35445B]">{t('freeDrawing')}</span>
          </motion.button>
        </section>

        {/* drawing of the day */}
        <motion.section
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          aria-label={t('dailyDrawing')}
          className="relative overflow-hidden rounded-[1.8rem] border-[3px] border-[#35445B]/10 bg-gradient-to-br from-[#E2D1F9] via-white to-[#BDE6E1] p-4 shadow-[0_6px_0_rgba(53,68,91,0.1)]"
        >
          <div className="flex items-center gap-4">
            <div className="w-24 shrink-0 sm:w-28">
              <TemplatePreview
                svg={daily.svg}
                className="aspect-square w-full rounded-2xl border-[3px] border-[#35445B]/10 bg-white p-1 shadow"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="flex items-center gap-1.5 text-base font-black text-[#35445B]">
                <Star className="h-4 w-4 fill-[#FFD65A] text-[#35445B]" />
                {t('dailyDrawing')}
              </h3>
              <p className="mt-0.5 truncate text-sm font-bold text-[#35445B]/60">
                {lang === 'fa' ? daily.fa : daily.en}
              </p>
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={openDaily}
                className="mt-2.5 rounded-2xl bg-[#FFAA62] px-5 py-2 text-sm font-black text-[#35445B] shadow-[0_4px_0_rgba(53,68,91,0.18)]"
              >
                {t('colorIt')}
              </motion.button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
