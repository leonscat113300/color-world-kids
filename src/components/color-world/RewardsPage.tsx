'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  Star, Trophy, Gift, Sparkles, Brush, Crown, Rainbow, Sun,
} from 'lucide-react'
import { useApp } from '@/lib/store'
import { makeT, num, tf } from '@/lib/i18n'
import { initAudio, sfx, playVoice } from '@/lib/sound'
import { Rango } from './Rango'
import { StarBurst } from './Fx'
import { listArtworks, type ArtworkDto } from '@/lib/artworks'

interface BadgeDef {
  key: 'badge1' | 'badge2' | 'badge3' | 'badge4' | 'badge5' | 'badge6' | 'badge7' | 'badge8'
  descKey:
    | 'badge1Desc' | 'badge2Desc' | 'badge3Desc' | 'badge4Desc'
    | 'badge5Desc' | 'badge6Desc' | 'badge7Desc' | 'badge8Desc'
  kind: 'drawings' | 'stars'
  need: number
  color: string
  icon: typeof Star
}

const BADGES: BadgeDef[] = [
  { key: 'badge1', descKey: 'badge1Desc', kind: 'drawings', need: 1, color: '#8DDEB0', icon: Star },
  { key: 'badge2', descKey: 'badge2Desc', kind: 'drawings', need: 10, color: '#78C8F8', icon: Brush },
  { key: 'badge3', descKey: 'badge3Desc', kind: 'drawings', need: 25, color: '#FFAA62', icon: Trophy },
  { key: 'badge4', descKey: 'badge4Desc', kind: 'drawings', need: 50, color: '#B9A0F5', icon: Gift },
  { key: 'badge5', descKey: 'badge5Desc', kind: 'drawings', need: 100, color: '#FF91B8', icon: Crown },
  { key: 'badge6', descKey: 'badge6Desc', kind: 'stars', need: 500, color: '#FFD65A', icon: Sparkles },
  { key: 'badge7', descKey: 'badge7Desc', kind: 'stars', need: 2000, color: '#F7B7C8', icon: Rainbow },
  { key: 'badge8', descKey: 'badge8Desc', kind: 'stars', need: 5000, color: '#FFC168', icon: Sun },
]

export function RewardsPage() {
  const { lang, settings, setStarTotal } = useApp()
  const t = makeT(lang)
  const [items, setItems] = useState<ArtworkDto[] | null>(null)

  useEffect(() => {
    listArtworks()
      .then((data: ArtworkDto[]) => {
        setItems(data)
        const total = data.reduce((s, a) => s + a.stars, 0)
        if (total !== useApp.getState().starTotal) setStarTotal(total)
      })
      .catch(() => setItems([]))
  }, [setStarTotal])

  const count = items?.length ?? 0
  const stars = useMemo(() => items?.reduce((s, a) => s + a.stars, 0) ?? 0, [items])
  const next = BADGES.find((b) => count < b.need)

  useEffect(() => {
    if (items && items.length > 0) {
      const to = setTimeout(() => sfx.achievement(), 400)
      return () => clearTimeout(to)
    }
  }, [items])

  return (
    <div className="relative min-h-dvh overflow-x-hidden pb-28">
      <div className="mx-auto w-full max-w-2xl px-4 pt-14">
        <h1 className="text-center text-2xl font-black text-[#35445B]">{t('rewardsTitle')}</h1>

        {/* stars hero */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 16 }}
          className="relative mx-auto mt-5 w-full max-w-sm overflow-hidden rounded-[2rem] border-[3px] border-[#35445B]/10 bg-gradient-to-br from-[#FFE38A] to-[#FFD65A] p-6 text-center shadow-[0_8px_0_rgba(53,68,91,0.14)]"
        >
          <StarBurst count={12} />
          <div className="flex items-center justify-center gap-3">
            <motion.span
              animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.12, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            >
              <Star className="h-14 w-14 fill-white text-[#35445B] drop-shadow" />
            </motion.span>
            <span className="text-5xl font-black text-[#35445B]">{num(stars, lang)}</span>
          </div>
          <p className="mt-1 text-sm font-black text-[#35445B]/70">{t('totalStars')}</p>
          <p className="mt-0.5 text-xs font-bold text-[#35445B]/55">{t('keepGoing')}</p>
        </motion.div>

        {/* badges */}
        <h2 className="mb-3 mt-7 flex items-center gap-2 text-lg font-black text-[#35445B]">
          <Sparkles className="h-5 w-5 text-[#FFAA62]" />
          {t('badges')}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BADGES.map((b, i) => {
            const cur = b.kind === 'drawings' ? count : stars
            const unlocked = cur >= b.need
            const pct = Math.min(100, Math.round((cur / b.need) * 100))
            const remaining = Math.max(0, b.need - cur)
            const Icon = b.icon
            return (
              <motion.div
                key={b.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileTap={unlocked ? { scale: 0.93, rotate: -2 } : undefined}
                onClick={() => {
                  if (!unlocked) return
                  initAudio()
                  sfx.achievement()
                  playVoice(lang, 'rStar', settings.voice)
                }}
                className={`relative rounded-[1.5rem] border-[3px] p-3 text-center shadow-[0_5px_0_rgba(53,68,91,0.1)] ${
                  unlocked ? 'bg-white border-[#35445B]/10' : 'bg-white/60 border-dashed border-[#35445B]/15'
                }`}
              >
                <span
                  className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${unlocked ? '' : 'grayscale opacity-40'}`}
                  style={{ backgroundColor: `${b.color}55` }}
                >
                  <Icon className="h-8 w-8 text-[#35445B]" />
                </span>
                <p className="mt-2 truncate text-sm font-black text-[#35445B]">{t(b.key)}</p>
                <p className="mt-0.5 text-[11px] font-bold text-[#35445B]/50">{t(b.descKey)}</p>
                {/* challenge progress */}
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#35445B]/10">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${b.color}, #FFAA62)` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.04, ease: 'easeOut' }}
                  />
                </div>
                {!unlocked && (
                  <p className="mt-1 text-[10px] font-black text-[#FF91B8]">
                    {b.kind === 'drawings'
                      ? tf(t, 'drawingsCount', remaining, lang)
                      : `${num(remaining, lang)} ★`}
                  </p>
                )}
                {unlocked && (
                  <motion.span
                    className="absolute end-2 top-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    <Star className="h-4 w-4 fill-[#FFD65A] text-[#35445B]/30" />
                  </motion.span>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* next goal */}
        {next && (
          <div className="mt-5 flex items-center gap-3 rounded-[1.5rem] border-[3px] border-[#35445B]/10 bg-white p-4 shadow-[0_5px_0_rgba(53,68,91,0.1)]">
            <Rango mood="think" size={72} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-[#35445B]">
                {t(next.key)} — {t('nextBadge')}{' '}
                {num(next.kind === 'drawings' ? next.need - count : next.need - stars, lang)}
              </p>
              <div className="mt-2 h-4 overflow-hidden rounded-full bg-[#35445B]/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#FFD65A] to-[#FFAA62]"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, ((next.kind === 'drawings' ? count : stars) / next.need) * 100)}%`,
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
