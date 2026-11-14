'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import {
  Eye, Pencil, PenLine, Trash2, Download, Share2, Brush, Star, X,
} from 'lucide-react'
import { useApp, buzz } from '@/lib/store'
import { makeT, num, type TKey } from '@/lib/i18n'
import { initAudio, sfx } from '@/lib/sound'
import {
  fetchImageBlob, safeFileName, saveImageToDevice, shareImage, isAbort,
} from '@/lib/save-image'
import { useToast } from '@/hooks/use-toast'
import { Rango } from './Rango'
import { StarBurst } from './Fx'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

export interface ArtworkDto {
  id: number
  title: string
  templateId: string
  stars: number
  state: string
  createdAt: string
}

const iconBtn =
  'grid h-9 w-9 place-items-center rounded-xl border-2 border-[#35445B]/10 bg-white text-[#35445B]/70 shadow-sm'

export function GalleryPage() {
  const { lang, settings, go, openEdit } = useApp()
  const t = makeT(lang)
  const { toast } = useToast()
  const [items, setItems] = useState<ArtworkDto[] | null>(null)
  const [viewItem, setViewItem] = useState<ArtworkDto | null>(null)
  const [renameItem, setRenameItem] = useState<ArtworkDto | null>(null)
  const [newName, setNewName] = useState('')
  const [deleteItem, setDeleteItem] = useState<ArtworkDto | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/artworks')
      setItems(await res.json())
    } catch {
      setItems([])
    }
  }, [])

  useEffect(() => {
    let alive = true
    fetch('/api/artworks')
      .then((r) => r.json())
      .then((data: ArtworkDto[]) => {
        if (alive) setItems(data)
      })
      .catch(() => {
        if (alive) setItems([])
      })
    return () => {
      alive = false
    }
  }, [])

  const doRename = async () => {
    if (!renameItem) return
    sfx.tap()
    await fetch(`/api/artworks/${renameItem.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newName.trim() || t('artworkName') }),
    })
    setRenameItem(null)
    sfx.success()
    void load()
  }

  const doDelete = async () => {
    if (!deleteItem) return
    await fetch(`/api/artworks/${deleteItem.id}`, { method: 'DELETE' })
    setDeleteItem(null)
    setViewItem(null)
    sfx.pop()
    buzz(settings.vibration, 30)
    void load()
  }

  /** Really saves the PNG on the phone (Downloads / Documents / gallery). */
  const download = async (a: ArtworkDto) => {
    sfx.tap()
    try {
      const blob = await fetchImageBlob(`/api/artworks/${a.id}/image`)
      await saveImageToDevice(blob, safeFileName(a.title))
      sfx.success()
      buzz(settings.vibration, 30)
      toast({ description: t('savedToDevice') })
    } catch (err) {
      if (isAbort(err)) return // user closed the native dialog
      sfx.error()
      toast({ description: t('saveFailed') })
    }
  }

  const share = async (a: ArtworkDto) => {
    sfx.tap()
    if (!settings.sharing) {
      sfx.error()
      toast({ description: t('sharedDisabled') })
      return
    }
    try {
      await shareImage(`/api/artworks/${a.id}/image`, a.title || 'artwork')
      sfx.success()
    } catch (err) {
      if (isAbort(err)) return // user closed the share sheet
      // couldn't open a share sheet → save it instead
      try {
        const blob = await fetchImageBlob(`/api/artworks/${a.id}/image`)
        await saveImageToDevice(blob, safeFileName(a.title))
        sfx.success()
        toast({ description: t('savedToDevice') })
      } catch (err2) {
        if (isAbort(err2)) return
        sfx.error()
        toast({ description: t('saveFailed') })
      }
    }
  }

  const dateStr = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')
    } catch {
      return ''
    }
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden pb-28">
      <div className="mx-auto w-full max-w-2xl px-4 pt-14">
        <h1 className="text-center text-2xl font-black text-[#35445B]">{t('galleryTitle')}</h1>

        {items === null && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-[1.4rem]" />
            ))}
          </div>
        )}

        {items !== null && items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex flex-col items-center gap-3 text-center"
          >
            <Rango mood="sad" size={130} />
            <p className="text-lg font-black text-[#35445B]">{t('emptyGallery')}</p>
            <p className="text-sm font-bold text-[#35445B]/60">{t('emptyGalleryHint')}</p>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => {
                initAudio()
                sfx.open()
                go('categories')
              }}
              className="mt-1 flex items-center gap-2 rounded-2xl bg-[#FFD65A] px-6 py-3 text-base font-black text-[#35445B] shadow-[0_4px_0_rgba(53,68,91,0.18)]"
            >
              <Brush className="h-5 w-5" />
              {t('makeFirstArt')}
            </motion.button>
          </motion.div>
        )}

        {items !== null && items.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <AnimatePresence>
              {items.map((a, i) => (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className="relative overflow-hidden rounded-[1.4rem] border-[3px] border-[#35445B]/10 bg-white p-2 shadow-[0_5px_0_rgba(53,68,91,0.1)]"
                >
                  <button
                    onClick={() => {
                      sfx.pop()
                      setViewItem(a)
                    }}
                    className="block w-full"
                    aria-label={a.title}
                  >
                    <img
                      src={`/api/artworks/${a.id}/image`}
                      alt={a.title}
                      className="aspect-square w-full rounded-xl border-2 border-[#35445B]/5 bg-white object-contain"
                      loading="lazy"
                    />
                  </button>
                  <div className="mt-1.5 flex items-center justify-between gap-1 px-0.5">
                    <span className="min-w-0 truncate text-xs font-black text-[#35445B]">{a.title}</span>
                    <span className="flex shrink-0 items-center gap-0.5 text-[11px] font-black text-[#FFAA62]">
                      <Star className="h-3.5 w-3.5 fill-[#FFD65A] text-[#35445B]/30" />
                      {num(a.stars, lang)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between gap-1 border-t-2 border-dashed border-[#35445B]/10 pt-1.5">
                    <span className="truncate text-[10px] font-bold text-[#35445B]/40">{dateStr(a.createdAt)}</span>
                    <div className="flex gap-1">
                      <button
                        className={iconBtn}
                        onClick={() => openEdit({ id: a.id, title: a.title, templateId: a.templateId, state: a.state })}
                        aria-label={t('edit')}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        className={iconBtn}
                        onClick={() => {
                          sfx.tap()
                          setRenameItem(a)
                          setNewName(a.title)
                        }}
                        aria-label={t('rename')}
                      >
                        <PenLine className="h-4 w-4" />
                      </button>
                      <button
                        className={iconBtn}
                        onClick={() => {
                          sfx.tap()
                          setDeleteItem(a)
                        }}
                        aria-label={t('delete')}
                      >
                        <Trash2 className="h-4 w-4 text-[#E63946]/80" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* fullscreen view */}
      <Dialog open={!!viewItem} onOpenChange={(o) => !o && setViewItem(null)}>
        <DialogContent className="max-w-md rounded-[1.8rem] border-[3px] border-[#35445B]/10 bg-white p-4">
          {viewItem && (
            <>
              <DialogHeader className="flex-row items-center justify-between space-y-0">
                <DialogTitle className="text-base font-black text-[#35445B]">{viewItem.title}</DialogTitle>
                <DialogDescription className="sr-only">{viewItem.title}</DialogDescription>
                <div className="flex gap-1.5">
                  <button className={iconBtn} onClick={() => download(viewItem)} aria-label={t('download')}>
                    <Download className="h-4 w-4" />
                  </button>
                  <button className={iconBtn} onClick={() => share(viewItem)} aria-label={t('share')}>
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    className={iconBtn}
                    onClick={() => {
                      sfx.close()
                      setViewItem(null)
                    }}
                    aria-label={t('close')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </DialogHeader>
              <div className="relative">
                <img
                  src={`/api/artworks/${viewItem.id}/image`}
                  alt={viewItem.title}
                  className="mt-2 w-full rounded-2xl border-2 border-[#35445B]/5 bg-white"
                />
                <StarBurst count={10} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* rename */}
      <Dialog open={!!renameItem} onOpenChange={(o) => !o && setRenameItem(null)}>
        <DialogContent className="max-w-xs rounded-[1.8rem] border-[3px] border-[#35445B]/10 bg-white p-5">
          <DialogHeader>
            <DialogTitle className="text-center text-base font-black text-[#35445B]">{t('rename')}</DialogTitle>
            <DialogDescription className="text-center text-xs font-bold text-[#35445B]/60">
              {t('newTitle')}
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="rounded-2xl border-[3px] border-[#35445B]/15 py-5 text-center font-bold"
          />
          <div className="mt-2 flex justify-center gap-2">
            <button
              onClick={doRename}
              className="rounded-2xl bg-[#8DDEB0] px-6 py-2.5 text-sm font-black text-[#35445B] shadow-[0_3px_0_rgba(53,68,91,0.18)]"
            >
              {t('ok')}
            </button>
            <button
              onClick={() => setRenameItem(null)}
              className="rounded-2xl bg-[#35445B]/10 px-6 py-2.5 text-sm font-black text-[#35445B]"
            >
              {t('cancel')}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* delete confirm */}
      <Dialog open={!!deleteItem} onOpenChange={(o) => !o && setDeleteItem(null)}>
        <DialogContent className="max-w-xs rounded-[1.8rem] border-[3px] border-[#35445B]/10 bg-white p-5 text-center">
          <DialogHeader className="items-center">
            <DialogTitle className="text-base font-black text-[#35445B]">{t('deleteConfirmTitle')}</DialogTitle>
            <DialogDescription className="text-sm font-bold text-[#35445B]/60">
              {t('deleteConfirmText')}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex justify-center gap-2">
            <button
              onClick={doDelete}
              className="rounded-2xl bg-[#FF91B8] px-6 py-2.5 text-sm font-black text-[#35445B] shadow-[0_3px_0_rgba(53,68,91,0.18)]"
            >
              {t('yes')}
            </button>
            <button
              onClick={() => setDeleteItem(null)}
              className="rounded-2xl bg-[#35445B]/10 px-6 py-2.5 text-sm font-black text-[#35445B]"
            >
              {t('no')}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
