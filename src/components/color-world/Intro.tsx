'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Rango } from './Rango'
import { useApp } from '@/lib/store'
import { makeT } from '@/lib/i18n'
import { initAudio, sfx } from '@/lib/sound'

const STARS = [
  { top: -22, left: -26, s: 26, d: 0.55, c: '#FFD65A' },
  { top: -30, right: -18, s: 18, d: 0.7, c: '#FF91B8' },
  { bottom: -16, left: -20, s: 18, d: 0.85, c: '#8DDEB0' },
  { bottom: -26, right: -26, s: 24, d: 1, c: '#B9A0F5' },
]

/** Candy Team Game Studio logo intro — plays once at the very start of the app. */
export function StudioIntro() {
  const { go, lang } = useApp()
  const t = makeT(lang)

  useEffect(() => {
    const timer = setTimeout(() => go('splash'), 3200)
    return () => clearTimeout(timer)
  }, [go])

  return (
    <div
      className="relative grid min-h-dvh place-items-center overflow-hidden bg-gradient-to-b from-[#FFF3D6] via-[#FFE9F0] to-[#DFF3FF] px-6"
      onPointerDown={() => go('splash')}
      role="button"
      aria-label={t('loading')}
    >
      {/* candy blobs */}
      <motion.div className="absolute -left-10 top-[10%] h-36 w-36 rounded-full bg-[#FF91B8]/30 blur-md" animate={{ y: [0, -14, 0] }} transition={{ duration: 5, repeat: Infinity }} />
      <motion.div className="absolute -right-8 top-[22%] h-24 w-24 rounded-full bg-[#FFD65A]/40 blur-md" animate={{ y: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity }} />
      <motion.div className="absolute bottom-[12%] left-[14%] h-20 w-20 rounded-full bg-[#8DDEB0]/35 blur-md" animate={{ y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity }} />
      <motion.div className="absolute bottom-[18%] right-[10%] h-28 w-28 rounded-full bg-[#B9A0F5]/30 blur-md" animate={{ y: [0, 10, 0] }} transition={{ duration: 6.5, repeat: Infinity }} />

      <div className="relative flex flex-col items-center">
        {/* studio logo with pop + sparkle ring + shine sweep */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.3, rotate: -14 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 210, damping: 12 }}
        >
          <motion.div
            className="grid h-36 w-36 place-items-center rounded-[2.4rem] border-4 border-white bg-white p-3 shadow-[0_14px_0_rgba(53,68,91,0.16)] sm:h-40 sm:w-40"
            animate={{ y: [0, -6, 0] }}
            transition={{ delay: 1.2, duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src="/logo.webp"
              alt="Candy Team Game Studio"
              width={128}
              height={128}
              priority
              unoptimized
              className="h-full w-full object-contain"
            />
          </motion.div>

          {/* rotating sparkle ring */}
          <motion.div
            className="pointer-events-none absolute -inset-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
            aria-hidden
          >
            {STARS.map((st, i) => (
              <motion.span
                key={i}
                className="absolute"
                style={{ top: st.top, left: st.left, right: st.right, bottom: st.bottom, width: st.s, height: st.s, color: st.c }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.25, 1], opacity: 1 }}
                transition={{ delay: st.d, duration: 0.5 }}
              >
                <svg viewBox="0 0 20 20" className="h-full w-full drop-shadow">
                  <path d="M10 0 L12.4 7 L20 7.6 L14 12 L16 19.4 L10 15 L4 19.4 L6 12 L0 7.6 L7.6 7 Z" fill={st.c} />
                </svg>
              </motion.span>
            ))}
          </motion.div>

          {/* shine sweep */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.4rem]" aria-hidden>
            <motion.div
              className="h-full w-1/3 -skew-x-12 bg-white/70 blur-md"
              initial={{ x: '-160%' }}
              animate={{ x: '420%' }}
              transition={{ delay: 0.7, duration: 1.15, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        {/* studio name */}
        <motion.h1
          className="mt-6 text-center font-[family-name:var(--font-baloo)] text-4xl font-extrabold tracking-tight text-[#35445B] drop-shadow-[0_3px_0_rgba(255,255,255,0.8)] sm:text-5xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          {t('studioBrand')}
        </motion.h1>
        <motion.p
          className="mt-1 text-center font-[family-name:var(--font-baloo)] text-sm font-bold uppercase tracking-[0.35em] text-[#35445B]/70"
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.35em' }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {t('studioSub')}
        </motion.p>
        <motion.p
          className="mt-4 rounded-full border-[3px] border-white/70 bg-white/70 px-4 py-1.5 text-center text-xs font-black text-[#35445B] backdrop-blur sm:text-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35 }}
        >
          {t('studioTag')}
        </motion.p>
      </div>
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
            alt="Candy Team Game Studio"
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
