'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Rango } from './Rango'
import { useApp } from '@/lib/store'
import { makeT } from '@/lib/i18n'
import { initAudio, sfx } from '@/lib/sound'

/** Candy Team Game Studio logo intro — plays once at the very start of the app. */
export function StudioIntro() {
  const { go } = useApp()

  useEffect(() => {
    const timer = setTimeout(() => go('splash'), 3200)
    return () => clearTimeout(timer)
  }, [go])

  return (
    <div
      className="relative grid min-h-dvh place-items-center overflow-hidden bg-black px-6"
      onPointerDown={() => go('splash')}
      role="button"
      aria-label="Candy Team Game Studio"
    >
      {/* soft ambient glow behind the logo */}
      <motion.div
        className="pointer-events-none absolute h-[60vmin] w-[60vmin] rounded-full bg-[#B9A0F5]/15 blur-3xl"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        aria-hidden
      />

      {/* the studio logo itself — nothing else, on black */}
      <motion.div
        className="relative w-[min(86vw,640px)]"
        initial={{ opacity: 0, scale: 0.55 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 18 }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ delay: 1.2, duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image
            src="/candy-team-logo.webp"
            alt="Candy Team Game Studio"
            width={1536}
            height={1024}
            priority
            unoptimized
            className="h-auto w-full object-contain"
          />
        </motion.div>

        {/* shine sweep across the logo */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <motion.div
            className="h-full w-1/4 -skew-x-12 bg-white/10 blur-md"
            initial={{ x: '-180%' }}
            animate={{ x: '520%' }}
            transition={{ delay: 0.8, duration: 1.2, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </div>
  )
}

export function Splash() {
  const { go, langChosen, nameChosen, lang } = useApp()
  const t = makeT(lang)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!langChosen) go('language')
      else if (!nameChosen) go('name')
      else go('home')
    }, 2700)
    return () => clearTimeout(timer)
  }, [go, langChosen, nameChosen])

  return (
    <div
      className="relative grid min-h-dvh place-items-center overflow-hidden bg-[#78C8F8] px-6"
      onPointerDown={() => initAudio()}
    >
      {/* paint splats */}
      <motion.div className="absolute left-[8%] top-[12%] h-16 w-16 rounded-full bg-[#FF91B8]/70 blur-[1px]" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }} />
      <motion.div className="absolute right-[10%] top-[20%] h-10 w-10 rounded-full bg-[#FFD65A]/80" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, type: 'spring' }} />
      <motion.div className="absolute bottom-[16%] left-[16%] h-12 w-12 rounded-full bg-[#8DDEB0]/70" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9, type: 'spring' }} />
      <motion.div className="absolute bottom-[22%] right-[14%] h-8 w-8 rounded-full bg-[#B9A0F5]/80" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.05, type: 'spring' }} />

      <div className="relative flex flex-col items-center">
        {/* studio logo */}
        <motion.div
          className="mb-3 grid h-28 w-28 place-items-center rounded-[2rem] border-4 border-white/70 bg-white/90 p-2 shadow-[0_10px_0_rgba(53,68,91,0.18)]"
          initial={{ opacity: 0, scale: 0.4, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 13 }}
        >
          <Image
            src="/logo.webp"
            alt={t('appName')}
            width={96}
            height={96}
            priority
            unoptimized
            className="h-full w-full object-contain"
          />
        </motion.div>

        {/* painted stroke reveal */}
        <svg viewBox="0 0 420 120" className="w-[min(80vw,420px)]">
          <motion.path
            d="M 20 78 C 80 40 130 96 190 58 C 250 22 300 92 400 48"
            fill="none"
            stroke="#FFD65A"
            strokeWidth="26"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.3 }}
          />
          <motion.path
            d="M 20 78 C 80 40 130 96 190 58 C 250 22 300 92 400 48"
            fill="none"
            stroke="#FF91B8"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.55 }}
          />
        </svg>

        <motion.h1
          className="-mt-8 text-center text-5xl font-black text-[#35445B] drop-shadow-[0_4px_0_rgba(255,255,255,0.65)] sm:text-6xl"
          initial={{ opacity: 0, scale: 0.6, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.9, type: 'spring', stiffness: 200, damping: 14 }}
        >
          {t('appName')}
        </motion.h1>
        <motion.p
          className="mt-3 text-center text-base font-bold text-[#2C3A50] drop-shadow-[0_2px_0_rgba(255,255,255,0.5)] sm:text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25 }}
        >
          {t('slogan')}
        </motion.p>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, type: 'spring', damping: 15 }}
        >
          <Rango mood="wave" size={150} />
        </motion.div>
      </div>
    </div>
  )
}

export function LanguageSelect() {
  const { setLang, go, lang } = useApp()
  const t = makeT(lang)

  const pick = (l: 'fa' | 'en') => {
    initAudio()
    sfx.success()
    setLang(l)
    go('name')
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#78C8F8] px-6 py-10">
      <h2 className="text-center text-3xl font-black text-[#35445B] drop-shadow-[0_3px_0_rgba(255,255,255,0.6)]">
        {t('chooseLanguage')}
      </h2>
      <p className="mt-2 text-sm font-bold text-[#2C3A50]">{t('languageHint')}</p>

      <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-5">
        <motion.button
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.04 }}
          onClick={() => pick('fa')}
          className="flex flex-col items-center gap-3 rounded-[2rem] border-4 border-white/60 bg-white p-6 shadow-[0_8px_0_rgba(53,68,91,0.15)]"
          aria-label="فارسی"
        >
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#FFD65A] text-3xl font-black text-[#35445B] shadow-inner">
            آ
          </span>
          <span className="text-xl font-black text-[#35445B]">فارسی</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.04 }}
          onClick={() => pick('en')}
          className="flex flex-col items-center gap-3 rounded-[2rem] border-4 border-white/60 bg-white p-6 shadow-[0_8px_0_rgba(53,68,91,0.15)]"
          aria-label="English"
        >
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#78C8F8] text-3xl font-black text-[#35445B] shadow-inner">
            A
          </span>
          <span className="text-xl font-black text-[#35445B]">English</span>
        </motion.button>
      </div>

      <div className="mt-10">
        <Rango mood="happy" size={120} />
      </div>
    </div>
  )
}

export function NameAsk() {
  const { setKidName, go, lang } = useApp()
  const t = makeT(lang)
  const [value, setValue] = useState('')

  const submit = () => {
    initAudio()
    sfx.success()
    setKidName(value)
    go('home')
  }

  return (
    <div
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#78C8F8] px-6 py-10"
      onPointerDown={() => initAudio()}
    >
      <motion.div
        className="w-full max-w-md rounded-[2.2rem] border-4 border-white/70 bg-white p-7 text-center shadow-[0_10px_0_rgba(53,68,91,0.16)]"
        initial={{ opacity: 0, y: 26, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      >
        <h2 className="text-3xl font-black text-[#35445B]">{t('yourName')}</h2>
        <p className="mt-2 text-sm font-bold text-[#35445B]/60">{t('nameHint')}</p>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder={t('namePlaceholder')}
          maxLength={20}
          aria-label={t('yourName')}
          className="mt-6 w-full rounded-2xl border-[3px] border-[#78C8F8]/60 bg-[#F2FAFF] px-5 py-4 text-center text-xl font-black text-[#35445B] outline-none placeholder:text-[#35445B]/35 focus:border-[#78C8F8]"
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={submit}
          className="mt-5 w-full rounded-2xl bg-[#FFD65A] py-4 text-xl font-black text-[#35445B] shadow-[0_5px_0_rgba(53,68,91,0.2)]"
        >
          {t('letsGo')}
        </motion.button>

        <button
          onClick={() => {
            sfx.tap()
            setKidName('')
            go('home')
          }}
          className="mt-3 text-sm font-bold text-[#35445B]/50 underline-offset-4 hover:underline"
        >
          {t('skipName')}
        </button>
      </motion.div>

      <div className="mt-8">
        <Rango mood="wave" size={130} />
      </div>
    </div>
  )
}
