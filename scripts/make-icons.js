// Regenerate every app icon + splash asset from the user-provided logo:
//   upload/gyf-Photoroom.png  (1254x1254 rounded app-icon artwork)
//
// Outputs:
//   assets/icon-only.png        1024x1024 (capacitor-assets source, flattened)
//   assets/icon-foreground.png  1024x1024 (adaptive foreground, logo in safe zone)
//   assets/icon-background.png  1024x1024 (adaptive background, solid sky blue)
//   assets/splash.png           2732x2732 SOLID COLOR ONLY (no logo — user asked
//                                          to remove the logo shown at launch)
//   public/logo.webp            new app logo (favicon + «دنیای رنگ‌ها» splash page)
//   public/icons/icon-192.png / icon-512.png / icon-maskable-512.png
//
// Usage: node scripts/make-icons.js
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SRC = path.join(__dirname, '..', 'upload', 'gyf-Photoroom.png')
const ROOT = path.join(__dirname, '..')

const SKY = '#78C8F8' // app sky blue — matches the splash / theme color

async function main() {
  const meta = await sharp(SRC).metadata()
  console.log(`source: ${meta.width}x${meta.height} ${meta.format}`)

  // 1) capacitor-assets icon source — flatten onto sky blue (rounded corners become blue)
  await sharp(SRC)
    .resize(1024, 1024, { fit: 'contain', background: SKY })
    .flatten({ background: SKY })
    .png()
    .toFile(path.join(ROOT, 'assets', 'icon-only.png'))
  console.log('✓ assets/icon-only.png')

  // 2) adaptive foreground — logo scaled to ~62% inside the safe zone, transparent around
  const fgLogo = await sharp(SRC)
    .resize(640, 640, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
  await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: fgLogo, gravity: 'center' }])
    .png()
    .toFile(path.join(ROOT, 'assets', 'icon-foreground.png'))
  console.log('✓ assets/icon-foreground.png')

  // 3) adaptive background — solid sky blue
  await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: SKY },
  })
    .png()
    .toFile(path.join(ROOT, 'assets', 'icon-background.png'))
  console.log('✓ assets/icon-background.png')

  // 4) splash — SOLID COLOR ONLY, no logo (the phone shows no logo at launch now)
  await sharp({
    create: { width: 2732, height: 2732, channels: 4, background: SKY },
  })
    .png()
    .toFile(path.join(ROOT, 'assets', 'splash.png'))
  console.log('✓ assets/splash.png (solid color, no logo)')

  // 5) favicon + «دنیای رنگ‌ها» page logo (same path as before → nothing else changes)
  await sharp(SRC)
    .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 92 })
    .toFile(path.join(ROOT, 'public', 'logo.webp'))
  console.log('✓ public/logo.webp (new app logo)')

  // 6) web / PWA icons
  for (const size of [192, 512]) {
    await sharp(SRC)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(ROOT, 'public', 'icons', `icon-${size}.png`))
    console.log(`✓ public/icons/icon-${size}.png`)
  }

  // 7) maskable icon — logo at 80% inside the maskable safe zone on sky blue
  const inner = await sharp(SRC)
    .resize(410, 410, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
  await sharp({
    create: { width: 512, height: 512, channels: 4, background: SKY },
  })
    .composite([{ input: inner, gravity: 'center' }])
    .png()
    .toFile(path.join(ROOT, 'public', 'icons', 'icon-maskable-512.png'))
  console.log('✓ public/icons/icon-maskable-512.png')

  console.log('all icon assets regenerated ✓')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
