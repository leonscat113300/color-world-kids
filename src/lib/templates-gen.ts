import {
  ColoringTemplate,
  Difficulty,
  INK,
  svgWrap,
  eye,
  smile,
  happyMouth,
  blush,
  limb,
  glove,
  cloud,
  star,
  beret,
} from './template-types'

// ================================================================ PRNG
/** Deterministic seeded PRNG (mulberry32). No Math.random anywhere. */
const mulberry32 = (seed: number): (() => number) => {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const rr = (r: () => number, lo: number, hi: number): number => lo + r() * (hi - lo)
export const ri = (r: () => number, lo: number, hi: number): number => Math.floor(lo + r() * (hi - lo + 1))

export interface Variant {
  expr: number
  acc: number
  scene: number
  r: () => number
  flip: boolean
}

export type Recipe = (v: Variant) => string

/** Format a coordinate: integers stay clean, floats get one decimal. */
export const f1 = (n: number): string => (Number.isInteger(n) ? String(n) : n.toFixed(1))

// ================================================================ low level svg helpers
export const circ = (cx: number, cy: number, r: number, sw = 5): string =>
  `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="#FFFFFF" stroke="${INK}" stroke-width="${sw}"/>`

export const ell = (cx: number, cy: number, rx: number, ry: number, sw = 5, rot = 0): string =>
  rot === 0
    ? `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="#FFFFFF" stroke="${INK}" stroke-width="${sw}"/>`
    : `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" transform="rotate(${f1(rot)} ${f1(cx)} ${f1(cy)})" fill="#FFFFFF" stroke="${INK}" stroke-width="${sw}"/>`

export const rct = (
  x: number,
  y: number,
  w: number,
  h: number,
  rx = 8,
  sw = 5,
  rot = 0,
  px?: number,
  py?: number,
): string => {
  const t =
    rot === 0
      ? ''
      : ` transform="rotate(${f1(rot)} ${f1(px ?? x + w / 2)} ${f1(py ?? y + h / 2)})"`
  return `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(rx)}" fill="#FFFFFF" stroke="${INK}" stroke-width="${sw}"${t}/>`
}

export const poly = (pts: number[][], sw = 5): string =>
  `<polygon points="${pts.map((p) => `${f1(p[0])},${f1(p[1])}`).join(' ')}" fill="#FFFFFF" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>`

/** Colorable closed path. Always ends with Z so flood fill works. */
export const pathC = (d: string, sw = 5): string =>
  `<path d="${d}${d.endsWith('Z') ? '' : ' Z'}" fill="#FFFFFF" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>`

/** Decorative fixed stroke (not colorable). */
export const line = (d: string, sw = 4): string =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`

export const wheel = (cx: number, cy: number, r: number): string =>
  circ(cx, cy, r, 6) +
  `<circle cx="${cx}" cy="${cy}" r="${(r * 0.28).toFixed(1)}" fill="${INK}" stroke="none"/>`

/** Ellipse petals arranged in a ring. */
export const petals = (cx: number, cy: number, n: number, ring: number, rx: number, ry: number, off = 0): string => {
  let s = ''
  for (let i = 0; i < n; i++) {
    const a = ((Math.PI * 2) / n) * i + off
    const px = cx + ring * Math.cos(a)
    const py = cy + ring * Math.sin(a)
    const deg = (a * 180) / Math.PI + 90
    s += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${rx}" ry="${ry}" transform="rotate(${deg.toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>`
  }
  return s
}

/** Diamond (kite-shaped quad) centered at px,py rotated by rot degrees. */
export const diamond = (px: number, py: number, w: number, h: number, rot: number): string =>
  `<polygon points="${px.toFixed(1)},${(py - h).toFixed(1)} ${(px + w).toFixed(1)},${py.toFixed(1)} ${px.toFixed(1)},${(py + h).toFixed(1)} ${(px - w).toFixed(1)},${py.toFixed(1)}" fill="#FFFFFF" stroke="${INK}" stroke-width="4" stroke-linejoin="round" transform="rotate(${rot.toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})"/>`

/** Smooth scalloped blob (donut icing). */
export const scallopBlob = (cx: number, cy: number, R: number, n: number, bump: number): string => {
  const px: number[] = []
  const py: number[] = []
  for (let i = 0; i < n; i++) {
    const a = ((Math.PI * 2) / n) * i
    px.push(cx + R * Math.cos(a))
    py.push(cy + R * Math.sin(a))
  }
  let d = `M ${px[0].toFixed(1)} ${py[0].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const mx = (px[i] + px[j]) / 2
    const my = (py[i] + py[j]) / 2
    const ang = Math.atan2(my - cy, mx - cx)
    d += ` Q ${(cx + (R + bump) * Math.cos(ang)).toFixed(1)} ${(cy + (R + bump) * Math.sin(ang)).toFixed(1)} ${px[j].toFixed(1)} ${py[j].toFixed(1)}`
  }
  return pathC(d, 5)
}

// ================================================================ face helpers
/** Happy closed eye (upward arc) used for winking / sleepy faces. */
const winkEye = (cx: number, cy: number, r = 15): string =>
  line(
    `M ${(cx - r).toFixed(1)} ${(cy + 3).toFixed(1)} Q ${cx} ${(cy - r * 1.1).toFixed(1)} ${(cx + r).toFixed(1)} ${(cy + 3).toFixed(1)}`,
    5,
  )

/** Round surprised open mouth (colorable) with a small tongue. */
const openMouth = (cx: number, cy: number, rx = 13, ry = 15): string =>
  ell(cx, cy, rx, ry, 5) +
  ell(cx, cy + ry * 0.38, Math.max(6, rx * 0.55), Math.max(5, ry * 0.32), 4)

interface FaceOpts {
  dx?: number
  dy?: number
  er?: number
  my?: number
  mw?: number
  mh?: number
  bx?: number
  by?: number
  br?: number
  tongue?: boolean
}

/** Front-facing expression: happy / winking+smile / surprised open mouth. */
export const face = (v: Variant, cx: number, cy: number, o: FaceOpts = {}): string => {
  const dx = o.dx ?? 40
  const dy = o.dy ?? 0
  const er = o.er ?? 16
  const my = o.my ?? cy + dy + er + 16
  const mw = o.mw ?? 44
  const mh = o.mh ?? 20
  const bx = o.bx ?? dx + er + 14
  const by = o.by ?? dy + er + 14
  const br = o.br ?? 11
  const eyes =
    v.expr === 1
      ? winkEye(cx - dx, cy + dy, er) + eye(cx + dx, cy + dy, er)
      : eye(cx - dx, cy + dy, er) + eye(cx + dx, cy + dy, er)
  let mouth: string
  if (v.expr === 2) mouth = openMouth(cx, my + mh * 0.3, Math.max(10, mw * 0.36), Math.max(11, mh * 0.7))
  else if (v.expr === 0 && o.tongue) mouth = happyMouth(cx, my, mw, mh)
  else mouth = smile(cx, my, mw, mh)
  return eyes + mouth + blush(cx - bx, cy + by, br) + blush(cx + bx, cy + by, br)
}

/** Eyes + blush only, for faces with a custom mouth (nose, teeth...). br<=0 skips blush. */
export const eyesBlush = (
  v: Variant,
  cx: number,
  cy: number,
  dx: number,
  er: number,
  bx: number,
  by: number,
  br = 10,
): string => {
  const eyes =
    v.expr === 1
      ? winkEye(cx - dx, cy, er) + eye(cx + dx, cy, er)
      : eye(cx - dx, cy, er) + eye(cx + dx, cy, er)
  const bl = br <= 0 ? '' : blush(cx - bx, cy + by, br) + blush(cx + bx, cy + by, br)
  return eyes + bl
}

/** Side view single-eye expression (fish and friends). */
export const faceSide = (
  v: Variant,
  ex: number,
  ey: number,
  er: number,
  mx: number,
  my: number,
  mw: number,
  mh: number,
  bx: number,
  by: number,
): string => {
  const eyeSvg = v.expr === 1 ? winkEye(ex, ey, er) : eye(ex, ey, er)
  const mouth =
    v.expr === 2
      ? openMouth(mx, my + mh * 0.3, Math.max(9, mw * 0.38), Math.max(10, mh * 0.7))
      : smile(mx, my, mw, mh)
  return eyeSvg + mouth + blush(bx, by, 10)
}

// ================================================================ accessories
/** Party cone hat with pom-pom and dots. Sits with its base at ty. */
const partyHat = (cx: number, ty: number, s = 1, rot = 0): string => {
  const w = 40 * s
  const h = 54 * s
  const inner =
    poly(
      [
        [cx - w, ty],
        [cx + w, ty],
        [cx, ty - h],
      ],
      5,
    ) +
    circ(cx, ty - h - 9 * s, 9 * s, 5) +
    circ(cx - w * 0.3, ty - h * 0.55, 7 * s, 4) +
    circ(cx + w * 0.25, ty - h * 0.32, 7 * s, 4)
  return rot === 0 ? inner : `<g transform="rotate(${rot} ${cx} ${ty})">${inner}</g>`
}

/** Top hat: brim + tube + band. */
const topHat = (cx: number, ty: number): string =>
  rct(cx - 46, ty - 12, 92, 15, 7) +
  rct(cx - 30, ty - 66, 60, 58, 8) +
  rct(cx - 30, ty - 26, 60, 13, 4)

/** Baseball cap: dome + side brim + button. */
const capHat = (cx: number, ty: number): string =>
  pathC(`M ${cx - 42} ${ty} A 42 36 0 0 1 ${cx + 42} ${ty}`, 5) +
  rct(cx + 26, ty - 12, 52, 13, 6) +
  circ(cx, ty - 34, 8, 4)

const hatAcc = (v: Variant, cx: number, ty: number, s = 1, rot = 0): string => {
  if (rot !== 0) return partyHat(cx, ty, s, rot)
  const style = ri(v.r, 0, 2)
  if (style === 0) return partyHat(cx, ty, s)
  if (style === 1) return topHat(cx, ty)
  return capHat(cx, ty)
}

/** Cute crown: zigzag band + gems. Top reaches ty - 65. */
const crownAcc = (cx: number, ty: number, rot = 0): string => {
  const inner =
    rct(cx - 44, ty - 20, 88, 22, 6) +
    poly(
      [
        [cx - 44, ty - 18],
        [cx - 44, ty - 46],
        [cx - 15, ty - 26],
        [cx, ty - 52],
        [cx + 15, ty - 26],
        [cx + 44, ty - 46],
        [cx + 44, ty - 18],
      ],
      5,
    ) +
    circ(cx - 22, ty - 9, 7, 4) +
    circ(cx, ty - 9, 7, 4) +
    circ(cx + 22, ty - 9, 7, 4) +
    circ(cx, ty - 58, 7, 4)
  return rot === 0 ? inner : `<g transform="rotate(${rot} ${cx} ${ty})">${inner}</g>`
}

/** Accessory placed on top of a subject: hat (acc=1) or crown (acc=2). */
export const accTop = (v: Variant, cx: number, ty: number, s = 1, rot = 0): string => {
  if (v.acc === 1) return hatAcc(v, cx, ty, s, rot)
  if (v.acc === 2) return crownAcc(cx, ty, rot)
  return ''
}

const hairTuft = (cx: number, ty: number): string =>
  line(`M ${cx - 22} ${ty + 12} Q ${cx - 13} ${ty - 4} ${cx - 3} ${ty + 9}`, 4) +
  line(`M ${cx + 3} ${ty + 9} Q ${cx + 13} ${ty - 5} ${cx + 22} ${ty + 11}`, 4)

export const accHead = (v: Variant, cx: number, ty: number, preferBeret = false): string => {
  if (v.acc === 0) return hairTuft(cx, ty)
  if (v.acc === 1) return preferBeret ? beret(cx, ty + 6, 0.95) : hatAcc(v, cx, ty)
  return crownAcc(cx, ty)
}

// ================================================================ scene decorations
/** Small colorable heart. */
export const heart = (cx: number, cy: number, s: number): string =>
  pathC(
    `M ${f1(cx)} ${f1(cy + s)} ` +
      `C ${(cx - 0.89 * s).toFixed(1)} ${(cy + 0.44 * s).toFixed(1)} ${(cx - s).toFixed(1)} ${(cy - 0.3 * s).toFixed(1)} ${(cx - 0.54 * s).toFixed(1)} ${(cy - 0.55 * s).toFixed(1)} ` +
      `C ${(cx - 0.27 * s).toFixed(1)} ${(cy - 0.71 * s).toFixed(1)} ${(cx - 0.04 * s).toFixed(1)} ${(cy - 0.54 * s).toFixed(1)} ${f1(cx)} ${f1(cy - 0.33 * s)} ` +
      `C ${(cx + 0.04 * s).toFixed(1)} ${(cy - 0.54 * s).toFixed(1)} ${(cx + 0.27 * s).toFixed(1)} ${(cy - 0.71 * s).toFixed(1)} ${(cx + 0.54 * s).toFixed(1)} ${(cy - 0.55 * s).toFixed(1)} ` +
      `C ${(cx + s).toFixed(1)} ${(cy - 0.3 * s).toFixed(1)} ${(cx + 0.89 * s).toFixed(1)} ${(cy + 0.44 * s).toFixed(1)} ${f1(cx)} ${f1(cy + s)}`,
    5,
  )

/** Crescent moon, opening right. */
export const crescent = (cx: number, cy: number, R: number): string =>
  pathC(
    `M ${(cx - 0.2 * R).toFixed(1)} ${(cy - R).toFixed(1)} ` +
      `A ${R} ${R} 0 1 0 ${(cx - 0.2 * R).toFixed(1)} ${(cy + R).toFixed(1)} ` +
      `A ${(1.15 * R).toFixed(1)} ${(1.15 * R).toFixed(1)} 0 0 1 ${(cx - 0.2 * R).toFixed(1)} ${(cy - R).toFixed(1)}`,
    6,
  )

const balloonDeco = (cx: number, cy: number): string =>
  ell(cx, cy, 26, 32) +
  poly(
    [
      [cx - 8, cy + 30],
      [cx + 8, cy + 30],
      [cx, cy + 42],
    ],
    4,
  ) +
  line(`M ${cx} ${cy + 42} Q ${cx + 12} ${cy + 72} ${cx - 4} ${cy + 96}`, 4)

const flowerDeco = (cx: number, cy: number): string => {
  let s = ''
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 / 5) * i - Math.PI / 2
    s += circ(cx + 16 * Math.cos(a), cy + 16 * Math.sin(a), 9, 4)
  }
  return s + circ(cx, cy, 8, 4)
}

/** Point-up teardrop (raindrop, candle flame). */
export const raindrop = (x: number, y: number, s = 1): string =>
  pathC(
    `M ${x} ${y} ` +
      `C ${(x - 12 * s).toFixed(1)} ${(y + 20 * s).toFixed(1)} ${(x - 12 * s).toFixed(1)} ${(y + 34 * s).toFixed(1)} ${x} ${(y + 42 * s).toFixed(1)} ` +
      `C ${(x + 12 * s).toFixed(1)} ${(y + 34 * s).toFixed(1)} ${(x + 12 * s).toFixed(1)} ${(y + 20 * s).toFixed(1)} ${x} ${y}`,
    5,
  )

const flipX = (inner: string): string =>
  `<g transform="translate(512,0) scale(-1,1)">${inner}</g>`

// ---------------------------------------------------------------- scene builders
const sceneStarHeart = (v: Variant): string => {
  const r = v.r
  const j = () => rr(r, -13, 13)
  return (
    star(70 + j(), 80 + j(), ri(r, 18, 25)) +
    heart(438 + j(), 78 + j(), ri(r, 15, 20)) +
    star(446 + j(), 168 + j(), ri(r, 13, 16)) +
    heart(74 + j(), 178 + j(), ri(r, 13, 16)) +
    star(64 + j(), 420 + j(), ri(r, 14, 17)) +
    heart(442 + j(), 414 + j(), ri(r, 14, 17))
  )
}

const sceneGarden = (v: Variant): string => {
  const r = v.r
  const fx1 = 84 + rr(r, -12, 12)
  const fx2 = 428 + rr(r, -12, 12)
  return (
    rct(26, 466, 460, 26, 13) +
    flowerDeco(fx1, 444) +
    flowerDeco(fx2, 448) +
    line(
      `M 160 487 Q 166 471 172 487 M 250 489 Q 256 473 262 489 M 340 487 Q 346 471 352 487`,
      4,
    )
  )
}

const sceneSky = (v: Variant): string => {
  const r = v.r
  const n = ri(r, 7, 9)
  let s = ''
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 / n) * i
    s += poly(
      [
        [70 + 28 * Math.cos(a - 0.22), 74 + 28 * Math.sin(a - 0.22)],
        [70 + 44 * Math.cos(a), 74 + 44 * Math.sin(a)],
        [70 + 28 * Math.cos(a + 0.22), 74 + 28 * Math.sin(a + 0.22)],
      ],
      4,
    )
  }
  return s + circ(70, 74, 26) + cloud(424, 92, 0.8) + cloud(300, 62, 0.55)
}

const sceneParty = (v: Variant): string => {
  const r = v.r
  const j = () => rr(r, -10, 10)
  const slots: Array<[number, number, number]> = [
    [64, 140, 0],
    [448, 148, 1],
    [90, 322, 1],
    [424, 318, 0],
    [160, 64, 0],
    [352, 60, 1],
    [46, 240, 1],
    [466, 244, 0],
  ]
  let conf = ''
  const n = ri(r, 5, 8)
  for (let i = 0; i < n; i++) {
    const [sx, sy, kind] = slots[i]
    const x = sx + j()
    const y = sy + j()
    conf +=
      kind === 0
        ? circ(x, y, 9, 4)
        : rct(x - 9, y - 9, 18, 18, 4, 4, 45, x, y)
  }
  return balloonDeco(88, 76) + balloonDeco(424, 82) + conf
}

const buildScene = (v: Variant, scene2Kind: 'garden' | 'sky'): string => {
  if (v.scene === 1) return sceneStarHeart(v)
  if (v.scene === 2) return scene2Kind === 'sky' ? sceneSky(v) : sceneGarden(v)
  if (v.scene === 3) return sceneParty(v)
  return ''
}

// ================================================================ names
const NAME_EXPR = [
  { fa: 'خوشحال', en: 'Happy' },
  { fa: 'خندان', en: 'Smiling' },
  { fa: 'متعجب', en: 'Surprised' },
]
const NAME_ACC = [
  { fa: '', en: '' },
  { fa: 'کلاه‌دار', en: 'with Hat' },
  { fa: 'با تاج', en: 'with Crown' },
]
const NAME_SCENE = [
  { fa: '', en: '' },
  { fa: 'زیر ستاره‌ها', en: 'under the Stars' },
  { fa: 'تو باغ', en: 'in the Garden' },
  { fa: 'مهمونی', en: 'at the Party' },
]

export interface NameBase {
  fa: string
  en: string
}

const nameFor = (base: NameBase, expr: number, acc: number, scene: number): NameBase => {
  if (expr === 0 && acc === 0 && scene === 0) {
    return { fa: base.fa.replace('{s}', 'بامزه'), en: base.en.replace('{s}', 'Cute') }
  }
  const faParts = [NAME_EXPR[expr].fa]
  const enParts = [NAME_EXPR[expr].en]
  if (acc > 0) {
    faParts.push(NAME_ACC[acc].fa)
    enParts.push(NAME_ACC[acc].en)
  }
  if (scene > 0) {
    faParts.push(NAME_SCENE[scene].fa)
    enParts.push(NAME_SCENE[scene].en)
  }
  return {
    fa: base.fa.replace('{s}', faParts.join(' ')),
    en: base.en.replace('{s}', enParts.join(' ')),
  }
}

// ================================================================ builder types
export interface RecipeMeta {
  base: NameBase
  diff: 1 | 2 | 3
  fn: Recipe
  noDrop?: boolean
  scene2?: 'garden' | 'sky'
}

// ================================================================ ANIMALS
const aCat: Recipe = (v) => {
  const r = v.r
  const wEnd = ri(r, 30, 44)
  const stripes = ri(r, 2, 3)
  let marks = ''
  for (let i = 0; i < stripes; i++) {
    const x = 236 + i * 18
    marks += line(`M ${x} 86 L ${x} 106`, 4)
  }
  return (
    pathC('M 352 436 C 420 428 448 372 430 318 C 422 294 396 292 390 314 C 382 344 396 384 330 398', 6) +
    ell(256, 380, 94, 80, 6) +
    ell(256, 396, 54, 48) +
    ell(202, 448, 30, 16) +
    ell(310, 448, 30, 16) +
    pathC('M 170 118 L 132 34 L 234 62', 6) +
    pathC('M 342 118 L 380 34 L 278 62', 6) +
    circ(256, 176, 104, 6) +
    pathC('M 178 92 L 154 44 L 208 60', 4) +
    pathC('M 334 92 L 358 44 L 304 60', 4) +
    face(v, 256, 160, { dx: 42, er: 19, my: 218, mw: 46, mh: 22, bx: 62, by: 42, tongue: true }) +
    pathC('M 242 202 Q 256 192 270 202 Q 270 216 256 222 Q 242 216 242 202', 5) +
    line(
      `M 156 186 L ${wEnd + 62} 194 M 158 212 L ${wEnd + 64} 208 M 356 186 L ${456 - wEnd} 194 M 354 212 L ${454 - wEnd} 208`,
      4,
    ) +
    marks +
    accTop(v, 256, 78)
  )
}

const aDog: Recipe = (v) => {
  const r = v.r
  const spots = ri(r, 0, 2)
  let spotSvg = ''
  const slots: Array<[number, number]> = [
    [198, 402],
    [312, 414],
    [256, 434],
  ]
  for (let i = 0; i < spots; i++) spotSvg += circ(slots[i][0], slots[i][1], 15, 4)
  return (
    pathC('M 344 430 C 406 420 428 372 414 336 C 408 320 386 324 388 344 C 392 380 380 400 336 408', 6) +
    ell(256, 384, 92, 76, 6) +
    ell(206, 448, 29, 15) +
    ell(306, 448, 29, 15) +
    circ(256, 180, 104, 6) +
    pathC('M 196 116 C 140 102 108 164 118 242 C 122 276 158 282 168 250 C 178 216 178 158 200 132', 6) +
    pathC('M 316 116 C 372 102 404 164 394 242 C 390 276 354 282 344 250 C 334 216 334 158 312 132', 6) +
    circ(302, 190, 38) +
    face(v, 256, 176, { dx: 44, er: 18, my: 240, mw: 46, mh: 20, bx: 66, by: 40, tongue: true }) +
    pathC('M 240 226 Q 256 216 272 226 Q 272 242 256 248 Q 240 242 240 226', 5) +
    pathC('M 200 306 Q 256 344 312 306 L 312 328 Q 256 366 200 328', 5) +
    circ(256, 356, 13) +
    spotSvg +
    accTop(v, 256, 80)
  )
}

const aRabbit: Recipe = (v) => {
  const r = v.r
  const whisk = ri(r, 2, 3)
  let wsvg = ''
  for (let i = 0; i < whisk; i++) {
    const y = 246 + i * 14
    wsvg += line(`M 172 ${y} L 138 ${y - 6} M 340 ${y} L 374 ${y - 6}`, 4)
  }
  const teeth =
    v.expr === 2
      ? openMouth(256, 282, 12, 14)
      : rct(240, 262, 15, 24, 5) + rct(257, 262, 15, 24, 5)
  return (
    circ(352, 430, 24) +
    pathC('M 192 192 C 158 98 170 42 200 40 C 228 42 234 102 228 186', 6) +
    pathC('M 320 192 C 354 98 342 42 312 40 C 284 42 278 102 284 186', 6) +
    pathC('M 200 176 C 178 106 186 58 202 56 C 218 60 222 108 216 170', 4) +
    pathC('M 312 176 C 334 106 326 58 310 56 C 294 60 290 108 296 170', 4) +
    ell(256, 396, 78, 66, 6) +
    ell(206, 448, 28, 15) +
    ell(306, 448, 28, 15) +
    circ(256, 226, 96, 6) +
    eyesBlush(v, 256, 206, 40, 16, 58, 36, 11) +
    pathC('M 244 238 Q 256 230 268 238 Q 268 252 256 258 Q 244 252 244 238', 5) +
    teeth +
    wsvg +
    accTop(v, 256, 134)
  )
}

const aBear: Recipe = (v) => {
  const r = v.r
  const tufts = ri(r, 2, 3)
  let tsvg = ''
  for (let i = 0; i < tufts; i++) tsvg += line(`M ${226 + i * 22} 92 L ${226 + i * 22} 106`, 4)
  const mouth =
    v.expr === 2
      ? openMouth(256, 258, 12, 12)
      : line('M 256 246 L 256 254', 5) +
        line('M 256 254 Q 244 268 230 260', 5) +
        line('M 256 254 Q 268 268 282 260', 5)
  return (
    circ(176, 96, 34, 6) +
    circ(336, 96, 34, 6) +
    circ(176, 96, 17, 4) +
    circ(336, 96, 17, 4) +
    ell(256, 386, 88, 74, 6) +
    ell(256, 398, 52, 46) +
    ell(200, 448, 28, 15) +
    ell(312, 448, 28, 15) +
    circ(256, 188, 102, 6) +
    ell(256, 238, 48, 34) +
    eyesBlush(v, 256, 172, 42, 17, 62, 34, 11) +
    pathC('M 240 224 Q 256 214 272 224 Q 272 240 256 246 Q 240 240 240 224', 5) +
    mouth +
    tsvg +
    accTop(v, 256, 90)
  )
}

const aPanda: Recipe = (v) => {
  const r = v.r
  const leaves = ri(r, 2, 3)
  let leafSvg = ''
  for (let i = 0; i < leaves; i++) {
    leafSvg += ell(424, 300 + i * 52, 18, 30, 4, i % 2 === 0 ? 24 : -24)
  }
  return (
    line('M 440 452 L 440 262', 5) +
    line('M 424 300 L 440 296 M 424 352 L 440 348', 4) +
    leafSvg +
    ell(168, 360, 22, 48, 5, 18) +
    ell(344, 360, 22, 48, 5, -18) +
    ell(256, 388, 92, 74, 6) +
    ell(256, 396, 54, 48) +
    ell(198, 448, 30, 16) +
    ell(314, 448, 30, 16) +
    circ(174, 100, 36, 6) +
    circ(338, 100, 36, 6) +
    circ(256, 190, 104, 6) +
    ell(216, 176, 29, 38, 5, -14) +
    ell(296, 176, 29, 38, 5, 14) +
    (v.expr === 1 ? winkEye(216, 172, 14) : eye(216, 172, 14)) +
    eye(296, 172, 14) +
    (v.expr === 2 ? openMouth(256, 252, 12, 14) : smile(256, 246, 36, 16)) +
    blush(176, 220, 11) +
    blush(336, 220, 11) +
    pathC('M 242 224 Q 256 214 270 224 Q 270 240 256 246 Q 242 240 242 224', 5) +
    accTop(v, 256, 90)
  )
}

const aFox: Recipe = (v) => {
  const r = v.r
  const fluff = ri(r, 2, 3)
  let fsvg = ''
  for (let i = 0; i < fluff; i++) fsvg += line(`M ${238 + i * 12} 88 L ${238 + i * 12} 100`, 4)
  return (
    pathC('M 348 420 C 424 404 452 330 420 280 C 404 256 372 262 376 292 C 382 336 372 380 330 396', 6) +
    pathC('M 402 296 C 416 318 418 350 406 376 C 394 366 386 344 386 320 C 386 308 392 298 402 296', 4) +
    ell(256, 384, 86, 72, 6) +
    ell(206, 446, 28, 15) +
    ell(306, 446, 28, 15) +
    pathC('M 168 120 L 138 30 L 238 66', 6) +
    pathC('M 344 120 L 374 30 L 274 66', 6) +
    pathC('M 176 108 L 158 52 L 218 72', 4) +
    pathC('M 336 108 L 354 52 L 294 72', 4) +
    circ(256, 182, 100, 6) +
    ell(256, 254, 58, 40) +
    face(v, 256, 168, { dx: 44, er: 17, my: 236, mw: 42, mh: 18, bx: 66, by: 36 }) +
    circ(256, 240, 12) +
    line('M 256 252 Q 246 266 232 260 M 256 252 Q 266 266 280 260', 4) +
    fsvg +
    accTop(v, 256, 86)
  )
}

const aOwl: Recipe = (v) => {
  const r = v.r
  const rows = ri(r, 2, 3)
  let scalps = ''
  for (let i = 0; i < rows; i++) {
    const y = 322 + i * 36
    scalps += line(`M 214 ${y} Q 230 ${y + 12} 246 ${y} M 266 ${y} Q 282 ${y + 12} 298 ${y}`, 4)
  }
  return (
    poly([[168, 106], [178, 62], [216, 92]], 5) +
    poly([[344, 106], [334, 62], [296, 92]], 5) +
    ell(256, 300, 116, 146, 6) +
    circ(256, 176, 88, 6) +
    ell(146, 306, 26, 62, 5, 14) +
    ell(366, 306, 26, 62, 5, -14) +
    ell(256, 342, 64, 80) +
    circ(218, 168, 33) +
    circ(294, 168, 33) +
    (v.expr === 1 ? winkEye(218, 168, 15) : eye(218, 168, 15)) +
    eye(294, 168, 15) +
    (v.expr === 2 ? openMouth(256, 226, 12, 14) : '') +
    poly([[256, 198], [272, 216], [256, 234], [240, 216]], 5) +
    blush(190, 220, 9) +
    blush(322, 220, 9) +
    scalps +
    ell(212, 448, 24, 12) +
    ell(300, 448, 24, 12) +
    accTop(v, 256, 92)
  )
}

const aPenguin: Recipe = (v) => {
  const r = v.r
  const dots = ri(r, 2, 4)
  let dsvg = ''
  const slots: Array<[number, number]> = [
    [110, 200],
    [402, 210],
    [98, 380],
    [414, 372],
  ]
  for (let i = 0; i < dots; i++) dsvg += circ(slots[i][0], slots[i][1], 9, 4)
  return (
    dsvg +
    ell(126, 316, 20, 56, 5, 16) +
    ell(386, 316, 20, 56, 5, -16) +
    pathC(
      'M 256 92 C 180 92 142 196 142 296 C 142 392 190 444 256 444 C 322 444 370 392 370 296 C 370 196 332 92 256 92',
      6,
    ) +
    pathC(
      'M 256 208 C 214 208 186 252 186 312 C 186 376 216 420 256 420 C 296 420 326 376 326 312 C 326 252 298 208 256 208',
      5,
    ) +
    face(v, 256, 168, { dx: 32, er: 15, my: 236, mw: 40, mh: 16, bx: 52, by: 34 }) +
    poly([[236, 200], [276, 200], [256, 228]], 5) +
    ell(216, 452, 26, 13) +
    ell(296, 452, 26, 13) +
    accTop(v, 256, 96)
  )
}

const aFish: Recipe = (v) => {
  const r = v.r
  const scales = ri(r, 2, 4)
  let ssvg = ''
  for (let i = 0; i < scales; i++) {
    const x = 274 + i * 30
    ssvg += line(`M ${x} 240 Q ${x + 14} 256 ${x} 272 M ${x + 16} 274 Q ${x + 30} 290 ${x + 16} 306`, 4)
  }
  const bubbles = ri(r, 2, 3)
  let bsvg = ''
  const bslots: Array<[number, number, number]> = [
    [96, 178, 12],
    [74, 134, 9],
    [110, 96, 8],
  ]
  for (let i = 0; i < bubbles; i++) bsvg += circ(bslots[i][0], bslots[i][1], bslots[i][2], 4)
  return (
    bsvg +
    pathC('M 344 268 C 386 234 420 216 452 208 C 436 246 436 290 452 328 C 420 320 386 302 344 268', 6) +
    pathC('M 206 190 C 216 142 254 128 282 142 C 270 162 264 178 262 192', 5) +
    pathC('M 220 346 C 228 388 252 404 278 400 C 268 382 266 366 266 350', 5) +
    ell(238, 268, 124, 86, 6) +
    line('M 198 218 Q 174 268 198 320', 4) +
    ssvg +
    faceSide(v, 168, 246, 17, 138, 292, 30, 13, 150, 292) +
    pathC('M 232 282 C 262 274 288 286 296 308 C 274 316 248 312 232 294', 5) +
    accTop(v, 150, 202, 0.9, -20)
  )
}

const aTurtle: Recipe = (v) => {
  const r = v.r
  const shellDots = ri(r, 1, 3)
  const dslots: Array<[number, number]> = [
    [190, 262],
    [322, 264],
    [256, 238],
  ]
  let dsvg = ''
  for (let i = 0; i < shellDots; i++) dsvg += circ(dslots[i][0], dslots[i][1], 9, 4)
  return (
    rct(236, 322, 40, 56, 12) +
    poly([[154, 318], [122, 334], [156, 344]], 5) +
    ell(178, 352, 28, 16) +
    ell(334, 352, 28, 16) +
    pathC('M 148 330 A 108 108 0 0 1 364 330', 6) +
    poly([[256, 252], [306, 272], [306, 308], [256, 328], [206, 308], [206, 272]], 5) +
    line('M 206 272 L 164 290 M 306 272 L 348 290 M 256 252 L 256 228 M 206 308 L 178 326 M 306 308 L 334 326', 4) +
    dsvg +
    circ(256, 398, 42, 6) +
    face(v, 256, 390, { dx: 17, er: 10, my: 412, mw: 26, mh: 10, bx: 29, by: 15, br: 8 }) +
    accTop(v, 256, 226)
  )
}

// ================================================================ VEHICLES
const vCar: Recipe = (v) => {
  const r = v.r
  const stripes = ri(r, 1, 2)
  let ssvg = ''
  for (let i = 0; i < stripes; i++) ssvg += line(`M 130 ${376 + i * 14} L 390 ${376 + i * 14}`, 4)
  return (
    wheel(164, 424, 38) +
    wheel(356, 424, 38) +
    pathC(
      'M 96 372 C 96 340 116 330 148 326 L 190 262 C 198 250 210 244 226 244 L 300 244 C 316 244 328 252 336 264 L 372 326 C 404 330 424 342 424 372 L 424 404 C 424 418 414 426 400 426 L 120 426 C 106 426 96 418 96 404',
      6,
    ) +
    rct(204, 258, 116, 56, 10) +
    face(v, 262, 280, { dx: 22, er: 11, my: 298, mw: 32, mh: 11, bx: 34, by: 13, br: 8 }) +
    circ(114, 356, 14, 4) +
    rct(396, 350, 22, 16, 6, 4) +
    line('M 262 318 L 262 414 M 296 356 L 312 356', 4) +
    ssvg +
    accTop(v, 262, 252)
  )
}

const vBus: Recipe = (v) => {
  const r = v.r
  const vents = ri(r, 1, 2)
  let vsvg = ''
  for (let i = 0; i < vents; i++) vsvg += rct(120 + i * 200, 206, 44, 12, 5, 4)
  return (
    wheel(150, 420, 34) +
    wheel(362, 420, 34) +
    rct(72, 200, 368, 216, 34, 6) +
    rct(100, 232, 64, 62, 10) +
    rct(180, 232, 64, 62, 10) +
    rct(260, 232, 64, 62, 10) +
    rct(340, 232, 64, 62, 10) +
    face(v, 256, 330, { dx: 36, er: 14, my: 356, mw: 46, mh: 16, bx: 56, by: 16, br: 9 }) +
    rct(84, 268, 56, 148, 10) +
    line('M 112 268 L 112 416', 4) +
    vsvg +
    accTop(v, 256, 204)
  )
}

const vTruck: Recipe = (v) => {
  const r = v.r
  const panels = ri(r, 1, 2)
  let psvg = ''
  for (let i = 0; i < panels; i++) psvg += line(`M ${150 + i * 60} 200 L ${150 + i * 60} 360`, 4)
  return (
    wheel(150, 392, 36) +
    wheel(398, 392, 36) +
    cloud(84, 272, 0.5) +
    cloud(102, 232, 0.4) +
    rct(76, 302, 16, 58, 6, 4) +
    rct(96, 180, 240, 200, 18, 6) +
    rct(336, 240, 112, 116, 16, 6) +
    rct(356, 258, 70, 48, 8) +
    face(v, 391, 276, { dx: 13, er: 10, my: 292, mw: 24, mh: 9, bx: 22, by: 12, br: 7 }) +
    circ(452, 336, 12, 4) +
    line('M 336 320 L 448 320', 4) +
    psvg +
    accTop(v, 216, 184)
  )
}

const vTrain: Recipe = (v) => {
  const r = v.r
  const cargo = ri(r, 1, 2)
  let csvg = ''
  for (let i = 0; i < cargo; i++) csvg += circ(262 + i * 52, 348, 20, 4)
  return (
    wheel(96, 400, 30) +
    wheel(176, 400, 30) +
    wheel(258, 400, 24) +
    wheel(310, 400, 24) +
    wheel(384, 400, 24) +
    wheel(436, 400, 24) +
    cloud(176, 168, 0.5) +
    cloud(202, 128, 0.4) +
    cloud(160, 98, 0.32) +
    rct(64, 204, 80, 66, 10, 5) +
    rct(60, 264, 150, 130, 16, 6) +
    rct(158, 208, 34, 60, 8, 5) +
    rct(232, 288, 104, 106, 12, 6) +
    rct(358, 288, 104, 106, 12, 6) +
    line('M 210 350 L 232 350 M 336 350 L 358 350', 5) +
    rct(46, 384, 22, 40, 8, 5) +
    face(v, 126, 316, { dx: 22, er: 13, my: 342, mw: 38, mh: 14, bx: 34, by: 15, br: 9 }) +
    rct(258, 310, 52, 44, 8, 4) +
    rct(384, 310, 52, 44, 8, 4) +
    csvg +
    accTop(v, 104, 208)
  )
}

const vAirplane: Recipe = (v) => {
  const r = v.r
  const wins = ri(r, 2, 4)
  let wsvg = ''
  for (let i = 0; i < wins; i++) wsvg += circ(244 + i * 44, 268 - i * 4, 10, 4)
  const speed = ri(r, 2, 3)
  let ssvg = ''
  for (let i = 0; i < speed; i++) ssvg += line(`M 40 ${246 + i * 26} L 76 ${246 + i * 26}`, 4)
  return (
    ssvg +
    ell(256, 288, 170, 62, 6) +
    pathC('M 216 300 L 156 396 L 232 396 L 292 304', 5) +
    pathC('M 356 244 L 396 176 L 424 244', 5) +
    pathC('M 380 300 L 430 336 L 396 336', 5) +
    ell(106, 276, 20, 16) +
    faceSide(v, 150, 272, 12, 168, 300, 34, 12, 186, 296) +
    wsvg +
    accTop(v, 256, 230)
  )
}

const vHelicopter: Recipe = (v) => {
  const r = v.r
  const blades = ri(r, 2, 3)
  let bsvg = ''
  if (blades >= 2) bsvg += line('M 96 148 L 336 148', 5)
  if (blades >= 3) bsvg += line('M 140 136 L 300 160', 4)
  return (
    line('M 140 396 L 300 396', 5) +
    line('M 170 384 L 170 400 M 272 384 L 272 400', 4) +
    rct(316, 282, 140, 26, 13, 5) +
    pathC('M 440 286 L 462 232 L 478 286', 5) +
    ell(216, 300, 108, 92, 6) +
    rct(206, 148, 20, 60, 8, 5) +
    circ(216, 148, 12) +
    bsvg +
    circ(216, 292, 62) +
    face(v, 216, 276, { dx: 24, er: 12, my: 306, mw: 38, mh: 14, bx: 40, by: 14, br: 8 }) +
    accTop(v, 216, 212)
  )
}

const vRocket: Recipe = (v) => {
  const r = v.r
  const stripes = ri(r, 1, 2)
  let ssvg = ''
  for (let i = 0; i < stripes; i++) ssvg += line(`M 196 ${300 + i * 22} L 316 ${300 + i * 22}`, 4)
  return (
    pathC('M 236 372 L 276 372 C 276 420 262 444 256 456 C 250 444 236 420 236 372', 5) +
    pathC('M 196 300 C 160 320 148 356 152 396 L 196 372', 5) +
    pathC('M 316 300 C 352 320 364 356 360 396 L 316 372', 5) +
    pathC('M 256 76 C 216 108 196 170 196 250 L 196 372 L 316 372 L 316 250 C 316 170 296 108 256 76', 6) +
    circ(256, 220, 44) +
    face(v, 256, 206, { dx: 18, er: 12, my: 234, mw: 32, mh: 11, bx: 28, by: 14, br: 8 }) +
    ssvg +
    accTop(v, 256, 84)
  )
}

const vSailboat: Recipe = (v) => {
  const r = v.r
  const sailLines = ri(r, 1, 2)
  let slsvg = ''
  for (let i = 0; i < sailLines; i++) {
    slsvg += line(`M 292 ${170 + i * 60} Q 330 ${190 + i * 60} 366 ${240 + i * 60}`, 4)
  }
  const flag =
    v.acc === 0
      ? poly([[264, 96], [316, 108], [264, 122]], 4) + line('M 264 96 L 264 124', 4)
      : ''
  const waves = ri(r, 2, 3)
  let wsvg = ''
  for (let i = 0; i < waves; i++) {
    const x = 70 + i * 150
    wsvg += line(`M ${x} 470 Q ${x + 22} 456 ${x + 44} 470 Q ${x + 66} 484 ${x + 88} 470`, 4)
  }
  return (
    wsvg +
    pathC('M 116 366 L 396 366 L 356 440 C 350 450 340 456 328 456 L 184 456 C 172 456 162 450 156 440', 6) +
    line('M 132 396 L 380 396', 4) +
    rct(250, 96, 14, 274, 6, 5) +
    pathC('M 272 120 L 272 336 L 392 336 C 380 240 340 160 272 120', 5) +
    pathC('M 244 140 L 244 330 L 148 330 C 168 250 200 180 244 140', 5) +
    slsvg +
    flag +
    face(v, 214, 398, { dx: 18, er: 12, my: 424, mw: 34, mh: 12, bx: 28, by: 14, br: 8 }) +
    accTop(v, 257, 100)
  )
}

const petalFlowerMini = (cx: number, cy: number): string => {
  let s = ''
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 / 5) * i - Math.PI / 2
    s += circ(cx + 20 * Math.cos(a), cy + 20 * Math.sin(a), 8, 4)
  }
  return s
}

const vBicycle: Recipe = (v) => {
  const r = v.r
  const spokes = ri(r, 4, 6)
  let sp = ''
  for (let i = 0; i < spokes; i++) {
    const a = (Math.PI / spokes) * i
    sp += line(
      `M ${(168 - 66 * Math.cos(a)).toFixed(1)} ${(356 - 66 * Math.sin(a)).toFixed(1)} L ${(168 + 66 * Math.cos(a)).toFixed(1)} ${(356 + 66 * Math.sin(a)).toFixed(1)}` +
        ` M ${(344 - 66 * Math.cos(a)).toFixed(1)} ${(356 - 66 * Math.sin(a)).toFixed(1)} L ${(344 + 66 * Math.cos(a)).toFixed(1)} ${(356 + 66 * Math.sin(a)).toFixed(1)}`,
      4,
    )
  }
  return (
    wheel(168, 356, 78) +
    wheel(344, 356, 78) +
    line(
      'M 100 356 L 236 356 M 276 356 L 412 356 M 168 290 L 168 422 M 344 290 L 344 422 M 121 313 L 215 399 M 121 399 L 215 313 M 297 313 L 391 399 M 297 399 L 391 313',
      4,
    ) +
    sp +
    limb(168, 356, 250, 352, 14) +
    limb(250, 352, 262, 264, 14) +
    limb(168, 356, 262, 264, 14) +
    limb(250, 352, 322, 272, 14) +
    limb(262, 264, 322, 272, 14) +
    limb(322, 272, 344, 356, 14) +
    limb(322, 272, 304, 246, 12) +
    circ(300, 242, 9, 4) +
    ell(258, 252, 26, 12) +
    rct(352, 296, 52, 40, 8) +
    line('M 368 300 L 368 332 M 388 300 L 388 332', 4) +
    circ(378, 284, 11, 4) +
    petalFlowerMini(378, 284) +
    face(v, 378, 310, { dx: 12, er: 9, my: 326, mw: 22, mh: 8, bx: 20, by: 18, br: 6 }) +
    accTop(v, 258, 244, 0.85)
  )
}

const vTractor: Recipe = (v) => {
  const r = v.r
  const tread = ri(r, 5, 7)
  let tsvg = ''
  for (let i = 0; i < tread; i++) {
    const a = (Math.PI * 2 / tread) * i
    tsvg += line(
      `M ${(164 + 58 * Math.cos(a)).toFixed(1)} ${(372 + 58 * Math.sin(a)).toFixed(1)} L ${(164 + 72 * Math.cos(a)).toFixed(1)} ${(372 + 72 * Math.sin(a)).toFixed(1)}`,
      4,
    )
  }
  return (
    wheel(164, 372, 74) +
    wheel(352, 404, 44) +
    tsvg +
    rct(236, 320, 170, 62, 14, 6) +
    rct(248, 212, 96, 116, 14, 6) +
    rct(266, 232, 60, 52, 8) +
    face(v, 296, 250, { dx: 12, er: 10, my: 268, mw: 24, mh: 9, bx: 20, by: 12, br: 7 }) +
    rct(386, 268, 20, 56, 6, 5) +
    cloud(396, 240, 0.45) +
    line('M 100 352 A 74 74 0 0 1 228 352', 5) +
    line('M 252 366 L 390 366', 4) +
    accTop(v, 296, 216)
  )
}

// ================================================================ MAGIC
const mUnicorn: Recipe = (v) => {
  const r = v.r
  const maneN = ri(r, 3, 4)
  let mane = ''
  for (let i = 0; i < maneN; i++) {
    mane += circ(326 + i * 16, 152 + i * 44, 28 - i * 2, 5)
  }
  const mouth =
    v.expr === 2
      ? openMouth(256, 272, 12, 13)
      : line('M 256 257 Q 246 270 234 264', 4) + line('M 256 257 Q 266 270 278 264', 4)
  return (
    circ(150, 352, 22, 5) +
    circ(136, 392, 18, 5) +
    ell(256, 392, 84, 66, 6) +
    rct(190, 400, 26, 58, 10, 5) +
    rct(238, 404, 26, 54, 10, 5) +
    rct(290, 400, 26, 58, 10, 5) +
    mane +
    circ(256, 208, 96, 6) +
    ell(256, 258, 56, 40) +
    pathC('M 186 138 L 176 92 L 218 116', 5) +
    pathC('M 326 138 L 336 92 L 294 116', 5) +
    pathC('M 240 118 L 272 118 L 258 48 L 254 48', 5) +
    line('M 244 100 L 268 92 M 247 84 L 264 78 M 250 68 L 260 64', 4) +
    eyesBlush(v, 256, 192, 34, 16, 52, 30, 10) +
    circ(256, 246, 11, 4) +
    mouth +
    accTop(v, 306, 118, 0.9, -12)
  )
}

const mCastle: Recipe = (v) => {
  const r = v.r
  const bricks = ri(r, 2, 4)
  const bslots: string[] = [
    'M 226 236 L 286 236 M 236 268 L 276 268',
    'M 146 316 L 190 316 M 322 316 L 366 316',
    'M 232 200 L 280 200',
    'M 336 350 L 352 350 M 160 350 L 176 350',
  ]
  let bsvg = ''
  for (let i = 0; i < bricks; i++) bsvg += line(bslots[i], 4)
  const flags =
    v.acc === 0
      ? line('M 256 96 L 256 62', 5) +
        poly([[256, 64], [298, 74], [256, 86]], 4) +
        line('M 168 196 L 168 168', 4) +
        poly([[168, 170], [196, 177], [168, 184]], 4) +
        line('M 344 196 L 344 168', 4) +
        poly([[344, 170], [372, 177], [344, 184]], 4)
      : ''
  return (
    rct(96, 400, 320, 40, 10, 5) +
    rct(136, 260, 64, 144, 8, 5) +
    rct(312, 260, 64, 144, 8, 5) +
    pathC('M 126 260 L 210 260 L 168 196', 5) +
    pathC('M 302 260 L 386 260 L 344 196', 5) +
    rct(216, 180, 80, 224, 8, 6) +
    pathC('M 206 180 L 306 180 L 256 96', 6) +
    circ(256, 240, 16, 4) +
    rct(158, 298, 24, 42, 10, 4) +
    rct(330, 298, 24, 42, 10, 4) +
    pathC('M 226 404 L 226 344 A 30 30 0 0 1 286 344 L 286 404', 5) +
    `<circle cx="272" cy="376" r="5" fill="${INK}" stroke="none"/>` +
    face(v, 256, 282, { dx: 18, er: 11, my: 300, mw: 28, mh: 9, bx: 28, by: 12, br: 7 }) +
    bsvg +
    flags +
    accTop(v, 256, 100)
  )
}

const mFairy: Recipe = (v) => {
  const r = v.r
  const wingDots = ri(r, 2, 3)
  const dslots: Array<[number, number]> = [
    [168, 244],
    [344, 244],
    [256, 224],
  ]
  let dsvg = ''
  for (let i = 0; i < wingDots; i++) dsvg += circ(dslots[i][0], dslots[i][1], 9, 4)
  return (
    pathC('M 240 250 C 170 190 120 200 116 258 C 112 310 180 320 242 292', 5) +
    pathC('M 272 250 C 342 190 392 200 396 258 C 400 310 332 320 270 292', 5) +
    dsvg +
    limb(238, 236, 186, 200, 14) +
    limb(274, 236, 326, 200, 14) +
    limb(242, 328, 226, 408, 14) +
    limb(270, 328, 290, 404, 14) +
    ell(222, 414, 16, 9) +
    ell(294, 410, 16, 9) +
    pathC('M 228 214 L 284 214 L 320 328 L 192 328', 6) +
    line('M 200 328 Q 218 344 236 328 M 236 328 Q 256 344 276 328 M 276 328 Q 294 344 312 328', 4) +
    glove(186, 200, 11) +
    glove(326, 200, 11) +
    circ(256, 150, 54, 6) +
    circ(256, 92, 16, 5) +
    face(v, 256, 144, { dx: 18, er: 11, my: 168, mw: 30, mh: 12, bx: 28, by: 13, br: 8 }) +
    line('M 326 200 L 352 148', 5) +
    star(356, 140, 18) +
    line('M 390 108 L 402 120 M 402 108 L 390 120', 4) +
    accHead(v, 256, 96, true)
  )
}

const mDragon: Recipe = (v) => {
  const r = v.r
  const breath = ri(r, 0, 1)
  const breathSvg =
    breath === 1
      ? heart(338, 216, 12) + heart(360, 192, 10)
      : star(342, 214, 14) + star(366, 188, 11)
  return (
    pathC('M 196 260 C 150 210 104 216 100 268 C 96 316 150 322 198 296', 5) +
    pathC('M 332 260 C 378 210 424 216 428 268 C 432 316 378 322 330 296', 5) +
    pathC('M 176 396 C 130 408 108 388 112 356 C 114 340 132 338 136 352 C 140 372 156 384 184 376', 5) +
    ell(264, 336, 104, 100, 6) +
    ell(264, 348, 64, 66) +
    ell(212, 428, 30, 18) +
    ell(316, 428, 30, 18) +
    poly([[336, 252], [362, 232], [366, 268]], 5) +
    poly([[362, 300], [390, 288], [384, 322]], 5) +
    poly([[372, 348], [398, 344], [386, 374]], 5) +
    circ(256, 180, 92, 6) +
    pathC('M 210 108 L 196 64 L 232 92', 5) +
    pathC('M 302 108 L 316 64 L 280 92', 5) +
    ell(256, 232, 48, 30) +
    face(v, 256, 164, { dx: 38, er: 16, my: 214, mw: 40, mh: 16, bx: 58, by: 32, tongue: true }) +
    `<circle cx="242" cy="224" r="5" fill="${INK}" stroke="none"/>` +
    `<circle cx="270" cy="224" r="5" fill="${INK}" stroke="none"/>` +
    breathSvg +
    accTop(v, 256, 92)
  )
}

const mWizardHat: Recipe = (v) => {
  const r = v.r
  const spark = ri(r, 2, 4)
  const sslots: Array<[number, number, number]> = [
    [110, 180, 14],
    [400, 150, 16],
    [420, 262, 12],
    [96, 286, 12],
  ]
  let ssvg = ''
  for (let i = 0; i < spark; i++) ssvg += star(sslots[i][0], sslots[i][1], sslots[i][2])
  return (
    crescent(120, 92, 22) +
    ell(256, 308, 130, 34, 6) +
    pathC('M 256 56 C 244 130 218 226 202 302 L 310 302 C 294 226 268 130 256 56', 6) +
    pathC('M 204 262 C 240 254 272 254 308 262 L 306 298 C 270 290 242 290 206 298', 5) +
    rct(242, 266, 28, 26, 6, 4) +
    star(232, 180, 16) +
    star(276, 130, 12) +
    face(v, 256, 306, { dx: 34, er: 12, my: 326, mw: 40, mh: 14, bx: 52, by: 13, br: 9 }) +
    line('M 130 236 L 142 248 M 142 236 L 130 248', 4) +
    ssvg +
    accTop(v, 214, 172, 0.9, -24)
  )
}

const mCrown: Recipe = (v) => {
  const r = v.r
  const gems = ri(r, 3, 5)
  const gslots: Array<[number, number, number]> = [
    [256, 252, 14],
    [196, 282, 11],
    [316, 282, 11],
    [226, 262, 9],
    [286, 262, 9],
  ]
  let gsvg = ''
  for (let i = 0; i < gems; i++) gsvg += circ(gslots[i][0], gslots[i][1], gslots[i][2], 4)
  const spark = ri(r, 2, 4)
  const sslots: Array<[number, number, number]> = [
    [110, 150, 14],
    [402, 140, 16],
    [90, 260, 12],
    [426, 250, 12],
  ]
  let ssvg = ''
  for (let i = 0; i < spark; i++) ssvg += star(sslots[i][0], sslots[i][1], sslots[i][2])
  return (
    ssvg +
    ell(256, 400, 150, 44, 6) +
    circ(120, 430, 10, 4) +
    circ(392, 430, 10, 4) +
    pathC('M 156 356 L 156 212 L 216 258 L 256 190 L 296 258 L 356 212 L 356 356', 6) +
    line('M 156 316 L 356 316', 4) +
    gsvg +
    face(v, 256, 330, { dx: 34, er: 12, my: 336, mw: 40, mh: 12, bx: 52, by: 12, br: 8 }) +
    accTop(v, 256, 196)
  )
}

const mWand: Recipe = (v) => {
  const r = v.r
  const spark = ri(r, 3, 5)
  const sslots: Array<[number, number, number]> = [
    [120, 100, 16],
    [396, 120, 14],
    [110, 280, 12],
    [420, 300, 15],
    [404, 396, 12],
  ]
  let ssvg = ''
  for (let i = 0; i < spark; i++) ssvg += star(sslots[i][0], sslots[i][1], sslots[i][2])
  const hearts = ri(r, 1, 2)
  const hslots: Array<[number, number]> = [
    [150, 200],
    [370, 220],
  ]
  let hsvg = ''
  for (let i = 0; i < hearts; i++) hsvg += heart(hslots[i][0], hslots[i][1], 13)
  const mouth = v.expr === 2 ? openMouth(236, 164, 9, 9) : smile(236, 162, 24, 8)
  return (
    ssvg +
    hsvg +
    line('M 292 414 C 316 436 336 428 348 446', 4) +
    line('M 284 420 C 296 448 320 452 330 466', 4) +
    limb(250, 206, 296, 418, 34) +
    star(236, 150, 54) +
    eyesBlush(v, 236, 144, 14, 10, 0, 0, 0) +
    mouth +
    accTop(v, 236, 100, 0.85)
  )
}

const mPotion: Recipe = (v) => {
  const r = v.r
  const bubbles = ri(r, 2, 4)
  const bslots: Array<[number, number, number]> = [
    [226, 360, 11],
    [286, 350, 12],
    [256, 388, 9],
    [306, 380, 8],
  ]
  let bsvg = ''
  for (let i = 0; i < bubbles; i++) bsvg += circ(bslots[i][0], bslots[i][1], bslots[i][2], 4)
  const spark = ri(r, 2, 4)
  const sslots: Array<[number, number, number]> = [
    [120, 140, 14],
    [398, 160, 15],
    [100, 300, 12],
    [424, 288, 12],
  ]
  let ssvg = ''
  for (let i = 0; i < spark; i++) ssvg += star(sslots[i][0], sslots[i][1], sslots[i][2])
  return (
    ssvg +
    rct(232, 92, 48, 44, 10, 5) +
    rct(226, 130, 60, 70, 10, 5) +
    rct(234, 176, 44, 40, 8, 4) +
    pathC(
      'M 226 196 C 180 220 156 264 156 320 C 156 392 200 436 256 436 C 312 436 356 392 356 320 C 356 264 332 220 286 196',
      6,
    ) +
    pathC(
      'M 178 306 C 200 292 230 302 256 306 C 282 310 312 300 334 314 C 334 376 300 414 256 414 C 212 414 178 376 178 314',
      5,
    ) +
    bsvg +
    face(v, 256, 254, { dx: 30, er: 12, my: 276, mw: 38, mh: 13, bx: 46, by: 14, br: 8 }) +
    accTop(v, 256, 100)
  )
}

const mMushroomHouse: Recipe = (v) => {
  const r = v.r
  const spots = ri(r, 3, 5)
  const sslots: Array<[number, number, number]> = [
    [170, 244, 13],
    [342, 240, 14],
    [256, 152, 17],
    [186, 186, 16],
    [326, 186, 15],
  ]
  let ssvg = ''
  for (let i = 0; i < spots; i++) ssvg += circ(sslots[i][0], sslots[i][1], sslots[i][2], 4)
  return (
    ell(256, 448, 40, 10, 4) +
    pathC('M 196 290 L 316 290 L 316 420 C 316 436 304 444 288 444 L 224 444 C 208 444 196 436 196 420', 6) +
    pathC(
      'M 116 268 C 116 170 180 108 256 108 C 332 108 396 170 396 268 C 396 282 384 290 368 290 L 144 290 C 128 290 116 282 116 268',
      6,
    ) +
    ssvg +
    pathC('M 236 444 L 236 380 A 20 20 0 0 1 276 380 L 276 444', 5) +
    `<circle cx="266" cy="412" r="5" fill="${INK}" stroke="none"/>` +
    circ(256, 330, 22, 4) +
    line('M 234 330 L 278 330 M 256 308 L 256 352', 4) +
    face(v, 256, 252, { dx: 34, er: 12, my: 274, mw: 38, mh: 13, bx: 52, by: 12, br: 8 }) +
    accTop(v, 256, 116)
  )
}

const rainbowArcs = (cx: number, cy: number, outer: number, bands: number, bw: number): string => {
  let s = ''
  let o = outer
  for (let i = 0; i < bands; i++) {
    const inn = o - bw
    s += pathC(
      `M ${cx - o} ${cy} A ${o} ${o} 0 0 1 ${cx + o} ${cy} L ${cx + inn} ${cy} A ${inn} ${inn} 0 0 0 ${cx - inn} ${cy}`,
      5,
    )
    o = inn
  }
  return s
}

const mRainbow: Recipe = (v) => {
  const r = v.r
  const starJ = ri(r, 10, 22)
  return (
    star(84, 128, starJ) +
    star(424, 116, Math.max(12, starJ - 4)) +
    rainbowArcs(256, 400, 216, 5, 30) +
    cloud(96, 400, 1.05) +
    cloud(416, 400, 1.05) +
    face(v, 256, 240, { dx: 34, er: 15, my: 274, mw: 50, mh: 22, bx: 78, by: 24, br: 11 }) +
    accTop(v, 256, 188)
  )
}

// ================================================================ NATURE
const nTree: Recipe = (v) => {
  const r = v.r
  const apples = ri(r, 3, 5)
  const aslots: Array<[number, number]> = [
    [190, 170],
    [316, 162],
    [150, 240],
    [356, 236],
    [256, 130],
  ]
  let asvg = ''
  for (let i = 0; i < apples; i++) asvg += circ(aslots[i][0], aslots[i][1], 15, 4)
  return (
    asvg +
    pathC(
      'M 256 96 C 190 96 150 130 142 176 C 110 186 96 216 100 248 C 104 284 136 306 172 304 C 176 336 210 356 256 356 C 302 356 336 336 340 304 C 376 306 408 284 412 248 C 416 216 402 186 370 176 C 362 130 322 96 256 96',
      6,
    ) +
    pathC('M 220 350 L 220 440 C 220 452 228 458 240 458 L 272 458 C 284 458 292 452 292 440 L 292 350', 6) +
    line('M 220 440 L 200 456 M 292 440 L 312 456', 5) +
    face(v, 256, 390, { dx: 16, er: 10, my: 414, mw: 30, mh: 11, bx: 26, by: 13, br: 7 }) +
    line('M 168 458 Q 178 442 188 458 M 324 458 Q 334 442 344 458', 4) +
    accTop(v, 256, 104)
  )
}

const nFlowerPot: Recipe = (v) => {
  const r = v.r
  const petalN = ri(r, 6, 8)
  const off = ri(r, 0, 1) * (Math.PI / petalN)
  return (
    pathC('M 196 356 L 316 356 L 300 448 C 298 458 290 464 280 464 L 232 464 C 222 464 214 458 212 448', 6) +
    rct(188, 340, 136, 28, 10, 5) +
    line('M 206 396 L 306 396 M 214 424 L 298 424', 4) +
    rct(248, 240, 16, 104, 7, 5) +
    ell(208, 300, 34, 16, 5, -24) +
    ell(304, 286, 34, 16, 5, 20) +
    petals(256, 180, petalN, 62, 24, 34, off) +
    circ(256, 180, 38, 6) +
    face(v, 256, 172, { dx: 14, er: 10, my: 194, mw: 26, mh: 10, bx: 24, by: 13, br: 7 }) +
    accTop(v, 256, 92)
  )
}

const nTulip: Recipe = (v) => {
  const r = v.r
  const jx = ri(r, -8, 8)
  const cx = 256 + jx
  return (
    ell(256, 420, 120, 22, 5) +
    rct(248, 202, 16, 190, 7, 5) +
    pathC('M 248 306 C 202 300 174 336 182 386 C 216 380 244 352 250 320', 5) +
    pathC('M 264 282 C 310 276 338 312 330 362 C 296 356 268 328 262 296', 5) +
    pathC(
      `M ${(cx - 32).toFixed(1)} 140 C ${(cx - 36).toFixed(1)} 176 ${(cx - 22).toFixed(1)} 202 ${cx.toFixed(1)} 202 C ${(cx + 22).toFixed(1)} 202 ${(cx + 36).toFixed(1)} 176 ${(cx + 32).toFixed(1)} 140 L ${(cx + 15).toFixed(1)} 156 L ${cx.toFixed(1)} 136 L ${(cx - 15).toFixed(1)} 156`,
      6,
    ) +
    face(v, cx, 168, { dx: 16, er: 10, my: 186, mw: 26, mh: 10, bx: 24, by: 12, br: 6 }) +
    circ(368, 240, 15, 4) +
    circ(396, 262, 12, 4) +
    ell(358, 258, 8, 18, 4) +
    line('M 352 242 L 344 228 M 364 242 L 370 226', 4) +
    accTop(v, cx, 144)
  )
}

const nSun: Recipe = (v) => {
  const r = v.r
  const rays = ri(r, 10, 14)
  const pt = (rad: number, ang: number): number[] => [256 + rad * Math.cos(ang), 256 + rad * Math.sin(ang)]
  let rsvg = ''
  for (let i = 0; i < rays; i++) {
    const a = (Math.PI * 2 / rays) * i
    rsvg += poly([pt(122, a - Math.PI / rays), pt(172, a), pt(122, a + Math.PI / rays)], 5)
  }
  return (
    rsvg +
    circ(256, 256, 108, 6) +
    face(v, 256, 240, { dx: 34, er: 16, my: 284, mw: 54, mh: 26, bx: 70, by: 34, br: 12 }) +
    accTop(v, 256, 152)
  )
}

const nRainbow: Recipe = (v) => {
  const r = v.r
  const j = rr(r, -10, 10)
  return (
    rainbowArcs(256, 392, 220, 5, 30) +
    cloud(98 + j, 392, 1.05) +
    cloud(414 - j, 392, 1.05) +
    face(v, 256, 234, { dx: 36, er: 15, my: 268, mw: 50, mh: 22, bx: 80, by: 24, br: 11 }) +
    accTop(v, 256, 176)
  )
}

const nMountains: Recipe = (v) => {
  const r = v.r
  const j1 = ri(r, -10, 10)
  const j2 = ri(r, -8, 8)
  return (
    rct(56, 416, 400, 30, 12, 5) +
    pathC(`M ${296 + j2} 420 L ${390 + j2} 240 L ${470 + j2} 420`, 5) +
    pathC(
      `M ${362 + j2} 286 L ${390 + j2} 240 L ${418 + j2} 286 L ${404 + j2} 276 L ${390 + j2} 290 L ${376 + j2} 274`,
      4,
    ) +
    pathC(`M ${96 + j1} 420 L ${246 + j1} 148 L ${396 + j1} 420`, 6) +
    pathC(
      `M ${200 + j1} 226 L ${246 + j1} 148 L ${292 + j1} 226 L ${272 + j1} 214 L ${254 + j1} 232 L ${236 + j1} 212 L ${218 + j1} 230`,
      5,
    ) +
    face(v, 246 + j1, 300, { dx: 30, er: 13, my: 330, mw: 44, mh: 16, bx: 48, by: 18, br: 9 }) +
    poly([[120 + j2, 336], [150 + j2, 404], [90 + j2, 404]], 5) +
    rct(113 + j2, 404, 14, 16, 3, 4) +
    poly([[430 - j1, 352], [458 - j1, 412], [402 - j1, 412]], 5) +
    rct(423 - j1, 412, 14, 16, 3, 4) +
    accTop(v, 246 + j1, 152)
  )
}

const nRainCloud: Recipe = (v) => {
  const r = v.r
  const drops = ri(r, 4, 6)
  const dslots: Array<[number, number]> = [
    [176, 310],
    [256, 330],
    [336, 310],
    [216, 378],
    [296, 378],
    [140, 372],
  ]
  let dsvg = ''
  for (let i = 0; i < drops; i++) dsvg += raindrop(dslots[i][0], dslots[i][1], 0.7)
  return (
    dsvg +
    ell(256, 436, 130, 20, 5) +
    line('M 160 442 Q 180 432 200 442 M 312 442 Q 332 432 352 442', 4) +
    cloud(256, 200, 2.1) +
    face(v, 256, 190, { dx: 42, er: 15, my: 226, mw: 52, mh: 22, bx: 84, by: 28, br: 11 }) +
    accTop(v, 256, 126)
  )
}

const nMushroom: Recipe = (v) => {
  const r = v.r
  const spots = ri(r, 3, 5)
  const sslots: Array<[number, number, number]> = [
    [186, 180, 16],
    [316, 174, 15],
    [256, 148, 14],
    [158, 236, 13],
    [352, 232, 14],
  ]
  let ssvg = ''
  for (let i = 0; i < spots; i++) ssvg += circ(sslots[i][0], sslots[i][1], sslots[i][2], 4)
  const bug = ri(r, 0, 1)
  const bugSvg =
    bug === 1
      ? circ(368, 416, 17, 5) +
        circ(368, 394, 9, 4) +
        line('M 368 400 L 368 432', 4) +
        circ(356, 416, 7, 4) +
        circ(380, 408, 7, 4)
      : ''
  return (
    bugSvg +
    pathC('M 208 286 L 304 286 L 298 424 C 297 438 286 446 272 446 L 240 446 C 226 446 215 438 214 424', 6) +
    pathC(
      'M 128 264 C 128 172 186 112 256 112 C 326 112 384 172 384 264 C 384 278 372 286 356 286 L 156 286 C 140 286 128 278 128 264',
      6,
    ) +
    ssvg +
    face(v, 256, 330, { dx: 24, er: 11, my: 356, mw: 34, mh: 13, bx: 42, by: 14, br: 8 }) +
    line('M 150 460 Q 160 444 170 460 M 342 460 Q 352 444 362 460', 4) +
    accTop(v, 256, 120)
  )
}

const nCactus: Recipe = (v) => {
  const r = v.r
  const spines = ri(r, 4, 6)
  let ssvg = ''
  for (let i = 0; i < spines; i++) {
    const y = 180 + i * 34
    ssvg += line(`M 222 ${y} L 212 ${y - 6} M 290 ${y} L 300 ${y - 6}`, 4)
  }
  return (
    pathC('M 196 368 L 316 368 L 304 444 C 302 454 294 460 284 460 L 228 460 C 218 460 210 454 208 444', 6) +
    rct(188, 352, 136, 26, 9, 5) +
    line('M 214 396 L 298 396 M 222 424 L 290 424', 4) +
    pathC(
      'M 226 262 L 196 262 C 172 262 160 276 160 296 L 160 330 C 160 344 170 350 180 350 C 190 350 196 344 196 330 L 196 306 C 196 296 204 290 214 290 L 226 290',
      5,
    ) +
    pathC(
      'M 286 232 L 316 232 C 340 232 352 246 352 266 L 352 296 C 352 310 342 316 332 316 C 322 316 316 310 316 296 L 316 276 C 316 266 308 260 298 260 L 286 260',
      5,
    ) +
    rct(226, 140, 60, 224, 30, 6) +
    petals(256, 134, 5, 26, 12, 12) +
    circ(256, 134, 11, 4) +
    face(v, 256, 210, { dx: 16, er: 11, my: 238, mw: 32, mh: 12, bx: 24, by: 14, br: 7 }) +
    ssvg +
    accTop(v, 256, 100, 0.85)
  )
}

const nPalmIsland: Recipe = (v) => {
  const r = v.r
  const waves = ri(r, 2, 3)
  let wsvg = ''
  for (let i = 0; i < waves; i++) {
    const x = 60 + i * 160
    wsvg += line(`M ${x} 470 Q ${x + 20} 456 ${x + 40} 470 Q ${x + 60} 484 ${x + 80} 470`, 4)
  }
  const leafJ = ri(r, -8, 8)
  return (
    wsvg +
    ell(256, 430, 150, 34, 6) +
    pathC(
      `M 262 420 C 258 360 264 300 ${282 + leafJ} 252 L ${302 + leafJ} 258 C 286 304 282 360 286 420`,
      5,
    ) +
    line('M 264 380 Q 276 374 288 380 M 268 340 Q 280 334 292 340 M 272 300 Q 284 294 296 300', 4) +
    pathC(`M ${292 + leafJ} 252 C 240 216 180 220 152 258 C 196 262 244 268 290 262`, 5) +
    pathC(`M ${292 + leafJ} 250 C 250 200 200 186 160 200 C 196 228 246 246 290 258`, 5) +
    pathC(`M ${296 + leafJ} 252 C 350 216 410 220 438 258 C 394 262 346 268 300 262`, 5) +
    pathC(`M ${296 + leafJ} 250 C 338 200 388 186 428 200 C 392 228 342 246 298 258`, 5) +
    pathC(`M ${294 + leafJ} 250 C 290 196 302 156 332 138 C 340 178 324 220 302 252`, 5) +
    circ(272, 268, 14, 4) +
    circ(310, 276, 14, 4) +
    face(v, 214, 424, { dx: 18, er: 10, my: 444, mw: 30, mh: 10, bx: 28, by: 13, br: 7 }) +
    accTop(v, 294 + leafJ, 250, 0.85)
  )
}

// ================================================================ FOOD
const fIceCream: Recipe = (v) => {
  const r = v.r
  const sprinkles = ri(r, 2, 4)
  const sslots: Array<[number, number]> = [
    [214, 256],
    [298, 248],
    [238, 194],
    [302, 168],
  ]
  let ssvg = ''
  for (let i = 0; i < sprinkles; i++) ssvg += circ(sslots[i][0], sslots[i][1], 8, 4)
  const cherry =
    v.acc === 0
      ? circ(276, 98, 15) + line('M 276 84 C 280 72 290 68 298 70', 4)
      : ''
  return (
    cherry +
    pathC('M 190 298 L 322 298 L 262 458 C 258 466 254 466 250 458', 6) +
    line('M 212 324 L 300 324 M 226 366 L 288 366 M 238 404 L 276 404 M 256 302 L 256 450', 4) +
    ell(256, 280, 86, 54, 6) +
    ell(228, 206, 60, 42, 6) +
    ell(276, 142, 48, 36, 6) +
    ssvg +
    face(v, 256, 268, { dx: 30, er: 13, my: 298, mw: 44, mh: 16, bx: 48, by: 18, br: 9 }) +
    accTop(v, 276, 110)
  )
}

const fCupcake: Recipe = (v) => {
  const r = v.r
  const sprinkles = ri(r, 3, 5)
  const sslots: Array<[number, number]> = [
    [206, 232],
    [306, 232],
    [230, 288],
    [282, 288],
    [256, 214],
  ]
  let ssvg = ''
  for (let i = 0; i < sprinkles; i++) ssvg += circ(sslots[i][0], sslots[i][1], 8, 4)
  const cherry =
    v.acc === 0
      ? circ(256, 178, 15) + line('M 256 164 C 260 152 270 148 278 150', 4)
      : ''
  return (
    cherry +
    pathC('M 180 300 L 332 300 L 312 442 C 310 454 300 462 288 462 L 224 462 C 212 462 202 454 200 442', 6) +
    rct(224, 300, 24, 158, 10, 4) +
    rct(264, 300, 24, 158, 10, 4) +
    ell(210, 268, 48, 40, 5) +
    ell(302, 268, 48, 40, 5) +
    ell(256, 240, 52, 46, 6) +
    ssvg +
    face(v, 256, 240, { dx: 18, er: 11, my: 262, mw: 30, mh: 12, bx: 28, by: 13, br: 7 }) +
    accTop(v, 256, 196)
  )
}

const fDonut: Recipe = (v) => {
  const r = v.r
  const sprinkles = ri(r, 4, 7)
  const sslots: Array<[number, number]> = [
    [196, 190],
    [296, 178],
    [256, 148],
    [160, 250],
    [352, 248],
    [330, 322],
    [164, 318],
  ]
  let ssvg = ''
  for (let i = 0; i < sprinkles; i++) ssvg += circ(sslots[i][0], sslots[i][1], 8, 4)
  return (
    circ(256, 268, 130, 6) +
    scallopBlob(256, 268, 92, 10, 14) +
    circ(256, 268, 44, 5) +
    ssvg +
    face(v, 256, 316, { dx: 28, er: 11, my: 338, mw: 40, mh: 14, bx: 34, by: 16, br: 9 }) +
    accTop(v, 256, 142)
  )
}

const fCake: Recipe = (v) => {
  const r = v.r
  const dripJ = ri(r, 2, 8)
  const candles =
    v.acc === 0
      ? rct(208, 216, 16, 52, 6, 4) + rct(248, 216, 16, 52, 6, 4) + rct(288, 216, 16, 52, 6, 4)
      : rct(196, 216, 16, 52, 6, 4) + rct(300, 216, 16, 52, 6, 4)
  const flames =
    v.acc === 0
      ? raindrop(216, 190, 0.6) + raindrop(256, 190, 0.6) + raindrop(296, 190, 0.6)
      : raindrop(204, 190, 0.6) + raindrop(308, 190, 0.6)
  return (
    ell(256, 440, 170, 22, 5) +
    rct(136, 344, 240, 96, 14, 6) +
    pathC(
      `M 136 344 L 376 344 L 376 366 Q 356 ${392 + dripJ} 336 366 Q 316 ${392 + dripJ} 296 366 Q 276 ${392 + dripJ} 256 366 Q 236 ${392 + dripJ} 216 366 Q 196 ${392 + dripJ} 176 366 Q 156 ${392 + dripJ} 136 366`,
      5,
    ) +
    rct(176, 268, 160, 76, 12, 6) +
    pathC(
      'M 176 268 L 336 268 L 336 286 Q 320 306 304 286 Q 288 306 272 286 Q 256 306 240 286 Q 224 306 208 286 Q 192 306 176 286',
      5,
    ) +
    candles +
    flames +
    face(v, 256, 406, { dx: 40, er: 13, my: 424, mw: 44, mh: 12, bx: 52, by: 14, br: 9 }) +
    accTop(v, 256, 272)
  )
}

const fApple: Recipe = (v) => {
  const r = v.r
  const dots = ri(r, 0, 2)
  const dslots: Array<[number, number]> = [
    [340, 330],
    [164, 330],
  ]
  let dsvg = ''
  for (let i = 0; i < dots; i++) dsvg += circ(dslots[i][0], dslots[i][1], 8, 4)
  return (
    dsvg +
    line('M 256 152 C 252 128 258 112 270 100', 5) +
    ell(298, 116, 34, 16, 5, -28) +
    pathC(
      'M 256 156 C 208 128 148 148 132 208 C 116 264 140 340 178 388 C 200 414 226 424 244 414 C 250 410 262 410 268 414 C 286 424 312 414 334 388 C 372 340 396 264 380 208 C 364 148 304 128 256 156',
      6,
    ) +
    face(v, 256, 240, { dx: 40, er: 16, my: 286, mw: 52, mh: 24, bx: 76, by: 32, br: 12 }) +
    line('M 176 200 Q 170 220 176 238 M 196 180 Q 191 192 194 204', 4) +
    accTop(v, 256, 158)
  )
}

const fBanana: Recipe = (v) => {
  const r = v.r
  const dots = ri(r, 1, 3)
  const dslots: Array<[number, number]> = [
    [356, 386],
    [198, 320],
    [318, 352],
  ]
  let dsvg = ''
  for (let i = 0; i < dots; i++) dsvg += circ(dslots[i][0], dslots[i][1], 8, 4)
  const eyes =
    v.expr === 1
      ? winkEye(228, 404, 9) + eye(272, 404, 9)
      : eye(228, 404, 9) + eye(272, 404, 9)
  const mouth = v.expr === 2 ? openMouth(250, 418, 10, 11) : smile(250, 420, 30, 9)
  return (
    dsvg +
    pathC(
      'M 128 272 Q 142 402 264 446 Q 352 472 412 424 Q 422 414 408 406 Q 348 430 284 404 Q 184 364 162 264 Q 158 248 142 254 Q 130 260 128 272',
      6,
    ) +
    eyes +
    mouth +
    accTop(v, 170, 290, 0.85, -36)
  )
}

const fWatermelon: Recipe = (v) => {
  const r = v.r
  const seeds = ri(r, 3, 5)
  const sslots: Array<[number, number]> = [
    [196, 234],
    [316, 238],
    [256, 222],
    [366, 306],
    [146, 306],
  ]
  let ssvg = ''
  for (let i = 0; i < seeds; i++) ssvg += ell(sslots[i][0], sslots[i][1], 7, 11, 4, ri(r, -20, 20))
  return (
    pathC('M 96 340 A 160 160 0 0 1 416 340', 6) +
    pathC('M 126 340 A 130 130 0 0 1 386 340', 5) +
    ssvg +
    face(v, 256, 280, { dx: 40, er: 13, my: 308, mw: 46, mh: 18, bx: 80, by: 18, br: 10 }) +
    accTop(v, 256, 188)
  )
}

const fPizza: Recipe = (v) => {
  const r = v.r
  const pepperoni = ri(r, 3, 4)
  const pslots: Array<[number, number, number]> = [
    [200, 252, 18],
    [312, 252, 18],
    [256, 376, 16],
    [256, 228, 13],
  ]
  let psvg = ''
  for (let i = 0; i < pepperoni; i++) {
    psvg += circ(
      pslots[i][0] + rr(r, -8, 8),
      pslots[i][1] + rr(r, -6, 6),
      pslots[i][2],
      4,
    )
  }
  return (
    pathC('M 130 190 A 190 190 0 0 1 382 190 L 256 448', 6) +
    pathC('M 130 190 A 190 190 0 0 1 382 190 L 356 214 A 150 150 0 0 0 156 214', 5) +
    psvg +
    face(v, 256, 288, { dx: 24, er: 11, my: 312, mw: 34, mh: 13, bx: 34, by: 14, br: 8 }) +
    accTop(v, 256, 150)
  )
}

const fBurger: Recipe = (v) => {
  const r = v.r
  const sesame = ri(r, 4, 6)
  const sslots: Array<[number, number]> = [
    [180, 236],
    [206, 196],
    [306, 196],
    [332, 236],
    [256, 176],
    [156, 210],
  ]
  let ssvg = ''
  for (let i = 0; i < sesame; i++) ssvg += ell(sslots[i][0], sslots[i][1], 10, 7, 4, ri(r, -16, 16))
  return (
    pathC('M 136 268 C 136 196 190 152 256 152 C 322 152 376 196 376 268', 6) +
    ssvg +
    face(v, 256, 224, { dx: 30, er: 12, my: 248, mw: 40, mh: 15, bx: 44, by: 14, br: 8 }) +
    pathC(
      'M 128 268 L 384 268 L 384 284 C 370 302 352 302 342 288 C 330 306 310 306 300 290 C 288 308 268 308 258 292 C 246 310 226 310 216 292 C 204 308 184 308 174 290 C 162 304 142 302 128 284',
      5,
    ) +
    rct(132, 306, 248, 40, 18, 5) +
    rct(140, 344, 232, 22, 10, 4) +
    pathC('M 136 364 L 376 364 L 376 396 C 376 420 356 436 330 436 L 182 436 C 156 436 136 420 136 396', 6) +
    accTop(v, 256, 160)
  )
}

const fCandy: Recipe = (v) => {
  const r = v.r
  const starJ = ri(r, 12, 16)
  return (
    star(120, 160, starJ) +
    star(392, 150, Math.max(12, starJ - 2)) +
    pathC('M 172 244 C 132 228 96 240 84 270 C 96 300 132 310 172 294 C 158 280 158 258 172 244', 5) +
    pathC('M 340 244 C 380 228 416 240 428 270 C 416 300 380 310 340 294 C 354 280 354 258 340 244', 5) +
    ell(256, 268, 86, 76, 6) +
    line('M 190 204 C 182 244 182 292 190 332 M 322 204 C 330 244 330 292 322 332', 4) +
    line('M 96 262 L 110 268 M 416 262 L 402 268', 4) +
    face(v, 256, 258, { dx: 22, er: 11, my: 282, mw: 34, mh: 13, bx: 34, by: 14, br: 8 }) +
    accTop(v, 256, 204)
  )
}

// ================================================================ STICKMAN
interface StickOpts2 {
  armL: [number, number]
  armR: [number, number]
  legL: [number, number]
  legR: [number, number]
  cx?: number
  cy?: number
  hr?: number
  behind?: string
  front?: string
  head?: string
  face?: string
  feet?: boolean
}

const stickFigure = (v: Variant, o: StickOpts2): string => {
  const cx = o.cx ?? 256
  const hcy = o.cy ?? 150
  const hr = o.hr ?? 58
  const shY = hcy + hr + 10
  const hipY = 318
  const faceSvg =
    o.face ??
    face(v, cx, hcy - 2, { dx: 22, er: 12, my: hcy + 22, mw: 34, mh: 14, bx: 40, by: 16, br: 9 })
  const feet =
    o.feet === false
      ? ''
      : ell(o.legL[0], o.legL[1], 19, 10, 5) + ell(o.legR[0], o.legR[1], 19, 10, 5)
  return (
    (o.behind ?? '') +
    limb(cx - 10, hipY - 4, o.legL[0], o.legL[1], 17) +
    limb(cx + 10, hipY - 4, o.legR[0], o.legR[1], 17) +
    feet +
    limb(cx - 12, shY, o.armL[0], o.armL[1], 15) +
    limb(cx + 12, shY, o.armR[0], o.armR[1], 15) +
    pathC(
      `M ${cx - 15} ${hcy + hr} Q ${cx} ${hcy + hr + 24} ${cx + 15} ${hcy + hr} L ${cx + 12} ${hipY} Q ${cx} ${hipY + 12} ${cx - 12} ${hipY}`,
      6,
    ) +
    glove(o.armL[0], o.armL[1], 13) +
    glove(o.armR[0], o.armR[1], 13) +
    circ(cx, hcy, hr, 6) +
    faceSvg +
    (o.head ?? accHead(v, cx, hcy - hr, true)) +
    (o.front ?? '')
  )
}

const note = (cx: number, cy: number, s = 1): string =>
  ell(cx, cy, 15 * s, 12 * s, 5, -18) +
  line(
    `M ${(cx + 13 * s).toFixed(1)} ${(cy - 4 * s).toFixed(1)} L ${(cx + 13 * s).toFixed(1)} ${(cy - 54 * s).toFixed(1)}`,
    5,
  ) +
  line(
    `M ${(cx + 13 * s).toFixed(1)} ${(cy - 54 * s).toFixed(1)} Q ${(cx + 30 * s).toFixed(1)} ${(cy - 48 * s).toFixed(1)} ${(cx + 34 * s).toFixed(1)} ${(cy - 32 * s).toFixed(1)}`,
    5,
  )

const sPainter: Recipe = (v) => {
  const r = v.r
  const angle = ri(r, 30, 44)
  return (
    stickFigure(v, {
      armL: [176, 254],
      armR: [342, 210],
      legL: [212, 424],
      legR: [300, 424],
    }) +
    ell(160, 274, 48, 34) +
    circ(144, 260, 9, 4) +
    circ(176, 256, 9, 4) +
    circ(140, 288, 9, 4) +
    circ(178, 290, 9, 4) +
    `<g transform="rotate(${angle} 342 210)">` +
    rct(334, 130, 15, 74, 7, 4) +
    rct(330, 198, 23, 16, 4, 4) +
    pathC('M 329 214 L 354 214 L 347 242 L 336 242', 4) +
    '</g>'
  )
}

const sWaving: Recipe = (v) => {
  const r = v.r
  const marks = ri(r, 2, 3)
  let msvg = ''
  for (let i = 0; i < marks; i++) {
    msvg += line(
      `M ${394 + i * 14} ${96 - i * 10} Q ${406 + i * 14} ${108 - i * 10} ${400 + i * 14} ${124 - i * 10}`,
      4,
    )
  }
  return (
    msvg +
    stickFigure(v, {
      armL: [172, 262],
      armR: [354, 100],
      legL: [214, 424],
      legR: [298, 424],
    })
  )
}

const sDancing: Recipe = (v) => {
  const r = v.r
  const jx = rr(r, -8, 8)
  return (
    note(100 + jx, 150, 1) +
    note(416 - jx, 190, 0.85) +
    note(140, 92, 0.7) +
    stickFigure(v, {
      armL: [148, 172],
      armR: [366, 168],
      legL: [186, 420],
      legR: [326, 412],
    })
  )
}

const sJumpRope: Recipe = (v) => {
  const r = v.r
  const loops = ri(r, 0, 1)
  const extra = loops === 1 ? line('M 120 320 Q 256 372 392 320', 4) : ''
  return (
    line('M 162 262 C 96 344 150 452 256 456 C 362 452 416 344 350 262', 5) +
    extra +
    stickFigure(v, {
      armL: [168, 244],
      armR: [344, 244],
      legL: [206, 396],
      legR: [306, 396],
    }) +
    rct(154, 226, 14, 38, 6, 4, -28) +
    rct(344, 226, 14, 38, 6, 4, 28)
  )
}

const sHero: Recipe = (v) => {
  const r = v.r
  const j = ri(r, -8, 8)
  return (
    star(120 + j, 96, 18) +
    star(398 - j, 88, 15) +
    stickFigure(v, {
      armL: [176, 220],
      armR: [352, 106],
      legL: [204, 430],
      legR: [308, 430],
      behind: pathC(
        `M ${232 + j} 214 C 150 300 138 386 150 436 L 362 436 C 374 386 362 300 ${280 + j} 214`,
        6,
      ),
      front: star(256, 266, 13),
    })
  )
}

const sReading: Recipe = (v) => {
  const r = v.r
  const lines = ri(r, 1, 2)
  let lsvg = ''
  for (let i = 0; i < lines; i++) {
    lsvg += line(
      `M 186 ${296 + i * 16} L 232 ${302 + i * 16} M 280 ${302 + i * 16} L 326 ${296 + i * 16}`,
      4,
    )
  }
  return (
    stickFigure(v, {
      armL: [190, 280],
      armR: [322, 280],
      legL: [216, 428],
      legR: [296, 428],
    }) +
    pathC(
      'M 256 286 C 226 270 190 268 168 278 L 168 340 C 192 330 228 332 256 348 C 284 332 320 330 344 340 L 344 278 C 322 268 286 270 256 286',
      5,
    ) +
    line('M 256 286 L 256 348', 4) +
    lsvg
  )
}

const sSleepy: Recipe = (v) => {
  const r = v.r
  const stars = ri(r, 2, 3)
  const sslots: Array<[number, number, number]> = [
    [128, 92, 14],
    [184, 64, 11],
    [96, 160, 10],
  ]
  let ssvg = ''
  for (let i = 0; i < stars; i++) ssvg += star(sslots[i][0], sslots[i][1], sslots[i][2])
  const head =
    v.acc === 0
      ? pathC('M 198 112 Q 256 44 328 92 L 294 114', 5) + circ(334, 88, 12, 5)
      : accHead(v, 256, 92)
  return (
    crescent(402, 92, 30) +
    ssvg +
    stickFigure(v, {
      armL: [180, 268],
      armR: [332, 268],
      legL: [220, 426],
      legR: [292, 426],
      face:
        winkEye(234, 148, 12) +
        winkEye(278, 148, 12) +
        (v.expr === 2
          ? ell(256, 178, 7, 8, 5)
          : smile(256, 174, v.expr === 0 ? 26 : 18, v.expr === 0 ? 11 : 7)) +
        blush(214, 162, 9) +
        blush(298, 162, 9),
      head,
    })
  )
}

const sKicker: Recipe = (v) => {
  const r = v.r
  const spokes = ri(r, 3, 5)
  const ppts: Array<[number, number]> = []
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 / 5) * i - Math.PI / 2
    ppts.push([412 + 15 * Math.cos(a), 404 + 15 * Math.sin(a)])
  }
  const pent = `<polygon points="${ppts
    .map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(' ')}" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`
  let spokesSvg = ''
  for (let i = 0; i < spokes; i++) {
    const a = (Math.PI * 2 / 5) * i - Math.PI / 2
    spokesSvg += line(
      `M ${(412 + 15 * Math.cos(a)).toFixed(1)} ${(404 + 15 * Math.sin(a)).toFixed(1)} L ${(412 + 36 * Math.cos(a)).toFixed(1)} ${(404 + 36 * Math.sin(a)).toFixed(1)}`,
      4,
    )
  }
  return (
    stickFigure(v, {
      armL: [160, 230],
      armR: [346, 216],
      legL: [222, 428],
      legR: [352, 372],
      feet: false,
    }) +
    ell(222, 428, 19, 10, 5) +
    ell(356, 376, 19, 10, 5) +
    circ(412, 404, 40, 6) +
    pent +
    spokesSvg
  )
}

const sMusic: Recipe = (v) => {
  const r = v.r
  const j = rr(r, -10, 10)
  return (
    note(120 + j, 120, 0.9) +
    note(390 - j, 108, 0.8) +
    stickFigure(v, {
      armL: [176, 150],
      armR: [336, 252],
      legL: [210, 424],
      legR: [302, 424],
      front:
        ell(330, 250, 18, 14, 5, -20) +
        line('M 346 244 L 346 160', 5) +
        line('M 346 160 Q 366 168 372 184', 5),
    })
  )
}

const sSkater: Recipe = (v) => {
  const r = v.r
  const flakes = ri(r, 2, 4)
  const fslots: Array<[number, number, number]> = [
    [120, 90, 13],
    [398, 110, 12],
    [70, 210, 10],
    [440, 200, 10],
  ]
  let fsvg = ''
  for (let i = 0; i < flakes; i++) fsvg += star(fslots[i][0], fslots[i][1], fslots[i][2])
  return (
    fsvg +
    stickFigure(v, {
      armL: [164, 220],
      armR: [348, 220],
      legL: [212, 424],
      legR: [302, 424],
      feet: false,
    }) +
    rct(195, 418, 36, 26, 8, 5) +
    rct(285, 418, 36, 26, 8, 5) +
    line('M 190 448 L 240 448 M 280 448 L 330 448', 5) +
    line('M 186 452 Q 190 448 194 448 M 244 444 Q 240 448 236 448', 4)
  )
}

// ================================================================ SHAPES
const shMandala: Recipe = (v) => {
  const r = v.r
  const off = ri(r, 0, 1) * (Math.PI / 12)
  let ring3 = ''
  const n = 16
  for (let i = 0; i < n; i++) {
    const a = ((Math.PI * 2) / n) * i + off
    ring3 += diamond(256 + 206 * Math.cos(a), 256 + 206 * Math.sin(a), 14, 24, (a * 180) / Math.PI + 90)
  }
  return (
    petals(256, 256, 8, 84, 22, 32, off) +
    petals(256, 256, 12, 148, 26, 34, off + Math.PI / 12) +
    ring3 +
    circ(256, 256, 56, 6) +
    face(v, 256, 248, { dx: 18, er: 10, my: 270, mw: 28, mh: 10, bx: 30, by: 14, br: 7 }) +
    accTop(v, 256, 206)
  )
}

const shRobot: Recipe = (v) => {
  const r = v.r
  const buttons = ri(r, 2, 3)
  let bsvg = ''
  for (let i = 0; i < buttons; i++) bsvg += circ(226 + i * 30, 318, 10, 4)
  const antenna = v.acc === 0 ? line('M 256 120 L 256 84', 5) + circ(256, 76, 12, 5) : ''
  return (
    antenna +
    limb(150, 290, 104, 320, 16) +
    limb(362, 290, 408, 320, 16) +
    glove(100, 324, 13) +
    glove(412, 324, 13) +
    rct(186, 412, 40, 36, 8, 5) +
    rct(286, 412, 40, 36, 8, 5) +
    ell(206, 452, 34, 14, 5) +
    ell(306, 452, 34, 14, 5) +
    rct(240, 246, 32, 20, 6, 5) +
    rct(156, 262, 200, 150, 20, 6) +
    rct(176, 120, 160, 130, 22, 6) +
    rct(196, 288, 120, 60, 12, 5) +
    bsvg +
    face(v, 256, 172, { dx: 40, er: 15, my: 218, mw: 48, mh: 18, bx: 58, by: 16, br: 9 }) +
    accTop(v, 256, 128)
  )
}

const shTree: Recipe = (v) => {
  const r = v.r
  const j = ri(r, -8, 8)
  const ornaments = ri(r, 3, 4)
  const oslots: Array<[number, number]> = [
    [216, 352],
    [300, 356],
    [222, 270],
    [296, 272],
  ]
  let osvg = ''
  for (let i = 0; i < ornaments; i++) osvg += circ(oslots[i][0] + j, oslots[i][1], 12, 4)
  return (
    ell(256, 448, 150, 18, 5) +
    pathC(`M 116 384 L ${256 + j} 264 L 396 384`, 5) +
    pathC(`M 140 296 L ${256 + j} 196 L 372 296`, 5) +
    pathC(`M 164 220 L ${256 + j} 128 L 348 220`, 5) +
    rct(228, 384, 56, 56, 8, 6) +
    star(256 + j, 104, 26) +
    osvg +
    face(v, 256, 402, { dx: 13, er: 9, my: 422, mw: 26, mh: 9, bx: 22, by: 12, br: 6 }) +
    accTop(v, 256 + j, 106, 0.8)
  )
}

const shHeartBalloon: Recipe = (v) => {
  const r = v.r
  const j1 = rr(r, -12, 12)
  const j2 = rr(r, -12, 12)
  return (
    heart(150 + j1, 130, 16) +
    heart(368 + j2, 120, 13) +
    line('M 256 396 C 250 430 262 448 256 470', 5) +
    poly([[256, 428], [234, 416], [234, 440]], 4) +
    poly([[256, 428], [278, 416], [278, 440]], 4) +
    pathC(
      'M 256 396 C 150 320 116 226 158 178 C 190 142 240 158 256 196 C 272 158 322 142 354 178 C 396 226 362 320 256 396',
      6,
    ) +
    face(v, 256, 232, { dx: 36, er: 15, my: 268, mw: 48, mh: 20, bx: 72, by: 26, br: 11 }) +
    accTop(v, 256, 204)
  )
}

const shStarSheet: Recipe = (v) => {
  const r = v.r
  const j = rr(r, -8, 8)
  return (
    star(110 + j, 110, 52) +
    star(402 - j, 118, 52) +
    star(88, 300, 30) +
    star(424, 296, 30) +
    star(150, 420, 28) +
    star(362, 424, 28) +
    circ(256, 96, 9, 4) +
    circ(256, 416, 9, 4) +
    star(256, 250, 120) +
    face(v, 256, 234, { dx: 34, er: 14, my: 268, mw: 44, mh: 18, bx: 64, by: 24, br: 11 }) +
    accTop(v, 256, 134, 0.85)
  )
}

const shKite: Recipe = (v) => {
  const r = v.r
  const bows = ri(r, 2, 3)
  const bslots: Array<[number, number]> = [
    [280, 392],
    [270, 428],
    [292, 356],
  ]
  let bsvg = ''
  for (let i = 0; i < bows; i++) {
    const [bx, by] = bslots[i]
    bsvg +=
      poly([[bx, by], [bx - 18, by - 10], [bx - 18, by + 10]], 4) +
      poly([[bx, by], [bx + 18, by - 10], [bx + 18, by + 10]], 4)
  }
  return (
    line('M 256 356 C 292 388 258 412 292 448', 5) +
    bsvg +
    poly([[256, 64], [372, 240], [256, 356], [140, 240]], 6) +
    line('M 256 64 L 256 356 M 140 240 L 372 240', 4) +
    face(v, 256, 212, { dx: 30, er: 13, my: 244, mw: 42, mh: 16, bx: 44, by: 16, br: 9 }) +
    accTop(v, 256, 68, 0.8)
  )
}

const shEggs: Recipe = (v) => {
  const r = v.r
  const j = ri(r, -8, 8)
  const dots = ri(r, 2, 3)
  const dslots: Array<[number, number]> = [
    [168, 286],
    [206, 300],
    [148, 320],
  ]
  let dsvg = ''
  for (let i = 0; i < dots; i++) dsvg += circ(dslots[i][0] + j, dslots[i][1], 9, 4)
  return (
    rct(60, 430, 392, 30, 14, 5) +
    ell(404 + j, 396, 42, 52, 6) +
    face(v, 404 + j, 388, { dx: 12, er: 9, my: 408, mw: 22, mh: 9, bx: 20, by: 12, br: 6 }) +
    ell(312 + j, 372, 58, 74, 6) +
    face(v, 312 + j, 358, { dx: 18, er: 11, my: 384, mw: 30, mh: 12, bx: 28, by: 14, br: 7 }) +
    ell(180 + j, 350, 74, 96, 6) +
    dsvg +
    face(v, 180 + j, 336, { dx: 24, er: 13, my: 368, mw: 38, mh: 15, bx: 36, by: 16, br: 8 }) +
    accTop(v, 180 + j, 258)
  )
}

const shGeoFlower: Recipe = (v) => {
  const r = v.r
  const off = ri(r, 0, 1) * 22.5
  const j = rr(r, -6, 6)
  let sq = ''
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 / 8) * i + (off * Math.PI) / 180
    const px = 256 + 78 * Math.cos(a)
    const py = 200 + 78 * Math.sin(a)
    sq += `<rect x="${(px - 22).toFixed(1)}" y="${(py - 22).toFixed(1)}" width="44" height="44" rx="8" fill="#FFFFFF" stroke="${INK}" stroke-width="5" transform="rotate(${((a * 180) / Math.PI + 45).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})"/>`
  }
  return (
    sq +
    circ(256, 200, 44, 6) +
    face(v, 256, 192, { dx: 16, er: 10, my: 214, mw: 28, mh: 11, bx: 26, by: 13, br: 7 }) +
    rct(248, 240, 16, 170, 7, 5) +
    ell(204 + j, 320, 36, 16, 5, -22) +
    ell(308 + j, 300, 36, 16, 5, 18) +
    ell(256, 428, 110, 20, 5) +
    accTop(v, 256, 100, 0.8)
  )
}

const shOwl: Recipe = (v) => {
  const r = v.r
  const rows = ri(r, 2, 3)
  let scalps = ''
  for (let i = 0; i < rows; i++) {
    const y = 316 + i * 34
    scalps += line(`M 216 ${y} Q 232 ${y + 12} 248 ${y} M 264 ${y} Q 280 ${y + 12} 296 ${y}`, 4)
  }
  return (
    circ(186, 108, 20, 5) +
    circ(326, 108, 20, 5) +
    circ(256, 296, 128, 6) +
    circ(256, 176, 84, 6) +
    circ(140, 310, 44, 5) +
    circ(372, 310, 44, 5) +
    circ(256, 340, 62, 5) +
    circ(218, 170, 32, 5) +
    circ(294, 170, 32, 5) +
    (v.expr === 1 ? winkEye(218, 170, 14) : eye(218, 170, 14)) +
    eye(294, 170, 14) +
    (v.expr === 2 ? openMouth(256, 226, 11, 13) : '') +
    poly([[256, 194], [274, 214], [256, 234], [238, 214]], 5) +
    blush(196, 222, 9) +
    blush(316, 222, 9) +
    scalps +
    ell(212, 430, 26, 13, 5) +
    ell(300, 430, 26, 13, 5) +
    accTop(v, 256, 100)
  )
}

const shHouse: Recipe = (v) => {
  const r = v.r
  const j = ri(r, -6, 6)
  const smoke = ri(r, 1, 2)
  let ssvg = ''
  if (smoke >= 1) ssvg += cloud(337, 108, 0.45)
  if (smoke >= 2) ssvg += cloud(362, 78, 0.35)
  return (
    ssvg +
    rct(70, 416, 372, 28, 13, 5) +
    circ(110 + j, 414, 26, 5) +
    circ(402 - j, 414, 26, 5) +
    poly([[136, 220], [376, 220], [256, 108 + j]], 6) +
    rct(156, 220, 200, 200, 12, 6) +
    rct(320, 130, 34, 56, 6, 5) +
    circ(256, 272, 30, 5) +
    line('M 226 272 L 286 272 M 256 242 L 256 302', 4) +
    rct(226, 330, 60, 90, 10, 5) +
    `<circle cx="272" cy="378" r="5" fill="${INK}" stroke="none"/>` +
    face(v, 256, 176, { dx: 24, er: 11, my: 200, mw: 34, mh: 12, bx: 34, by: 13, br: 7 }) +
    accTop(v, 256, 112 + j)
  )
}

// ================================================================ category wiring
const ANIMALS: RecipeMeta[] = [
  { base: { fa: 'گربه‌ی {s}', en: '{s} Cat' }, diff: 2, fn: aCat },
  { base: { fa: 'سگِ {s}', en: '{s} Dog' }, diff: 2, fn: aDog },
  { base: { fa: 'خرگوشِ {s}', en: '{s} Rabbit' }, diff: 2, fn: aRabbit },
  { base: { fa: 'خرسِ {s}', en: '{s} Bear' }, diff: 2, fn: aBear },
  { base: { fa: 'پاندای {s}', en: '{s} Panda' }, diff: 2, fn: aPanda },
  { base: { fa: 'روباهِ {s}', en: '{s} Fox' }, diff: 2, fn: aFox },
  { base: { fa: 'جغدِ {s}', en: '{s} Owl' }, diff: 2, fn: aOwl },
  { base: { fa: 'پنگوئنِ {s}', en: '{s} Penguin' }, diff: 2, fn: aPenguin },
  { base: { fa: 'ماهیِ {s}', en: '{s} Fish' }, diff: 1, fn: aFish, scene2: 'sky' },
  { base: { fa: 'لاک‌پشتِ {s}', en: '{s} Turtle' }, diff: 2, fn: aTurtle },
]

const VEHICLES: RecipeMeta[] = [
  { base: { fa: 'ماشینِ {s}', en: '{s} Car' }, diff: 2, fn: vCar },
  { base: { fa: 'اتوبوسِ {s}', en: '{s} Bus' }, diff: 2, fn: vBus },
  { base: { fa: 'کامیونِ {s}', en: '{s} Truck' }, diff: 2, fn: vTruck },
  { base: { fa: 'قطارِ {s}', en: '{s} Train' }, diff: 3, fn: vTrain },
  { base: { fa: 'هواپیمای {s}', en: '{s} Airplane' }, diff: 1, fn: vAirplane, scene2: 'sky' },
  { base: { fa: 'هلیکوپترِ {s}', en: '{s} Helicopter' }, diff: 2, fn: vHelicopter, scene2: 'sky' },
  { base: { fa: 'موشکِ {s}', en: '{s} Rocket' }, diff: 1, fn: vRocket, scene2: 'sky' },
  { base: { fa: 'قایقِ {s}', en: '{s} Sailboat' }, diff: 2, fn: vSailboat, scene2: 'sky' },
  { base: { fa: 'دوچرخه‌ی {s}', en: '{s} Bicycle' }, diff: 3, fn: vBicycle },
  { base: { fa: 'تراکتورِ {s}', en: '{s} Tractor' }, diff: 2, fn: vTractor },
]

const MAGIC: RecipeMeta[] = [
  { base: { fa: 'تک‌شاخِ {s}', en: '{s} Unicorn' }, diff: 2, fn: mUnicorn },
  { base: { fa: 'قصرِ {s}', en: '{s} Castle' }, diff: 3, fn: mCastle, scene2: 'sky' },
  { base: { fa: 'پریِ {s}', en: '{s} Fairy' }, diff: 2, fn: mFairy, scene2: 'sky' },
  { base: { fa: 'اژدهای {s}', en: '{s} Dragon' }, diff: 3, fn: mDragon, scene2: 'sky' },
  { base: { fa: 'کلاه جادوییِ {s}', en: '{s} Wizard Hat' }, diff: 2, fn: mWizardHat, scene2: 'sky' },
  { base: { fa: 'تاجِ {s}', en: '{s} Crown' }, diff: 2, fn: mCrown },
  { base: { fa: 'چوب جادوییِ {s}', en: '{s} Magic Wand' }, diff: 1, fn: mWand, scene2: 'sky' },
  { base: { fa: 'شربت جادوییِ {s}', en: '{s} Magic Potion' }, diff: 2, fn: mPotion },
  { base: { fa: 'خانه‌ی قارچیِ {s}', en: '{s} Mushroom House' }, diff: 2, fn: mMushroomHouse },
  { base: { fa: 'رنگین‌کمانِ {s}', en: '{s} Rainbow' }, diff: 2, fn: mRainbow, scene2: 'sky' },
]

const NATURE: RecipeMeta[] = [
  { base: { fa: 'درختِ {s}', en: '{s} Tree' }, diff: 2, fn: nTree },
  { base: { fa: 'گلدانِ {s}', en: '{s} Potted Flower' }, diff: 2, fn: nFlowerPot },
  { base: { fa: 'لاله‌ی {s}', en: '{s} Tulip' }, diff: 1, fn: nTulip },
  { base: { fa: 'خورشیدِ {s}', en: '{s} Sun' }, diff: 1, fn: nSun },
  { base: { fa: 'رنگین‌کمانِ {s}', en: '{s} Rainbow' }, diff: 2, fn: nRainbow, scene2: 'sky' },
  { base: { fa: 'کوهِ {s}', en: '{s} Mountain' }, diff: 2, fn: nMountains, scene2: 'sky' },
  { base: { fa: 'ابرِ بارونیِ {s}', en: '{s} Rain Cloud' }, diff: 1, fn: nRainCloud, scene2: 'sky' },
  { base: { fa: 'قارچِ {s}', en: '{s} Mushroom' }, diff: 2, fn: nMushroom },
  { base: { fa: 'کاکتوسِ {s}', en: '{s} Cactus' }, diff: 2, fn: nCactus },
  { base: { fa: 'جزیره‌ی {s}', en: '{s} Palm Island' }, diff: 3, fn: nPalmIsland, scene2: 'sky' },
]

const FOOD: RecipeMeta[] = [
  { base: { fa: 'بستنیِ {s}', en: '{s} Ice Cream' }, diff: 2, fn: fIceCream },
  { base: { fa: 'کاپ‌کیکِ {s}', en: '{s} Cupcake' }, diff: 2, fn: fCupcake },
  { base: { fa: 'دوناتِ {s}', en: '{s} Donut' }, diff: 2, fn: fDonut },
  { base: { fa: 'کیکِ تولدِ {s}', en: '{s} Birthday Cake' }, diff: 3, fn: fCake },
  { base: { fa: 'سیبِ {s}', en: '{s} Apple' }, diff: 1, fn: fApple },
  { base: { fa: 'موزِ {s}', en: '{s} Banana' }, diff: 2, fn: fBanana },
  { base: { fa: 'هندونه‌ی {s}', en: '{s} Watermelon' }, diff: 2, fn: fWatermelon },
  { base: { fa: 'پیتزای {s}', en: '{s} Pizza Slice' }, diff: 2, fn: fPizza },
  { base: { fa: 'همبرگرِ {s}', en: '{s} Burger' }, diff: 2, fn: fBurger },
  { base: { fa: 'آب‌نباتِ {s}', en: '{s} Candy' }, diff: 1, fn: fCandy },
]

const STICKMAN: RecipeMeta[] = [
  { base: { fa: 'استیک‌من نقاشِ {s}', en: '{s} Painter Stickman' }, diff: 2, fn: sPainter },
  { base: { fa: 'استیک‌من سلام‌کنِ {s}', en: '{s} Waving Stickman' }, diff: 1, fn: sWaving },
  { base: { fa: 'استیک‌من رقصنده‌ی {s}', en: '{s} Dancing Stickman' }, diff: 2, fn: sDancing },
  { base: { fa: 'استیک‌من طناب‌زنِ {s}', en: '{s} Jump Rope Stickman' }, diff: 2, fn: sJumpRope },
  { base: { fa: 'استیک‌من ابرقهرمانِ {s}', en: '{s} Superhero Stickman' }, diff: 2, fn: sHero, scene2: 'sky' },
  { base: { fa: 'استیک‌من کتاب‌خونِ {s}', en: '{s} Reading Stickman' }, diff: 2, fn: sReading },
  { base: { fa: 'استیک‌من خواب‌آلودِ {s}', en: '{s} Sleepy Stickman' }, diff: 1, fn: sSleepy, scene2: 'sky' },
  { base: { fa: 'استیک‌من فوتبالیستِ {s}', en: '{s} Soccer Stickman' }, diff: 2, fn: sKicker },
  { base: { fa: 'استیک‌من موسیقی‌دانِ {s}', en: '{s} Music Stickman' }, diff: 2, fn: sMusic },
  { base: { fa: 'استیک‌من اسکیت‌بازِ {s}', en: '{s} Skating Stickman' }, diff: 2, fn: sSkater },
]

const SHAPES: RecipeMeta[] = [
  { base: { fa: 'ماندالای {s}', en: '{s} Mandala' }, diff: 3, fn: shMandala, noDrop: true },
  { base: { fa: 'ربات مربعیِ {s}', en: '{s} Square Robot' }, diff: 2, fn: shRobot },
  { base: { fa: 'درخت مثلثیِ {s}', en: '{s} Triangle Tree' }, diff: 2, fn: shTree },
  { base: { fa: 'بادکنک قلبیِ {s}', en: '{s} Heart Balloon' }, diff: 1, fn: shHeartBalloon, scene2: 'sky' },
  { base: { fa: 'ستاره‌های {s}', en: '{s} Star Pattern' }, diff: 2, fn: shStarSheet },
  { base: { fa: 'بادبادک لوزیِ {s}', en: '{s} Diamond Kite' }, diff: 2, fn: shKite, scene2: 'sky' },
  { base: { fa: 'تخم‌مرغ‌های {s}', en: '{s} Egg Family' }, diff: 2, fn: shEggs },
  { base: { fa: 'گل هندسیِ {s}', en: '{s} Geo Flower' }, diff: 2, fn: shGeoFlower },
  { base: { fa: 'جغد دایره‌ایِ {s}', en: '{s} Circle Owl' }, diff: 2, fn: shOwl },
  { base: { fa: 'خانه‌ی {s}', en: '{s} Shape House' }, diff: 2, fn: shHouse },
]

const CATEGORIES: Array<{ key: string; items: RecipeMeta[] }> = [
  { key: 'animals', items: ANIMALS },
  { key: 'vehicles', items: VEHICLES },
  { key: 'magic', items: MAGIC },
  { key: 'nature', items: NATURE },
  { key: 'food', items: FOOD },
  { key: 'stickman', items: STICKMAN },
  { key: 'shapes', items: SHAPES },
]

export const buildCategory = (catIndex: number, cat: string, items: RecipeMeta[]): ColoringTemplate[] => {
  const out: ColoringTemplate[] = []
  for (let i = 0; i < 100; i++) {
    const recipeIndex = i % items.length
    const variantIndex = Math.floor(i / items.length)
    const item = items[recipeIndex]
    const expr = variantIndex % 3
    const acc = Math.floor(variantIndex / 3) % 3
    // Scene groups follow the accessory groups (floor(variantIndex / 3)) so that
    // all four scene types and the combined acc+scene names actually occur; the
    // raw sum can reach 4, hence the rotation modulo 4.
    const scene = (Math.floor(variantIndex / 3) + (recipeIndex % 2)) % 4
    const flip = i % 4 < 2
    const seed = 1000 * catIndex + i
    const r = mulberry32(seed)
    const v: Variant = { expr, acc, scene, r, flip }
    const subject = item.fn(v)
    const drop = item.noDrop || acc === 0 ? 0 : 24
    const wrapped = `<g transform="translate(0,${drop})">${subject}</g>`
    const sceneSvg = buildScene(v, item.scene2 ?? 'garden')
    const body = flip ? flipX(wrapped) : wrapped
    const name = nameFor(item.base, expr, acc, scene)
    const difficulty = Math.min(3, item.diff + (scene === 3 ? 1 : 0)) as Difficulty
    out.push({
      id: `${cat}-g${i + 1}`,
      fa: name.fa,
      en: name.en,
      category: cat,
      difficulty,
      svg: svgWrap(sceneSvg + body),
    })
  }
  return out
}

/** 700 procedurally generated coloring templates (100 per category, deterministic). */
export const GEN_TEMPLATES: ColoringTemplate[] = CATEGORIES.flatMap((c, idx) =>
  buildCategory(idx, c.key, c.items),
)
