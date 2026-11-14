import {
  ColoringTemplate,
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

// ---------------------------------------------------------------- blank page
const blank: ColoringTemplate = {
  id: 'free-draw',
  fa: 'نقاشی آزاد',
  en: 'Free Drawing',
  category: 'shapes',
  difficulty: 1,
  svg: svgWrap(
    `<rect x="16" y="16" width="480" height="480" rx="28" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>`
  ),
}

// ---------------------------------------------------------------- cat
const cat: ColoringTemplate = {
  id: 'cat',
  fa: 'گربه بامزه',
  en: 'Cute Cat',
  category: 'animals',
  difficulty: 2,
  svg: svgWrap(
    // tail
    `<path d="M 330 452 C 420 448 452 386 436 330 C 430 306 404 300 396 322 C 386 348 396 396 322 414 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // body
    `<ellipse cx="256" cy="392" rx="98" ry="92" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<ellipse cx="256" cy="408" rx="56" ry="54" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // paws
    `<ellipse cx="204" cy="474" rx="30" ry="18" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="308" cy="474" rx="30" ry="18" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // ears
    `<path d="M 168 108 L 128 22 L 232 52 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 344 108 L 384 22 L 280 52 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // head
    `<circle cx="256" cy="178" r="112" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // inner ears
    `<path d="M 176 92 L 152 42 L 208 58 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M 336 92 L 360 42 L 304 58 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    eye(214, 166, 20) +
    eye(298, 166, 20) +
    blush(178, 216, 13) +
    blush(334, 216, 13) +
    // nose
    `<path d="M 242 210 Q 256 200 270 210 Q 270 224 256 230 Q 242 224 242 210 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // mouth
    `<path d="M 256 230 Q 244 248 228 240" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M 256 230 Q 268 248 284 240" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    // whiskers
    `<path d="M 120 190 L 168 198 M 122 216 L 168 212 M 392 190 L 344 198 M 390 216 L 344 212" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    // forehead marks
    `<path d="M 244 84 L 244 106 M 268 84 L 268 106" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`
  ),
}

// ---------------------------------------------------------------- sun (generated rays)
const sunRays = (() => {
  let s = ''
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI / 6) * i
    const a1 = a - 0.16
    const a2 = a + 0.16
    const p = (r: number, ang: number) =>
      `${(256 + r * Math.cos(ang)).toFixed(1)},${(256 + r * Math.sin(ang)).toFixed(1)}`
    s += `<polygon points="${p(112, a1)} ${p(168, a)} ${p(112, a2)}" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`
  }
  return s
})()
const sun: ColoringTemplate = {
  id: 'sun',
  fa: 'خورشید خندان',
  en: 'Smiling Sun',
  category: 'nature',
  difficulty: 1,
  svg: svgWrap(
    sunRays +
    `<circle cx="256" cy="256" r="104" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    eye(219, 240, 15) +
    eye(293, 240, 15) +
    smile(256, 282, 52, 28) +
    blush(192, 272, 12) +
    blush(320, 272, 12)
  ),
}

// ---------------------------------------------------------------- rainbow
const rainbowBands = (() => {
  const cx = 256
  const cy = 402
  let s = ''
  let outer = 236
  for (let i = 0; i < 5; i++) {
    const inner = outer - 30
    s += `<path d="M ${cx - outer} ${cy} A ${outer} ${outer} 0 0 1 ${cx + outer} ${cy} L ${cx + inner} ${cy} A ${inner} ${inner} 0 0 0 ${cx - inner} ${cy} Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`
    outer = inner
  }
  return s
})()
const rainbow: ColoringTemplate = {
  id: 'rainbow',
  fa: 'رنگین‌کمان',
  en: 'Rainbow',
  category: 'nature',
  difficulty: 1,
  svg: svgWrap(
    star(86, 120, 34) +
    star(430, 96, 26) +
    star(396, 180, 18) +
    rainbowBands +
    cloud(108, 402, 1.05) +
    cloud(404, 402, 1.05)
  ),
}

// ---------------------------------------------------------------- shapes buddies
const circleBuddy: ColoringTemplate = {
  id: 'shape-circle',
  fa: 'دایره‌ی خوشحال',
  en: 'Happy Circle',
  category: 'shapes',
  difficulty: 1,
  svg: svgWrap(
    limb(146, 300, 104, 330, 16) +
    limb(366, 300, 408, 330, 16) +
    glove(100, 334, 13) +
    glove(412, 334, 13) +
    `<circle cx="256" cy="246" r="122" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<ellipse cx="212" cy="374" rx="30" ry="16" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="300" cy="374" rx="30" ry="16" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    eye(216, 228, 17) +
    eye(296, 228, 17) +
    smile(256, 276, 56, 30) +
    blush(184, 266, 13) +
    blush(328, 266, 13)
  ),
}

const squareBot: ColoringTemplate = {
  id: 'shape-square',
  fa: 'ربات مربعی',
  en: 'Square Robot',
  category: 'shapes',
  difficulty: 1,
  svg: svgWrap(
    `<path d="M 256 96 L 256 56" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    `<circle cx="256" cy="44" r="14" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    limb(150, 250, 96, 224, 16) +
    limb(362, 250, 416, 224, 16) +
    glove(92, 220, 13) +
    glove(420, 220, 13) +
    `<rect x="152" y="120" width="208" height="212" rx="26" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<ellipse cx="206" cy="342" rx="28" ry="14" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="306" cy="342" rx="28" ry="14" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    eye(216, 200, 16) +
    eye(296, 200, 16) +
    smile(256, 250, 48, 22) +
    `<rect x="216" y="284" width="80" height="30" rx="12" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="256" cy="299" r="8" fill="${INK}" stroke="none"/>`
  ),
}

const starBuddy: ColoringTemplate = {
  id: 'shape-star',
  fa: 'ستاره‌ی درخشان',
  en: 'Shiny Star',
  category: 'shapes',
  difficulty: 1,
  svg: svgWrap(
    star(256, 258, 168) +
    eye(220, 240, 15) +
    eye(292, 240, 15) +
    smile(256, 282, 46, 24) +
    blush(190, 272, 11) +
    blush(322, 272, 11)
  ),
}

const heartBuddy: ColoringTemplate = {
  id: 'shape-heart',
  fa: 'قلب عاشق',
  en: 'Lovely Heart',
  category: 'shapes',
  difficulty: 1,
  svg: svgWrap(
    `<path d="M 256 430 C 96 330 76 196 158 150 C 208 122 248 152 256 190 C 264 152 304 122 354 150 C 436 196 416 330 256 430 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    eye(214, 218, 15) +
    eye(298, 218, 15) +
    smile(256, 262, 46, 24) +
    blush(184, 252, 11) +
    blush(328, 252, 11)
  ),
}

const kite: ColoringTemplate = {
  id: 'shape-kite',
  fa: 'بادبادک',
  en: 'Flying Kite',
  category: 'shapes',
  difficulty: 2,
  svg: svgWrap(
    `<path d="M 256 470 C 300 420 260 400 300 356" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M 292 366 L 272 348 L 310 342 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M 306 348 L 296 328 L 330 330 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M 256 48 L 372 236 L 256 340 L 140 236 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 256 48 L 256 340 M 140 236 L 372 236" fill="none" stroke="${INK}" stroke-width="4"/>` +
    eye(226, 210, 13) +
    eye(288, 210, 13) +
    smile(257, 246, 40, 20)
  ),
}

const hexBee: ColoringTemplate = {
  id: 'shape-bee',
  fa: 'زنبور شش‌ضلعی',
  en: 'Hexagon Bee',
  category: 'shapes',
  difficulty: 2,
  svg: svgWrap(
    `<ellipse cx="150" cy="180" rx="52" ry="36" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="362" cy="180" rx="52" ry="36" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M 256 118 L 358 176 L 358 292 L 256 350 L 154 292 L 154 176 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 154 216 L 358 216 M 154 262 L 358 262" fill="none" stroke="${INK}" stroke-width="5"/>` +
    eye(222, 172, 13) +
    eye(290, 172, 13) +
    smile(256, 196, 36, 16) +
    `<path d="M 256 350 L 256 396" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M 246 402 L 266 402 L 256 384 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`
  ),
}

// ---------------------------------------------------------------- stickmen
interface StickOpts {
  armL: [number, number]
  armR: [number, number]
  legL: [number, number]
  legR: [number, number]
  mouth?: 'smile' | 'happy'
  head?: string // extra head gear drawn after head
  behind?: string // drawn first (cape, balloons...)
  front?: string // drawn last (held items)
  face?: string // overrides default eyes
  cx?: number
  cy?: number
  lean?: number
}

const stickman = (o: StickOpts): string => {
  const cx = o.cx ?? 256
  const hcy = o.cy ?? 148
  const hr = 62
  const shY = hcy + hr + 14
  const hipY = 316
  const face =
    o.face ??
    (eye(cx - 22, hcy - 4, 12) +
      eye(cx + 22, hcy - 4, 12) +
      (o.mouth === 'happy' ? happyMouth(cx, hcy + 24, 36, 18) : smile(cx, hcy + 22, 34, 16)) +
      blush(cx - 44, hcy + 14, 9) +
      blush(cx + 44, hcy + 14, 9))
  return (
    (o.behind ?? '') +
    limb(cx - 10, hipY - 6, o.legL[0], o.legL[1], 18) +
    limb(cx + 10, hipY - 6, o.legR[0], o.legR[1], 18) +
    `<ellipse cx="${o.legL[0]}" cy="${o.legL[1]}" rx="20" ry="11" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="${o.legR[0]}" cy="${o.legR[1]}" rx="20" ry="11" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    limb(cx - 12, shY + 4, o.armL[0], o.armL[1], 16) +
    limb(cx + 12, shY + 4, o.armR[0], o.armR[1], 16) +
    `<path d="M ${cx - 13} ${hcy + hr - 8} L ${cx - 8} ${hipY + 4}" fill="none" stroke="${INK}" stroke-width="0"/>` +
    `<path d="M ${cx - 14} ${hcy + hr} Q ${cx} ${hcy + hr + 26} ${cx + 14} ${hcy + hr} L ${cx + 12} ${hipY} Q ${cx} ${hipY + 14} ${cx - 12} ${hipY} Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    glove(o.armL[0], o.armL[1], 14) +
    glove(o.armR[0], o.armR[1], 14) +
    `<circle cx="${cx}" cy="${hcy}" r="${hr}" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    face +
    (o.head ?? beret(cx, hcy - hr + 8, 0.95)) +
    (o.front ?? '')
  )
}

const painterPal: ColoringTemplate = {
  id: 'stick-painter',
  fa: 'استیک‌من نقاش',
  en: 'Stickman Painter',
  category: 'stickman',
  difficulty: 2,
  svg: svgWrap(
    stickman({
      armL: [176, 252],
      armR: [340, 208],
      legL: [212, 424],
      legR: [300, 424],
      mouth: 'happy',
      front:
        // palette on left glove
        `<ellipse cx="164" cy="268" rx="50" ry="36" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
        `<circle cx="164" cy="268" r="9" fill="${INK}" stroke="none"/>` +
        `<circle cx="142" cy="252" r="8" fill="${INK}" stroke="none"/>` +
        `<circle cx="188" cy="250" r="8" fill="${INK}" stroke="none"/>` +
        `<circle cx="140" cy="284" r="8" fill="${INK}" stroke="none"/>` +
        `<circle cx="190" cy="284" r="8" fill="${INK}" stroke="none"/>` +
        // brush on right glove
        `<g transform="rotate(38 340 208)">` +
        `<rect x="332" y="130" width="14" height="72" rx="7" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/>` +
        `<rect x="329" y="196" width="20" height="16" rx="4" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M 328 212 L 350 212 L 344 240 L 334 240 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
        `</g>`
    })
  ),
}

const wavePal: ColoringTemplate = {
  id: 'stick-wave',
  fa: 'استیک‌من سلام',
  en: 'Waving Stickman',
  category: 'stickman',
  difficulty: 1,
  svg: svgWrap(
    star(392, 84, 22) +
    star(120, 130, 16) +
    stickman({
      armL: [168, 268],
      armR: [352, 104],
      legL: [214, 428],
      legR: [298, 428],
      mouth: 'happy'
    })
  ),
}

const dancePal: ColoringTemplate = {
  id: 'stick-dance',
  fa: 'استیک‌من رقصان',
  en: 'Dancing Stickman',
  category: 'stickman',
  difficulty: 2,
  svg: svgWrap(
    // music notes
    `<circle cx="98" cy="150" r="16" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M 114 150 L 114 96 Q 130 100 136 112" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    `<circle cx="420" cy="196" r="14" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M 434 196 L 434 150 Q 448 154 452 164" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    stickman({
      armL: [148, 170],
      armR: [366, 168],
      legL: [188, 424],
      legR: [330, 414],
      mouth: 'happy',
      head: beret(256, 94, 0.95)
    })
  ),
}

const astroPal: ColoringTemplate = {
  id: 'stick-astro',
  fa: 'استیک‌من فضانورد',
  en: 'Astronaut Stickman',
  category: 'stickman',
  difficulty: 2,
  svg: svgWrap(
    star(110, 90, 18) +
    star(400, 130, 14) +
    star(440, 300, 12) +
    star(70, 300, 12) +
    `<circle cx="256" cy="140" r="96" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    stickman({
      armL: [158, 240],
      armR: [354, 240],
      legL: [206, 428],
      legR: [306, 428],
      cx: 256,
      cy: 140,
      head:
        `<circle cx="256" cy="140" r="80" fill="none" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M 196 168 A 70 70 0 0 0 316 168" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
      front:
        `<rect x="196" y="238" width="120" height="72" rx="18" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
        `<circle cx="226" cy="274" r="10" fill="${INK}" stroke="none"/>` +
        `<circle cx="256" cy="274" r="10" fill="${INK}" stroke="none"/>` +
        `<circle cx="286" cy="274" r="10" fill="${INK}" stroke="none"/>`
    })
  ),
}

const chefPal: ColoringTemplate = {
  id: 'stick-chef',
  fa: 'استیک‌من آشپز',
  en: 'Chef Stickman',
  category: 'stickman',
  difficulty: 2,
  svg: svgWrap(
    stickman({
      armL: [172, 244],
      armR: [344, 250],
      legL: [212, 426],
      legR: [300, 426],
      mouth: 'happy',
      head:
        `<rect x="216" y="66" width="80" height="30" rx="10" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
        `<circle cx="222" cy="52" r="26" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
        `<circle cx="256" cy="38" r="30" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
        `<circle cx="290" cy="52" r="26" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>`,
      front:
        // spoon
        `<g transform="rotate(-30 344 250)">` +
        `<rect x="338" y="196" width="12" height="70" rx="6" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/>` +
        `<ellipse cx="344" cy="182" rx="20" ry="26" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/>` +
        `</g>` +
        // bowl
        `<path d="M 130 268 A 46 46 0 0 0 222 268 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
        `<path d="M 124 268 L 228 268" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
    })
  ),
}

const heroPal: ColoringTemplate = {
  id: 'stick-hero',
  fa: 'استیک‌من قهرمان',
  en: 'Hero Stickman',
  category: 'stickman',
  difficulty: 2,
  svg: svgWrap(
    star(120, 96, 20) +
    star(398, 88, 16) +
    stickman({
      armL: [176, 216],
      armR: [352, 118],
      legL: [206, 430],
      legR: [306, 430],
      mouth: 'happy',
      behind:
        `<path d="M 236 210 C 150 300 140 380 150 430 L 362 430 C 372 380 362 300 276 210 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`,
      head:
        `<path d="M 190 132 L 322 132 L 322 106 Q 256 92 190 106 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
        eye(230, 148, 11) +
        eye(282, 148, 11) +
        smile(256, 172, 32, 14) +
        blush(206, 164, 8) +
        blush(306, 164, 8),
      face: ''
    })
  ),
}

const jumpPal: ColoringTemplate = {
  id: 'stick-jump',
  fa: 'استیک‌من پرنده',
  en: 'Jumping Stickman',
  category: 'stickman',
  difficulty: 1,
  svg: svgWrap(
    star(120, 130, 16) +
    star(396, 110, 20) +
    star(256, 60, 14) +
    stickman({
      armL: [150, 118],
      armR: [362, 118],
      legL: [206, 402],
      legR: [306, 402],
      mouth: 'happy',
      head: beret(256, 94, 0.95)
    })
  ),
}

const sleepyPal: ColoringTemplate = {
  id: 'stick-sleepy',
  fa: 'استیک‌من خواب‌آلود',
  en: 'Sleepy Stickman',
  category: 'stickman',
  difficulty: 1,
  svg: svgWrap(
    `<path d="M 396 96 A 40 40 0 1 0 436 156 A 48 48 0 0 1 396 96 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    star(150, 100, 18) +
    star(210, 70, 12) +
    stickman({
      armL: [176, 262],
      armR: [338, 262],
      legL: [220, 424],
      legR: [294, 424],
      face:
        `<path d="M 226 140 Q 236 150 246 140" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
        `<path d="M 266 140 Q 276 150 286 140" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
        smile(256, 172, 26, 12) +
        blush(212, 160, 9) +
        blush(300, 160, 9),
      head:
        `<path d="M 196 96 Q 256 30 330 76 L 296 104 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
        `<circle cx="334" cy="78" r="12" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>`
    })
  ),
}

const lovePal: ColoringTemplate = {
  id: 'stick-love',
  fa: 'استیک‌من مهربان',
  en: 'Sweet Stickman',
  category: 'stickman',
  difficulty: 1,
  svg: svgWrap(
    star(120, 110, 16) +
    star(398, 100, 18) +
    stickman({
      armL: [186, 262],
      armR: [326, 262],
      legL: [212, 426],
      legR: [300, 426],
      mouth: 'happy',
      front:
        `<path d="M 256 320 C 196 284 190 240 214 226 C 232 216 250 230 256 248 C 262 230 280 216 298 226 C 322 240 316 284 256 320 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`
    })
  ),
}

const balloonPal: ColoringTemplate = {
  id: 'stick-balloon',
  fa: 'استیک‌من بادکنکی',
  en: 'Balloon Stickman',
  category: 'stickman',
  difficulty: 1,
  svg: svgWrap(
    // balloons
    `<ellipse cx="170" cy="86" rx="44" ry="52" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="278" cy="60" rx="40" ry="48" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="360" cy="110" rx="40" ry="48" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M 170 138 L 176 300" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M 278 108 L 210 296" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M 360 158 L 190 302" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    stickman({
      armL: [176, 300],
      armR: [340, 236],
      legL: [212, 426],
      legR: [300, 426],
      mouth: 'happy'
    })
  ),
}

export const CORE_TEMPLATES: ColoringTemplate[] = [
  blank,
  cat,
  sun,
  rainbow,
  circleBuddy,
  squareBot,
  starBuddy,
  heartBuddy,
  kite,
  hexBee,
  painterPal,
  wavePal,
  dancePal,
  astroPal,
  chefPal,
  heroPal,
  jumpPal,
  sleepyPal,
  lovePal,
  balloonPal,
]
