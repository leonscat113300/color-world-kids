'use client'

/**
 * Native gallery save & share for the Capacitor APK.
 *
 * Inside the Android WebView neither `<a download>` nor `navigator.share`
 * work, so the APK ships a tiny custom Capacitor plugin (GallerySaver) that:
 *   - saveImage():  writes the PNG into the phone gallery (Pictures/Color World Kids)
 *   - shareImage(): opens the Android share sheet for the PNG
 *
 * In a normal browser both helpers are graceful no-ops (they return false) and
 * the caller falls back to classic web APIs.
 */

interface GallerySaverPlugin {
  saveImage(opts: { data: string; name: string }): Promise<{ uri?: string }>
  shareImage(opts: { data: string; name: string; title?: string }): Promise<void>
}

export function nativeGallery(): GallerySaverPlugin | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { Capacitor?: { Plugins?: Record<string, GallerySaverPlugin> } }
  const p = w.Capacitor?.Plugins?.GallerySaver
  return p && typeof p.saveImage === 'function' ? p : null
}

/** Blob -> base64 (no data-url prefix), chunked so large images stay safe. */
export async function blobToBase64(blob: Blob): Promise<string> {
  const buf = new Uint8Array(await blob.arrayBuffer())
  let s = ''
  const CH = 0x8000
  for (let i = 0; i < buf.length; i += CH) {
    s += String.fromCharCode(...buf.subarray(i, i + CH))
  }
  return btoa(s)
}

/** Sanitize an artwork title into a safe file name. */
export function safeFileName(title: string): string {
  const clean = (title || 'artwork')
    .replace(/[\\/:*?"<>|#%&{}$!'`=@+]+/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60)
  return clean.endsWith('.png') ? clean : `${clean || 'artwork'}.png`
}

/** Save a PNG blob into the phone gallery via the native plugin. */
export async function saveToGallery(blob: Blob, name: string): Promise<boolean> {
  const g = nativeGallery()
  if (!g) return false
  const data = await blobToBase64(blob)
  await g.saveImage({ data, name: safeFileName(name) })
  return true
}

/** Share a PNG blob through the Android share sheet via the native plugin. */
export async function shareNative(blob: Blob, name: string, title?: string): Promise<boolean> {
  const g = nativeGallery()
  if (!g) return false
  const data = await blobToBase64(blob)
  await g.shareImage({ data, name: safeFileName(name), title })
  return true
}
