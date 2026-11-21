// Colorful cartoon stickers (SVG strings, viewBox 0 0 100 100).
export interface Sticker {
  id: string
  svg: string
}

const s = (inner: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${inner}</svg>`
const K = '#303030'

const star5 = (cx: number, cy: number, R: number, fill: string, sw = 4) => {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? R : R * 0.45
    const a = (Math.PI / 5) * i - Math.PI / 2
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`)
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${K}" stroke-width="${sw}" stroke-linejoin="round"/>`
}

export const STICKERS: Sticker[] = [
  {
    id: 'star',
    svg: s(star5(50, 52, 42, '#FFD65A') + `<circle cx="40" cy="50" r="4" fill="${K}"/><circle cx="60" cy="50" r="4" fill="${K}"/><path d="M 42 60 Q 50 68 58 60" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>`),
  },
  {
    id: 'heart',
    svg: s(`<path d="M 50 86 C 12 60 8 30 28 18 C 40 11 50 20 50 32 C 50 20 60 11 72 18 C 92 30 88 60 50 86 Z" fill="#FF6FB5" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><circle cx="34" cy="34" r="6" fill="#FFFFFF" opacity="0.8"/>`),
  },
  {
    id: 'cloud',
    svg: s(`<path d="M 20 72 a 15 15 0 0 1 -2 -30 a 20 20 0 0 1 38 -10 a 22 22 0 0 1 34 14 a 14 14 0 0 1 -6 26 Z" fill="#FFFFFF" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><circle cx="38" cy="50" r="3.5" fill="${K}"/><circle cx="56" cy="50" r="3.5" fill="${K}"/><path d="M 40 58 Q 47 63 54 58" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>`),
  },
  {
    id: 'sun',
    svg: s(
      (() => {
        let rays = ''
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI / 4) * i
          const x1 = 50 + 34 * Math.cos(a)
          const y1 = 50 + 34 * Math.sin(a)
          const x2 = 50 + 46 * Math.cos(a)
          const y2 = 50 + 46 * Math.sin(a)
          rays += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`
        }
        return rays
      })() +
      `<circle cx="50" cy="50" r="28" fill="#FFAA62" stroke="${K}" stroke-width="5"/><circle cx="41" cy="46" r="3.5" fill="${K}"/><circle cx="59" cy="46" r="3.5" fill="${K}"/><path d="M 42 55 Q 50 62 58 55" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>`
    ),
  },
  {
    id: 'flower',
    svg: s(
      (() => {
        let petals = ''
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i
          const x = 50 + 24 * Math.cos(a)
          const y = 50 + 24 * Math.sin(a)
          petals += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="14" ry="11" fill="#FF91B8" stroke="${K}" stroke-width="4" transform="rotate(${((a * 180) / Math.PI).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`
        }
        return petals
      })() +
      `<circle cx="50" cy="50" r="14" fill="#FFD65A" stroke="${K}" stroke-width="4"/><circle cx="45" cy="48" r="2.5" fill="${K}"/><circle cx="55" cy="48" r="2.5" fill="${K}"/>`
    ),
  },
  {
    id: 'rainbow',
    svg: s(
      `<path d="M 12 76 A 38 38 0 0 1 88 76" fill="none" stroke="#E63946" stroke-width="9"/>` +
      `<path d="M 22 76 A 28 28 0 0 1 78 76" fill="none" stroke="#FFD65A" stroke-width="9"/>` +
      `<path d="M 32 76 A 18 18 0 0 1 68 76" fill="none" stroke="#4CC178" stroke-width="9"/>` +
      `<path d="M 6 78 a 10 10 0 0 1 8 -14 a 12 12 0 0 1 22 2 a 10 10 0 0 1 -2 12 Z" fill="#FFFFFF" stroke="${K}" stroke-width="4"/>` +
      `<path d="M 66 78 a 10 10 0 0 1 8 -14 a 12 12 0 0 1 22 2 a 10 10 0 0 1 -2 12 Z" fill="#FFFFFF" stroke="${K}" stroke-width="4"/>`
    ),
  },
  {
    id: 'smiley',
    svg: s(`<circle cx="50" cy="50" r="40" fill="#FFD65A" stroke="${K}" stroke-width="5"/><circle cx="36" cy="42" r="5" fill="${K}"/><circle cx="64" cy="42" r="5" fill="${K}"/><path d="M 32 58 Q 50 76 68 58" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`),
  },
  {
    id: 'balloon',
    svg: s(`<ellipse cx="50" cy="38" rx="26" ry="30" fill="#FF6B6B" stroke="${K}" stroke-width="5"/><path d="M 46 68 L 54 68 L 50 74 Z" fill="#FF6B6B" stroke="${K}" stroke-width="3" stroke-linejoin="round"/><path d="M 50 74 C 42 84 58 88 50 98" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="40" cy="28" rx="7" ry="10" fill="#FFFFFF" opacity="0.7"/>`),
  },
  {
    id: 'butterfly',
    svg: s(
      `<ellipse cx="30" cy="38" rx="20" ry="16" fill="#B9A0F5" stroke="${K}" stroke-width="4" transform="rotate(-25 30 38)"/>` +
      `<ellipse cx="70" cy="38" rx="20" ry="16" fill="#B9A0F5" stroke="${K}" stroke-width="4" transform="rotate(25 70 38)"/>` +
      `<ellipse cx="33" cy="64" rx="16" ry="13" fill="#FF91B8" stroke="${K}" stroke-width="4" transform="rotate(20 33 64)"/>` +
      `<ellipse cx="67" cy="64" rx="16" ry="13" fill="#FF91B8" stroke="${K}" stroke-width="4" transform="rotate(-20 67 64)"/>` +
      `<ellipse cx="50" cy="52" rx="8" ry="24" fill="#FFD65A" stroke="${K}" stroke-width="4"/>` +
      `<path d="M 45 30 Q 38 18 32 14 M 55 30 Q 62 18 68 14" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>` +
      `<circle cx="32" cy="14" r="4" fill="${K}"/><circle cx="68" cy="14" r="4" fill="${K}"/>`
    ),
  },
  {
    id: 'crown',
    svg: s(`<path d="M 16 74 L 12 30 L 32 48 L 50 20 L 68 48 L 88 30 L 84 74 Z" fill="#FFD65A" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><circle cx="50" cy="40" r="6" fill="#E63946" stroke="${K}" stroke-width="3"/><circle cx="32" cy="58" r="5" fill="#4CC178" stroke="${K}" stroke-width="3"/><circle cx="68" cy="58" r="5" fill="#78C8F8" stroke="${K}" stroke-width="3"/>`),
  },
  {
    id: 'moon',
    svg: s(`<path d="M 62 10 A 44 44 0 1 0 90 62 A 36 36 0 0 1 62 10 Z" fill="#FFE28A" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><circle cx="46" cy="38" r="3.5" fill="${K}"/><path d="M 40 50 Q 46 55 52 50" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>`),
  },
  {
    id: 'sparkle',
    svg: s(`<path d="M 50 6 C 54 34 66 46 94 50 C 66 54 54 66 50 94 C 46 66 34 54 6 50 C 34 46 46 34 50 6 Z" fill="#FFD65A" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="50" r="8" fill="#FFF7D6"/>`),
  },
  {
    id: 'apple',
    svg: s(`<path d="M 50 30 C 20 22 12 52 24 70 C 32 82 42 88 50 86 C 58 88 68 82 76 70 C 88 52 80 22 50 30 Z" fill="#E63946" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="M 50 30 Q 50 16 58 10" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/><path d="M 58 16 Q 78 8 80 24 Q 66 32 58 16 Z" fill="#4CC178" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="36" cy="46" rx="6" ry="9" fill="#FFFFFF" opacity="0.7"/>`),
  },
  {
    id: 'strawberry',
    svg: s(`<path d="M 50 88 C 24 74 16 48 26 34 C 34 24 66 24 74 34 C 84 48 76 74 50 88 Z" fill="#FF4D6D" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="M 28 34 Q 50 20 72 34 Q 60 44 50 36 Q 40 44 28 34 Z" fill="#4CC178" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>${[34, 50, 66, 42, 58].map((x, i) => `<ellipse cx="${x}" cy="${[48, 44, 48, 62, 62][i]}" rx="3" ry="4.5" fill="#FFE28A" stroke="${K}" stroke-width="2"/>`).join('')}`),
  },
  {
    id: 'gift',
    svg: s(`<rect x="18" y="42" width="64" height="46" rx="8" fill="#B9A0F5" stroke="${K}" stroke-width="5"/><rect x="12" y="30" width="76" height="18" rx="8" fill="#78C8F8" stroke="${K}" stroke-width="5"/><rect x="44" y="30" width="12" height="58" fill="#FFD65A" stroke="${K}" stroke-width="4"/><path d="M 50 30 C 34 8 14 16 26 28 Q 36 34 50 30 C 66 8 86 16 74 28 Q 64 34 50 30 Z" fill="#FF91B8" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>`),
  },
  {
    id: 'rocket',
    svg: s(`<path d="M 50 6 C 66 22 70 44 66 62 L 34 62 C 30 44 34 22 50 6 Z" fill="#F4F4F4" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><circle cx="50" cy="34" r="10" fill="#78C8F8" stroke="${K}" stroke-width="4"/><path d="M 34 50 L 16 74 L 34 68 Z" fill="#E63946" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M 66 50 L 84 74 L 66 68 Z" fill="#E63946" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M 40 62 Q 50 84 60 62 Z" fill="#FFAA62" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>`),
  },
  {
    id: 'paw',
    svg: s(`<ellipse cx="50" cy="64" rx="24" ry="19" fill="#FFAA62" stroke="${K}" stroke-width="5"/><circle cx="26" cy="40" r="10" fill="#FFAA62" stroke="${K}" stroke-width="4"/><circle cx="44" cy="30" r="10" fill="#FFAA62" stroke="${K}" stroke-width="4"/><circle cx="62" cy="30" r="10" fill="#FFAA62" stroke="${K}" stroke-width="4"/><circle cx="78" cy="40" r="10" fill="#FFAA62" stroke="${K}" stroke-width="4"/>`),
  },
  {
    id: 'note',
    svg: s(`<ellipse cx="36" cy="72" rx="16" ry="12" fill="#B9A0F5" stroke="${K}" stroke-width="4" transform="rotate(-15 36 72)"/><path d="M 50 68 L 50 18 Q 70 22 76 36" fill="none" stroke="${K}" stroke-width="6" stroke-linecap="round"/>`),
  },
  {
    id: 'bow',
    svg: s(`<path d="M 50 50 C 30 30 10 34 14 52 C 17 66 36 66 50 50 C 64 66 83 66 86 52 C 90 34 70 30 50 50 Z" fill="#FF6FB5" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="50" r="9" fill="#FF91B8" stroke="${K}" stroke-width="4"/>`),
  },
  {
    id: 'icecream',
    svg: s(`<path d="M 32 52 L 68 52 L 50 92 Z" fill="#DDA15E" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M 40 60 L 60 74 M 60 60 L 40 74" stroke="${K}" stroke-width="2.5"/><circle cx="38" cy="40" r="16" fill="#FFB5C2" stroke="${K}" stroke-width="4"/><circle cx="60" cy="42" r="15" fill="#BDE6E1" stroke="${K}" stroke-width="4"/><circle cx="49" cy="26" r="12" fill="#FFF3B0" stroke="${K}" stroke-width="4"/><circle cx="50" cy="12" r="5" fill="#E63946" stroke="${K}" stroke-width="3"/>`),
  },
]

export const stickerById = (id: string) => STICKERS.find((st) => st.id === id)
export const stickerDataUrl = (id: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(stickerById(id)?.svg ?? '')}`
