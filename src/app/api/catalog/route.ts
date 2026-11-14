import { NextResponse } from 'next/server'
import { CATEGORIES, templatesByCategory } from '@/lib/templates'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/catalog
 * JSON catalog of the coloring app: 20 categories x 100 drawings each,
 * with id, bilingual names, difficulty and category for every drawing.
 */
export async function GET() {
  const categories = CATEGORIES.map((c) => {
    const items = templatesByCategory(c.id)
    return {
      id: c.id,
      name: { fa: c.fa, en: c.en },
      color: c.color,
      count: items.length,
      drawings: items.map((t) => ({
        id: t.id,
        name: { fa: t.fa, en: t.en },
        difficulty: t.difficulty,
      })),
    }
  })
  return NextResponse.json(
    {
      app: 'color-world-kids',
      totalDrawings: categories.reduce((s, c) => s + c.count, 0),
      categories,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
