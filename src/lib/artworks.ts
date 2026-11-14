/**
 * Offline-first artwork storage (IndexedDB).
 *
 * The app is a fully client-side coloring book, so artworks are stored on the
 * device itself — no server needed. This makes the PWA work offline and lets
 * the Capacitor APK bundle run without any backend.
 *
 * Record shape mirrors the public REST API (`/api/artworks`) so the two stay
 * interchangeable: { id, title, templateId, stars, state, createdAt }.
 * The full-resolution PNG is kept as a Blob alongside the metadata.
 */

export interface ArtworkDto {
  id: number
  title: string
  templateId: string
  stars: number
  state: string
  createdAt: string
}

interface ArtworkRecord extends ArtworkDto {
  blob: Blob
  updatedAt: string
}

const DB_NAME = 'color-world'
const STORE = 'artworks'

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error('indexedDB open failed'))
  })
  return dbPromise
}

async function run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest): Promise<T> {
  const db = await openDb()
  return new Promise<T>((resolve, reject) => {
    const t = db.transaction(STORE, mode)
    const req = fn(t.objectStore(STORE))
    req.onsuccess = () => resolve(req.result as T)
    req.onerror = () => reject(req.error ?? new Error('indexedDB request failed'))
    // NOTE: the connection is cached (dbPromise) and intentionally left open.
    // Closing it here would break every later transaction.
  })
}

/** data URL -> Blob (works in every WebView / browser). */
async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl)
  return res.blob()
}

/** Cached object-URL per artwork so gallery grids don't re-create URLs. */
const urlCache = new Map<number, string>()

function dropUrl(id: number) {
  const url = urlCache.get(id)
  if (url) {
    URL.revokeObjectURL(url)
    urlCache.delete(id)
  }
}

/** All artworks, newest first. Same JSON shape as GET /api/artworks. */
export async function listArtworks(): Promise<ArtworkDto[]> {
  const recs = await run<ArtworkRecord[]>('readonly', (s) => s.getAll())
  return recs
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : b.id - a.id))
    .map(({ blob: _blob, updatedAt: _updatedAt, ...dto }) => dto)
}

/** Object-URL for an artwork image (cached). Returns null when missing. */
export async function artworkImageUrl(id: number): Promise<string | null> {
  const hit = urlCache.get(id)
  if (hit) return hit
  const rec = await run<ArtworkRecord | undefined>('readonly', (s) => s.get(id))
  if (!rec?.blob) return null
  const url = URL.createObjectURL(rec.blob)
  urlCache.set(id, url)
  return url
}

/** Save a new artwork. `image` is a PNG data URL, same as POST /api/artworks. */
export async function createArtwork(input: {
  title: string
  image: string
  templateId: string
  state: string
  stars: number
}): Promise<ArtworkDto> {
  const blob = await dataUrlToBlob(input.image)
  const now = new Date().toISOString()
  const stars = Math.max(0, Math.min(999, input.stars))
  const title = (input.title || 'Artwork').slice(0, 80)
  const id = await run<IDBValidKey>('readwrite', (s) =>
    s.add({ title, templateId: input.templateId, state: input.state, stars, createdAt: now, updatedAt: now, blob })
  )
  return { id: Number(id), title, templateId: input.templateId, stars, state: input.state, createdAt: now }
}

/** Update an artwork (rename / re-save after editing). */
export async function updateArtwork(
  id: number,
  patch: { title?: string; image?: string; templateId?: string; state?: string; stars?: number }
): Promise<void> {
  const rec = await run<ArtworkRecord | undefined>('readonly', (s) => s.get(id))
  if (!rec) throw new Error('artwork not found')
  let blob = rec.blob
  if (patch.image) blob = await dataUrlToBlob(patch.image)
  const next: ArtworkRecord = {
    ...rec,
    ...patch,
    title: patch.title !== undefined ? patch.title.slice(0, 80) : rec.title,
    stars: patch.stars !== undefined ? Math.max(0, Math.min(999, patch.stars)) : rec.stars,
    blob,
    updatedAt: new Date().toISOString(),
  }
  await run('readwrite', (s) => s.put(next))
  if (patch.image) dropUrl(id)
}

/** Delete one artwork. */
export async function deleteArtwork(id: number): Promise<void> {
  await run('readwrite', (s) => s.delete(id))
  dropUrl(id)
}

/** Delete every artwork (parents area). */
export async function deleteAllArtworks(): Promise<void> {
  await run('readwrite', (s) => s.clear())
  for (const url of urlCache.values()) URL.revokeObjectURL(url)
  urlCache.clear()
}
