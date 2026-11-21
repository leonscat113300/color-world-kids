import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { db } from '@/lib/db'

const ARTWORKS_DIR = path.join(process.cwd(), 'db', 'artworks')

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  const numId = Number(id)
  if (!Number.isFinite(numId)) {
    return NextResponse.json({ error: 'bad id' }, { status: 400 })
  }
  try {
    const body = (await req.json()) as {
      title?: string
      image?: string
      state?: string
      stars?: number
    }
    const data: Record<string, unknown> = {}
    if (typeof body.title === 'string') data.title = body.title.slice(0, 80) || 'Artwork'
    if (typeof body.state === 'string') data.state = body.state
    if (typeof body.stars === 'number') data.stars = Math.max(0, Math.min(999, body.stars))

    if (body.image && body.image.startsWith('data:image/png;base64,')) {
      const buffer = Buffer.from(body.image.replace('data:image/png;base64,', ''), 'base64')
      if (buffer.length > 0 && buffer.length <= 8 * 1024 * 1024) {
        await fs.mkdir(ARTWORKS_DIR, { recursive: true })
        await fs.writeFile(path.join(ARTWORKS_DIR, `${numId}.png`), buffer)
      }
    }

    const updated = await db.artwork.update({ where: { id: numId }, data })
    return NextResponse.json(updated)
  } catch (e) {
    console.error('artwork patch failed', e)
    return NextResponse.json({ error: 'patch failed' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  const numId = Number(id)
  if (!Number.isFinite(numId)) {
    return NextResponse.json({ error: 'bad id' }, { status: 400 })
  }
  try {
    await db.artwork.delete({ where: { id: numId } })
    await fs.unlink(path.join(ARTWORKS_DIR, `${numId}.png`)).catch(() => undefined)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('artwork delete failed', e)
    return NextResponse.json({ error: 'delete failed' }, { status: 500 })
  }
}
