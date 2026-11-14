import { NextRequest, NextResponse } from 'next/server'
import { execFileSync } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/download            -> ZIP of the full project source (incl. apk-kit)
 * GET /api/download?file=apk   -> the prebuilt offline Android APK
 */
const INCLUDES = [
  'src',
  'public',
  'prisma',
  'scripts',
  'apk-kit/build-apk.sh',
  'apk-kit/capacitor.config.json',
  'apk-kit/package.json',
  'HOW-TO-BUILD-APK.md',
  'package.json',
  'bun.lock',
  'tsconfig.json',
  'next.config.ts',
  'next-env.d.ts',
  'tailwind.config.ts',
  'postcss.config.mjs',
  'eslint.config.mjs',
  'components.json',
]

export async function GET(req: NextRequest) {
  const root = process.cwd()

  // -- prebuilt APK ----------------------------------------------------------
  if (req.nextUrl.searchParams.get('file') === 'apk') {
    const apkPath = path.join(root, 'download', 'color-world-kids.apk')
    try {
      const buf = await fs.readFile(apkPath)
      return new NextResponse(new Uint8Array(buf), {
        headers: {
          'Content-Type': 'application/vnd.android.package-archive',
          'Content-Disposition': 'attachment; filename="color-world-kids.apk"',
          'Content-Length': String(buf.length),
          'Cache-Control': 'no-store',
        },
      })
    } catch {
      return NextResponse.json(
        { error: 'APK not built yet — run: bash apk-kit/build-apk.sh' },
        { status: 404 },
      )
    }
  }

  // -- full source ZIP -------------------------------------------------------
  const stamp = new Date().toISOString().slice(0, 10)
  const out = path.join(os.tmpdir(), `color-world-kids-source-${stamp}.zip`)

  try {
    await fs.unlink(out)
  } catch {
    /* no stale file */
  }

  try {
    // only include entries that actually exist (keeps the route robust)
    const existing: string[] = []
    for (const inc of INCLUDES) {
      try {
        await fs.access(path.join(root, inc))
        existing.push(inc)
      } catch {
        /* skip missing */
      }
    }
    execFileSync('zip', ['-r', '-q', out, ...existing], {
      cwd: root,
      timeout: 60_000,
    })
    const buf = await fs.readFile(out)
    await fs.unlink(out).catch(() => undefined)
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="color-world-kids-source-${stamp}.zip"`,
        'Content-Length': String(buf.length),
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'failed to build source archive', detail: (err as Error).message },
      { status: 500 },
    )
  }
}
