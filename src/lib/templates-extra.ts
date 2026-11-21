import {
  ColoringTemplate,
  INK,
  svgWrap,
  eye,
  smile,
  happyMouth,
  blush,
  limb,
  cloud,
  star,
} from './template-types'

// ----------------------------------------------------------- local helpers

/** Small heart (colorable). */
const heart = (cx: number, cy: number, s: number): string =>
  `<path d="M ${cx} ${cy + s} ` +
  `C ${(cx - 0.89 * s).toFixed(1)} ${(cy + 0.44 * s).toFixed(1)} ${(cx - s).toFixed(1)} ${(cy - 0.3 * s).toFixed(1)} ${(cx - 0.54 * s).toFixed(1)} ${(cy - 0.55 * s).toFixed(1)} ` +
  `C ${(cx - 0.27 * s).toFixed(1)} ${(cy - 0.71 * s).toFixed(1)} ${(cx - 0.04 * s).toFixed(1)} ${(cy - 0.54 * s).toFixed(1)} ${cx} ${(cy - 0.33 * s).toFixed(1)} ` +
  `C ${(cx + 0.04 * s).toFixed(1)} ${(cy - 0.54 * s).toFixed(1)} ${(cx + 0.27 * s).toFixed(1)} ${(cy - 0.71 * s).toFixed(1)} ${(cx + 0.54 * s).toFixed(1)} ${(cy - 0.55 * s).toFixed(1)} ` +
  `C ${(cx + s).toFixed(1)} ${(cy - 0.3 * s).toFixed(1)} ${(cx + 0.89 * s).toFixed(1)} ${(cy + 0.44 * s).toFixed(1)} ${cx} ${cy + s} Z" ` +
  `fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`

/** Crescent moon (colorable), opening to the right. */
const crescent = (cx: number, cy: number, R: number): string =>
  `<path d="M ${(cx - 0.2 * R).toFixed(1)} ${(cy - R).toFixed(1)} ` +
  `A ${R} ${R} 0 1 0 ${(cx - 0.2 * R).toFixed(1)} ${(cy + R).toFixed(1)} ` +
  `A ${(1.15 * R).toFixed(1)} ${(1.15 * R).toFixed(1)} 0 0 1 ${(cx - 0.2 * R).toFixed(1)} ${(cy - R).toFixed(1)} Z" ` +
  `fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`

/** Teardrop with the point on top (colorable). Raindrops, drips, flames. */
const drop = (x: number, y: number, s = 1): string =>
  `<path d="M ${x} ${y} ` +
  `C ${(x - 12 * s).toFixed(1)} ${(y + 14 * s).toFixed(1)} ${(x - 11 * s).toFixed(1)} ${(y + 30 * s).toFixed(1)} ${x} ${(y + 34 * s).toFixed(1)} ` +
  `C ${(x + 11 * s).toFixed(1)} ${(y + 30 * s).toFixed(1)} ${(x + 12 * s).toFixed(1)} ${(y + 14 * s).toFixed(1)} ${x} ${y} Z" ` +
  `fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`

/** Vehicle wheel: colorable tire + fixed dark hub. */
const wheel = (cx: number, cy: number, r: number): string =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
  `<circle cx="${cx}" cy="${cy}" r="${(r * 0.3).toFixed(1)}" fill="${INK}" stroke="none"/>`

/** Tiny capsule sprinkle (colorable), rotated by a degrees. */
const sprinkle = (cx: number, cy: number, a: number): string =>
  `<rect x="${cx - 11}" y="${cy - 4}" width="22" height="8" rx="4" transform="rotate(${a} ${cx} ${cy})" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`

/** Tulip head: cup with three tips (colorable). */
const tulip = (cx: number, ty: number): string =>
  `<path d="M ${cx - 32} ${ty} ` +
  `C ${cx - 36} ${ty + 36} ${cx - 22} ${ty + 62} ${cx} ${ty + 62} ` +
  `C ${cx + 22} ${ty + 62} ${cx + 36} ${ty + 36} ${cx + 32} ${ty} ` +
  `L ${cx + 15} ${ty + 16} L ${cx} ${ty - 4} L ${cx - 15} ${ty + 16} Z" ` +
  `fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`

// ================================================================== ANIMALS

const dog: ColoringTemplate = {
  id: 'dog',
  fa: 'سگ بامزه',
  en: 'Cute Dog',
  category: 'animals',
  difficulty: 2,
  svg: svgWrap(
    // tail
    `<path d="M 348 430 C 408 420 428 372 414 336 C 408 320 386 324 388 344 C 392 380 380 400 340 408 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // body + paws
    `<ellipse cx="256" cy="398" rx="96" ry="86" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<ellipse cx="210" cy="470" rx="30" ry="16" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="302" cy="470" rx="30" ry="16" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // head
    `<circle cx="256" cy="204" r="110" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // floppy ears
    `<path d="M 196 110 C 140 96 106 160 116 240 C 120 276 158 284 168 250 C 178 214 178 156 200 128 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 316 110 C 372 96 406 160 396 240 C 392 276 354 284 344 250 C 334 214 334 156 312 128 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // eye patch over right eye
    `<circle cx="300" cy="188" r="40" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    eye(212, 188, 17) +
    eye(300, 188, 17) +
    blush(190, 250, 12) +
    blush(326, 250, 12) +
    // nose
    `<path d="M 240 234 Q 256 226 272 234 Q 272 250 256 256 Q 240 250 240 234 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // mouth
    `<path d="M 256 256 L 256 266 M 256 266 Q 244 280 230 272 M 256 266 Q 268 280 282 272" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    // tongue
    happyMouth(256, 278, 40, 18) +
    // collar + tag
    `<path d="M 200 298 Q 256 338 312 298 L 312 320 Q 256 360 200 320 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<circle cx="256" cy="350" r="13" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>`
  ),
}

const rabbit: ColoringTemplate = {
  id: 'rabbit',
  fa: 'خرگوش مهربون',
  en: 'Sweet Rabbit',
  category: 'animals',
  difficulty: 2,
  svg: svgWrap(
    // fluffy tail
    `<circle cx="352" cy="444" r="24" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // long ears
    `<path d="M 196 176 C 160 96 176 28 208 28 C 238 28 244 96 232 172 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 316 176 C 352 96 336 28 304 28 C 274 28 268 96 280 172 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // inner ears
    `<path d="M 204 160 C 180 100 190 48 208 48 C 224 48 228 100 218 156 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 308 160 C 332 100 322 48 304 48 C 288 48 284 100 294 156 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // body + feet
    `<ellipse cx="256" cy="398" rx="76" ry="74" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<ellipse cx="204" cy="464" rx="30" ry="17" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="308" cy="464" rx="30" ry="17" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // head
    `<circle cx="256" cy="226" r="100" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    eye(216, 208, 16) +
    eye(296, 208, 16) +
    blush(184, 252, 12) +
    blush(328, 252, 12) +
    // nose
    `<path d="M 244 248 Q 256 240 268 248 Q 268 260 256 266 Q 244 260 244 248 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 256 266 L 256 272" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    // buck teeth
    `<rect x="241" y="272" width="14" height="24" rx="5" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="257" y="272" width="14" height="24" rx="5" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>`
  ),
}

const fish: ColoringTemplate = {
  id: 'fish',
  fa: 'ماهی نارنجی',
  en: 'Little Fish',
  category: 'animals',
  difficulty: 1,
  svg: svgWrap(
    // bubbles
    `<circle cx="98" cy="160" r="12" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="76" cy="118" r="9" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="112" cy="84" r="7" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // tail fin
    `<path d="M 350 268 C 396 236 430 214 464 204 C 446 244 446 292 464 332 C 430 322 396 300 350 268 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // dorsal fin
    `<path d="M 196 200 C 206 148 248 132 278 146 C 266 168 262 186 262 200 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // ventral fin
    `<path d="M 226 344 C 234 384 258 400 284 396 C 274 378 272 362 272 346 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // body
    `<ellipse cx="236" cy="268" rx="130" ry="88" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // gill + scales (stroke only)
    `<path d="M 200 218 Q 176 268 200 320" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M 282 238 Q 298 254 282 270 M 314 238 Q 330 254 314 270 M 298 278 Q 314 294 298 310" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    eye(168, 246, 17) +
    smile(136, 290, 28, 12) +
    // side fin
    `<path d="M 232 280 C 262 272 288 284 296 306 C 274 314 248 310 232 292 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`
  ),
}

const butterfly: ColoringTemplate = {
  id: 'butterfly',
  fa: 'پروانه‌ی زیبا',
  en: 'Beautiful Butterfly',
  category: 'animals',
  difficulty: 2,
  svg: svgWrap(
    // upper wings
    `<path d="M 240 254 C 176 176 88 178 66 246 C 48 302 122 344 238 296 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 272 254 C 336 176 424 178 446 246 C 464 302 390 344 274 296 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // lower wings
    `<path d="M 240 316 C 168 330 108 372 118 428 C 126 470 196 460 240 384 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 272 316 C 344 330 404 372 394 428 C 386 470 316 460 272 384 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // inner spots
    `<circle cx="140" cy="258" r="26" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="372" cy="258" r="26" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="180" cy="402" r="18" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="332" cy="402" r="18" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // segmented body
    `<ellipse cx="256" cy="322" rx="22" ry="78" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<path d="M 236 296 Q 256 304 276 296 M 236 340 Q 256 348 276 340" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    // head + face
    `<circle cx="256" cy="214" r="28" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    eye(244, 210, 9) +
    eye(268, 210, 9) +
    smile(256, 228, 18, 8) +
    // antennae + balls
    `<path d="M 242 192 C 226 150 202 132 180 130 M 270 192 C 286 150 310 132 332 130" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    `<circle cx="176" cy="128" r="9" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="336" cy="128" r="9" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>`
  ),
}

const bird: ColoringTemplate = {
  id: 'bird',
  fa: 'جوجه‌ی کوچولو',
  en: 'Little Chick',
  category: 'animals',
  difficulty: 1,
  svg: svgWrap(
    // tail feathers
    `<path d="M 352 292 C 406 272 440 286 442 310 C 430 312 420 316 414 322 C 426 328 434 338 436 350 C 404 352 366 340 352 326 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // floating hearts
    heart(120, 130, 26) +
    heart(196, 84, 20) +
    heart(390, 120, 22) +
    // round body
    `<circle cx="256" cy="300" r="120" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // head feathers
    `<path d="M 244 182 Q 240 156 226 148 M 256 180 Q 256 150 256 142 M 268 182 Q 272 156 286 148" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    // wing
    `<path d="M 160 310 C 118 330 116 382 152 400 C 188 416 226 390 232 350 C 208 338 180 326 160 310 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    eye(216, 258, 16) +
    eye(296, 258, 16) +
    blush(188, 296, 12) +
    blush(324, 296, 12) +
    // beak
    `<path d="M 234 286 L 278 286 L 256 314 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // feet
    `<path d="M 224 416 L 224 462 M 224 462 L 206 478 M 224 462 L 224 480 M 224 462 L 242 478 M 288 416 L 288 462 M 288 462 L 270 478 M 288 462 L 288 480 M 288 462 L 306 478" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
  ),
}

const turtle: ColoringTemplate = {
  id: 'turtle',
  fa: 'لاک‌پرتوی خنده‌رو',
  en: 'Funny Turtle',
  category: 'animals',
  difficulty: 3,
  svg: svgWrap(
    // four feet
    `<ellipse cx="140" cy="430" rx="26" ry="22" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="208" cy="432" rx="26" ry="22" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="302" cy="432" rx="26" ry="22" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="372" cy="430" rx="26" ry="22" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // head (peeks out from under the shell)
    `<circle cx="80" cy="324" r="42" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // shell dome
    `<path d="M 108 390 C 108 276 190 208 268 208 C 350 208 416 282 416 390 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // hexagon plates
    `<path d="M 262 218 L 288 232 L 288 260 L 262 274 L 236 260 L 236 232 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 172 298 L 206 318 L 206 358 L 172 378 L 138 358 L 138 318 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 352 298 L 386 318 L 386 358 L 352 378 L 318 358 L 318 318 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 262 270 L 302 292 L 302 336 L 262 358 L 222 336 L 222 292 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // rim band
    `<rect x="84" y="382" width="356" height="26" rx="13" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // tail
    `<path d="M 430 384 C 456 380 470 392 472 402 C 458 412 442 412 430 406 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    eye(66, 314, 11) +
    eye(94, 314, 11) +
    smile(80, 340, 26, 10) +
    blush(52, 340, 8)
  ),
}

const bear: ColoringTemplate = {
  id: 'bear',
  fa: 'خرس مهربون',
  en: 'Gentle Bear',
  category: 'animals',
  difficulty: 2,
  svg: svgWrap(
    // ears + inner ears
    `<circle cx="168" cy="126" r="40" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="344" cy="126" r="40" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="168" cy="126" r="20" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="344" cy="126" r="20" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // body + belly patch
    `<ellipse cx="256" cy="392" rx="88" ry="80" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<ellipse cx="256" cy="412" rx="50" ry="46" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // arms
    limb(180, 350, 138, 386, 22) +
    limb(332, 350, 374, 386, 22) +
    // head
    `<circle cx="256" cy="210" r="102" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // muzzle + nose + mouth
    `<ellipse cx="256" cy="252" rx="48" ry="36" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M 240 230 Q 256 220 272 230 Q 272 246 256 252 Q 240 246 240 230 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 256 252 L 256 262 M 256 262 Q 244 276 230 268 M 256 262 Q 268 276 282 268" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    eye(212, 194, 16) +
    eye(300, 194, 16) +
    blush(176, 240, 11) +
    blush(336, 240, 11)
  ),
}

const elephant: ColoringTemplate = {
  id: 'elephant',
  fa: 'فیل کوچولو',
  en: 'Baby Elephant',
  category: 'animals',
  difficulty: 2,
  svg: svgWrap(
    // body + feet
    `<ellipse cx="256" cy="408" rx="82" ry="74" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<ellipse cx="212" cy="470" rx="30" ry="17" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="300" cy="470" rx="30" ry="17" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // curled trunk
    `<path d="M 222 296 C 216 346 220 388 238 412 C 254 432 284 436 298 418 C 308 404 306 384 294 378 C 300 368 298 354 288 350 C 278 346 270 354 274 364 C 276 372 268 378 260 372 C 248 360 244 326 264 296 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // head
    `<circle cx="256" cy="226" r="108" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // big ears + inner ears
    `<ellipse cx="132" cy="218" rx="60" ry="82" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="380" cy="218" rx="60" ry="82" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="134" cy="218" rx="36" ry="58" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="378" cy="218" rx="36" ry="58" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    eye(214, 218, 15) +
    eye(298, 218, 15) +
    blush(198, 268, 11) +
    blush(314, 268, 11)
  ),
}

// ================================================================= VEHICLES

const raceCar: ColoringTemplate = {
  id: 'race-car',
  fa: 'ماشین مسابقه',
  en: 'Race Car',
  category: 'vehicles',
  difficulty: 2,
  svg: svgWrap(
    // body
    `<path d="M 56 376 C 56 342 82 322 124 314 L 196 302 C 228 266 272 254 314 260 L 348 270 C 378 280 400 298 412 318 L 448 332 C 462 338 464 354 458 366 C 454 374 444 376 432 376 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // racing stripe
    `<rect x="66" y="348" width="380" height="22" rx="11" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // window
    `<path d="M 234 298 C 254 274 286 268 310 276 C 320 282 326 290 330 298 C 300 306 262 306 234 298 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // spoiler
    `<rect x="88" y="286" width="14" height="44" rx="5" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="44" y="268" width="104" height="18" rx="9" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // wheels
    wheel(150, 384, 50) +
    wheel(372, 384, 50) +
    // headlight
    `<ellipse cx="446" cy="344" rx="11" ry="9" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>`
  ),
}

const policeCar: ColoringTemplate = {
  id: 'police-car',
  fa: 'ماشین پلیس',
  en: 'Police Car',
  category: 'vehicles',
  difficulty: 2,
  svg: svgWrap(
    // lower body + cabin
    `<rect x="48" y="330" width="416" height="52" rx="20" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<path d="M 150 332 L 190 282 C 196 274 206 268 218 268 L 306 268 C 320 268 330 276 336 286 L 366 332 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // side stripe
    `<rect x="60" y="346" width="392" height="18" rx="9" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // windows
    `<path d="M 200 324 L 232 280 C 236 275 242 272 250 272 L 262 272 L 262 324 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 274 272 L 302 272 C 312 272 320 278 326 288 L 344 324 L 274 324 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // roof light bar + lights
    `<rect x="216" y="244" width="96" height="24" rx="10" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="224" y="250" width="36" height="14" rx="7" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="268" y="250" width="36" height="14" rx="7" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // wheels + headlight
    wheel(140, 388, 46) +
    wheel(372, 388, 46) +
    `<ellipse cx="450" cy="358" rx="10" ry="8" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>`
  ),
}

const fireTruck: ColoringTemplate = {
  id: 'fire-truck',
  fa: 'ماشین آتش‌نشانی',
  en: 'Fire Truck',
  category: 'vehicles',
  difficulty: 3,
  svg: svgWrap(
    // rear body + cab
    `<rect x="48" y="300" width="280" height="84" rx="16" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<path d="M 328 384 L 328 300 C 328 286 338 276 352 276 L 396 276 C 408 276 418 282 424 292 L 452 336 C 458 346 460 356 460 366 L 460 374 C 460 380 456 384 450 384 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // side stripe
    `<rect x="60" y="330" width="256" height="16" rx="8" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // ladder posts + ladder with rungs
    `<rect x="84" y="292" width="14" height="14" rx="4" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="280" y="292" width="14" height="14" rx="4" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="56" y="258" width="268" height="36" rx="8" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<path d="M 92 258 L 92 294 M 128 258 L 128 294 M 164 258 L 164 294 M 200 258 L 200 294 M 236 258 L 236 294 M 272 258 L 272 294" fill="none" stroke="${INK}" stroke-width="4"/>` +
    // cab window
    `<path d="M 360 322 L 360 294 C 360 288 364 284 370 284 L 390 284 C 397 284 402 288 406 294 L 420 322 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // siren light
    `<path d="M 356 276 C 356 258 392 258 392 276 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<circle cx="374" cy="270" r="4" fill="${INK}" stroke="none"/>` +
    // coiled hose
    `<path d="M 88 368 C 88 346 122 346 122 366 C 122 382 96 382 96 362" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    // wheels + light + bumper
    wheel(128, 396, 44) +
    wheel(384, 396, 44) +
    `<ellipse cx="446" cy="350" rx="9" ry="8" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="444" y="366" width="24" height="16" rx="6" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>`
  ),
}

const airplane: ColoringTemplate = {
  id: 'airplane',
  fa: 'هواپیما',
  en: 'Airplane',
  category: 'vehicles',
  difficulty: 2,
  svg: svgWrap(
    // clouds
    cloud(110, 118, 0.8) +
    cloud(420, 150, 0.7) +
    // propeller blades
    `<ellipse cx="458" cy="244" rx="8" ry="28" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="458" cy="324" rx="8" ry="28" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // tail fin + tail wing
    `<path d="M 118 264 C 108 230 118 204 146 196 C 158 216 164 242 162 266 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 100 296 C 82 300 66 312 60 326 C 78 332 98 328 110 318 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // main wing (behind fuselage)
    `<path d="M 236 296 C 210 336 202 366 208 392 C 242 396 276 388 296 368 C 282 344 268 322 260 296 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // fuselage
    `<path d="M 96 268 C 150 240 330 236 420 262 C 444 270 452 282 448 294 C 440 316 380 330 300 332 C 220 334 140 322 104 300 C 88 290 86 276 96 268 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // spinner
    `<circle cx="458" cy="284" r="13" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // windows + cockpit
    `<circle cx="200" cy="284" r="14" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="252" cy="280" r="14" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="304" cy="278" r="14" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="392" cy="272" rx="22" ry="15" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>`
  ),
}

const helicopter: ColoringTemplate = {
  id: 'helicopter',
  fa: 'هلیکوپتر',
  en: 'Helicopter',
  category: 'vehicles',
  difficulty: 2,
  svg: svgWrap(
    // clouds
    cloud(88, 96, 0.6) +
    cloud(396, 128, 0.75) +
    // tail rotor
    `<ellipse cx="38" cy="260" rx="8" ry="28" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="38" cy="332" rx="8" ry="28" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="38" cy="296" r="9" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // tail boom
    `<path d="M 130 272 C 90 274 56 280 40 290 L 40 302 C 60 306 96 310 130 310 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // body + cockpit window
    `<ellipse cx="232" cy="288" rx="118" ry="92" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<circle cx="296" cy="270" r="40" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // mast + main rotor
    `<rect x="224" y="172" width="16" height="30" rx="6" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="60" y="148" width="392" height="16" rx="8" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<circle cx="232" cy="156" r="8" fill="${INK}" stroke="none"/>` +
    // skids
    `<rect x="170" y="376" width="12" height="52" rx="5" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="310" y="376" width="12" height="52" rx="5" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="124" y="422" width="252" height="12" rx="6" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>`
  ),
}

const train: ColoringTemplate = {
  id: 'train',
  fa: 'قطار شادی',
  en: 'Happy Train',
  category: 'vehicles',
  difficulty: 3,
  svg: svgWrap(
    // smoke puffs
    cloud(356, 206, 0.55) +
    cloud(298, 148, 0.7) +
    cloud(370, 90, 0.85) +
    // coupling
    `<rect x="190" y="378" width="18" height="24" rx="6" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // chimney
    `<path d="M 366 322 L 358 272 C 357 264 362 258 370 258 L 386 258 C 394 258 399 264 398 272 L 390 322 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // wagon + cab + boiler
    `<rect x="56" y="320" width="140" height="100" rx="12" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<rect x="204" y="264" width="120" height="156" rx="14" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<rect x="324" y="316" width="108" height="104" rx="16" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // cab window
    `<rect x="232" y="292" width="64" height="56" rx="10" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // wheels
    wheel(94, 428, 30) +
    wheel(158, 428, 30) +
    wheel(252, 428, 32) +
    wheel(396, 428, 32) +
    // rail
    `<path d="M 44 464 L 468 464" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
  ),
}

const boat: ColoringTemplate = {
  id: 'boat',
  fa: 'کشتی بامزه',
  en: 'Happy Boat',
  category: 'vehicles',
  difficulty: 1,
  svg: svgWrap(
    // sun
    `<circle cx="416" cy="96" r="40" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<path d="M 464 96 L 482 96 M 368 96 L 350 96 M 416 48 L 416 30 M 416 144 L 416 162 M 450 62 L 463 49 M 382 62 L 369 49 M 450 130 L 463 143 M 382 130 L 369 143" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    // back wave
    `<path d="M 40 430 Q 70 414 100 430 T 160 430 T 220 430 T 280 430 T 340 430 T 400 430 T 460 430" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    // mast + sails
    `<path d="M 256 356 L 256 112" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` +
    `<path d="M 266 150 C 336 186 372 252 376 338 L 266 338 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 246 182 C 198 212 174 262 170 322 L 246 322 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // flag + top ball
    `<path d="M 258 108 L 304 120 L 258 132 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<circle cx="256" cy="106" r="8" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // cabin + porthole
    `<rect x="180" y="322" width="88" height="36" rx="8" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="224" cy="340" r="9" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // hull
    `<path d="M 116 356 L 396 356 L 356 424 C 350 432 342 436 330 436 L 182 436 C 170 436 162 432 156 424 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // front wave
    `<path d="M 64 462 Q 94 446 124 462 T 184 462 T 244 462 T 304 462 T 364 462 T 424 462" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
  ),
}

const rocket: ColoringTemplate = {
  id: 'rocket',
  fa: 'موشک فضایی',
  en: 'Space Rocket',
  category: 'vehicles',
  difficulty: 1,
  svg: svgWrap(
    // stars
    star(118, 106, 26) +
    star(402, 128, 20) +
    star(88, 282, 15) +
    // nose cone (behind body)
    `<path d="M 256 44 C 228 72 210 110 204 158 C 236 146 276 146 308 158 C 302 110 284 72 256 44 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // fins (behind body)
    `<path d="M 202 290 C 172 312 154 348 152 390 L 200 366 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 310 290 C 340 312 358 348 360 390 L 312 366 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // body
    `<rect x="200" y="150" width="112" height="206" rx="26" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // window ring + glass
    `<circle cx="256" cy="226" r="34" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<circle cx="256" cy="226" r="22" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // flames
    `<path d="M 218 352 C 210 392 226 426 256 448 C 286 426 302 392 294 352 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 236 354 C 232 386 240 408 256 422 C 272 408 280 386 276 354 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`
  ),
}

// ==================================================================== MAGIC

const unicorn: ColoringTemplate = {
  id: 'unicorn',
  fa: 'تک‌شاخ جادویی',
  en: 'Magic Unicorn',
  category: 'magic',
  difficulty: 3,
  svg: svgWrap(
    // tail
    `<path d="M 400 296 C 444 292 470 318 472 356 C 473 394 452 424 418 432 C 428 404 430 372 418 344 C 412 326 406 310 400 296 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // legs
    limb(226, 396, 214, 458, 26) +
    limb(280, 400, 276, 460, 26) +
    limb(330, 400, 326, 460, 26) +
    limb(378, 392, 388, 456, 26) +
    // neck + body
    limb(238, 296, 202, 214, 62) +
    `<ellipse cx="300" cy="340" rx="110" ry="82" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // horn + stripes
    `<path d="M 150 110 L 206 24 L 198 102 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 170 80 L 201 75 M 186 54 L 203 51" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    // ear
    `<path d="M 210 132 L 236 84 L 240 142 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // head
    `<circle cx="170" cy="180" r="80" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // mane sections
    `<circle cx="248" cy="170" r="28" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="272" cy="214" r="30" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="290" cy="260" r="30" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // muzzle + face
    `<ellipse cx="120" cy="224" rx="42" ry="32" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="102" cy="226" r="4.5" fill="${INK}" stroke="none"/>` +
    smile(116, 244, 24, 8) +
    eye(150, 172, 20) +
    blush(204, 228, 12)
  ),
}

const castle: ColoringTemplate = {
  id: 'castle',
  fa: 'قلعه‌ی جادویی',
  en: 'Magic Castle',
  category: 'magic',
  difficulty: 3,
  svg: svgWrap(
    // clouds
    cloud(110, 140, 0.8) +
    cloud(402, 128, 0.75) +
    // flag poles
    `<path d="M 132 190 L 132 158 M 256 108 L 256 74 M 380 190 L 380 158" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    // flags
    `<path d="M 132 158 L 168 170 L 132 182 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 256 74 L 296 87 L 256 100 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 380 158 L 416 170 L 380 182 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // cone roofs
    `<path d="M 84 262 L 132 190 L 180 262 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 200 192 L 256 108 L 312 192 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 332 262 L 380 190 L 428 262 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // towers
    `<rect x="96" y="260" width="72" height="160" rx="6" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<rect x="212" y="190" width="88" height="230" rx="6" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<rect x="344" y="260" width="72" height="160" rx="6" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // windows
    `<circle cx="132" cy="300" r="16" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="256" cy="240" r="18" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="380" cy="300" r="16" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // front wall + gate
    `<rect x="140" y="348" width="232" height="72" rx="8" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<path d="M 224 420 L 224 376 C 224 358 238 348 256 348 C 274 348 288 358 288 376 L 288 420 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // ground
    `<path d="M 72 424 L 440 424" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
  ),
}

const wizardHat: ColoringTemplate = {
  id: 'wizard-hat',
  fa: 'کلاه جادویی',
  en: 'Wizard Hat',
  category: 'magic',
  difficulty: 1,
  svg: svgWrap(
    // stars beside
    star(96, 180, 16) +
    star(420, 210, 20) +
    // cone + brim
    `<path d="M 256 42 C 238 100 214 180 198 258 L 314 258 C 298 180 274 100 256 42 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<ellipse cx="256" cy="262" rx="132" ry="30" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // band + buckle
    `<path d="M 208 218 L 304 218 L 311 244 L 201 244 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<rect x="240" y="222" width="30" height="20" rx="4" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="249" y="229" width="12" height="7" fill="${INK}" stroke="none"/>` +
    // moon + stars on the cone
    crescent(260, 104, 17) +
    star(244, 154, 14) +
    star(278, 198, 12)
  ),
}

const dragon: ColoringTemplate = {
  id: 'dragon',
  fa: 'اژدهای مهربون',
  en: 'Friendly Dragon',
  category: 'magic',
  difficulty: 3,
  svg: svgWrap(
    // spiky tail
    `<path d="M 370 380 C 428 376 462 348 470 310 L 454 324 L 450 298 L 434 314 L 428 290 L 410 308 C 396 314 380 318 368 312 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // small wings
    `<path d="M 226 272 C 190 224 152 210 124 222 C 134 246 138 268 132 290 C 162 284 196 282 226 292 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 330 268 C 356 224 390 206 418 214 C 410 238 408 262 414 286 C 384 280 354 280 330 292 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 148 232 C 158 250 162 268 158 282 M 396 230 C 388 248 384 264 388 280" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    // body + belly
    `<ellipse cx="280" cy="350" rx="108" ry="88" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<ellipse cx="276" cy="372" rx="64" ry="56" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // horns
    `<path d="M 136 118 L 116 70 L 152 110 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 184 112 L 210 66 L 202 124 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // head + snout
    `<circle cx="168" cy="190" r="82" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<ellipse cx="120" cy="232" rx="44" ry="32" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    eye(146, 168, 17) +
    eye(212, 162, 17) +
    blush(208, 226, 11) +
    `<circle cx="100" cy="226" r="4" fill="${INK}" stroke="none"/>` +
    `<circle cx="122" cy="222" r="4" fill="${INK}" stroke="none"/>` +
    smile(112, 250, 30, 10) +
    // feet
    `<ellipse cx="196" cy="432" rx="34" ry="22" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="280" cy="436" rx="34" ry="22" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>`
  ),
}

const mushroomHouse: ColoringTemplate = {
  id: 'mushroom-house',
  fa: 'خانه‌ی قارچی',
  en: 'Mushroom House',
  category: 'magic',
  difficulty: 2,
  svg: svgWrap(
    // smoke + chimney
    cloud(350, 70, 0.4) +
    `<rect x="326" y="96" width="28" height="60" rx="6" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // grass bushes
    `<ellipse cx="150" cy="452" rx="46" ry="22" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="362" cy="452" rx="46" ry="22" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // stem house
    `<path d="M 196 300 C 188 360 184 408 192 444 C 194 458 206 464 224 464 L 288 464 C 306 464 318 458 320 444 C 328 408 324 360 316 300 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // spotted cap
    `<path d="M 96 298 C 100 192 170 118 256 118 C 342 118 412 192 416 298 C 376 312 336 318 256 318 C 176 318 136 312 96 298 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // spots
    `<circle cx="170" cy="210" r="24" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="300" cy="180" r="20" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="350" cy="258" r="17" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="208" cy="268" r="14" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // round window
    `<circle cx="256" cy="340" r="20" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M 236 340 L 276 340 M 256 320 L 256 360" fill="none" stroke="${INK}" stroke-width="4"/>` +
    // door + knob
    `<path d="M 226 464 L 226 396 C 226 376 240 364 256 364 C 272 364 286 376 286 396 L 286 464 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<circle cx="274" cy="424" r="5" fill="${INK}" stroke="none"/>`
  ),
}

const crown: ColoringTemplate = {
  id: 'crown',
  fa: 'تاج شاهانه',
  en: 'Royal Crown',
  category: 'magic',
  difficulty: 1,
  svg: svgWrap(
    // stars beside
    star(84, 140, 20) +
    star(428, 132, 22) +
    // crown with three peaks
    `<path d="M 116 330 L 116 216 L 186 268 L 256 188 L 326 268 L 396 216 L 396 330 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // peak jewels
    `<circle cx="116" cy="206" r="16" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="256" cy="178" r="18" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="396" cy="206" r="16" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // band + jewels
    `<rect x="108" y="296" width="296" height="44" rx="10" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<circle cx="176" cy="318" r="10" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="256" cy="318" r="12" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="336" cy="318" r="10" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>`
  ),
}

const snowman: ColoringTemplate = {
  id: 'snowman',
  fa: 'آدم‌برفی بامزه',
  en: 'Funny Snowman',
  category: 'magic',
  difficulty: 1,
  svg: svgWrap(
    // twig arms
    `<path d="M 168 302 L 92 258 M 120 276 L 104 252 M 130 282 L 148 260 M 344 302 L 420 258 M 392 276 L 408 252 M 382 282 L 364 260" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    // body balls
    `<circle cx="256" cy="362" r="100" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<circle cx="256" cy="192" r="78" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // hat: crown, band, brim
    `<rect x="216" y="62" width="80" height="62" rx="8" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<rect x="216" y="98" width="80" height="16" rx="4" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="196" y="118" width="120" height="14" rx="7" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // face
    eye(226, 166, 13) +
    eye(282, 166, 13) +
    `<path d="M 250 188 L 298 198 L 250 208 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 224 224 L 224 231 M 238 232 L 238 239 M 254 236 L 254 243 M 270 232 L 270 239 M 284 224 L 284 231" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` +
    // scarf + tail
    `<path d="M 192 254 Q 256 284 320 254 L 320 280 Q 256 310 192 280 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 290 294 L 316 286 L 330 342 L 304 350 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // coal buttons
    `<circle cx="256" cy="322" r="7" fill="${INK}" stroke="none"/>` +
    `<circle cx="256" cy="358" r="7" fill="${INK}" stroke="none"/>` +
    `<circle cx="256" cy="394" r="7" fill="${INK}" stroke="none"/>`
  ),
}

const moonFairy: ColoringTemplate = {
  id: 'moon-fairy',
  fa: 'پری مهتابی',
  en: 'Moon Fairy',
  category: 'magic',
  difficulty: 2,
  svg: svgWrap(
    // crescent moon + sleepy face
    crescent(190, 290, 115) +
    `<path d="M 82 214 Q 94 226 106 214 M 74 292 Q 86 304 98 292 M 74 252 Q 88 268 102 252" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    // stars
    star(240, 112, 16) +
    star(330, 210, 14) +
    star(398, 300, 12) +
    // wings
    `<path d="M 158 118 C 128 92 96 94 84 118 C 104 122 120 138 128 158 C 140 146 150 132 158 118 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 204 118 C 234 92 266 94 278 118 C 258 122 242 138 234 158 C 222 146 212 132 204 118 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // dress + legs + arms
    `<path d="M 164 132 L 200 132 L 214 178 Q 182 196 150 178 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    limb(160, 186, 148, 240, 14) +
    limb(182, 188, 178, 244, 14) +
    limb(162, 148, 130, 172, 12) +
    limb(198, 146, 228, 126, 12) +
    // head
    `<circle cx="182" cy="108" r="26" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    eye(174, 104, 8) +
    eye(192, 104, 8) +
    smile(183, 118, 16, 7) +
    blush(162, 114, 7) +
    blush(204, 114, 7)
  ),
}

// =================================================================== NATURE

const tree: ColoringTemplate = {
  id: 'tree',
  fa: 'درخت سیب',
  en: 'Apple Tree',
  category: 'nature',
  difficulty: 1,
  svg: svgWrap(
    // trunk
    `<path d="M 224 470 C 232 410 230 350 222 300 L 290 300 C 282 350 280 410 288 470 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 244 340 C 240 380 242 420 240 452 M 268 330 C 272 370 270 410 272 448" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    // one fluffy crown
    `<path d="M 120 310 C 76 302 72 250 112 234 C 100 192 134 160 174 170 C 178 124 234 106 268 132 C 306 108 352 128 356 168 C 398 162 424 198 408 234 C 444 252 436 300 394 310 C 320 326 190 326 120 310 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // apples
    `<circle cx="180" cy="240" r="22" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="280" cy="200" r="22" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="350" cy="262" r="20" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // fallen apple
    `<circle cx="140" cy="452" r="16" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // grass
    `<path d="M 96 470 L 416 470 M 130 470 C 128 456 134 446 142 442 M 380 470 C 382 456 376 446 368 442" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
  ),
}

const flowerPetals = (() => {
  let s = ''
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI / 6) * i
    const cx = 256 + 94 * Math.cos(a)
    const cy = 200 + 94 * Math.sin(a)
    const deg = ((a * 180) / Math.PI - 90).toFixed(1)
    s += `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="18" ry="50" transform="rotate(${deg} ${cx.toFixed(1)} ${cy.toFixed(1)})" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>`
  }
  return s
})()

const flower: ColoringTemplate = {
  id: 'flower',
  fa: 'گل آفتابگردون',
  en: 'Sunflower',
  category: 'nature',
  difficulty: 3,
  svg: svgWrap(
    // stem + leaves
    `<path d="M 247 254 C 245 320 249 380 243 450 L 269 450 C 263 380 267 320 265 254 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 246 362 C 208 344 166 350 146 376 C 170 398 214 396 246 378 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 266 396 C 304 378 346 384 366 410 C 342 432 298 430 266 412 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 156 374 Q 200 370 242 372 M 356 408 Q 312 404 270 406" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    // petals
    flowerPetals +
    // center + seeds
    `<circle cx="256" cy="200" r="58" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<circle cx="236" cy="184" r="4.5" fill="${INK}" stroke="none"/>` +
    `<circle cx="276" cy="184" r="4.5" fill="${INK}" stroke="none"/>` +
    `<circle cx="256" cy="216" r="4.5" fill="${INK}" stroke="none"/>` +
    `<circle cx="222" cy="210" r="4.5" fill="${INK}" stroke="none"/>` +
    `<circle cx="290" cy="210" r="4.5" fill="${INK}" stroke="none"/>` +
    `<circle cx="256" cy="172" r="4.5" fill="${INK}" stroke="none"/>` +
    // ground
    `<path d="M 120 452 L 392 452" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
  ),
}

const rainCloud: ColoringTemplate = {
  id: 'rain-cloud',
  fa: 'ابر بارونی',
  en: 'Rainy Cloud',
  category: 'nature',
  difficulty: 1,
  svg: svgWrap(
    // big cloud
    cloud(320, 230, 2.6) +
    // raindrops
    drop(150, 316) +
    drop(235, 330) +
    drop(320, 316) +
    drop(190, 392) +
    drop(275, 400) +
    drop(358, 386) +
    // puddle
    `<ellipse cx="256" cy="464" rx="110" ry="20" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>`
  ),
}

const mountain: ColoringTemplate = {
  id: 'mountain',
  fa: 'کوه و آفتاب',
  en: 'Mountain and Sun',
  category: 'nature',
  difficulty: 1,
  svg: svgWrap(
    // sun + rays
    `<circle cx="420" cy="92" r="40" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<path d="M 420 44 L 420 28 M 468 92 L 486 92 M 420 140 L 420 156 M 372 92 L 354 92 M 448 64 L 461 51 M 392 64 L 379 51 M 448 120 L 461 133 M 392 120 L 379 133" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    // clouds
    cloud(110, 120, 0.7) +
    cloud(300, 84, 0.55) +
    // back mountain + snow cap
    `<path d="M 60 420 L 210 170 L 360 420 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 168 246 L 210 170 L 252 246 C 240 232 228 250 210 238 C 192 250 180 232 168 246 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // front mountain + snow cap
    `<path d="M 220 424 L 350 240 L 480 424 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 318 296 L 350 240 L 382 296 C 370 286 360 300 350 290 C 340 300 330 286 318 296 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // ground
    `<path d="M 44 428 L 468 428" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
  ),
}

const beach: ColoringTemplate = {
  id: 'beach',
  fa: 'ساحل دریا',
  en: 'Sunny Beach',
  category: 'nature',
  difficulty: 2,
  svg: svgWrap(
    // sun + rays
    `<circle cx="96" cy="96" r="40" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<path d="M 96 48 L 96 30 M 48 96 L 30 96 M 96 144 L 96 162 M 144 96 L 162 96 M 124 68 L 137 55 M 68 68 L 55 55 M 124 124 L 137 137 M 68 124 L 55 137" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    // sea band
    `<path d="M 36 360 Q 66 344 96 360 T 156 360 T 216 360 T 276 360 T 336 360 T 396 360 T 456 360 L 456 432 L 36 432 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 250 404 Q 280 392 310 404 T 370 404" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    // island + palm trunk
    `<ellipse cx="322" cy="376" rx="84" ry="26" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M 306 372 C 298 330 300 290 318 254 L 338 262 C 322 296 322 332 330 370 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // fronds
    `<path d="M 328 256 C 300 222 260 212 226 226 C 250 244 278 258 300 268 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 330 254 C 356 220 394 210 428 222 C 406 242 378 256 354 266 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 326 260 C 292 258 260 274 244 300 C 270 300 298 290 318 276 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 332 258 C 366 258 396 276 410 302 C 384 300 358 288 340 274 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // coconuts
    `<circle cx="322" cy="268" r="7" fill="${INK}" stroke="none"/>` +
    `<circle cx="338" cy="272" r="7" fill="${INK}" stroke="none"/>` +
    // beach ball
    `<circle cx="150" cy="452" r="38" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<path d="M 136 418 C 118 438 118 466 136 486 M 164 418 C 182 438 182 466 164 486" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    `<circle cx="150" cy="452" r="6" fill="${INK}" stroke="none"/>`
  ),
}

const tulipGarden: ColoringTemplate = {
  id: 'tulip-garden',
  fa: 'گل‌های بهاری',
  en: 'Spring Tulips',
  category: 'nature',
  difficulty: 2,
  svg: svgWrap(
    // butterfly
    `<ellipse cx="316" cy="110" rx="17" ry="12" transform="rotate(-28 316 110)" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="352" cy="104" rx="17" ry="12" transform="rotate(28 352 104)" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="322" cy="132" rx="13" ry="10" transform="rotate(20 322 132)" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="346" cy="130" rx="13" ry="10" transform="rotate(-20 346 130)" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<ellipse cx="334" cy="120" rx="5" ry="18" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M 330 104 Q 322 92 314 88 M 338 104 Q 346 92 354 88" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    // stems
    `<path d="M 133 270 L 147 270 L 143 440 L 135 440 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 249 218 L 263 218 L 259 446 L 251 446 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 365 276 L 379 276 L 375 440 L 367 440 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // leaves
    `<path d="M 136 366 C 106 348 88 310 94 274 C 120 292 138 326 142 364 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 146 400 C 176 384 192 350 188 316 C 162 332 146 364 142 398 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 250 330 C 220 312 204 276 210 242 C 236 260 252 294 256 328 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 378 372 C 408 354 424 318 418 284 C 392 302 376 334 372 370 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // tulip heads
    tulip(140, 210) +
    tulip(256, 158) +
    tulip(372, 216) +
    // ground + grass
    `<path d="M 84 452 L 428 452 M 110 452 C 108 438 114 428 122 424 M 400 452 C 402 438 396 428 388 424" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
  ),
}

// ===================================================================== FOOD

const iceCream: ColoringTemplate = {
  id: 'ice-cream',
  fa: 'بستنی قیفی',
  en: 'Ice Cream Cone',
  category: 'food',
  difficulty: 1,
  svg: svgWrap(
    // floating hearts
    heart(140, 120, 16) +
    heart(372, 96, 14) +
    // top scoop (behind)
    `<path d="M 206 190 C 202 148 228 120 258 120 C 290 120 312 148 306 190 C 274 202 236 202 206 190 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // bottom scoop
    `<path d="M 186 268 C 178 216 210 178 256 178 C 302 178 334 216 326 268 C 296 280 216 280 186 268 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // cone
    `<path d="M 194 266 L 318 266 L 264 450 Q 256 464 248 450 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // waffle cross-hatch
    `<path d="M 214 300 L 282 372 M 298 300 L 230 372 M 232 278 L 284 334 M 280 278 L 228 334" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    // cherry + leaf
    `<circle cx="262" cy="108" r="16" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M 262 92 C 264 80 274 74 284 72" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M 282 70 C 292 62 304 62 310 70 C 302 76 290 76 282 70 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // sparkles
    `<path d="M 132 208 L 132 232 M 120 220 L 144 220 M 384 190 L 384 214 M 372 202 L 396 202" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`
  ),
}

const birthdayCake: ColoringTemplate = {
  id: 'birthday-cake',
  fa: 'کیک تولد',
  en: 'Birthday Cake',
  category: 'food',
  difficulty: 3,
  svg: svgWrap(
    // plate
    `<ellipse cx="256" cy="440" rx="170" ry="26" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // layers
    `<rect x="116" y="350" width="280" height="84" rx="14" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<rect x="156" y="268" width="200" height="70" rx="12" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // candles
    `<rect x="196" y="200" width="16" height="62" rx="6" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="248" y="190" width="16" height="72" rx="6" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="300" y="200" width="16" height="62" rx="6" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // frosting bands + drips
    `<rect x="116" y="336" width="280" height="26" rx="13" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    drop(160, 358, 0.9) +
    drop(240, 358, 1) +
    drop(320, 358, 0.85) +
    `<rect x="156" y="258" width="200" height="22" rx="11" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    drop(206, 276, 0.7) +
    drop(306, 276, 0.7) +
    // flames + wicks
    drop(204, 168, 0.55) +
    drop(256, 158, 0.6) +
    drop(308, 168, 0.55) +
    `<path d="M 204 187 L 204 200 M 256 178 L 256 190 M 308 187 L 308 200" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    // sprinkle dots
    `<circle cx="150" cy="394" r="5" fill="${INK}" stroke="none"/>` +
    `<circle cx="256" cy="394" r="5" fill="${INK}" stroke="none"/>` +
    `<circle cx="362" cy="394" r="5" fill="${INK}" stroke="none"/>`
  ),
}

const donut: ColoringTemplate = {
  id: 'donut',
  fa: 'دونات شیرین',
  en: 'Sweet Donut',
  category: 'food',
  difficulty: 1,
  svg: svgWrap(
    // plate
    `<ellipse cx="256" cy="428" rx="140" ry="26" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // dough torus
    `<circle cx="256" cy="252" r="148" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // wavy icing
    `<path d="M 112 288 A 148 148 0 1 1 400 288 C 386 302 372 306 360 296 C 348 286 334 288 326 300 C 316 314 300 316 288 304 C 278 294 262 294 252 306 C 242 318 226 318 216 306 C 206 296 190 296 180 306 C 170 316 156 314 148 304 C 140 294 126 294 112 288 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // hole
    `<circle cx="256" cy="252" r="52" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // sprinkles
    sprinkle(180, 180, -20) +
    sprinkle(240, 148, 15) +
    sprinkle(312, 172, 40) +
    sprinkle(192, 246, 60) +
    sprinkle(330, 234, -30)
  ),
}

const watermelon: ColoringTemplate = {
  id: 'watermelon',
  fa: 'هندوانه',
  en: 'Watermelon Slice',
  category: 'food',
  difficulty: 1,
  svg: svgWrap(
    // juice drops
    drop(84, 372, 0.8) +
    drop(436, 340, 0.7) +
    // big slice: flesh + rind
    `<path d="M 128 240 A 128 128 0 0 0 384 240 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 116 240 A 140 140 0 0 0 396 240 L 384 240 A 128 128 0 0 1 128 240 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // seeds
    `<circle cx="200" cy="290" r="6" fill="${INK}" stroke="none"/>` +
    `<circle cx="256" cy="322" r="6" fill="${INK}" stroke="none"/>` +
    `<circle cx="312" cy="290" r="6" fill="${INK}" stroke="none"/>` +
    `<circle cx="226" cy="348" r="6" fill="${INK}" stroke="none"/>` +
    `<circle cx="286" cy="348" r="6" fill="${INK}" stroke="none"/>` +
    // small slice: flesh + rind
    `<path d="M 386 150 A 44 44 0 0 0 474 150 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 382 150 A 48 48 0 0 0 478 150 L 474 150 A 44 44 0 0 1 386 150 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<circle cx="424" cy="172" r="4" fill="${INK}" stroke="none"/>` +
    `<circle cx="444" cy="168" r="4" fill="${INK}" stroke="none"/>`
  ),
}

const apple: ColoringTemplate = {
  id: 'apple',
  fa: 'سیب قرمز',
  en: 'Red Apple',
  category: 'food',
  difficulty: 1,
  svg: svgWrap(
    // small apple behind + its leaf
    `<circle cx="400" cy="330" r="48" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    `<path d="M 408 278 C 422 264 444 262 456 272 C 446 288 424 292 410 284 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 400 284 L 396 262" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    // stem
    `<path d="M 250 162 C 248 138 252 116 262 98 L 272 102 C 264 120 262 140 264 164 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // main apple
    `<path d="M 256 168 C 216 140 156 148 132 196 C 108 244 120 316 160 366 C 190 402 226 412 256 396 C 286 412 322 402 352 366 C 392 316 404 244 380 196 C 356 148 296 140 256 168 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // leaf + vein
    `<path d="M 270 106 C 294 82 332 78 354 94 C 338 120 302 128 274 116 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 282 108 Q 314 100 344 96" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    // shine spot
    `<ellipse cx="178" cy="224" rx="15" ry="26" transform="rotate(-15 178 224)" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>`
  ),
}

const strawberry: ColoringTemplate = {
  id: 'strawberry',
  fa: 'توت‌فرنگی',
  en: 'Strawberry',
  category: 'food',
  difficulty: 2,
  svg: svgWrap(
    // little flower
    `<circle cx="110" cy="316" r="13" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="132" cy="334" r="13" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="124" cy="362" r="13" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="96" cy="362" r="13" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="88" cy="334" r="13" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="110" cy="340" r="11" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // stem
    `<path d="M 250 166 C 248 148 250 132 256 118 L 264 120 C 258 134 258 150 260 168 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // berry body
    `<path d="M 256 200 C 300 200 344 224 352 268 C 360 316 320 388 256 428 C 192 388 152 316 160 268 C 168 224 212 200 256 200 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // leafy crown
    `<path d="M 254 206 C 226 194 198 194 178 206 C 198 218 228 220 254 212 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 258 206 C 286 194 314 194 334 206 C 314 218 284 220 258 212 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M 256 162 L 234 202 Q 256 214 278 202 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    // seeds
    `<circle cx="222" cy="268" r="5" fill="${INK}" stroke="none"/>` +
    `<circle cx="290" cy="268" r="5" fill="${INK}" stroke="none"/>` +
    `<circle cx="200" cy="318" r="5" fill="${INK}" stroke="none"/>` +
    `<circle cx="312" cy="318" r="5" fill="${INK}" stroke="none"/>` +
    `<circle cx="236" cy="378" r="5" fill="${INK}" stroke="none"/>` +
    `<circle cx="278" cy="378" r="5" fill="${INK}" stroke="none"/>`
  ),
}

const pizza: ColoringTemplate = {
  id: 'pizza',
  fa: 'پیتزا',
  en: 'Pizza Slice',
  category: 'food',
  difficulty: 1,
  svg: svgWrap(
    // crust
    `<rect x="142" y="114" width="228" height="54" rx="16" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>` +
    // cheese slice
    `<path d="M 150 168 L 362 168 L 262 442 Q 256 452 250 442 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // melted cheese drips under the crust
    drop(190, 172, 0.7) +
    drop(256, 172, 0.85) +
    drop(320, 172, 0.7) +
    // pepperoni
    `<circle cx="222" cy="240" r="26" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="296" cy="262" r="24" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="252" cy="330" r="22" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // olives
    `<circle cx="232" cy="296" r="7" fill="${INK}" stroke="none"/>` +
    `<circle cx="282" cy="300" r="7" fill="${INK}" stroke="none"/>`
  ),
}

const cupcake: ColoringTemplate = {
  id: 'cupcake',
  fa: 'کاپ‌کیک',
  en: 'Cupcake',
  category: 'food',
  difficulty: 1,
  svg: svgWrap(
    // wrapper
    `<path d="M 176 300 L 336 300 L 316 436 C 314 446 306 452 296 452 L 216 452 C 206 452 198 446 196 436 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 212 302 L 222 450 M 256 302 L 256 450 M 300 302 L 290 450" fill="none" stroke="${INK}" stroke-width="4"/>` +
    // swirled frosting (two stacked blobs)
    `<path d="M 174 290 C 158 258 176 230 208 230 C 204 202 234 184 256 194 C 278 184 308 202 304 230 C 336 230 354 258 338 290 C 282 302 230 302 174 290 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 206 234 C 194 198 220 170 256 174 C 292 170 318 198 306 234 C 290 246 222 246 206 234 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M 226 206 Q 256 220 286 206" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
    // star sprinkles
    star(208, 262, 11) +
    star(304, 262, 11) +
    // rim
    `<rect x="168" y="288" width="176" height="24" rx="12" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    // cherry + stem
    `<circle cx="256" cy="150" r="17" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M 256 133 C 258 120 266 112 276 108" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
  ),
}

export const EXTRA_TEMPLATES: ColoringTemplate[] = [
  // animals
  dog,
  rabbit,
  fish,
  butterfly,
  bird,
  turtle,
  bear,
  elephant,
  // vehicles
  raceCar,
  policeCar,
  fireTruck,
  airplane,
  helicopter,
  train,
  boat,
  rocket,
  // magic
  unicorn,
  castle,
  wizardHat,
  dragon,
  mushroomHouse,
  crown,
  snowman,
  moonFairy,
  // nature
  tree,
  flower,
  rainCloud,
  mountain,
  beach,
  tulipGarden,
  // food
  iceCream,
  birthdayCake,
  donut,
  watermelon,
  apple,
  strawberry,
  pizza,
  cupcake,
]
