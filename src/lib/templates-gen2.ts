import { ColoringTemplate, INK, blush, cloud, eye, limb, smile, star } from './template-types'
import {
  buildCategory,
  circ,
  ell,
  eyesBlush,
  f1,
  face,
  faceSide,
  heart,
  line,
  pathC,
  poly,
  raindrop,
  rct,
  rr,
  ri,
  scallopBlob,
  wheel,
  Recipe,
  RecipeMeta,
  accHead,
  accTop,
} from './templates-gen'

// ================================================================ BIRDS
const bDuck: Recipe = (v) => {
  const r = v.r
  const wingRot = rr(r, 12, 26)
  return (
    poly([[150, 296], [96, 262], [106, 322]], 5) +
    ell(256, 330, 118, 92, 6) +
    ell(170, 336, 44, 62, 5, wingRot) +
    circ(256, 168, 80, 6) +
    ell(256, 208, 34, 14) +
    eyesBlush(v, 256, 152, 34, 15, 46, 20) +
    ell(212, 434, 28, 12) +
    ell(300, 434, 28, 12) +
    accTop(v, 256, 88)
  )
}

const bChick: Recipe = (v) => (
  circ(256, 296, 112, 6) +
  ell(148, 300, 26, 40, 5, 22) +
  ell(364, 300, 26, 40, 5, -22) +
  poly([[238, 212], [274, 212], [256, 242]], 5) +
  eyesBlush(v, 256, 192, 38, 15, 48, 16) +
  line('M 220 404 L 220 428 M 292 404 L 292 428', 5) +
  ell(212, 434, 20, 9) +
  ell(300, 434, 20, 9) +
  accTop(v, 256, 184)
)

const bParrot: Recipe = (v) => {
  const r = v.r
  const crestX = rr(r, -6, 6)
  return (
    ell(150, 430, 16, 56, 5, 42) +
    ell(178, 442, 16, 60, 5, 26) +
    ell(208, 450, 16, 62, 5, 10) +
    ell(256, 306, 88, 118, 6) +
    ell(196, 336, 40, 82, 5, 14) +
    circ(256, 148, 72, 6) +
    accTop(v, 256, 78, 0.9) +
    pathC('M 232 92 C 214 44 252 30 262 66 C 268 84 254 96 232 92 Z', 4) +
    pathC(`M ${f1(276 + crestX)} 90 C 300 48 336 66 318 96 C 306 112 288 104 ${f1(276 + crestX)} 90 Z`, 4) +
    pathC('M 296 160 C 336 162 338 200 304 206 C 316 192 312 180 294 182 Z', 5) +
    eyesBlush(v, 250, 138, 30, 13, 40, 16)
  )
}

const bFlamingo: Recipe = (v) => (
  ell(310, 300, 92, 76, 6) +
  pathC('M 396 282 C 428 262 446 268 452 288 C 436 286 420 296 412 308 Z', 4) +
  ell(330, 296, 40, 52, 5, -14) +
  limb(258, 296, 208, 180, 46) +
  limb(208, 180, 224, 142, 46) +
  circ(228, 96, 46, 6) +
  pathC('M 262 88 C 306 90 310 122 276 128 C 282 114 276 104 260 106 Z', 5) +
  faceSide(v, 214, 84, 11, 246, 112, 12, 5, 194, 108) +
  limb(284, 372, 272, 456, 16) +
  limb(330, 368, 340, 456, 16) +
  ell(268, 462, 20, 8) +
  ell(346, 462, 20, 8) +
  accTop(v, 228, 50, 0.8)
)

const bBranch: Recipe = (v) => (
  // branch
  pathC('M 60 380 C 140 366 260 356 452 330 L 456 352 C 268 378 148 388 62 402 Z', 5) +
  // leaf pairs on branch
  ell(120, 352, 18, 10, 4, -30) +
  ell(396, 322, 18, 10, 4, -24) +
  // bird body
  ell(238, 268, 82, 66, 6) +
  // tail
  poly([[310, 252], [382, 218], [378, 268], [312, 282]], 5) +
  // wing
  ell(238, 276, 44, 34, 5, 12) +
  // head
  circ(170, 196, 52, 6) +
  // beak
  poly([[122, 196], [76, 206], [122, 216]], 4) +
  faceSide(v, 156, 184, 10, 128, 210, 16, 6, 196, 212) +
  // legs to branch
  line('M 216 330 L 214 362 M 260 332 L 262 358', 4) +
  accTop(v, 170, 144)
)

const BIRDS: RecipeMeta[] = [
  { base: { fa: 'اردکِ {s}', en: '{s} Duck' }, diff: 2, fn: bDuck },
  { base: { fa: 'جوجه‌ی {s}', en: '{s} Chick' }, diff: 1, fn: bChick },
  { base: { fa: 'طوطیِ {s}', en: '{s} Parrot' }, diff: 2, fn: bParrot },
  { base: { fa: 'فلامینگوی {s}', en: '{s} Flamingo' }, diff: 2, fn: bFlamingo },
  { base: { fa: 'پرنده‌ی {s} روی شاخه', en: '{s} Bird on Branch' }, diff: 2, fn: bBranch },
]

// ================================================================ SEA
const sOctopus: Recipe = (v) => {
  const r = v.r
  const spread = ri(r, 0, 10)
  return (
    limb(190, 272, 132 + spread, 372, 36) +
    limb(234, 276, 216, 396, 36) +
    limb(278, 276, 300, 396, 36) +
    limb(322, 272, 382 - spread, 372, 36) +
    pathC('M 156 268 A 100 100 0 0 1 356 268 Z', 6) +
    circ(160, 320, 7, 4) +
    circ(206, 356, 7, 4) +
    circ(306, 356, 7, 4) +
    circ(352, 320, 7, 4) +
    face(v, 256, 208, { dx: 36, er: 15, my: 244, mw: 40, mh: 14 }) +
    accTop(v, 256, 168)
  )
}

const sWhale: Recipe = (v) => {
  const r = v.r
  const d1 = rr(r, 0, 8)
  return (
    raindrop(180 - d1, 108, 0.9) +
    raindrop(214, 96, 1) +
    raindrop(246 + d1, 110, 0.85) +
    ell(250, 290, 132, 84, 6) +
    pathC('M 372 262 C 396 224 428 212 452 202 C 438 236 442 260 456 284 C 424 274 396 280 376 296 Z', 5) +
    ell(238, 330, 36, 20, 5, 18) +
    faceSide(v, 162, 262, 13, 130, 292, 26, 11, 116, 298) +
    line('M 170 330 Q 250 352 330 326', 4) +
    accTop(v, 250, 206)
  )
}

const sCrab: Recipe = (v) => {
  const r = v.r
  const legS = ri(r, 8, 16)
  return (
    accTop(v, 256, 226) +
    limb(180, 340, 120 - legS, 400, 14) +
    limb(196, 362, 148 - legS, 428, 14) +
    limb(332, 340, 392 + legS, 400, 14) +
    limb(316, 362, 364 + legS, 428, 14) +
    limb(170, 270, 132, 236, 18) +
    limb(342, 270, 380, 236, 18) +
    pathC('M 108 196 A 44 44 0 1 0 152 262 L 124 236 Z', 5) +
    pathC('M 404 196 A 44 44 0 1 1 360 262 L 388 236 Z', 5) +
    ell(256, 306, 102, 80, 6) +
    line('M 232 232 L 226 196', 4) +
    line('M 280 232 L 286 196', 4) +
    eye(226, 182, 13) +
    eye(286, 182, 13) +
    smile(256, 316, 42, 16) +
    blush(206, 296, 10) +
    blush(306, 296, 10)
  )
}

const sJelly: Recipe = (v) => (
  limb(192, 272, 168, 384, 26) +
  limb(234, 276, 226, 404, 26) +
  limb(278, 276, 286, 404, 26) +
  limb(320, 272, 344, 384, 26) +
  pathC('M 156 244 A 100 94 0 0 1 356 244 Q 356 272 330 272 L 182 272 Q 156 272 156 244 Z', 6) +
  face(v, 256, 200, { dx: 34, er: 14, my: 236, mw: 36, mh: 12 }) +
  accTop(v, 256, 150)
)

const sStarfish: Recipe = (v) => {
  const r = v.r
  const rot = rr(r, -12, 12)
  const dots: string[] = []
  for (let i = 0; i < 5; i++) {
    const a = ((Math.PI * 2) / 5) * i - Math.PI / 2 + (rot * Math.PI) / 180
    dots.push(circ(256 + 84 * Math.cos(a), 292 + 84 * Math.sin(a), 11, 4))
  }
  return (
    `<g transform="rotate(${f1(rot)} 256 292)">` + star(256, 292, 142) + dots.join('') + `</g>` +
    face(v, 256, 268, { dx: 32, er: 14, my: 306, mw: 34, mh: 12 }) +
    accTop(v, 256, 150)
  )
}

const SEA: RecipeMeta[] = [
  { base: { fa: 'هشت‌پای {s}', en: '{s} Octopus' }, diff: 2, fn: sOctopus, scene2: 'sky' },
  { base: { fa: 'نهنگِ {s}', en: '{s} Whale' }, diff: 2, fn: sWhale, scene2: 'sky' },
  { base: { fa: 'خرچنگِ {s}', en: '{s} Crab' }, diff: 2, fn: sCrab },
  { base: { fa: 'عروس دریاییِ {s}', en: '{s} Jellyfish' }, diff: 1, fn: sJelly, scene2: 'sky' },
  { base: { fa: 'ستاره‌ی دریاییِ {s}', en: '{s} Starfish' }, diff: 1, fn: sStarfish },
]

// ================================================================ INSECTS
const iBee: Recipe = (v) => (
  ell(192, 186, 50, 30, 5, -28) +
  ell(320, 186, 50, 30, 5, 28) +
  line('M 226 240 Q 206 196 184 188', 4) +
  line('M 286 240 Q 306 196 328 188', 4) +
  circ(180, 184, 8, 4) +
  circ(332, 184, 8, 4) +
  ell(256, 306, 96, 78, 6) +
  line('M 214 246 L 214 362', 5) +
  line('M 298 246 L 298 362', 5) +
  poly([[352, 296], [392, 286], [392, 306]], 4) +
  eyesBlush(v, 256, 292, 30, 14, 42, 18) +
  smile(256, 324, 34, 13) +
  accTop(v, 256, 228)
)

const iButterfly: Recipe = (v) => (
  ell(158, 236, 76, 58, 5, -24) +
  ell(354, 236, 76, 58, 5, 24) +
  ell(178, 354, 54, 44, 5, 18) +
  ell(334, 354, 54, 44, 5, -18) +
  circ(150, 226, 15, 4) +
  circ(362, 226, 15, 4) +
  circ(170, 358, 12, 4) +
  circ(342, 358, 12, 4) +
  ell(256, 320, 26, 88, 6) +
  circ(256, 208, 36, 6) +
  line('M 244 180 Q 226 148 208 142', 4) +
  line('M 268 180 Q 286 148 304 142', 4) +
  circ(204, 138, 7, 4) +
  circ(308, 138, 7, 4) +
  eyesBlush(v, 256, 198, 14, 9, 20, 8) +
  smile(256, 220, 18, 8) +
  accTop(v, 256, 172)
)

const iLadybug: Recipe = (v) => (
  line('M 234 150 Q 220 118 200 110', 4) +
  line('M 278 150 Q 292 118 312 110', 4) +
  circ(196, 106, 8, 4) +
  circ(316, 106, 8, 4) +
  circ(256, 190, 56, 6) +
  circ(256, 316, 112, 6) +
  line('M 256 210 L 256 424', 4) +
  circ(196, 290, 16, 4) +
  circ(316, 290, 16, 4) +
  circ(216, 366, 14, 4) +
  circ(296, 366, 14, 4) +
  circ(256, 316, 13, 4) +
  eyesBlush(v, 256, 176, 18, 10, 26, 12) +
  smile(256, 204, 26, 10) +
  accTop(v, 256, 134)
)

const iSnail: Recipe = (v) => (
  circ(310, 286, 98, 6) +
  line('M 310 188 A 98 98 0 0 1 408 286', 4) +
  line('M 408 286 A 62 62 0 0 1 346 348', 4) +
  line('M 346 348 A 34 34 0 0 1 292 312', 4) +
  pathC('M 210 392 C 128 392 108 330 152 306 C 178 292 202 306 212 336 L 212 392 Z', 6) +
  circ(148, 268, 40, 6) +
  line('M 132 232 Q 124 200 110 192', 4) +
  line('M 164 232 Q 176 200 190 194', 4) +
  circ(106, 188, 8, 4) +
  circ(194, 190, 8, 4) +
  eyesBlush(v, 148, 256, 16, 10, 22, 12) +
  smile(148, 286, 22, 9) +
  accTop(v, 148, 228)
)

const iAnt: Recipe = (v) => (
  line('M 234 142 Q 214 108 194 100', 4) +
  line('M 278 142 Q 298 108 318 100', 4) +
  circ(190, 96, 8, 4) +
  circ(322, 96, 8, 4) +
  circ(256, 386, 68, 6) +
  circ(256, 282, 42, 6) +
  circ(256, 184, 52, 6) +
  limb(222, 296, 150, 352, 14) +
  limb(290, 296, 362, 352, 14) +
  limb(224, 316, 162, 396, 14) +
  limb(288, 316, 350, 396, 14) +
  eyesBlush(v, 256, 170, 20, 11, 28, 12) +
  smile(256, 202, 26, 10) +
  accTop(v, 256, 132)
)

const INSECTS: RecipeMeta[] = [
  { base: { fa: 'زنبورِ {s}', en: '{s} Bee' }, diff: 2, fn: iBee },
  { base: { fa: 'پروانه‌ی {s}', en: '{s} Butterfly' }, diff: 2, fn: iButterfly },
  { base: { fa: 'کفشدوزکِ {s}', en: '{s} Ladybug' }, diff: 1, fn: iLadybug },
  { base: { fa: 'حلزونِ {s}', en: '{s} Snail' }, diff: 2, fn: iSnail },
  { base: { fa: 'مورچه‌ی {s}', en: '{s} Ant' }, diff: 2, fn: iAnt },
]

// ================================================================ DINO
const dTrex: Recipe = (v) => (
  pathC('M 190 352 C 122 330 76 278 58 214 C 112 250 162 282 210 300 Z', 5) +
  ell(282, 312, 112, 88, 6) +
  ell(268, 336, 62, 48, 4) +
  limb(322, 258, 348, 196, 54) +
  circ(358, 168, 62, 6) +
  pathC('M 358 226 C 396 224 410 244 398 258 L 352 254 Z', 5) +
  limb(330, 316, 368, 334, 18) +
  limb(238, 384, 228, 462, 32) +
  limb(318, 384, 310, 462, 32) +
  ell(222, 468, 32, 12) +
  ell(304, 468, 32, 12) +
  faceSide(v, 372, 156, 11, 402, 190, 22, 9, 336, 186) +
  line('M 236 240 L 254 224 L 272 240 M 272 240 L 290 222 L 308 240', 4) +
  accTop(v, 358, 106)
)

const dLong: Recipe = (v) => (
  limb(396, 348, 468, 300, 26) +
  ell(302, 336, 112, 82, 6) +
  limb(262, 402, 254, 468, 28) +
  limb(342, 404, 336, 468, 28) +
  ell(250, 474, 28, 10) +
  ell(332, 474, 28, 10) +
  limb(242, 316, 200, 150, 44) +
  circ(196, 118, 46, 6) +
  faceSide(v, 182, 106, 10, 210, 136, 20, 8, 158, 132) +
  circ(300, 320, 12, 4) +
  circ(342, 350, 10, 4) +
  circ(266, 352, 9, 4) +
  accTop(v, 196, 72, 0.85)
)

const dStego: Recipe = (v) => (
  poly([[196, 254], [222, 176], [252, 258]], 5) +
  poly([[252, 258], [284, 162], [318, 262]], 5) +
  poly([[318, 262], [352, 180], [382, 268]], 5) +
  limb(382, 336, 462, 372, 24) +
  ell(272, 330, 122, 86, 6) +
  circ(148, 282, 46, 6) +
  limb(178, 312, 162, 296, 44) +
  limb(222, 400, 214, 466, 28) +
  limb(322, 402, 316, 466, 28) +
  ell(208, 472, 28, 10) +
  ell(310, 472, 28, 10) +
  faceSide(v, 134, 270, 10, 164, 298, 20, 8, 116, 296) +
  accTop(v, 148, 236, 0.85)
)

const dEgg: Recipe = (v) => (
  ell(256, 300, 58, 50, 6) +
  circ(256, 208, 68, 6) +
  limb(206, 292, 162, 306, 18) +
  limb(306, 292, 350, 306, 18) +
  pathC('M 164 404 C 164 330 198 296 256 296 C 314 296 348 330 348 404 C 296 420 216 420 164 404 Z', 6) +
  line('M 200 330 L 222 316 L 238 336 L 258 314 L 278 336 L 296 318 L 312 332', 4) +
  pathC('M 200 186 A 58 58 0 0 1 312 186 Q 256 208 200 186 Z', 4) +
  face(v, 256, 194, { dx: 26, er: 13, my: 234, mw: 30, mh: 11 }) +
  accTop(v, 256, 140)
)

const dFly: Recipe = (v) => (
  poly([[300, 282], [404, 172], [434, 292]], 5) +
  poly([[212, 292], [96, 336], [116, 252]], 5) +
  poly([[324, 320], [408, 350], [330, 366]], 5) +
  ell(256, 310, 88, 58, 6) +
  circ(176, 240, 50, 6) +
  poly([[132, 238], [58, 254], [134, 260]], 5) +
  poly([[188, 196], [216, 152], [226, 200]], 5) +
  limb(226, 356, 216, 420, 14) +
  limb(286, 356, 296, 420, 14) +
  eye(160, 228, 11) +
  blush(142, 254, 8) +
  accTop(v, 176, 190)
)

const DINO: RecipeMeta[] = [
  { base: { fa: 'دایناسورِ {s}', en: '{s} Dino' }, diff: 2, fn: dTrex },
  { base: { fa: 'دایناسور گردن‌درازِ {s}', en: '{s} Long-neck Dino' }, diff: 2, fn: dLong },
  { base: { fa: 'استگوزاروسِ {s}', en: '{s} Stegosaurus' }, diff: 3, fn: dStego },
  { base: { fa: 'بچه‌دایناسورِ {s}', en: '{s} Baby Dino' }, diff: 1, fn: dEgg },
  { base: { fa: 'دایناسور پرنده‌ی {s}', en: '{s} Flying Dino' }, diff: 2, fn: dFly, scene2: 'sky' },
]

// ================================================================ WEATHER
const wUmbrella: Recipe = (v) => (
  pathC('M 112 262 A 144 144 0 0 1 400 262 Q 372 290 344 262 Q 316 290 288 262 Q 260 290 232 262 Q 204 290 176 262 Q 148 290 112 262 Z', 6) +
  line('M 256 118 L 176 254 M 256 118 L 344 254', 4) +
  rct(248, 262, 16, 152, 6) +
  line('M 256 406 C 256 452 208 458 198 432', 6) +
  raindrop(96, 330, 0.85) +
  raindrop(420, 316, 0.85) +
  raindrop(396, 400, 0.7) +
  raindrop(70, 420, 0.7) +
  face(v, 256, 196, { dx: 36, er: 14, my: 232, mw: 34, mh: 12 }) +
  accTop(v, 256, 116, 0.85)
)

const wSnowman: Recipe = (v) => (
  circ(256, 384, 90, 6) +
  circ(256, 268, 64, 6) +
  circ(256, 164, 50, 6) +
  line('M 198 262 L 140 232 M 140 232 L 126 244 M 140 232 L 134 214', 4) +
  line('M 314 262 L 372 232 M 372 232 L 386 244 M 372 232 L 380 214', 4) +
  circ(256, 258, 9, 4) +
  circ(256, 286, 9, 4) +
  poly([[256, 160], [256, 172], [298, 170]], 4) +
  eyesBlush(v, 256, 148, 18, 10, 26, 12) +
  smile(256, 184, 26, 10) +
  accHead(v, 256, 114)
)

const wSnowflake: Recipe = (v) => {
  const arms: string[] = []
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i
    const x2 = 256 + 148 * Math.cos(a)
    const y2 = 266 + 148 * Math.sin(a)
    arms.push(line(`M 256 266 L ${f1(x2)} ${f1(y2)}`, 6))
    const xt = 256 + 92 * Math.cos(a)
    const yt = 266 + 92 * Math.sin(a)
    const a1 = a + 0.6
    const a2 = a - 0.6
    arms.push(
      line(`M ${f1(xt)} ${f1(yt)} L ${f1(xt + 34 * Math.cos(a1))} ${f1(yt + 34 * Math.sin(a1))}`, 4),
      line(`M ${f1(xt)} ${f1(yt)} L ${f1(xt + 34 * Math.cos(a2))} ${f1(yt + 34 * Math.sin(a2))}`, 4),
    )
  }
  return (
    arms.join('') +
    circ(256, 266, 26, 6) +
    eyesBlush(v, 256, 258, 10, 6, 14, 8) +
    smile(256, 274, 14, 6) +
    accTop(v, 256, 118, 0.8)
  )
}

const wLeaf: Recipe = (v) => (
  pathC('M 256 128 C 172 170 142 262 176 336 C 196 384 232 408 256 408 C 280 408 316 384 336 336 C 370 262 340 170 256 128 Z', 6) +
  line('M 256 150 L 256 400', 4) +
  line('M 256 210 L 196 250 M 256 210 L 316 250 M 256 290 L 200 330 M 256 290 L 312 330', 4) +
  line('M 256 408 L 256 444', 5) +
  eyesBlush(v, 256, 240, 30, 13, 42, 16) +
  smile(256, 276, 30, 12) +
  accTop(v, 256, 128)
)

const wSunRain: Recipe = (v) => {
  const rays: string[] = []
  for (let i = 0; i < 8; i++) {
    const a = ((Math.PI * 2) / 8) * i
    rays.push(
      poly(
        [
          [164 + 66 * Math.cos(a - 0.2), 160 + 66 * Math.sin(a - 0.2)],
          [164 + 96 * Math.cos(a), 160 + 96 * Math.sin(a)],
          [164 + 66 * Math.cos(a + 0.2), 160 + 66 * Math.sin(a + 0.2)],
        ],
        4,
      ),
    )
  }
  return (
    rays.join('') +
    circ(164, 160, 62, 6) +
    face(v, 164, 148, { dx: 20, er: 11, my: 182, mw: 26, mh: 10 }) +
    cloud(356, 300, 1.15) +
    raindrop(318, 372, 0.8) +
    raindrop(360, 386, 0.9) +
    raindrop(402, 370, 0.8) +
    accTop(v, 164, 98, 0.9)
  )
}

const WEATHER: RecipeMeta[] = [
  { base: { fa: 'چترِ {s}', en: '{s} Umbrella' }, diff: 2, fn: wUmbrella },
  { base: { fa: 'آدم‌برفیِ {s}', en: '{s} Snowman' }, diff: 2, fn: wSnowman },
  { base: { fa: 'دانه‌برفِ {s}', en: '{s} Snowflake' }, diff: 1, fn: wSnowflake },
  { base: { fa: 'برگ پاییزیِ {s}', en: '{s} Autumn Leaf' }, diff: 1, fn: wLeaf },
  { base: { fa: 'بارون و آفتابِ {s}', en: '{s} Sun & Rain' }, diff: 2, fn: wSunRain },
]

// ================================================================ SPACE
const xAstronaut: Recipe = (v) => (
  rct(300, 292, 52, 96, 10) +
  limb(180, 316, 118, 346, 30) +
  limb(332, 316, 394, 346, 30) +
  circ(108, 354, 22, 5) +
  circ(404, 354, 22, 5) +
  limb(214, 402, 202, 464, 32) +
  limb(298, 402, 310, 464, 32) +
  ell(196, 472, 30, 12) +
  ell(316, 472, 30, 12) +
  rct(176, 284, 160, 126, 22, 6) +
  rct(232, 312, 48, 30, 8, 4) +
  circ(244, 327, 5, 3) +
  circ(268, 327, 5, 3) +
  circ(256, 188, 84, 6) +
  pathC('M 184 196 A 72 64 0 0 1 328 196 Q 328 246 256 246 Q 184 246 184 196 Z', 5) +
  face(v, 256, 204, { dx: 26, er: 11, my: 232, mw: 28, mh: 10 }) +
  accTop(v, 256, 104, 0.9)
)

const xPlanet: Recipe = (v) => {
  const ringRot = rr(v.r, -20, -10)
  return (
    `<g transform="rotate(${f1(ringRot)} 256 268)">` +
    ell(256, 268, 186, 46, 5) +
    circ(256, 268, 112, 6) +
    line(`M ${f1(256 - 186)} 268 A 186 46 0 0 0 ${f1(256 + 186)} 268`, 5) +
    `</g>` +
    circ(216, 240, 16, 4) +
    circ(296, 300, 12, 4) +
    circ(240, 318, 9, 4) +
    eyesBlush(v, 256, 252, 28, 13, 40, 16) +
    smile(256, 288, 30, 12) +
    star(84, 110, 20) +
    star(434, 132, 15) +
    star(420, 424, 17) +
    star(76, 408, 13) +
    accTop(v, 256, 156, 0.9)
  )
}

const xAlien: Recipe = (v) => (
  line('M 216 132 Q 200 96 182 88', 4) +
  line('M 296 132 Q 312 96 330 88', 4) +
  circ(178, 84, 10, 4) +
  circ(334, 84, 10, 4) +
  limb(206, 306, 148, 330, 20) +
  limb(306, 306, 364, 330, 20) +
  circ(140, 336, 18, 5) +
  circ(372, 336, 18, 5) +
  limb(232, 388, 222, 458, 20) +
  limb(280, 388, 290, 458, 20) +
  ell(216, 466, 24, 10) +
  ell(296, 466, 24, 10) +
  ell(256, 196, 98, 82, 6) +
  ell(256, 330, 56, 62, 6) +
  face(v, 256, 186, { dx: 36, er: 17, my: 232, mw: 36, mh: 13 }) +
  circ(256, 344, 7, 4) +
  accTop(v, 256, 114)
)

const xUfo: Recipe = (v) => (
  poly([[196, 262], [146, 428], [366, 428], [316, 262]], 5) +
  pathC('M 176 208 A 80 80 0 0 1 336 208 Z', 6) +
  eyesBlush(v, 256, 168, 22, 11, 30, 10) +
  smile(256, 192, 22, 8) +
  ell(256, 238, 152, 44, 6) +
  circ(150, 244, 10, 4) +
  circ(256, 254, 10, 4) +
  circ(362, 244, 10, 4) +
  star(80, 120, 16) +
  star(430, 100, 14) +
  star(440, 320, 12) +
  accTop(v, 256, 128, 0.9)
)

const xMoon: Recipe = (v) => (
  circ(256, 262, 118, 6) +
  circ(196, 210, 18, 4) +
  circ(316, 234, 14, 4) +
  circ(292, 330, 16, 4) +
  circ(210, 320, 11, 4) +
  eyesBlush(v, 256, 246, 30, 14, 42, 16) +
  smile(256, 284, 32, 13) +
  star(96, 130, 18) +
  star(424, 116, 15) +
  star(436, 380, 16) +
  star(72, 380, 13) +
  accTop(v, 256, 144, 0.9)
)

const SPACE: RecipeMeta[] = [
  { base: { fa: 'فضانوردِ {s}', en: '{s} Astronaut' }, diff: 2, fn: xAstronaut, scene2: 'sky' },
  { base: { fa: 'سیاره‌ی {s}', en: '{s} Planet' }, diff: 2, fn: xPlanet, scene2: 'sky' },
  { base: { fa: 'فضاییِ {s}', en: '{s} Alien' }, diff: 2, fn: xAlien, scene2: 'sky' },
  { base: { fa: 'بشقاب پرنده‌ی {s}', en: '{s} UFO' }, diff: 1, fn: xUfo, scene2: 'sky' },
  { base: { fa: 'ماهِ {s}', en: '{s} Moon' }, diff: 1, fn: xMoon, scene2: 'sky' },
]

// ================================================================ SPORTS
const pSoccer: Recipe = (v) => {
  const c: number[][] = []
  for (let i = 0; i < 5; i++) {
    const a = ((Math.PI * 2) / 5) * i - Math.PI / 2
    c.push([256 + 52 * Math.cos(a), 288 + 52 * Math.sin(a)])
  }
  let spokes = ''
  for (let i = 0; i < 5; i++) {
    const a = ((Math.PI * 2) / 5) * i - Math.PI / 2
    spokes += line(
      `M ${f1(256 + 52 * Math.cos(a))} ${f1(288 + 52 * Math.sin(a))} L ${f1(256 + 122 * Math.cos(a))} ${f1(288 + 122 * Math.sin(a))}`,
      4,
    )
  }
  return (
    circ(256, 288, 130, 6) +
    poly(c, 5) +
    spokes +
    eyesBlush(v, 256, 272, 30, 14, 42, 18) +
    smile(256, 306, 32, 13) +
    accTop(v, 256, 158)
  )
}

const pMedal: Recipe = (v) => (
  rct(200, 84, 46, 130, 10, 5, 16) +
  rct(266, 84, 46, 130, 10, 5, -16) +
  circ(256, 306, 98, 6) +
  circ(256, 306, 72, 4) +
  star(256, 306, 44) +
  accTop(v, 256, 90, 0.8)
)

const pTrophy: Recipe = (v) => (
  pathC('M 174 168 C 116 164 108 236 172 250 C 152 230 150 196 176 192 Z', 5) +
  pathC('M 338 168 C 396 164 404 236 340 250 C 360 230 362 196 336 192 Z', 5) +
  pathC('M 172 148 C 172 264 204 318 256 318 C 308 318 340 264 340 148 Z', 6) +
  rct(238, 318, 36, 42, 8) +
  rct(198, 360, 116, 34, 12) +
  rct(182, 394, 148, 30, 12) +
  star(256, 216, 42) +
  accTop(v, 256, 148, 0.9)
)

const pBeachBall: Recipe = (v) => (
  circ(256, 292, 126, 6) +
  line('M 256 166 C 196 220 196 364 256 418', 4) +
  line('M 256 166 C 130 214 130 370 256 418', 4) +
  line('M 256 166 C 316 220 316 364 256 418', 4) +
  line('M 256 166 C 382 214 382 370 256 418', 4) +
  circ(256, 166, 14, 4) +
  eyesBlush(v, 256, 286, 32, 14, 44, 18) +
  smile(256, 320, 32, 13) +
  accTop(v, 256, 158)
)

const pFlag: Recipe = (v) => (
  rct(138, 88, 16, 350, 7) +
  ell(146, 444, 62, 16) +
  pathC('M 154 100 C 224 78 286 132 366 96 L 366 224 C 286 260 224 206 154 228 Z', 6) +
  star(236, 162, 30) +
  accTop(v, 146, 88, 0.8)
)

const SPORTS: RecipeMeta[] = [
  { base: { fa: 'توپ فوتبالِ {s}', en: '{s} Soccer Ball' }, diff: 2, fn: pSoccer },
  { base: { fa: 'مدالِ {s}', en: '{s} Medal' }, diff: 1, fn: pMedal },
  { base: { fa: 'جام قهرمانیِ {s}', en: '{s} Trophy' }, diff: 2, fn: pTrophy },
  { base: { fa: 'توپ ساحلیِ {s}', en: '{s} Beach Ball' }, diff: 1, fn: pBeachBall },
  { base: { fa: 'پرچم قهرمانیِ {s}', en: '{s} Winner Flag' }, diff: 1, fn: pFlag },
]

// ================================================================ MUSIC
const mDrum: Recipe = (v) => (
  limb(306, 168, 380, 118, 14) +
  circ(388, 112, 17, 5) +
  limb(206, 168, 132, 118, 14) +
  circ(124, 112, 17, 5) +
  rct(166, 232, 180, 160, 14, 6) +
  ell(256, 232, 92, 26, 6) +
  line('M 180 244 L 180 380 M 226 252 L 226 388 M 286 252 L 286 388 M 332 244 L 332 380', 4) +
  ell(256, 392, 92, 22, 5) +
  face(v, 256, 300, { dx: 28, er: 12, my: 336, mw: 30, mh: 11 }) +
  accTop(v, 256, 206, 0.9)
)

const mGuitar: Recipe = (v) => (
  rct(238, 80, 36, 120, 8) +
  rct(230, 44, 52, 36, 10) +
  circ(224, 54, 7, 4) +
  circ(224, 72, 7, 4) +
  circ(288, 54, 7, 4) +
  circ(288, 72, 7, 4) +
  pathC('M 256 172 C 296 172 316 208 310 244 C 356 256 378 294 378 352 C 378 430 330 472 256 472 C 182 472 134 430 134 352 C 134 294 156 256 202 244 C 196 208 216 172 256 172 Z', 6) +
  circ(256, 348, 36, 5) +
  line('M 246 80 L 246 344 M 256 80 L 256 348 M 266 80 L 266 344', 3) +
  rct(234, 362, 44, 16, 6) +
  eyesBlush(v, 256, 396, 26, 12, 34, 14) +
  smile(256, 422, 26, 10) +
  accTop(v, 256, 44, 0.8)
)

const mNotes: Recipe = (v) => (
  poly([[244, 170], [396, 138], [396, 178], [244, 210]], 5) +
  rct(238, 170, 14, 210, 6) +
  rct(384, 138, 14, 210, 6) +
  ell(214, 386, 40, 30, 6, -18) +
  ell(360, 354, 40, 30, 6, -18) +
  eyesBlush(v, 214, 376, 13, 8, 18, 8) +
  smile(214, 396, 16, 7) +
  ell(120, 220, 18, 14, 5, -18) +
  rct(134, 130, 9, 90, 4) +
  line('M 143 130 C 165 138 168 158 156 172', 4) +
  star(430, 430, 15) +
  star(84, 420, 13) +
  accTop(v, 244, 170, 0.8)
)

const mPiano: Recipe = (v) => {
  const keys: string[] = []
  for (let i = 0; i < 8; i++) keys.push(rct(126 + i * 33, 214, 30, 118, 4, 4))
  const blacks = [1, 2, 4, 5, 6].map((k) => rct(126 + k * 33 - 9, 214, 18, 70, 3, 4))
  return (
    rct(112, 190, 288, 196, 16, 6) +
    keys.join('') +
    blacks.join('') +
    rct(126, 386, 26, 66, 8) +
    rct(360, 386, 26, 66, 8) +
    ell(230, 460, 14, 8, 4) +
    ell(282, 460, 14, 8, 4) +
    face(v, 256, 344, { dx: 24, er: 10, my: 372, mw: 26, mh: 9 }) +
    accTop(v, 256, 190, 0.9)
  )
}

const mBell: Recipe = (v) => (
  circ(256, 116, 20, 5) +
  pathC('M 256 130 C 192 130 172 196 168 262 C 164 302 142 322 132 338 L 380 338 C 370 322 348 302 344 262 C 340 196 320 130 256 130 Z', 6) +
  rct(124, 338, 264, 30, 14) +
  circ(256, 386, 22, 5) +
  face(v, 256, 238, { dx: 28, er: 12, my: 274, mw: 30, mh: 11 }) +
  accTop(v, 256, 96, 0.85)
)

const MUSIC: RecipeMeta[] = [
  { base: { fa: 'طبلِ {s}', en: '{s} Drum' }, diff: 2, fn: mDrum },
  { base: { fa: 'گیتارِ {s}', en: '{s} Guitar' }, diff: 2, fn: mGuitar },
  { base: { fa: 'نت‌های موسیقیِ {s}', en: '{s} Music Notes' }, diff: 1, fn: mNotes },
  { base: { fa: 'پیانوی {s}', en: '{s} Piano' }, diff: 3, fn: mPiano },
  { base: { fa: 'زنگِ {s}', en: '{s} Bell' }, diff: 1, fn: mBell },
]

// ================================================================ CLOTHES
const cTshirt: Recipe = (v) => (
  pathC('M 178 148 L 116 190 L 148 254 L 188 232 L 188 404 L 324 404 L 324 232 L 364 254 L 396 190 L 334 148 C 302 176 210 176 178 148 Z', 6) +
  line('M 210 158 Q 256 186 302 158', 4) +
  face(v, 256, 210, { dx: 24, er: 11, my: 244, mw: 26, mh: 10 }) +
  star(256, 310, 40) +
  accTop(v, 256, 148, 0.9)
)

const cSneaker: Recipe = (v) => (
  pathC('M 108 358 C 108 300 148 268 200 268 C 240 268 258 300 298 316 C 332 330 382 330 402 346 C 414 354 414 380 402 392 L 120 392 C 112 392 108 380 108 358 Z', 6) +
  rct(102, 388, 318, 34, 14) +
  line('M 190 300 L 226 318 M 182 322 L 220 340 M 176 344 L 212 360', 4) +
  line('M 130 288 C 118 310 116 340 122 372', 4) +
  eye(206, 320, 12) +
  blush(180, 342, 9) +
  smile(238, 344, 22, 9) +
  accTop(v, 214, 268, 0.8)
)

const cCap: Recipe = (v) => (
  pathC('M 128 262 A 128 120 0 0 1 384 262 Z', 6) +
  pathC('M 368 252 C 444 254 460 296 442 310 C 402 292 360 288 328 290 L 332 254 Z', 5) +
  circ(256, 134, 16, 4) +
  line('M 256 142 L 256 176 M 210 160 L 220 190 M 302 160 L 292 190', 4) +
  eyesBlush(v, 256, 200, 28, 13, 36, 15) +
  smile(256, 232, 28, 11) +
  accTop(v, 256, 132, 0.85)
)

const cBackpack: Recipe = (v) => (
  limb(206, 172, 184, 114, 20) +
  limb(306, 172, 328, 114, 20) +
  rct(164, 176, 184, 246, 26, 6) +
  pathC('M 164 250 L 164 202 Q 164 176 190 176 L 322 176 Q 348 176 348 202 L 348 250 Q 256 276 164 250 Z', 5) +
  rct(200, 258, 34, 22, 6, 4) +
  rct(278, 258, 34, 22, 6, 4) +
  rct(212, 318, 88, 86, 18, 5) +
  face(v, 256, 348, { dx: 20, er: 9, my: 372, mw: 22, mh: 9 }) +
  accTop(v, 256, 176, 0.9)
)

const cDress: Recipe = (v) => (
  pathC('M 214 128 L 298 128 L 312 218 L 344 300 C 366 382 344 424 256 424 C 168 424 146 382 168 300 L 200 218 Z', 6) +
  line('M 200 218 L 312 218', 4) +
  circ(226, 300, 10, 4) +
  circ(290, 320, 10, 4) +
  circ(256, 360, 10, 4) +
  circ(214, 376, 8, 4) +
  circ(300, 386, 8, 4) +
  face(v, 256, 176, { dx: 22, er: 11, my: 208, mw: 26, mh: 10 }) +
  accTop(v, 256, 128, 0.9)
)

const CLOTHES: RecipeMeta[] = [
  { base: { fa: 'تی‌شرتِ {s}', en: '{s} T-Shirt' }, diff: 2, fn: cTshirt },
  { base: { fa: 'کفشِ {s}', en: '{s} Sneaker' }, diff: 2, fn: cSneaker },
  { base: { fa: 'کلاه کپِ {s}', en: '{s} Cap' }, diff: 1, fn: cCap },
  { base: { fa: 'کوله‌پشتیِ {s}', en: '{s} Backpack' }, diff: 2, fn: cBackpack },
  { base: { fa: 'پیراهنِ {s}', en: '{s} Dress' }, diff: 2, fn: cDress },
]

// ================================================================ SCHOOL
const kBook: Recipe = (v) => (
  pathC('M 256 168 C 204 138 132 136 88 158 L 88 382 C 132 360 204 362 256 392 C 308 362 380 360 424 382 L 424 158 C 380 136 308 138 256 168 Z', 6) +
  line('M 256 168 L 256 392', 4) +
  line('M 116 210 C 150 200 186 202 216 214 M 116 258 C 150 248 186 250 216 262 M 116 306 C 150 296 186 298 216 310', 3) +
  poly([[296, 180], [322, 182], [322, 268], [309, 252], [296, 268]], 4) +
  face(v, 348, 280, { dx: 22, er: 10, my: 312, mw: 24, mh: 9 }) +
  accTop(v, 256, 142, 0.9)
)

const kPencil: Recipe = (v) => (
  rct(218, 106, 76, 42, 12, 5) +
  rct(218, 146, 76, 20, 4, 4) +
  rct(218, 164, 76, 218, 6, 6) +
  poly([[218, 382], [294, 382], [256, 458]], 5) +
  poly([[240, 420], [272, 420], [256, 458]], 4) +
  line('M 244 172 L 244 374 M 268 172 L 268 374', 3) +
  face(v, 256, 262, { dx: 24, er: 12, my: 300, mw: 28, mh: 10 }) +
  accTop(v, 256, 106, 0.8)
)

const kRuler: Recipe = (v) => {
  const ys = [124, 154, 184, 304, 334, 364, 394]
  const ticks = ys.map((y, i) => line(`M 200 ${y} L ${200 + (i % 2 === 0 ? 34 : 20)} ${y}`, 4))
  return (
    rct(192, 96, 128, 330, 14, 6) +
    ticks.join('') +
    eyesBlush(v, 256, 236, 26, 12, 34, 15) +
    smile(256, 268, 28, 11) +
    accTop(v, 256, 96, 0.85)
  )
}

const kScissors: Recipe = (v) => (
  pathC('M 244 290 L 196 96 C 192 74 226 66 234 88 L 264 286 Z', 5) +
  pathC('M 268 290 L 316 96 C 320 74 286 66 278 88 L 248 286 Z', 5) +
  circ(256, 296, 17, 5) +
  pathC('M 238 318 C 184 336 166 396 214 410 C 248 418 262 372 254 324 Z', 5) +
  pathC('M 274 318 C 328 336 346 396 298 410 C 264 418 250 372 258 324 Z', 5) +
  star(140, 150, 16) +
  star(376, 140, 14) +
  accTop(v, 256, 70, 0.8)
)

const kGlobe: Recipe = (v) => (
  rct(238, 352, 36, 62, 8) +
  rct(186, 410, 140, 28, 12) +
  circ(256, 240, 120, 6) +
  `<ellipse cx="256" cy="240" rx="46" ry="118" fill="none" stroke="${INK}" stroke-width="4"/>` +
  line('M 136 240 L 376 240', 4) +
  pathC('M 168 292 C 154 314 170 336 194 330 C 216 324 214 298 198 290 C 188 284 176 284 168 292 Z', 4) +
  pathC('M 318 168 C 306 190 322 214 348 208 C 370 202 368 176 352 166 C 340 158 326 158 318 168 Z', 4) +
  face(v, 256, 196, { dx: 26, er: 11, my: 230, mw: 26, mh: 9 }) +
  accTop(v, 256, 120)
)

const SCHOOL: RecipeMeta[] = [
  { base: { fa: 'کتابِ {s}', en: '{s} Book' }, diff: 2, fn: kBook },
  { base: { fa: 'مدادرنگیِ {s}', en: '{s} Pencil' }, diff: 1, fn: kPencil },
  { base: { fa: 'خط‌کشِ {s}', en: '{s} Ruler' }, diff: 1, fn: kRuler },
  { base: { fa: 'قیچیِ {s}', en: '{s} Scissors' }, diff: 2, fn: kScissors },
  { base: { fa: 'کره‌ی زمینِ {s}', en: '{s} Globe' }, diff: 2, fn: kGlobe },
]

// ================================================================ PARTY
const yBalloons: Recipe = (v) => (
  ell(150, 200, 42, 52) +
  poly([[142, 248], [158, 248], [150, 262]], 4) +
  line('M 150 262 Q 164 300 148 340', 4) +
  eyesBlush(v, 150, 190, 12, 8, 18, 8) +
  smile(150, 210, 16, 7) +
  ell(360, 170, 46, 56) +
  poly([[352, 222], [368, 222], [360, 236]], 4) +
  line('M 360 236 Q 344 280 362 322', 4) +
  eyesBlush(v, 360, 160, 13, 8, 19, 8) +
  smile(360, 182, 17, 7) +
  ell(258, 320, 52, 64) +
  poly([[249, 380], [267, 380], [258, 396]], 4) +
  line('M 258 396 Q 274 436 256 468', 4) +
  eyesBlush(v, 258, 308, 15, 9, 22, 9) +
  smile(258, 334, 19, 8) +
  star(76, 120, 16) +
  star(444, 110, 14) +
  star(64, 400, 13) +
  star(446, 396, 15) +
  accTop(v, 258, 256, 0.85)
)

const yGift: Recipe = (v) => (
  rct(146, 236, 220, 184, 16, 6) +
  rct(234, 236, 44, 184, 4, 5) +
  rct(126, 186, 260, 54, 12, 6) +
  rct(234, 186, 44, 54, 4, 5) +
  ell(212, 172, 36, 24, 5, -28) +
  ell(300, 172, 36, 24, 5, 28) +
  circ(256, 178, 17, 5) +
  circ(180, 300, 10, 4) +
  circ(330, 320, 10, 4) +
  circ(180, 380, 10, 4) +
  circ(330, 388, 10, 4) +
  face(v, 256, 296, { dx: 14, er: 8, my: 318, mw: 16, mh: 7 }) +
  accTop(v, 256, 148, 0.8)
)

const yCandle: Recipe = (v) => (
  raindrop(256, 128, 1.35) +
  line('M 256 186 L 256 214', 4) +
  rct(224, 214, 64, 206, 12, 6) +
  ell(216, 236, 11, 18, 4) +
  ell(296, 230, 11, 20, 4) +
  line('M 224 250 L 288 282', 4) +
  face(v, 256, 330, { dx: 20, er: 10, my: 362, mw: 24, mh: 9 }) +
  accTop(v, 256, 216, 0.7)
)

const yFlag: Recipe = (v) => {
  const xs = [96, 158, 220, 282, 344, 406]
  const ys = [166, 180, 190, 190, 180, 166]
  const pennants = xs.map((x, i) => poly([[x, ys[i]], [x + 50, ys[i]], [x + 25, ys[i] + 64]], 5))
  return (
    line('M 56 148 Q 256 206 456 148', 5) +
    pennants.join('') +
    star(84, 300, 14) +
    star(430, 310, 13) +
    star(256, 304, 16) +
    accTop(v, 256, 176, 0.8)
  )
}

const yBow: Recipe = (v) => (
  pathC('M 256 260 C 180 180 90 200 100 280 C 108 344 190 330 256 260 Z', 6) +
  pathC('M 256 260 C 332 180 422 200 412 280 C 404 344 322 330 256 260 Z', 6) +
  poly([[234, 282], [210, 380], [250, 372]], 5) +
  poly([[278, 282], [302, 380], [262, 372]], 5) +
  rct(234, 238, 44, 44, 12) +
  face(v, 256, 258, { dx: 14, er: 8, my: 278, mw: 16, mh: 7 }) +
  accTop(v, 256, 238, 0.7)
)

const PARTY: RecipeMeta[] = [
  { base: { fa: 'بادکنک‌های {s}', en: '{s} Balloons' }, diff: 1, fn: yBalloons },
  { base: { fa: 'کادوی {s}', en: '{s} Gift Box' }, diff: 2, fn: yGift },
  { base: { fa: 'شمع تولدِ {s}', en: '{s} Birthday Candle' }, diff: 1, fn: yCandle },
  { base: { fa: 'رشته‌بندهای {s}', en: '{s} Party Flag' }, diff: 2, fn: yFlag },
  { base: { fa: 'پاپیون {s}', en: '{s} Bow' }, diff: 1, fn: yBow },
]

// ================================================================ FARM
const fCow: Recipe = (v) => (
  pathC('M 190 140 C 168 104 200 88 216 116 Z', 4) +
  pathC('M 322 140 C 344 104 312 88 296 116 Z', 4) +
  ell(146, 176, 32, 18, 5, -28) +
  ell(366, 176, 32, 18, 5, 28) +
  ell(256, 226, 98, 86, 6) +
  ell(256, 276, 60, 36) +
  circ(236, 272, 9, 4) +
  circ(276, 272, 9, 4) +
  eyesBlush(v, 256, 190, 32, 14, 44, 18) +
  ell(256, 392, 112, 68, 6) +
  circ(196, 380, 16, 4) +
  circ(310, 402, 13, 4) +
  limb(196, 436, 190, 470, 24) +
  limb(316, 436, 322, 470, 24) +
  line('M 366 380 Q 416 370 412 330', 4) +
  circ(412, 322, 10, 4) +
  accTop(v, 256, 140, 0.9)
)

const fSheep: Recipe = (v) => (
  ell(178, 148, 26, 15, 5, -30) +
  ell(334, 148, 26, 15, 5, 30) +
  scallopBlob(256, 186, 64, 8, 20) +
  ell(256, 196, 36, 44, 5) +
  scallopBlob(256, 340, 116, 11, 24) +
  eyesBlush(v, 256, 182, 16, 9, 22, 10) +
  smile(256, 214, 22, 8) +
  limb(196, 438, 190, 474, 20) +
  limb(316, 438, 322, 474, 20) +
  accTop(v, 256, 102, 0.8)
)

const fHen: Recipe = (v) => (
  ell(360, 250, 20, 58, 5, -38) +
  ell(382, 282, 18, 54, 5, -22) +
  ell(398, 314, 16, 48, 5, -8) +
  ell(258, 322, 98, 86, 6) +
  ell(266, 326, 50, 38, 5, 14) +
  circ(180, 200, 48, 6) +
  accTop(v, 180, 152, 0.8) +
  pathC('M 158 162 C 146 130 176 122 182 146 C 188 120 214 126 206 152 C 220 132 240 148 224 168 Q 192 152 158 162 Z', 4) +
  poly([[136, 198], [94, 208], [136, 220]], 4) +
  ell(178, 252, 12, 17, 4) +
  faceSide(v, 166, 188, 10, 136, 212, 16, 6, 198, 216) +
  limb(226, 404, 220, 462, 14) +
  limb(292, 404, 298, 462, 14) +
  line('M 220 462 L 204 474 M 220 462 L 236 474', 4) +
  line('M 298 462 L 282 474 M 298 462 L 314 474', 4)
)

const fBarn: Recipe = (v) => (
  rct(146, 222, 220, 218, 10, 6) +
  poly([[124, 222], [256, 118], [388, 222]], 6) +
  circ(256, 190, 26, 5) +
  line('M 230 190 L 282 190 M 256 164 L 256 216', 4) +
  rct(214, 318, 84, 122, 8, 5) +
  line('M 214 318 L 298 440 M 298 318 L 214 440', 4) +
  face(v, 256, 276, { dx: 28, er: 12, my: 306, mw: 30, mh: 11 }) +
  accTop(v, 256, 118, 0.9)
)

const fScarecrow: Recipe = (v) => (
  rct(248, 240, 16, 226, 6) +
  rct(148, 258, 216, 15, 7) +
  rct(198, 272, 116, 108, 12, 5) +
  rct(288, 330, 40, 34, 8, 4, 14) +
  line('M 148 258 L 136 244 M 156 256 L 148 238 M 166 258 L 162 240', 4) +
  line('M 364 258 L 376 244 M 356 256 L 364 238 M 346 258 L 350 240', 4) +
  circ(256, 178, 60, 6) +
  line('M 226 132 L 214 108 M 256 124 L 256 98 M 286 132 L 298 108', 4) +
  line('M 240 206 L 272 206', 4) +
  line('M 246 198 L 246 214 M 256 198 L 256 214 M 266 198 L 266 214', 3) +
  eyesBlush(v, 256, 162, 22, 11, 30, 13) +
  rct(198, 352, 116, 18, 6, 4) +
  circ(256, 361, 8, 4) +
  accHead(v, 256, 118)
)

const FARM: RecipeMeta[] = [
  { base: { fa: 'گاوِ {s}', en: '{s} Cow' }, diff: 2, fn: fCow },
  { base: { fa: 'گوسفندِ {s}', en: '{s} Sheep' }, diff: 2, fn: fSheep },
  { base: { fa: 'مرغِ {s}', en: '{s} Hen' }, diff: 2, fn: fHen },
  { base: { fa: 'انبار مزرعه‌ی {s}', en: '{s} Farm Barn' }, diff: 2, fn: fBarn },
  { base: { fa: 'مترسکِ {s}', en: '{s} Scarecrow' }, diff: 2, fn: fScarecrow },
]

// ================================================================ CASTLE
const rTower: Recipe = (v) => (
  accTop(v, 256, 98, 0.85) +
  rct(196, 202, 120, 248, 12, 6) +
  poly([[174, 202], [338, 202], [256, 98]], 6) +
  line('M 256 98 L 256 58', 4) +
  poly([[256, 58], [302, 70], [256, 84]], 4) +
  pathC('M 234 268 L 234 226 Q 256 200 278 226 L 278 268 Q 256 280 234 268 Z', 5) +
  pathC('M 224 450 L 224 402 Q 256 372 288 402 L 288 450 Z', 5) +
  face(v, 256, 312, { dx: 24, er: 11, my: 344, mw: 26, mh: 10 })
)

const rThrone: Recipe = (v) => (
  accTop(v, 256, 118, 0.9) +
  rct(186, 118, 140, 226, 22, 6) +
  heart(256, 108, 28) +
  circ(226, 170, 9, 4) +
  circ(286, 170, 9, 4) +
  circ(256, 210, 9, 4) +
  face(v, 256, 258, { dx: 26, er: 12, my: 292, mw: 28, mh: 10 }) +
  rct(148, 244, 34, 106, 12, 5) +
  rct(330, 244, 34, 106, 12, 5) +
  rct(166, 350, 180, 46, 14, 6) +
  ell(256, 352, 74, 22, 5) +
  rct(180, 396, 30, 62, 10, 5) +
  rct(302, 396, 30, 62, 10, 5)
)

const rShield: Recipe = (v) => (
  pathC('M 256 112 C 306 132 366 132 398 122 C 402 224 388 332 256 420 C 124 332 110 224 114 122 C 146 132 206 132 256 112 Z', 6) +
  line('M 256 130 L 256 400', 4) +
  line('M 140 220 C 180 236 330 236 372 220', 4) +
  star(256, 210, 48) +
  star(180, 300, 18) +
  star(332, 300, 18) +
  accTop(v, 256, 112, 0.85)
)

const rCarriage: Recipe = (v) => (
  limb(140, 330, 82, 358, 14) +
  pathC('M 138 298 C 138 238 190 206 256 206 C 322 206 374 238 374 298 L 374 328 C 374 348 358 358 340 358 L 172 358 C 154 358 138 348 138 328 Z', 6) +
  rct(214, 238, 84, 72, 16, 5) +
  line('M 236 238 L 236 310 M 280 238 L 280 310', 3) +
  accTop(v, 256, 206, 0.85) +
  wheel(188, 392, 54) +
  wheel(324, 392, 54) +
  face(v, 256, 328, { dx: 22, er: 10, my: 352, mw: 24, mh: 8 })
)

const rBanner: Recipe = (v) => (
  accTop(v, 256, 84, 0.8) +
  rct(122, 84, 268, 22, 10, 5) +
  circ(118, 95, 15, 5) +
  circ(394, 95, 15, 5) +
  pathC('M 146 106 L 366 106 L 366 330 L 316 372 L 256 330 L 196 372 L 146 330 Z', 6) +
  poly([[214, 224], [298, 224], [298, 190], [276, 208], [256, 182], [236, 208], [214, 190]], 5) +
  circ(226, 240, 8, 4) +
  circ(286, 240, 8, 4) +
  face(v, 256, 278, { dx: 24, er: 11, my: 310, mw: 26, mh: 10 })
)

const CASTLE: RecipeMeta[] = [
  { base: { fa: 'برج قلعه‌ی {s}', en: '{s} Castle Tower' }, diff: 2, fn: rTower },
  { base: { fa: 'تخت سلطنتیِ {s}', en: '{s} Throne' }, diff: 2, fn: rThrone },
  { base: { fa: 'سپر سلطنتیِ {s}', en: '{s} Royal Shield' }, diff: 2, fn: rShield },
  { base: { fa: 'کالسکه‌ی سلطنتیِ {s}', en: '{s} Royal Carriage' }, diff: 3, fn: rCarriage },
  { base: { fa: 'پرچم سلطنتیِ {s}', en: '{s} Royal Banner' }, diff: 2, fn: rBanner },
]

// ================================================================ wiring
const GEN2_CATS: Array<{ key: string; items: RecipeMeta[] }> = [
  { key: 'birds', items: BIRDS },
  { key: 'sea', items: SEA },
  { key: 'insects', items: INSECTS },
  { key: 'dino', items: DINO },
  { key: 'weather', items: WEATHER },
  { key: 'space', items: SPACE },
  { key: 'sports', items: SPORTS },
  { key: 'music', items: MUSIC },
  { key: 'clothes', items: CLOTHES },
  { key: 'school', items: SCHOOL },
  { key: 'party', items: PARTY },
  { key: 'farm', items: FARM },
  { key: 'castle', items: CASTLE },
]

/** 1300 more generated templates: 13 new categories x 100 (deterministic seeds offset by 100). */
export const GEN2_TEMPLATES: ColoringTemplate[] = GEN2_CATS.flatMap((c, idx) =>
  buildCategory(100 + idx, c.key, c.items),
)
