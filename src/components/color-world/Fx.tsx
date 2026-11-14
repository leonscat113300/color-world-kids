'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { Star } from 'lucide-react'
import { useApp } from '@/lib/store'
import { listArtworks } from '@/lib/artworks'
import { makeT, num } from '@/lib/i18n'
import { initAudio, sfx } from '@/lib/sound'

const STAR_COLORS = ['#FFD65A', '#FF91B8', '#78C8F8', '#8DDEB0', '#B9A0F5', '#FFAA62']

/** Always-visible star counter, pinned to the top-center so it never covers corner icons. */
export function StarChip() {
  const { lang, starTotal, setStarTotal, go } = useApp()
  const t = makeT(lang)

  useEffect(() => {
    if (starTotal !== null) return
    listArtworks()
      .then((items) => setStarTotal(items.reduce((s, a) => s + a.stars, 0)))
      .catch(() => setStarTotal(0))
  }, [starTotal, setStarTotal])

  return (
    <div className="fixed left-1/2 top-3 z-50 -translate-x-1/2">
      <motion.button
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          initAudio()
          sfx.tap()
          go('rewards')
        }}
        aria-label={t('rewardsTitle')}
        className="flex h-10 items-center gap-1.5 rounded-full border-[3px] border-[#35445B]/15 bg-white/95 px-3.5 shadow-[0_4px_0_rgba(53,68,91,0.14)] backdrop-blur"
      >
        <Star className="h-5 w-5 fill-[#FFD65A] text-[#35445B]" />
        <span className="min-w-[1.6rem] text-center text-sm font-black text-[#35445B]">
          {starTotal === null ? '…' : num(starTotal, lang)}
        </span>
      </motion.button>
    </div>
  )
}

/** Burst of stars / confetti — used on save, rewards and achievements. */
export function StarBurst({ count = 14, active = true }: { count?: number; active?: boolean }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        angle: (360 / count) * i + Math.random() * 20,
        dist: 90 + Math.random() * 90,
        size: 10 + Math.random() * 14,
        color: STAR_COLORS[i % STAR_COLORS.length],
        delay: Math.random() * 0.25,
        spin: Math.random() * 360,
      })),
    [count]
  )
  if (!active) return null
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden>
      {stars.map((st, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.2, 1, 0.6],
            x: Math.cos((st.angle * Math.PI) / 180) * st.dist,
            y: Math.sin((st.angle * Math.PI) / 180) * st.dist,
            rotate: st.spin,
          }}
          transition={{ duration: 1.4, delay: st.delay, ease: 'easeOut' }}
          className="absolute"
          style={{
            width: st.size,
            height: st.size,
            color: st.color,
          }}
        >
          <svg viewBox="0 0 20 20" className="h-full w-full drop-shadow">
            <path
              d="M10 0 L12.4 7 L20 7.6 L14 12 L16 19.4 L10 15 L4 19.4 L6 12 L0 7.6 L7.6 7 Z"
              fill={st.color}
            />
          </svg>
        </motion.span>
      ))}
    </div>
  )
}

/** Soft floating background decorations: clouds, stars, paint blobs. */
export function FloatingDecor({ dense = false }: { dense?: boolean }) {
  const items = useMemo(() => {
    const clouds = dense
      ? [
          { top: '6%', left: '8%', s: 90, d: 9 },
          { top: '14%', right: '10%', s: 70, d: 11 },
          { top: '58%', left: '4%', s: 60, d: 13 },
        ]
      : [
          { top: '8%', left: '6%', s: 80, d: 10 },
          { top: '12%', right: '8%', s: 64, d: 12 },
        ]
    const blobs = [
      { top: '46%', left: '-3%', s: 40, c: '#FF91B8' },
      { top: '64%', right: '-3%', s: 34, c: '#8DDEB0' },
    ]
    return { clouds, blobs }
  }, [dense])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.clouds.map((c, i) => (
        <motion.div
          key={`c${i}`}
          className="absolute"
          style={{ top: c.top, left: c.left, right: c.right, width: c.s, opacity: 0.5 }}
          animate={{ x: [0, 14, 0] }}
          transition={{ duration: c.d, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 100 60">
            <path
              d="M 20 52 a 14 14 0 0 1 -2 -28 a 18 18 0 0 1 34 -9 a 20 20 0 0 1 32 13 a 13 13 0 0 1 -6 24 Z"
              fill="#FFFFFF"
            />
          </svg>
        </motion.div>
      ))}
      {items.blobs.map((b, i) => (
        <motion.div
          key={`b${i}`}
          className="absolute rounded-full blur-md"
          style={{ top: b.top, left: b.left, right: b.right, width: b.s, height: b.s, background: b.c, opacity: 0.35 }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/** Small difficulty badge with stars. */
export function DifficultyDots({ level, label }: { level: 1 | 2 | 3; label: string }) {
  const color = level === 1 ? '#8DDEB0' : level === 2 ? '#FFD65A' : '#FF91B8'
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-[#35445B]"
      style={{ backgroundColor: `${color}CC` }}
    >
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: n <= level ? '#35445B' : 'rgba(53,68,91,0.2)' }}
        />
      ))}
      {label}
    </span>
  )
}
