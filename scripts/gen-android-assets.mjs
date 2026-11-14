// Generates assets/icon-only.png (1024) + assets/splash.png (2732) from
// public/icons/icon-512.png for `bunx capacitor-assets generate --android`.
// Usage: bun scripts/gen-android-assets.mjs
import sharp from 'sharp'
import fs from 'fs'

const root = new URL('..', import.meta.url).pathname
const src = root + 'public/icons/icon-512.png'

fs.mkdirSync(root + 'assets', { recursive: true })

await sharp(src)
  .resize(920, 920, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .extend({ top: 52, bottom: 52, left: 52, right: 52, background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png()
  .toFile(root + 'assets/icon-only.png')

const icon = await sharp(src).resize(760, 760).png().toBuffer()
await sharp({
  create: { width: 2732, height: 2732, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
})
  .composite([{ input: icon, gravity: 'centre' }])
  .png()
  .toFile(root + 'assets/splash.png')

console.log('✓ assets/icon-only.png + assets/splash.png generated')
