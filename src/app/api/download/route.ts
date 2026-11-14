import { NextResponse } from 'next/server'
import { execFileSync } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/download
 * Packs the app source (code, assets, prisma schema, voice files, config)
 * into a clean ZIP and returns it as a downloadable file.
 */
const INCLUDES = [
  'src',
  'public',
  'prisma',
  'scripts',
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

export async function GET() {
  const root = process.cwd()
  const stamp = new Date().toISOString().slice(0, 10)
  const out = path.join(os.tmpdir(), `color-world-kids-source-${stamp}.zip`)

  try {
    await fs.unlink(out)
  } catch {
    /* no stale file */
  }

  try {
    execFileSync('zip', ['-r', '-q', out, ...INCLUDES], {
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
