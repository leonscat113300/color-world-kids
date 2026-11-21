import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { db } from '@/lib/db'

const ARTWORKS_DIR = path.join(process.cwd(), 'db', 'artworks')

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  const numId = Number(id)
  if (!Number.isFinite(numId)) {
    return new NextResponse('bad id', { status: 400 })
  }
  try {
    const art = await db.artwork.findUnique({
      where: { id: numId },
      select: { image: true, title: true },
    })
    if (!art || !art.image) return new NextResponse('not found', { status: 404 })
    const file = await fs.readFile(path.join(ARTWORKS_DIR, art.image))
    // attachment → opening the URL directly (without JS) also downloads the PNG
    const fname = `color-world-artwork-${numId}.png`
    return new NextResponse(new Uint8Array(file), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${fname}"; filename*=UTF-8''${encodeURIComponent(fname)}`,
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return new NextResponse('not found', { status: 404 })
  }
}
