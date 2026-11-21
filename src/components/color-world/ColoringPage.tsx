'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight, PaintBucket, Brush, Pencil, Highlighter as Crayon, Eraser, Undo2, Redo2,
  Sticker as StickerIcon, Trash2, CircleHelp, Save, Minus, Plus, Maximize,
  RotateCw, X, Palette as PaletteIcon, Check,
} from 'lucide-react'
import { useApp, buzz } from '@/lib/store'
import { makeT, tf, num, type TKey } from '@/lib/i18n'
import { templateById, dailyTemplate } from '@/lib/templates'
import { MAIN_COLORS, PALETTES, paletteTitle } from '@/lib/palettes'
import { STICKERS, stickerById, stickerDataUrl } from '@/lib/stickers'
import { initAudio, sfx, playVoice } from '@/lib/sound'
import { saveArtwork } from '@/lib/artwork-store'
import { Rango, SpeechBubble } from './Rango'
import { StarBurst } from './Fx'
import { cn } from '@/lib/utils'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'

type Tool = 'fill' | 'brush' | 'pencil' | 'crayon' | 'eraser' | 'sticker'

interface Stroke {
  tool: 'brush' | 'pencil' | 'crayon' | 'eraser'
  color: string
  size: number
  points: number[][] // [x, y] in 0..512 template units
}

interface Placed {
  id: string
  x: number // 0..512
  y: number
  size: number
  rot: number
}

interface Snapshot {
  fills: Record<number, string>
  strokes: Stroke[]
  stickers: Placed[]
}

const SIZES: Record<string, number[]> = {
  brush: [9, 16, 28],
  pencil: [3, 5, 8],
  crayon: [13, 21, 33],
  eraser: [26, 44, 70],
}

const TOOLBAR: { tool: Tool; icon: typeof Brush; key: TKey; bg: string }[] = [
  { tool: 'fill', icon: PaintBucket, key: 'toolFill', bg: '#78C8F8' },
  { tool: 'brush', icon: Brush, key: 'toolBrush', bg: '#FF91B8' },
  { tool: 'pencil', icon: Pencil, key: 'toolPencil', bg: '#FFD65A' },
  { tool: 'crayon', icon: Crayon, key: 'toolCrayon', bg: '#B9A0F5' },
  { tool: 'eraser', icon: Eraser, key: 'toolEraser', bg: '#8DDEB0' },
]

export function ColoringPage() {
  const { lang, settings, currentTemplateId, editing, go, clearEdit } = useApp()
  const t = makeT(lang)
  const tpl = useMemo(
    () => templateById(currentTemplateId ?? '') ?? dailyTemplate(),
    [currentTemplateId]
  )

  const [tool, setTool] = useState<Tool>('fill')
  const [color, setColor] = useState('#E63946')
  const [sizeIdx, setSizeIdx] = useState(1)
  const [zoom, setZoom] = useState({ s: 1, x: 0, y: 0 })
  const [sheet, setSheet] = useState<null | 'palette' | 'stickers'>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showClear, setShowClear] = useState(false)
  const [saveStep, setSaveStep] = useState<null | 'name' | 'saving' | 'done'>(null)
  const [title, setTitle] = useState(editing?.title ?? '')
  const [earned, setEarned] = useState(0)
  const [isPainting, setIsPainting] = useState(false)
  const [fills, setFillsState] = useState<Record<number, string>>({})
  const [histLen, setHistLen] = useState(1)
  const [redoLen, setRedoLen] = useState(0)
  const [stickerVersion, bumpStickers] = useReducerPlus()
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)
  const [pendingSticker, setPendingSticker] = useState<string | null>(null)
  const [rangoLine, setRangoLine] = useState<TKey | null>(null)

  const svgFillRef = useRef<HTMLDivElement>(null)
  const svgLineRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const fillsRef = useRef<Record<number, string>>({})
  const strokesRef = useRef<Stroke[]>([])
  const stickersRef = useRef<Placed[]>([])
  const historyRef = useRef<Snapshot[]>([])
  const redoStackRef = useRef<Snapshot[]>([])
  const activeStrokeRef = useRef<Stroke | null>(null)
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map())
  const gestureRef = useRef<{ d0: number; mx0: number; my0: number; s0: number; tx0: number; ty0: number } | null>(null)
  const stickerDragRef = useRef<{ id: string; dx: number; dy: number } | null>(null)
  const lastBrushSfxRef = useRef(0)

  const sizeValue = SIZES[tool === 'sticker' ? 'brush' : tool]?.[sizeIdx] ?? 16

  const setFills = (next: Record<number, string>) => {
    fillsRef.current = next
    setFillsState(next)
  }

  // SVG string derived from fills state — innerHTML resets re-apply colors safely
  const markedSvg = useMemo(() => {
    let i = 0
    return tpl.svg.replace(/fill="#FFFFFF"/g, () => {
      const idx = i++
      const c = fills[idx]
      return `fill="${c ?? '#FFFFFF'}" data-c="${idx}"`
    })
  }, [tpl.svg, fills])

  // split into a fill-only layer (below paint) and a line-only layer (above paint)
  const fillsLayer = useMemo(
    () => markedSvg.replace(/stroke="#303030" stroke-width="[^"]*"/g, 'stroke="none"'),
    [markedSvg]
  )
  const linesLayer = useMemo(
    () => markedSvg.replace(/fill="[^"]*"/g, 'fill="none"'),
    [markedSvg]
  )

  // ------------------------------------------------------------- history
  const snapshot = useCallback((): Snapshot => ({
    fills: { ...fillsRef.current },
    strokes: [...strokesRef.current],
    stickers: [...stickersRef.current],
  }), [])

  const applySnapshot = useCallback((snap: Snapshot) => {
    fillsRef.current = { ...snap.fills }
    strokesRef.current = [...snap.strokes]
    stickersRef.current = [...snap.stickers]
    setFillsState({ ...snap.fills })
    redrawOverlay()
    bumpStickers()
  }, [bumpStickers])

  const pushHistory = useCallback(() => {
    historyRef.current.push(snapshot())
    if (historyRef.current.length > 40) historyRef.current.shift()
    redoStackRef.current = []
    setHistLen(historyRef.current.length)
    setRedoLen(0)
  }, [snapshot])

  const undo = useCallback(() => {
    if (historyRef.current.length <= 1) return
    const cur = historyRef.current.pop()!
    redoStackRef.current.push(cur)
    applySnapshot(historyRef.current[historyRef.current.length - 1])
    setHistLen(historyRef.current.length)
    setRedoLen(redoStackRef.current.length)
    sfx.undo()
  }, [applySnapshot])

  const redo = useCallback(() => {
    if (redoStackRef.current.length === 0) return
    const snap = redoStackRef.current.pop()!
    historyRef.current.push(snap)
    applySnapshot(snap)
    setHistLen(historyRef.current.length)
    setRedoLen(redoStackRef.current.length)
    sfx.redo()
  }, [applySnapshot])

  // ------------------------------------------------------------- overlay painting
  function redrawOverlay() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const k = canvas.width / 512
    ctx.setTransform(k, 0, 0, k, 0, 0)
    ctx.clearRect(0, 0, 512, 512)
    for (const st of strokesRef.current) paintStroke(ctx, st)
  }

  function paintStroke(ctx: CanvasRenderingContext2D, st: Stroke) {
    ctx.save()
    ctx.globalCompositeOperation = st.tool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.strokeStyle = st.color
    ctx.fillStyle = st.color
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const passes: Array<[number, number, number]> =
      st.tool === 'crayon'
        ? [
            [0, 0, 0.55],
            [st.size * 0.16, -st.size * 0.12, 0.3],
            [-st.size * 0.14, st.size * 0.14, 0.3],
            [st.size * 0.02, st.size * 0.18, 0.25],
          ]
        : [[0, 0, 1]]
    for (const [ox, oy, alpha] of passes) {
      ctx.globalAlpha = alpha
      ctx.lineWidth = st.size
      ctx.beginPath()
      const pts = st.points
      if (pts.length === 1) {
        ctx.arc(pts[0][0] + ox, pts[0][1] + oy, st.size / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.moveTo(pts[0][0] + ox, pts[0][1] + oy)
        for (let i = 1; i < pts.length - 1; i++) {
          const mx = (pts[i][0] + pts[i + 1][0]) / 2
          const my = (pts[i][1] + pts[i + 1][1]) / 2
          ctx.quadraticCurveTo(pts[i][0] + ox, pts[i][1] + oy, mx + ox, my + oy)
        }
        const last = pts[pts.length - 1]
        ctx.lineTo(last[0] + ox, last[1] + oy)
        ctx.stroke()
      }
    }
    ctx.restore()
  }

  // ------------------------------------------------------------- mount effects
  useEffect(() => {
    fillsRef.current = {}
    strokesRef.current = []
    stickersRef.current = []

    // restore edit state if editing a saved artwork
    if (editing?.state) {
      try {
        const saved = JSON.parse(editing.state) as Partial<Snapshot>
        fillsRef.current = saved.fills ?? {}
        strokesRef.current = saved.strokes ?? []
        stickersRef.current = saved.stickers ?? []
      } catch {
        /* ignore corrupt state */
      }
    }
    setFillsState({ ...fillsRef.current })
    historyRef.current = [snapshot()]
    redoStackRef.current = []
    setHistLen(1)
    setRedoLen(0)
    bumpStickers()
  }, [tpl.id])

  // resize canvas to element size (with DPR)
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * Math.max(zoom.s, 1)
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      redrawOverlay()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [zoom.s])

  // ------------------------------------------------------------- coordinate helpers
  const tplPoint = (clientX: number, clientY: number): [number, number] | null => {
    const wrap = wrapRef.current
    if (!wrap) return null
    const rect = wrap.getBoundingClientRect()
    if (rect.width === 0) return null
    const x = ((clientX - rect.left) / rect.width) * 512
    const y = ((clientY - rect.top) / rect.height) * 512
    return [Math.max(-20, Math.min(532, x)), Math.max(-20, Math.min(532, y))]
  }

  // ------------------------------------------------------------- pointer handlers
  const onPointerDown = (e: React.PointerEvent) => {
    initAudio()
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointersRef.current.size === 2) {
      // begin pinch/pan gesture, cancel any stroke
      activeStrokeRef.current = null
      setIsPainting(false)
      const pts = Array.from(pointersRef.current.values())
      const d0 = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      gestureRef.current = {
        d0: Math.max(20, d0),
        mx0: (pts[0].x + pts[1].x) / 2,
        my0: (pts[0].y + pts[1].y) / 2,
        s0: zoom.s,
        tx0: zoom.x,
        ty0: zoom.y,
      }
      return
    }
    if (pointersRef.current.size > 2) return

    if (tool === 'sticker') {
      if (pendingSticker) {
        const p = tplPoint(e.clientX, e.clientY)
        if (p) {
          const placed: Placed = { id: pendingSticker, x: p[0], y: p[1], size: 90, rot: 0 }
          stickersRef.current.push(placed)
          pushHistory()
          bumpStickers()
          setSelectedSticker(placed.id)
          setPendingSticker(null)
          sfx.sticker()
          buzz(settings.vibration)
        }
      } else {
        setSelectedSticker(null)
      }
      return
    }

    if (tool === 'fill') return // handled by SVG click

    // free drawing
    const p = tplPoint(e.clientX, e.clientY)
    if (!p) return
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    activeStrokeRef.current = {
      tool: tool as Stroke['tool'],
      color: tool === 'eraser' ? '#000' : color,
      size: sizeValue,
      points: [p],
    }
    setIsPainting(true)
    const now = performance.now()
    if (now - lastBrushSfxRef.current > 120) {
      sfx.brush()
      lastBrushSfxRef.current = now
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    // pinch / pan
    if (pointersRef.current.size === 2 && gestureRef.current) {
      const pts = Array.from(pointersRef.current.values())
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const mx = (pts[0].x + pts[1].x) / 2
      const my = (pts[0].y + pts[1].y) / 2
      const g = gestureRef.current
      const s = Math.max(1, Math.min(4, (g.s0 * d) / g.d0))
      const k = s / g.s0
      const rect = wrapRef.current?.parentElement?.getBoundingClientRect()
      const Ox = rect ? rect.left + rect.width / 2 : 0
      const Oy = rect ? rect.top + rect.height / 2 : 0
      // keep the content point under the fingers fixed while following the pan
      setZoom({
        s,
        x: mx - Ox - k * (g.mx0 - Ox) + k * g.tx0,
        y: my - Oy - k * (g.my0 - Oy) + k * g.ty0,
      })
      return
    }

    // sticker drag
    if (stickerDragRef.current && tool === 'sticker') {
      const p = tplPoint(e.clientX, e.clientY)
      if (p) {
        const st = stickersRef.current.find((s) => s.id === stickerDragRef.current!.id)
        if (st) {
          st.x = p[0] - stickerDragRef.current.dx
          st.y = p[1] - stickerDragRef.current.dy
          bumpStickers()
        }
      }
      return
    }

    // stroke extension
    const st = activeStrokeRef.current
    if (!st) return
    const p = tplPoint(e.clientX, e.clientY)
    if (!p) return
    st.points.push(p)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const k = canvas.width / 512
        ctx.setTransform(k, 0, 0, k, 0, 0)
        // draw only newest segment incrementally
        const n = st.points.length
        const seg: Stroke = { ...st, points: st.points.slice(Math.max(0, n - 3)) }
        paintStroke(ctx, seg)
      }
    }
    const now = performance.now()
    if (now - lastBrushSfxRef.current > 140) {
      sfx.brush()
      lastBrushSfxRef.current = now
    }
  }

  const onPointerUp = (e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId)
    if (pointersRef.current.size < 2) gestureRef.current = null
    if (stickerDragRef.current) {
      stickerDragRef.current = null
      pushHistory()
      return
    }
    const st = activeStrokeRef.current
    if (st) {
      if (st.points.length > 0) {
        strokesRef.current.push(st)
        pushHistory()
      }
      activeStrokeRef.current = null
      setIsPainting(false)
    }
  }

  // ------------------------------------------------------------- fill tool
  const onSvgClick = (e: React.MouseEvent) => {
    if (tool !== 'fill') return
    const el = e.target as SVGElement
    const idx = el.getAttribute('data-c')
    if (idx === null) return
    const i = Number(idx)
    setFills({ ...fillsRef.current, [i]: color })
    pushHistory()
    sfx.fill()
    buzz(settings.vibration, 18)
    if (Math.random() < 0.35) {
      setRangoLine('rColor')
      playVoice(lang, 'rColor', settings.voice)
      setTimeout(() => setRangoLine(null), 2600)
    }
  }

  // ------------------------------------------------------------- sticker helpers
  const startStickerDrag = (e: React.PointerEvent, st: Placed) => {
    if (tool !== 'sticker') return
    e.stopPropagation()
    const p = tplPoint(e.clientX, e.clientY)
    if (!p) return
    stickerDragRef.current = { id: st.id, dx: p[0] - st.x, dy: p[1] - st.y }
    setSelectedSticker(st.id)
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }

  const mutateSticker = (id: string, fn: (s: Placed) => void) => {
    const st = stickersRef.current.find((s) => s.id === id)
    if (!st) return
    fn(st)
    pushHistory()
    bumpStickers()
    sfx.tap()
  }

  const removeSticker = (id: string) => {
    stickersRef.current = stickersRef.current.filter((s) => s.id !== id)
    setSelectedSticker(null)
    pushHistory()
    bumpStickers()
    sfx.pop()
  }

  // ------------------------------------------------------------- save
  async function composeImage(): Promise<string> {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 1024
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, 1024, 1024)
    const drawSvgLayer = async (host: HTMLDivElement | null) => {
      const svg = host?.querySelector('svg')
      if (!svg) return
      const clone = svg.cloneNode(true) as SVGSVGElement
      clone.setAttribute('width', '1024')
      clone.setAttribute('height', '1024')
      const xml = new XMLSerializer().serializeToString(clone)
      const img = new Image()
      await new Promise<void>((res, rej) => {
        img.onload = () => res()
        img.onerror = () => rej(new Error('svg load failed'))
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml)
      })
      ctx.drawImage(img, 0, 0, 1024, 1024)
    }
    await drawSvgLayer(svgFillRef.current)
    const overlay = canvasRef.current
    if (overlay) ctx.drawImage(overlay, 0, 0, 1024, 1024)
    await drawSvgLayer(svgLineRef.current)
    for (const st of stickersRef.current) {
      const img = new Image()
      await new Promise<void>((res, rej) => {
        img.onload = () => res()
        img.onerror = () => rej(new Error('sticker load failed'))
        img.src = stickerDataUrl(st.id)
      })
      ctx.save()
      ctx.translate((st.x / 512) * 1024, (st.y / 512) * 1024)
      ctx.rotate((st.rot * Math.PI) / 180)
      const w = (st.size / 512) * 1024
      ctx.drawImage(img, -w / 2, -w / 2, w, w)
      ctx.restore()
    }
    return c.toDataURL('image/png')
  }

  const doSave = async () => {
    setSaveStep('saving')
    sfx.tap()
    try {
      const image = await composeImage()
      const state = JSON.stringify({
        fills: fillsRef.current,
        strokes: strokesRef.current,
        stickers: stickersRef.current,
      })
      const stars = Math.max(1, Object.keys(fillsRef.current).length + stickersRef.current.length)
      await saveArtwork(
        {
          title: title.trim() || t('artworkName'),
          image,
          templateId: tpl.id,
          state,
          stars,
        },
        editing?.id
      )
      setEarned(stars)
      setSaveStep('done')
      sfx.achievement()
      const st = useApp.getState()
      st.setStarTotal((st.starTotal ?? 0) + stars)
      clearEdit()
    } catch {
      setSaveStep(null)
      sfx.error()
    }
  }

  // ------------------------------------------------------------- zoom controls
  const zoomBy = (factor: number) => {
    setZoom((z) => {
      const s = Math.max(1, Math.min(4, z.s * factor))
      if (s === z.s) return z
      const k = s / z.s
      return { s, x: z.x * k, y: z.y * k }
    })
    sfx.tap()
  }
  const zoomReset = () => {
    setZoom({ s: 1, x: 0, y: 0 })
    sfx.tap()
  }

  const setToolWithSound = (tool: Tool) => {
    initAudio()
    sfx.tap()
    buzz(settings.vibration)
    setTool(tool)
    if (tool !== 'sticker') setPendingSticker(null)
    if (tool === 'eraser' && Math.random() < 0.3) {
      playVoice(lang, 'rAnother', settings.voice)
    }
  }

  const pickColor = (c: string) => {
    setColor(c)
    sfx.pick()
    if (Math.random() < 0.3) playVoice(lang, 'rColor', settings.voice)
  }

  const diffLabel = (d: 1 | 2 | 3): string => t((d === 1 ? 'easy' : d === 2 ? 'medium' : 'hard') as TKey)

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#78C8F8]">
      {/* top bar */}
      <header className="z-20 flex items-center gap-2 px-3 pt-3">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => {
            sfx.close()
            go('categories')
          }}
          className="grid h-11 w-11 place-items-center rounded-2xl border-[3px] border-[#35445B]/15 bg-white shadow-[0_4px_0_rgba(53,68,91,0.12)] rtl:rotate-180"
          aria-label={t('back')}
        >
          <ArrowRight className="h-6 w-6 text-[#35445B]" />
        </motion.button>
        <div className="min-w-0 flex-1 text-center">
          <h1 className="truncate text-base font-black text-[#35445B] sm:text-lg">
            {lang === 'fa' ? tpl.fa : tpl.en}
          </h1>
          <span className="text-[10px] font-bold text-[#35445B]/60">{diffLabel(tpl.difficulty)}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => {
            sfx.open()
            setShowHelp(true)
          }}
          className="grid h-11 w-11 place-items-center rounded-2xl border-[3px] border-[#35445B]/15 bg-white shadow-[0_4px_0_rgba(53,68,91,0.12)]"
          aria-label={t('help')}
        >
          <CircleHelp className="h-6 w-6 text-[#78C8F8]" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => {
            initAudio()
            sfx.open()
            setTitle(editing?.title ?? '')
            setSaveStep('name')
          }}
          className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FFD65A] shadow-[0_4px_0_rgba(53,68,91,0.18)]"
          aria-label={t('save')}
        >
          <Save className="h-6 w-6 text-[#35445B]" />
        </motion.button>
      </header>

      {/* stage */}
      <div className="relative z-10 mx-auto mt-2 flex w-full max-w-[560px] min-h-0 flex-1 flex-col items-center justify-center px-3">
        <div className="relative aspect-square w-full">
          <div
            ref={wrapRef}
            className="absolute inset-0 touch-none select-none rounded-[1.4rem] bg-white shadow-[0_8px_0_rgba(53,68,91,0.15)]"
            style={{
              transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.s})`,
              transition: gestureRef.current ? 'none' : 'transform 0.18s ease-out',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {/* color regions (below paint) */}
            <div
              ref={svgFillRef}
              onClick={onSvgClick}
              className="tpl-preview absolute inset-0 [&>svg]:h-full [&>svg]:w-full"
              style={{ pointerEvents: tool === 'fill' ? 'auto' : 'none' }}
              dangerouslySetInnerHTML={{ __html: fillsLayer }}
              aria-hidden
            />
            {/* paint overlay */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
              style={{ pointerEvents: 'none' }}
            />
            {/* black line art (above paint, never intercepts) */}
            <div
              ref={svgLineRef}
              className="tpl-preview pointer-events-none absolute inset-0 [&>svg]:h-full [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: linesLayer }}
              aria-hidden
            />
            {/* stickers layer */}
            <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
              {stickersRef.current.map((st) => (
                <div
                  key={st.id}
                  className="absolute"
                  style={{
                    left: `${(st.x / 512) * 100}%`,
                    top: `${(st.y / 512) * 100}%`,
                    width: `${(st.size / 512) * 100}%`,
                    transform: `translate(-50%, -50%) rotate(${st.rot}deg)`,
                    pointerEvents: tool === 'sticker' ? 'auto' : 'none',
                    touchAction: 'none',
                  }}
                  onPointerDown={(e) => startStickerDrag(e, st)}
                >
                  <div
                    className={cn(
                      'tpl-preview aspect-square w-full',
                      selectedSticker === st.id && tool === 'sticker' &&
                        'rounded-full outline-4 outline-dashed outline-[#FFAA62]'
                    )}
                    dangerouslySetInnerHTML={{ __html: stickerById(st.id)?.svg ?? '' }}
                  />
                  {selectedSticker === st.id && tool === 'sticker' && (
                    <div
                      className="absolute -top-12 start-1/2 flex -translate-x-1/2 gap-1 rounded-2xl border-2 border-[#35445B]/15 bg-white p-1 shadow-lg rtl:translate-x-1/2"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <button
                        className="grid h-8 w-8 place-items-center rounded-xl bg-[#8DDEB0]/50"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => mutateSticker(st.id, (s) => (s.size = Math.min(220, s.size * 1.3)))}
                        aria-label={t('bigger')}
                      >
                        <Plus className="h-4 w-4 text-[#35445B]" />
                      </button>
                      <button
                        className="grid h-8 w-8 place-items-center rounded-xl bg-[#78C8F8]/50"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => mutateSticker(st.id, (s) => (s.rot += 30))}
                        aria-label={t('rotate')}
                      >
                        <RotateCw className="h-4 w-4 text-[#35445B]" />
                      </button>
                      <button
                        className="grid h-8 w-8 place-items-center rounded-xl bg-[#FF91B8]/50"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => removeSticker(st.id)}
                        aria-label={t('stickerRemove')}
                      >
                        <Trash2 className="h-4 w-4 text-[#35445B]" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* zoom controls */}
          <div className="absolute -bottom-3 end-4 flex gap-1.5">
            {[
              { icon: Plus, fn: () => zoomBy(1.3), label: '+' },
              { icon: Minus, fn: () => zoomBy(1 / 1.3), label: '-' },
              { icon: Maximize, fn: zoomReset, label: '1:1' },
            ].map((b, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.85 }}
                onClick={b.fn}
                className="grid h-9 w-9 place-items-center rounded-xl border-2 border-[#35445B]/15 bg-white/95 shadow"
                aria-label={b.label}
              >
                <b.icon className="h-4.5 w-4.5 text-[#35445B]" />
              </motion.button>
            ))}
          </div>

          {/* mini rango */}
          <div className="pointer-events-none absolute -bottom-2 start-3 z-10">
            <Rango mood={isPainting ? 'paint' : rangoLine ? 'happy' : 'idle'} size={62} />
          </div>
          <AnimatePresence>
            {rangoLine && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute bottom-10 start-16 z-10"
              >
                <SpeechBubble text={t(rangoLine)} visible className="!px-3 !py-1.5 text-xs" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* color strip */}
      <div className="relative z-10 mx-auto mt-4 w-full max-w-[560px] px-3">
        <div className="flex items-center gap-2 rounded-3xl border-[3px] border-[#35445B]/10 bg-white/95 p-2 shadow-[0_5px_0_rgba(53,68,91,0.1)]">
          <button
            onClick={() => {
              sfx.open()
              setSheet('palette')
            }}
            className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-[#B9A0F5] px-3 py-2 text-xs font-black text-[#35445B] shadow-[0_3px_0_rgba(53,68,91,0.18)]"
            aria-label={t('colors')}
          >
            <PaletteIcon className="h-4 w-4" />
            {t('colors')}
          </button>
          <div className="kid-scroll-x flex flex-1 gap-1.5 overflow-x-auto">
            {MAIN_COLORS.map((c) => (
              <motion.button
                key={c}
                whileTap={{ scale: 0.85 }}
                onClick={() => pickColor(c)}
                className={cn(
                  'relative h-9 w-9 shrink-0 rounded-full border-[3px] shadow-inner',
                  color === c ? 'border-[#35445B] scale-110' : 'border-white'
                )}
                style={{ backgroundColor: c }}
                aria-label={c}
              >
                {color === c && <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />}
              </motion.button>
            ))}
          </div>
          <span
            className="h-9 w-9 shrink-0 rounded-full border-[3px] border-[#35445B] shadow-inner"
            style={{ backgroundColor: color }}
            aria-hidden
          />
        </div>
      </div>

      {/* toolbar */}
      <div className="relative z-10 mx-auto mt-2 w-full max-w-[560px] px-3 pb-[max(env(safe-area-inset-bottom),0.6rem)]">
        <div className="flex items-center justify-between gap-1 rounded-3xl border-[3px] border-[#35445B]/10 bg-white/95 p-1.5 shadow-[0_5px_0_rgba(53,68,91,0.1)]">
          <div className="flex flex-1 items-center justify-around gap-0.5">
            {TOOLBAR.map((tb) => {
              const Icon = tb.icon
              const active = tool === tb.tool
              return (
                <motion.button
                  key={tb.tool}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setToolWithSound(tb.tool)}
                  className={cn(
                    'relative grid h-11 w-11 place-items-center rounded-2xl transition-colors sm:h-12 sm:w-12',
                    active ? 'text-[#35445B]' : 'text-[#35445B]/70'
                  )}
                  style={active ? { backgroundColor: tb.bg, boxShadow: '0 3px 0 rgba(53,68,91,0.2)' } : undefined}
                  aria-label={t(tb.key)}
                  aria-pressed={active}
                >
                  <Icon className="h-6 w-6" />
                </motion.button>
              )
            })}
          </div>
          <span className="mx-1 h-9 w-0.5 rounded bg-[#35445B]/10" />
          <div className="flex items-center justify-around gap-0.5">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={undo}
              disabled={histLen <= 1}
              className="grid h-11 w-11 place-items-center rounded-2xl text-[#35445B]/70 disabled:opacity-30"
              aria-label={t('toolUndo')}
            >
              <Undo2 className="h-6 w-6 rtl:-scale-x-100" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={redo}
              disabled={redoLen === 0}
              className="grid h-11 w-11 place-items-center rounded-2xl text-[#35445B]/70 disabled:opacity-30"
              aria-label={t('toolRedo')}
            >
              <Redo2 className="h-6 w-6 rtl:-scale-x-100" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => {
                initAudio()
                sfx.tap()
                setSheet('stickers')
              }}
              className={cn(
                'grid h-11 w-11 place-items-center rounded-2xl',
                tool === 'sticker' ? 'bg-[#FFD65A] text-[#35445B]' : 'text-[#35445B]/70'
              )}
              aria-label={t('toolSticker')}
            >
              <StickerIcon className="h-6 w-6" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => {
                initAudio()
                sfx.open()
                setShowClear(true)
              }}
              className="grid h-11 w-11 place-items-center rounded-2xl text-[#E63946]/80"
              aria-label={t('toolClear')}
            >
              <Trash2 className="h-6 w-6" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* ---------------- palette sheet ---------------- */}
      <Sheet open={sheet === 'palette'} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent side="bottom" className="rounded-t-[2rem] border-[3px] border-b-0 border-[#35445B]/10 bg-white px-4 pb-8 pt-4">
          <h3 className="mb-1 text-center text-lg font-black text-[#35445B]">{t('colors')}</h3>
          <div className="kid-scroll-x mb-3 flex justify-start gap-2 overflow-x-auto pb-1 sm:justify-center">
            {PALETTES.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  sfx.tap()
                  document.getElementById(`pal-${p.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="shrink-0 rounded-full bg-[#35445B]/5 px-3 py-1.5 text-xs font-black text-[#35445B]/70"
              >
                {paletteTitle(p, lang)}
              </button>
            ))}
          </div>
          <div className="kid-scroll max-h-[38vh] space-y-4 overflow-y-auto px-1">
            {PALETTES.map((p) => (
              <div key={p.id} id={`pal-${p.id}`}>
                <p className="mb-1.5 text-xs font-black text-[#35445B]/50">{paletteTitle(p, lang)}</p>
                <div className="flex flex-wrap gap-2">
                  {p.colors.map((c) => (
                    <motion.button
                      key={c}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => {
                        pickColor(c)
                        setSheet(null)
                        setToolWithSound(tool === 'fill' ? 'fill' : tool)
                      }}
                      className={cn(
                        'h-11 w-11 rounded-full border-[3px] shadow-inner',
                        color === c ? 'border-[#35445B] scale-110' : 'border-white'
                      )}
                      style={{ backgroundColor: c }}
                      aria-label={c}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div>
              <p className="mb-1.5 text-xs font-black text-[#35445B]/50">{t('customColor')}</p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => pickColor(e.target.value)}
                  className="h-12 w-20 cursor-pointer rounded-2xl border-[3px] border-[#35445B]/15 bg-white p-1"
                  aria-label={t('customColor')}
                />
                <button
                  onClick={() => setSheet(null)}
                  className="rounded-2xl bg-[#8DDEB0] px-5 py-2.5 text-sm font-black text-[#35445B] shadow-[0_3px_0_rgba(53,68,91,0.18)]"
                >
                  {t('ok')}
                </button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* ---------------- stickers sheet ---------------- */}
      <Sheet open={sheet === 'stickers'} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent side="bottom" className="rounded-t-[2rem] border-[3px] border-b-0 border-[#35445B]/10 bg-white px-4 pb-8 pt-4">
          <h3 className="mb-3 text-center text-lg font-black text-[#35445B]">{t('stickersTitle')}</h3>
          <div className="kid-scroll grid max-h-[42vh] grid-cols-4 gap-2 overflow-y-auto px-1 sm:grid-cols-6">
            {STICKERS.map((st) => (
              <motion.button
                key={st.id}
                whileTap={{ scale: 0.85, rotate: -6 }}
                onClick={() => {
                  initAudio()
                  sfx.pop()
                  setPendingSticker(st.id)
                  setTool('sticker')
                  setSheet(null)
                  buzz(settings.vibration)
                }}
                className={cn(
                  'tpl-preview-box grid aspect-square place-items-center rounded-2xl border-[3px] p-1.5',
                  pendingSticker === st.id ? 'border-[#FFAA62] bg-[#FFD65A]/30' : 'border-[#35445B]/10 bg-[#FFF7E6]'
                )}
              >
                <div className="tpl-preview aspect-square w-full" dangerouslySetInnerHTML={{ __html: st.svg }} />
              </motion.button>
            ))}
          </div>
          <p className="mt-3 text-center text-xs font-bold text-[#35445B]/50">{t('stickerPlaced')}</p>
        </SheetContent>
      </Sheet>

      {/* ---------------- clear confirm ---------------- */}
      <Dialog open={showClear} onOpenChange={setShowClear}>
        <DialogContent className="max-w-xs rounded-[1.8rem] border-[3px] border-[#35445B]/10 bg-white p-5 text-center">
          <DialogHeader className="items-center">
            <DialogTitle className="text-lg font-black text-[#35445B]">{t('clearConfirmTitle')}</DialogTitle>
            <DialogDescription className="text-sm font-bold text-[#35445B]/60">
              {t('clearConfirmText')}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 flex justify-center gap-3">
            <button
              onClick={() => {
                setFills({})
                strokesRef.current = []
                stickersRef.current = []
                pushHistory()
                redrawOverlay()
                bumpStickers()
                setShowClear(false)
                sfx.close()
              }}
              className="rounded-2xl bg-[#FF91B8] px-5 py-2.5 text-sm font-black text-[#35445B] shadow-[0_3px_0_rgba(53,68,91,0.18)]"
            >
              {t('yes')}
            </button>
            <button
              onClick={() => {
                setShowClear(false)
                sfx.tap()
              }}
              className="rounded-2xl bg-[#35445B]/10 px-5 py-2.5 text-sm font-black text-[#35445B]"
            >
              {t('no')}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------- help ---------------- */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-sm rounded-[1.8rem] border-[3px] border-[#35445B]/10 bg-white p-5">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-black text-[#35445B]">{t('help')}</DialogTitle>
            <DialogDescription className="sr-only">{t('help')}</DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm font-bold text-[#35445B]/80">
            {(['helpFill', 'helpBrush', 'helpPencil', 'helpCrayon', 'helpEraser', 'helpSticker', 'helpZoom'] as TKey[]).map(
              (k) => (
                <li key={k} className="flex gap-2 rounded-2xl bg-[#FFF7E6] px-3 py-2">
                  <span className="text-[#FFAA62]">★</span>
                  {t(k)}
                </li>
              )
            )}
          </ul>
          <button
            onClick={() => {
              setShowHelp(false)
              sfx.tap()
            }}
            className="mx-auto mt-2 block rounded-2xl bg-[#FFD65A] px-6 py-2.5 text-sm font-black text-[#35445B] shadow-[0_3px_0_rgba(53,68,91,0.18)]"
          >
            {t('ok')}
          </button>
        </DialogContent>
      </Dialog>

      {/* ---------------- save dialog ---------------- */}
      <Dialog open={saveStep !== null} onOpenChange={(o) => !o && setSaveStep(null)}>
        <DialogContent className="max-w-sm overflow-visible rounded-[1.8rem] border-[3px] border-[#35445B]/10 bg-white p-5">
          {saveStep === 'name' && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-lg font-black text-[#35445B]">{t('saveTitle')}</DialogTitle>
                <DialogDescription className="sr-only">{t('saveTitle')}</DialogDescription>
              </DialogHeader>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('artworkName')}
                className="mt-2 rounded-2xl border-[3px] border-[#35445B]/15 py-5 text-center text-base font-bold"
              />
              <div className="mt-3 flex flex-col gap-2">
                <button
                  onClick={doSave}
                  className="rounded-2xl bg-[#8DDEB0] py-3 text-base font-black text-[#35445B] shadow-[0_4px_0_rgba(53,68,91,0.18)]"
                >
                  {t('saveBtn')}
                </button>
                <button
                  onClick={() => {
                    setSaveStep(null)
                    sfx.tap()
                  }}
                  className="rounded-2xl bg-[#35445B]/10 py-2.5 text-sm font-black text-[#35445B]"
                >
                  {t('keepPainting')}
                </button>
              </div>
            </>
          )}
          {saveStep === 'saving' && (
            <div className="flex flex-col items-center gap-3 py-6">
              <motion.div
                className="h-12 w-12 rounded-full border-4 border-[#FFD65A] border-t-[#35445B]"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              />
              <p className="text-base font-black text-[#35445B]">{t('saving')}</p>
            </div>
          )}
          {saveStep === 'done' && (
            <div className="relative py-2 text-center">
              <StarBurst count={16} />
              <Rango mood="celebrate" size={130} className="mx-auto" />
              <p className="mt-2 text-lg font-black text-[#35445B]">{t('savedMsg')}</p>
              <p className="mt-1 text-sm font-black text-[#FFAA62]">
                {tf(t, 'starsEarned', earned, lang)}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setSaveStep(null)
                    sfx.tap()
                  }}
                  className="rounded-2xl bg-[#FFD65A] py-3 text-base font-black text-[#35445B] shadow-[0_4px_0_rgba(53,68,91,0.18)]"
                >
                  {t('keepPainting')}
                </button>
                <button
                  onClick={() => {
                    setSaveStep(null)
                    sfx.tap()
                    go('gallery')
                  }}
                  className="rounded-2xl bg-[#B9A0F5] py-2.5 text-sm font-black text-[#35445B] shadow-[0_3px_0_rgba(53,68,91,0.18)]"
                >
                  {t('seeMyArt')}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

/** tiny counter helper (useState-based version counter) */
function useReducerPlus(): [number, () => void] {
  const [v, setV] = useState(0)
  return [v, () => setV((x) => x + 1)]
}
