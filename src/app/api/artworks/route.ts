import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { db } from '@/lib/db'

const ARTWORKS_DIR = path.join(process.cwd(), 'db', 'artworks')

export async function GET() {
  const items = await db.artwork.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      templateId: true,
      stars: true,
      state: true,
      createdAt: true,
    },
  })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      title?: string
      image?: string
      templateId?: string
      state?: string
      stars?: number
    }
    if (!body.image || !body.image.startsWith('data:image/png;base64,')) {
      return NextResponse.json({ error: 'invalid image' }, { status: 400 })
    }
    const base64 = body.image.replace('data:image/png;base64,', '')
    const buffer = Buffer.from(base64, 'base64')
    if (buffer.length === 0 || buffer.length > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'image too large' }, { status: 413 })
    }

    const created = await db.artwork.create({
      data: {
        title: (body.title || 'Artwork').slice(0, 80),
        image: '',
        templateId: body.templateId ?? '',
        state: body.state ?? '{}',
        stars: Math.max(0, Math.min(999, body.stars ?? 1)),
      },
    })

    const fileName = `${created.id}.png`
    await fs.mkdir(ARTWORKS_DIR, { recursive: true })
    await fs.writeFile(path.join(ARTWORKS_DIR, fileName), buffer)

    const updated = await db.artwork.update({
      where: { id: created.id },
      data: { image: fileName },
    })

    return NextResponse.json(updated, { status: 201 })
  } catch (e) {
    console.error('artwork save failed', e)
    return NextResponse.json({ error: 'save failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const all = req.nextUrl.searchParams.get('all')
  if (all) {
    const items = await db.artwork.findMany({ select: { id: true } })
    await fs.mkdir(ARTWORKS_DIR, { recursive: true })
    await Promise.all(
      items.map((it) =>
        fs.unlink(path.join(ARTWORKS_DIR, `${it.id}.png`)).catch(() => undefined)
      )
    )
    await db.artwork.deleteMany({})
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'missing id' }, { status: 400 })
}
