// Shared types + SVG building helpers for coloring templates.
// Style contract:
//  - viewBox is always "0 0 512 512"
//  - colorable regions use fill="#FFFFFF" (the app lets kids color these)
//  - fixed dark details (pupils, outlines) use fill="#303030"
//  - all strokes: stroke="#303030" stroke-width="5" or "6", round caps/joins

export type Difficulty = 1 | 2 | 3

export interface ColoringTemplate {
  id: string
  fa: string
  en: string
  category: string
  difficulty: Difficulty
  svg: string
}

export const INK = '#303030'

export const svgWrap = (inner: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${inner}</svg>`

/** Big cute cartoon eye with white area (colorable), dark pupil and shine dot. */
export const eye = (cx: number, cy: number, r = 16, pupil = 0.5): string =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
  `<circle cx="${cx + r * 0.08}" cy="${cy + r * 0.12}" r="${(r * pupil).toFixed(1)}" fill="${INK}" stroke="none"/>` +
  `<circle cx="${cx + r * 0.38}" cy="${cy - r * 0.3}" r="${Math.max(2.5, r * 0.2).toFixed(1)}" fill="#FFFFFF" stroke="none"/>`

/** Simple arc smile (stroke only, not colorable). */
export const smile = (cx: number, cy: number, w = 36, h = 20, up = true): string => {
  const dir = up ? 1 : -1
  return `<path d="M ${cx - w / 2} ${cy} Q ${cx} ${cy + dir * h} ${cx + w / 2} ${cy}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
}

/** Open happy mouth (colorable tongue area). */
export const happyMouth = (cx: number, cy: number, w = 44, h = 30): string =>
  `<path d="M ${cx - w / 2} ${cy} Q ${cx} ${cy + h * 2} ${cx + w / 2} ${cy} Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`

/** Rosy cheek circle (colorable). */
export const blush = (cx: number, cy: number, r = 12): string =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/>`

/** Capsule shaped limb (colorable stick arm/leg). */
export const limb = (x1: number, y1: number, x2: number, y2: number, w = 20): string => {
  const dx = x2 - x1
  const dy = y2 - y1
  const L = Math.hypot(dx, dy) || 1
  const nx = (-dy / L) * (w / 2)
  const ny = (dx / L) * (w / 2)
  const r = w / 2
  return `<path d="M ${(x1 + nx).toFixed(1)} ${(y1 + ny).toFixed(1)} A ${r} ${r} 0 0 1 ${(x1 - nx).toFixed(1)} ${(y1 - ny).toFixed(1)} L ${(x2 - nx).toFixed(1)} ${(y2 - ny).toFixed(1)} A ${r} ${r} 0 0 1 ${(x2 + nx).toFixed(1)} ${(y2 + ny).toFixed(1)} Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`
}

/** Cartoon glove hand (colorable circle). */
export const glove = (cx: number, cy: number, r = 15): string =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>`

/** Round blob cloud (colorable). */
export const cloud = (cx: number, cy: number, s = 1): string => {
  const d =
    `M ${(cx - 62 * s).toFixed(1)} ${(cy + 18 * s).toFixed(1)} ` +
    `a ${(20 * s).toFixed(1)} ${(20 * s).toFixed(1)} 0 0 1 ${(2 * s).toFixed(1)} ${(-39 * s).toFixed(1)} ` +
    `a ${(24 * s).toFixed(1)} ${(24 * s).toFixed(1)} 0 0 1 ${(42 * s).toFixed(1)} ${(-14 * s).toFixed(1)} ` +
    `a ${(26 * s).toFixed(1)} ${(26 * s).toFixed(1)} 0 0 1 ${(44 * s).toFixed(1)} ${(8 * s).toFixed(1)} ` +
    `a ${(19 * s).toFixed(1)} ${(19 * s).toFixed(1)} 0 0 1 ${(-4 * s).toFixed(1)} ${(37 * s).toFixed(1)} Z`
  return `<path d="${d}" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`
}

/** Five point star (colorable). */
export const star = (cx: number, cy: number, R: number): string => {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? R : R * 0.45
    const a = (Math.PI / 5) * i - Math.PI / 2
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`)
  }
  return `<polygon points="${pts.join(' ')}" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`
}

/** Painter beret with color dots, sits on top of a head centered at cx, top at ty. */
export const beret = (cx: number, ty: number, s = 1): string => {
  const w = 95 * s
  const h = 34 * s
  return (
    `<path d="M ${(cx - w).toFixed(1)} ${(ty + 6).toFixed(1)} Q ${(cx - w * 0.9).toFixed(1)} ${(ty - h).toFixed(1)} ${cx} ${(ty - h).toFixed(1)} Q ${(cx + w * 0.9).toFixed(1)} ${(ty - h).toFixed(1)} ${(cx + w).toFixed(1)} ${(ty + 6).toFixed(1)} Q ${cx} ${(ty + 16).toFixed(1)} ${(cx - w).toFixed(1)} ${(ty + 6).toFixed(1)} Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<circle cx="${cx - w * 0.35}" cy="${ty - h * 0.45}" r="${7 * s}" fill="${INK}" stroke="none"/>` +
    `<circle cx="${cx + w * 0.15}" cy="${ty - h * 0.75}" r="${7 * s}" fill="${INK}" stroke="none"/>` +
    `<circle cx="${cx + w * 0.55}" cy="${ty - h * 0.3}" r="${7 * s}" fill="${INK}" stroke="none"/>`
  )
}
