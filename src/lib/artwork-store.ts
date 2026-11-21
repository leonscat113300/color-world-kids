'use client'

// ---------------------------------------------------------------------------
// Dual-mode artwork storage.
//
//  • remote mode → the hosted Next.js API (/api/artworks…, SQLite + files)
//  • local mode  → IndexedDB inside the device (offline APK / static export,
//                  where no API exists)
//
// The mode is detected once on the first call: if /api/artworks answers with
// JSON we stay remote; if it 404s or returns HTML (static APK build) we switch
// to IndexedDB and stay there for the whole session. Both modes expose the
// exact same shape the screens already used.
// ---------------------------------------------------------------------------

export interface ArtworkDto {
  id: number
  title: string
  templateId: string
  stars: number
  state: string
  createdAt: string
}

export interface ArtworkSaveBody {
  title: string
  image: string // data:image/png;base64,…
  templateId: string
  state: string
  stars: number
}

interface LocalRecord extends ArtworkDto {
  image: string
}

type Mode = 'unknown' | 'remote' | 'local'
let mode: Mode = 'unknown'

async function detectMode(): Promise<'remote' | 'local'> {
  if (mode === 'remote') return 'remote'
  if (mode === 'local') return 'local'
  try {
    const res = await fetch('/api/artworks', { cache: 'no-store' })
    const ct = res.headers.get('content-type') ?? ''
    if (res.ok && ct.includes('application/json')) {
      await res.json()
      mode = 'remote'
      return 'remote'
    }
  } catch {
    /* network error → local */
  }
  mode = 'local'
  return 'local'
}

/** Test helper for stories/tests — resets detection. */
export function resetArtworkMode(): void {
  mode = 'unknown'
}

// ------------------------------------------------------------- IndexedDB core

const DB_NAME = 'color-world'
const STORE = 'artworks'

function openIdb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      if (typeof indexedDB === 'undefined') return resolve(null)
      const req = indexedDB.open(DB_NAME, 1)
      req.onupgradeneeded = () => {
        const d = req.result
        if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE, { keyPath: 'id' })
      }
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => resolve(null)
    } catch {
      resolve(null)
    }
  })
}

function idbTx(db: IDBDatabase, mode: IDBTransactionMode): IDBObjectStore {
  return db.transaction(STORE, mode).objectStore(STORE)
}

function idbRequest<T>(store: IDBObjectStore, op: 'getAll' | 'put' | 'get' | 'delete' | 'clear', key?: IDBValidKey): Promise<T> {
  return new Promise((resolve, reject) => {
    const req =
      op === 'getAll'
        ? store.getAll()
        : op === 'put'
          ? store.put(key as LocalRecord)
          : op === 'get'
            ? store.get(key as IDBValidKey)
            : op === 'delete'
              ? store.delete(key as IDBValidKey)
              : store.clear()
    req.onsuccess = () => resolve(req.result as T)
    req.onerror = () => reject(req.error ?? new Error('idb failed'))
  })
}

async function idbAll(): Promise<LocalRecord[]> {
  const db = await openIdb()
  if (!db) return []
  try {
    return (await idbRequest<LocalRecord[]>(idbTx(db, 'readonly'), 'getAll')) ?? []
  } catch {
    return []
  }
}

async function idbGet(id: number): Promise<LocalRecord | null> {
  const db = await openIdb()
  if (!db) return null
  try {
    return ((await idbRequest<LocalRecord | undefined>(idbTx(db, 'readonly'), 'get', id)) ?? null)
  } catch {
    return null
  }
}

async function idbPut(rec: LocalRecord): Promise<void> {
  const db = await openIdb()
  if (!db) throw new Error('storage unavailable')
  await idbRequest(idbTx(db, 'readwrite'), 'put', rec)
}

async function idbDelete(id: number): Promise<void> {
  const db = await openIdb()
  if (!db) return
  try {
    await idbRequest(idbTx(db, 'readwrite'), 'delete', id)
  } catch {
    /* ignore */
  }
}

async function idbClear(): Promise<void> {
  const db = await openIdb()
  if (!db) return
  try {
    await idbRequest(idbTx(db, 'readwrite'), 'clear')
  } catch {
    /* ignore */
  }
}

const stripImage = (r: LocalRecord): ArtworkDto => ({
  id: r.id,
  title: r.title,
  templateId: r.templateId,
  stars: r.stars,
  state: r.state,
  createdAt: r.createdAt,
})

// ------------------------------------------------------------- public API

export async function listArtworks(): Promise<ArtworkDto[]> {
  if ((await detectMode()) === 'remote') {
    const res = await fetch('/api/artworks', { cache: 'no-store' })
    if (!res.ok) throw new Error('list failed')
    return (await res.json()) as ArtworkDto[]
  }
  const all = await idbAll()
  return all.sort((a, b) => b.id - a.id).map(stripImage)
}

export async function saveArtwork(body: ArtworkSaveBody, editingId?: number): Promise<ArtworkDto> {
  if ((await detectMode()) === 'remote') {
    const res = await fetch(editingId ? `/api/artworks/${editingId}` : '/api/artworks', {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error('save failed')
    return (await res.json()) as ArtworkDto
  }

  if (editingId) {
    const rec = await idbGet(editingId)
    if (!rec) throw new Error('artwork not found')
    const updated: LocalRecord = { ...rec, ...body }
    await idbPut(updated)
    return stripImage(updated)
  }
  const all = await idbAll()
  const id = all.length ? Math.max(...all.map((r) => r.id)) + 1 : 1
  const rec: LocalRecord = { id, createdAt: new Date().toISOString(), ...body }
  await idbPut(rec)
  return stripImage(rec)
}

export async function renameArtwork(id: number, title: string): Promise<void> {
  if ((await detectMode()) === 'remote') {
    const res = await fetch(`/api/artworks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    if (!res.ok) throw new Error('rename failed')
    return
  }
  const rec = await idbGet(id)
  if (!rec) return
  await idbPut({ ...rec, title })
}

export async function deleteArtwork(id: number): Promise<void> {
  if ((await detectMode()) === 'remote') {
    await fetch(`/api/artworks/${id}`, { method: 'DELETE' })
    return
  }
  await idbDelete(id)
}

export async function deleteAllArtworks(): Promise<void> {
  if ((await detectMode()) === 'remote') {
    await fetch('/api/artworks?all=1', { method: 'DELETE' })
    return
  }
  await idbClear()
}

/** URL usable in <img src> — API URL in remote mode, data-URL in local mode. */
export async function artworkImageUrl(id: number): Promise<string> {
  if ((await detectMode()) === 'remote') return `/api/artworks/${id}/image`
  const rec = await idbGet(id)
  return rec?.image ?? ''
}

/** The artwork PNG as a real Blob (for save-to-device / native share). */
export async function artworkImageBlob(id: number): Promise<Blob> {
  if ((await detectMode()) === 'remote') {
    const res = await fetch(`/api/artworks/${id}/image`)
    if (!res.ok) throw new Error(`image fetch failed (${res.status})`)
    return await res.blob()
  }
  const rec = await idbGet(id)
  if (!rec?.image) throw new Error('image missing')
  return await (await fetch(rec.image)).blob()
}

/** Sum of all stars — used by the star chip, rewards and parents stats. */
export async function totalStarsEarned(): Promise<number> {
  const items = await listArtworks()
  return items.reduce((s, a) => s + a.stars, 0)
}
