'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
  Music, Volume2, Mic2, Vibrate, Sparkles, BookOpen, Info, ShieldCheck,
  Languages, ArrowRight, Trash2, Share2, Lock, Timer, UserRound, Pencil,
  Mail, Copy, Check, X,
} from 'lucide-react'
import { useApp, buzz } from '@/lib/store'
import { makeT, num, type TKey } from '@/lib/i18n'
import { initAudio, sfx } from '@/lib/sound'
import { Rango } from './Rango'
import { Slider } from '@/components/ui/slider'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { listArtworks, deleteAllArtworks, type ArtworkDto } from '@/lib/artworks'
import { cn } from '@/lib/utils'

const rowCls =
  'flex items-center gap-3 rounded-[1.3rem] border-[3px] border-[#35445B]/10 bg-white px-4 py-3 shadow-[0_4px_0_rgba(53,68,91,0.08)]'

function Row({ icon: Icon, label, children, tint = '#B9A0F5' }: {
  icon: typeof Music
  label: string
  children?: React.ReactNode
  tint?: string
}) {
  return (
    <div className={rowCls}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: `${tint}44` }}>
        <Icon className="h-5 w-5 text-[#35445B]" />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-black text-[#35445B]">{label}</span>
      {children}
    </div>
  )
}

/** Colorful, readable on/off toggle: mint + green check when on, soft rose + red cross when off. */
function ColorSwitch({ checked, onCheckedChange, label }: {
  checked: boolean
  onCheckedChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      dir="ltr"
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative grid h-8 w-[3.6rem] shrink-0 place-items-center rounded-full border-[3px] shadow-inner transition-colors',
        checked ? 'border-[#4CA97A]/45 bg-[#8DDEB0]' : 'border-[#D98A8A]/45 bg-[#F6D7D7]'
      )}
    >
      <motion.span
        initial={false}
        animate={{ x: checked ? 25 : 0 }}
        transition={{ type: 'spring', stiffness: 600, damping: 34 }}
        className="ml-[2px] grid h-[22px] w-[22px] place-items-center justify-self-start rounded-full bg-white shadow"
      >
        {checked ? (
          <Check className="h-3.5 w-3.5 text-[#2E9E6B]" strokeWidth={4} />
        ) : (
          <X className="h-3.5 w-3.5 text-[#E05656]" strokeWidth={4} />
        )}
      </motion.span>
    </button>
  )
}

export function SettingsPage() {
  const { lang, settings, updateSettings, go, setLang, kidName, setKidName } = useApp()
  const t = makeT(lang)
  const [showGuide, setShowGuide] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showName, setShowName] = useState(false)
  const [nameValue, setNameValue] = useState(kidName)
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(t('contactEmail'))
      sfx.success()
    } catch {
      sfx.tap()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  // hold-to-enter parents area
  const [hold, setHold] = useState(0)
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const startHold = () => {
    initAudio()
    if (holdTimer.current) clearInterval(holdTimer.current)
    setHold(0.001)
    const started = Date.now()
    holdTimer.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - started) / 2200)
      setHold(p)
      if (p >= 1) {
        clearInterval(holdTimer.current!)
        holdTimer.current = null
        setHold(0)
        sfx.success()
        buzz(true, 40)
        go('parents')
      }
    }, 50)
  }
  const cancelHold = () => {
    if (holdTimer.current) {
      clearInterval(holdTimer.current)
      holdTimer.current = null
    }
    if (hold > 0 && hold < 1) sfx.tap()
    setHold(0)
  }

  useEffect(() => () => {
    if (holdTimer.current) clearInterval(holdTimer.current)
  }, [])

  return (
    <div className="relative min-h-dvh overflow-x-hidden pb-28">
      <div className="mx-auto w-full max-w-xl px-4 pt-14">
        <h1 className="text-center text-2xl font-black text-[#35445B]">{t('settingsTitle')}</h1>

        <div className="mt-5 space-y-3">
          {/* language */}
          <Row icon={Languages} label={t('language')} tint="#78C8F8">
            <div className="flex gap-1.5">
              {(['fa', 'en'] as const).map((l) => (
                <motion.button
                  key={l}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    sfx.tap()
                    setLang(l)
                  }}
                  className={cn(
                    'rounded-xl px-3 py-1.5 text-sm font-black',
                    lang === l ? 'bg-[#78C8F8] text-[#35445B] shadow-[0_2px_0_rgba(53,68,91,0.2)]' : 'bg-[#35445B]/8 text-[#35445B]/60'
                  )}
                >
                  {l === 'fa' ? 'فارسی' : 'English'}
                </motion.button>
              ))}
            </div>
          </Row>

          {/* kid name */}
          <Row icon={UserRound} label={t('nameRow')} tint="#FFAA62">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                sfx.open()
                setNameValue(kidName)
                setShowName(true)
              }}
              className="flex items-center gap-1.5 rounded-xl bg-[#FFAA62]/25 px-3 py-1.5 text-sm font-black text-[#35445B]"
              aria-label={t('editName')}
            >
              <span className="max-w-24 truncate">{kidName || '—'}</span>
              <Pencil className="h-3.5 w-3.5" />
            </motion.button>
          </Row>

          {/* music */}
          <Row icon={Music} label={t('music')} tint="#FF91B8">
            <ColorSwitch
              checked={settings.music}
              onCheckedChange={(v) => {
                sfx.tap()
                updateSettings({ music: v })
              }}
              label={t('music')}
            />
          </Row>

          {/* sfx */}
          <Row icon={Volume2} label={t('sfx')} tint="#FFD65A">
            <div className="flex w-32 items-center gap-2">
              <ColorSwitch
                checked={settings.sfx}
                onCheckedChange={(v) => {
                  sfx.tap()
                  updateSettings({ sfx: v })
                }}
                label={t('sfx')}
              />
              {settings.sfx && (
                <Slider
                  value={[settings.sfxVolume * 100]}
                  onValueChange={([v]) => updateSettings({ sfxVolume: v / 100 })}
                  max={100}
                  step={10}
                  className="w-16"
                  aria-label={t('sfx')}
                />
              )}
            </div>
          </Row>

          {/* voice */}
          <Row icon={Mic2} label={t('voice')} tint="#8DDEB0">
            <ColorSwitch
              checked={settings.voice}
              onCheckedChange={(v) => {
                sfx.tap()
                updateSettings({ voice: v })
              }}
              label={t('voice')}
            />
          </Row>

          {/* vibration */}
          <Row icon={Vibrate} label={t('vibration')} tint="#FFAA62">
            <ColorSwitch
              checked={settings.vibration}
              onCheckedChange={(v) => {
                sfx.tap()
                updateSettings({ vibration: v })
                buzz(v, 30)
              }}
              label={t('vibration')}
            />
          </Row>

          {/* quality */}
          <Row icon={Sparkles} label={t('quality')} tint="#B9A0F5">
            <div className="flex gap-1.5">
              {(['high', 'low'] as const).map((q) => (
                <motion.button
                  key={q}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    sfx.tap()
                    updateSettings({ quality: q })
                  }}
                  className={cn(
                    'rounded-xl px-3 py-1.5 text-xs font-black',
                    settings.quality === q ? 'bg-[#B9A0F5] text-[#35445B] shadow-[0_2px_0_rgba(53,68,91,0.2)]' : 'bg-[#35445B]/8 text-[#35445B]/60'
                  )}
                >
                  {q === 'high' ? t('qualityHigh') : t('qualityLow')}
                </motion.button>
              ))}
            </div>
          </Row>

          {/* guide */}
          <button onClick={() => { sfx.open(); setShowGuide(true) }} className={cn(rowCls, 'w-full text-start')}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#78C8F8]/40">
              <BookOpen className="h-5 w-5 text-[#35445B]" />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-black text-[#35445B]">{t('guide')}</span>
          </button>

          {/* about */}
          <button onClick={() => { sfx.open(); setShowAbout(true) }} className={cn(rowCls, 'w-full text-start')}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#B9A0F5]/40">
              <Info className="h-5 w-5 text-[#35445B]" />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-black text-[#35445B]">{t('about')}</span>
          </button>

          {/* parents hold button */}
          <div className="rounded-[1.3rem] border-[3px] border-dashed border-[#35445B]/20 bg-white/70 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#35445B]/10">
                <Lock className="h-5 w-5 text-[#35445B]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-[#35445B]">{t('parentsArea')}</p>
                <p className="truncate text-[11px] font-bold text-[#35445B]/50">{t('holdToEnter')}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onPointerDown={startHold}
                onPointerUp={cancelHold}
                onPointerLeave={cancelHold}
                className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#35445B] text-white shadow-[0_3px_0_rgba(53,68,91,0.3)]"
                aria-label={t('parentsArea')}
              >
                <ShieldCheck className="h-6 w-6" />
                {hold > 0 && (
                  <span
                    className="absolute inset-x-0 bottom-0 bg-[#8DDEB0]"
                    style={{ height: `${hold * 100}%` }}
                  />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* guide dialog */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="max-w-sm rounded-[1.8rem] border-[3px] border-[#35445B]/10 bg-white p-5">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-black text-[#35445B]">{t('guide')}</DialogTitle>
            <DialogDescription className="sr-only">{t('guide')}</DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm font-bold text-[#35445B]/80">
            {(['guideText1', 'guideText2', 'guideText3', 'guideText4'] as TKey[]).map((k) => (
              <li key={k} className="flex gap-2 rounded-2xl bg-[#FFF7E6] px-3 py-2">
                <span className="text-[#FFAA62]">★</span>
                {t(k)}
              </li>
            ))}
          </ul>
          <button
            onClick={() => { setShowGuide(false); sfx.tap() }}
            className="mx-auto mt-2 block rounded-2xl bg-[#FFD65A] px-6 py-2.5 text-sm font-black text-[#35445B] shadow-[0_3px_0_rgba(53,68,91,0.18)]"
          >
            {t('ok')}
          </button>
        </DialogContent>
      </Dialog>

      {/* name dialog */}
      <Dialog open={showName} onOpenChange={setShowName}>
        <DialogContent className="max-w-sm rounded-[1.8rem] border-[3px] border-[#35445B]/10 bg-white p-5 text-center">
          <DialogHeader className="items-center">
            <DialogTitle className="text-lg font-black text-[#35445B]">{t('yourName')}</DialogTitle>
            <DialogDescription className="sr-only">{t('nameRow')}</DialogDescription>
          </DialogHeader>
          <input
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            maxLength={20}
            aria-label={t('yourName')}
            className="w-full rounded-2xl border-[3px] border-[#78C8F8]/60 bg-[#F2FAFF] px-4 py-3 text-center text-lg font-black text-[#35445B] outline-none focus:border-[#78C8F8]"
          />
          <button
            onClick={() => {
              sfx.success()
              setKidName(nameValue)
              setShowName(false)
            }}
            className="mx-auto mt-1 block rounded-2xl bg-[#FFD65A] px-8 py-2.5 text-sm font-black text-[#35445B] shadow-[0_3px_0_rgba(53,68,91,0.18)]"
          >
            {t('confirm')}
          </button>
        </DialogContent>
      </Dialog>

      {/* about dialog */}
      <Dialog open={showAbout} onOpenChange={setShowAbout}>
        <DialogContent className="max-w-sm rounded-[1.8rem] border-[3px] border-[#35445B]/10 bg-white p-5 text-center">
          <DialogHeader className="items-center">
            <DialogTitle className="text-lg font-black text-[#35445B]">{t('appName')}</DialogTitle>
            <DialogDescription className="text-sm font-bold text-[#35445B]/60">{t('aboutText')}</DialogDescription>
          </DialogHeader>
          <Rango mood="wave" size={110} className="mx-auto" />
          {/* stylish contact email card */}
          <div className="rounded-[1.4rem] border-[3px] border-[#FFAA62]/45 bg-gradient-to-br from-[#FFF7E6] to-[#FFE9F2] px-4 py-3.5 shadow-[0_4px_0_rgba(53,68,91,0.08)]">
            <p className="flex items-center justify-center gap-1.5 text-xs font-black text-[#35445B]/70">
              <Mail className="h-4 w-4 text-[#FFAA62]" strokeWidth={2.5} />
              {t('emailUs')}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2" dir="ltr">
              <a
                href={`mailto:${t('contactEmail')}`}
                className="flex items-center gap-2 rounded-full border-[3px] border-[#FF91B8]/50 bg-white px-4 py-2 text-sm font-black text-[#35445B] shadow-[0_3px_0_rgba(53,68,91,0.12)] transition-transform hover:scale-[1.03]"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#FF91B8] to-[#FFAA62] shadow-inner">
                  <Mail className="h-4 w-4 text-white" strokeWidth={2.5} />
                </span>
                <span className="min-w-0">{t('contactEmail')}</span>
              </a>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={copyEmail}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-[3px] border-[#8DDEB0]/70 bg-white shadow-[0_3px_0_rgba(53,68,91,0.12)]"
                aria-label={copied ? t('copied') : t('copy')}
              >
                {copied ? (
                  <Check className="h-4.5 w-4.5 text-[#2E9E6B]" strokeWidth={3} />
                ) : (
                  <Copy className="h-4.5 w-4.5 text-[#2E9E6B]" strokeWidth={2.5} />
                )}
              </motion.button>
            </div>
            {copied && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-center text-[11px] font-black text-[#2E9E6B]"
              >
                {t('copied')}
              </motion.p>
            )}
          </div>
          <p className="text-xs font-bold text-[#35445B]/40">{t('version')}</p>
          <button
            onClick={() => { setShowAbout(false); sfx.tap() }}
            className="mx-auto mt-1 block rounded-2xl bg-[#FFD65A] px-6 py-2.5 text-sm font-black text-[#35445B] shadow-[0_3px_0_rgba(53,68,91,0.18)]"
          >
            {t('ok')}
          </button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ------------------------------------------------------------------ parents
export function ParentsPage() {
  const { lang, settings, updateSettings, go, setLang } = useApp()
  const t = makeT(lang)
  const [stats, setStats] = useState<{ count: number; stars: number } | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmText, setConfirmText] = useState(false)

  useEffect(() => {
    listArtworks()
      .then((items: ArtworkDto[]) =>
        setStats({ count: items.length, stars: items.reduce((s, a) => s + a.stars, 0) })
      )
      .catch(() => setStats({ count: 0, stars: 0 }))
  }, [])

  const deleteAll = async () => {
    if (!confirmText) {
      setConfirmText(true)
      sfx.error()
      return
    }
    setConfirmText(false)
    setConfirmDelete(false)
    await deleteAllArtworks()
    sfx.pop()
    setStats({ count: 0, stars: 0 })
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#35445B] pb-16">
      <div className="mx-auto w-full max-w-xl px-4 pt-6 text-white">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => { sfx.close(); go('settings') }}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 rtl:rotate-180"
            aria-label={t('backToSettings')}
          >
            <ArrowRight className="h-6 w-6" />
          </motion.button>
          <div>
            <h1 className="text-xl font-black">{t('parentsTitle')}</h1>
            <p className="text-xs font-bold text-white/60">{t('parentsWelcome')}</p>
          </div>
        </div>

        {/* stats */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[1.3rem] bg-white/10 p-4 text-center">
            <p className="text-3xl font-black">{stats ? num(stats.count, lang) : '…'}</p>
            <p className="mt-1 text-xs font-bold text-white/70">{t('storageStats')}</p>
          </div>
          <div className="rounded-[1.3rem] bg-white/10 p-4 text-center">
            <p className="text-3xl font-black">{stats ? num(stats.stars, lang) : '…'}</p>
            <p className="mt-1 text-xs font-bold text-white/70">{t('starsStats')}</p>
          </div>
        </div>

        {/* controls */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-[1.3rem] bg-white/10 px-4 py-3.5">
            <span className="flex items-center gap-2 text-sm font-black">
              <Share2 className="h-5 w-5" />
              {t('sharingAllowed')}
            </span>
            <ColorSwitch label={t('sharingAllowed')} checked={settings.sharing} onCheckedChange={(v) => { sfx.tap(); updateSettings({ sharing: v }) }} />
          </div>

          <div className="flex items-center justify-between rounded-[1.3rem] bg-white/10 px-4 py-3.5">
            <span className="flex items-center gap-2 text-sm font-black">
              <Languages className="h-5 w-5" />
              {t('language')}
            </span>
            <div className="flex gap-1.5">
              {(['fa', 'en'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => { sfx.tap(); setLang(l) }}
                  className={cn(
                    'rounded-xl px-3 py-1.5 text-xs font-black',
                    lang === l ? 'bg-white text-[#35445B]' : 'bg-white/10 text-white/70'
                  )}
                >
                  {l === 'fa' ? 'فارسی' : 'English'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-[1.3rem] bg-white/10 px-4 py-3.5">
            <span className="flex items-center gap-2 text-sm font-black">
              <Music className="h-5 w-5" />
              {t('music')}
            </span>
            <ColorSwitch
              label={t('music')}
              checked={settings.music}
              onCheckedChange={(v) => { sfx.tap(); updateSettings({ music: v }) }}
            />
          </div>

          <button
            onClick={() => { initAudio(); sfx.open(); setConfirmDelete(true) }}
            className="flex w-full items-center justify-between rounded-[1.3rem] bg-[#E63946]/80 px-4 py-3.5 text-sm font-black text-white shadow-[0_3px_0_rgba(0,0,0,0.25)]"
          >
            <span className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              {t('deleteAll')}
            </span>
            {confirmDelete && <span className="animate-pulse text-xs">{t('confirm')}?</span>}
          </button>
        </div>

        {/* privacy */}
        <h2 className="mt-6 flex items-center gap-2 text-sm font-black text-white/80">
          <ShieldCheck className="h-4 w-4" />
          {t('privacyTitle')}
        </h2>
        <ul className="mt-2 space-y-2 pb-6 text-xs font-bold text-white/70">
          {(['noAds', 'noAccount', 'localOnly', 'noChat'] as TKey[]).map((k) => (
            <li key={k} className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5">
              <Timer className="h-3.5 w-3.5 shrink-0 text-[#8DDEB0]" />
              {t(k)}
            </li>
          ))}
        </ul>
      </div>

      {/* delete all confirm */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-xs rounded-[1.8rem] border-[3px] border-[#35445B]/10 bg-white p-5 text-center" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
          <DialogHeader className="items-center">
            <DialogTitle className="text-base font-black text-[#35445B]">{t('deleteAllConfirmTitle')}</DialogTitle>
            <DialogDescription className="text-sm font-bold text-[#35445B]/60">
              {t('deleteAllConfirmText')}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex justify-center gap-2">
            <button onClick={deleteAll} className="rounded-2xl bg-[#E63946] px-5 py-2.5 text-sm font-black text-white">
              {t('yes')}
            </button>
            <button
              onClick={() => { setConfirmDelete(false); setConfirmText(false); sfx.tap() }}
              className="rounded-2xl bg-[#35445B]/10 px-5 py-2.5 text-sm font-black text-[#35445B]"
            >
              {t('no')}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
