// Generates every logo asset of the app from the source artwork:
//   upload/2.webp  →  public/logo.webp, public/icons/icon-192.png,
//                     public/icons/icon-512.png, public/icons/icon-maskable-512.png
// Usage: bun scripts/make-icons.mjs
import sharp from 'sharp'

const SRC = 'upload/2.webp'
const OUT_DIR = 'public/icons'

// 1) in-app studio logo (used by StudioIntro & Splash) — keep original quality
await sharp(SRC).webp({ quality: 92 }).toFile('public/logo.webp')
console.log('OK public/logo.webp')

// 2) plain square PNG icons (full-bleed artwork, white rounded corners are part of the art)
for (const size of [192, 512]) {
  await sharp(SRC)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT_DIR}/icon-${size}.png`)
  console.log(`OK ${OUT_DIR}/icon-${size}.png`)
}

// 3) maskable icon: artwork scaled into the 80% safe zone on a white canvas
const inner = await sharp(SRC).resize(410, 410).png().toBuffer()
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#FFFFFF' } })
  .composite([{ input: inner, gravity: 'centre' }])
  .png({ compressionLevel: 9 })
  .toFile(`${OUT_DIR}/icon-maskable-512.png`)
console.log(`OK ${OUT_DIR}/icon-maskable-512.png`)
