// Robust "really save it on the phone" helper for artwork PNGs.
//
// The plain `<a download>` trick silently fails inside WebViews (Capacitor APK)
// and older mobile browsers — this module tries every real saving path in
// order and falls through until one works:
//
//   1. Capacitor Filesystem plugin (APK build)  → writes into the device
//      Documents folder (native file save).
//   2. Capacitor Share plugin (APK build)       → hands the file to the native
//      Android/iOS share sheet, which offers "Save to gallery / Files".
//   3. File System Access API (desktop Chromium) → real "Save as…" dialog.
//   4. Classic blob <a download>                → Chrome/Firefox/Safari
//      (goes straight into the phone's Downloads folder).
//   5. Web Share API with files                 → last resort on mobile.
'use client'

// ------------------------------------------------------------- tiny helpers

type CapFilesystem = {
  writeFile: (opts: {
    path: string
    data: string
    directory: string
    recursive?: boolean
  }) => Promise<{ uri?: string }>
}
type CapShare = {
  share: (opts: { title?: string; text?: string; url?: string; files?: string[] }) => Promise<unknown>
}
type CapApp = {
  exitApp?: () => Promise<void>
  addListener: (event: string, cb: () => void) => Promise<{ remove?: () => void } | undefined>
}

function capPlugins(): { Filesystem?: CapFilesystem; Share?: CapShare; App?: CapApp } | null {
  if (typeof window === 'undefined') return null
  const cap = (window as unknown as { Capacitor?: { Plugins?: { Filesystem?: CapFilesystem; Share?: CapShare; App?: CapApp } } })
    .Capacitor
  return cap?.Plugins ?? null
}

/** Abort = the user cancelled a native dialog / share sheet. */
export const isAbort = (err: unknown): boolean =>
  (err instanceof DOMException && err.name === 'AbortError') ||
  (typeof err === 'object' && err !== null && 'message' in err && String((err as Error).message).toLowerCase().includes('abort'))

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result ?? '')
      resolve(dataUrl.slice(dataUrl.indexOf(',') + 1))
    }
    reader.onerror = () => reject(new Error('base64 read failed'))
    reader.readAsDataURL(blob)
  })
}

/** Remove characters phones dislike in filenames, keep unicode (Persian) text. */
export function safeFileName(title: string): string {
  const base = (title || 'artwork').replace(/[\\/:*?"<>|]+/g, '-').trim().slice(0, 60)
  return `${base || 'artwork'}.png`
}

export async function fetchImageBlob(url: string): Promise<Blob> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`image fetch failed (${res.status})`)
  return await res.blob()
}

// ------------------------------------------------------------- save to device

export type SaveResult = 'saved' | 'downloaded' | 'shared'

/** Save an image blob onto the device, trying every available strategy. */
export async function saveImageToDevice(blob: Blob, filename: string): Promise<SaveResult> {
  const plugins = capPlugins()

  // 1) Capacitor APK: write straight into the public Documents folder
  if (plugins?.Filesystem) {
    try {
      const data = await blobToBase64(blob)
      await plugins.Filesystem.writeFile({
        path: filename,
        data,
        directory: 'DOCUMENTS',
        recursive: true,
      })
      return 'saved'
    } catch {
      /* scoped storage may block direct writes — fall through */
    }
  }

  // 2) Desktop Chromium: real "Save as…" dialog
  const w = window as unknown as {
    showSaveFilePicker?: (opts: unknown) => Promise<{
      createWritable: () => Promise<{ write: (b: Blob) => Promise<void>; close: () => Promise<void> }>
    }>
  }
  if (typeof w.showSaveFilePicker === 'function') {
    try {
      const handle = await w.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: 'PNG image', accept: { 'image/png': ['.png'] } }],
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      return 'saved'
    } catch (err) {
      if (isAbort(err)) throw err // user closed the dialog — not an error
      /* fall through */
    }
  }

  // 3) Classic download: blob URL + download attribute (works in Chrome,
  //    Firefox and modern iOS Safari — lands in the Downloads folder)
  try {
    const url = URL.createObjectURL(blob)
    const aEl = document.createElement('a')
    aEl.href = url
    aEl.download = filename
    aEl.rel = 'noopener'
    document.body.appendChild(aEl)
    aEl.click()
    aEl.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 20000)
    return 'downloaded'
  } catch {
    /* fall through */
  }

  // 4) Last resort: the native share sheet (has "save to gallery/files")
  const file = new File([blob], filename, { type: blob.type || 'image/png' })
  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: filename })
    return 'shared'
  }

  throw new Error('no save method available on this device')
}

// ------------------------------------------------------------- share

/** Share an artwork via the native share sheet; falls back to saving. */
export async function shareImage(url: string, title: string): Promise<'shared' | SaveResult> {
  const blob = await fetchImageBlob(url)
  const filename = safeFileName(title)
  const plugins = capPlugins()

  // Capacitor APK: stash the PNG in the cache dir and hand the file URI to
  // the native share sheet (gallery, WhatsApp, Files, …)
  if (plugins?.Filesystem && plugins?.Share) {
    try {
      const data = await blobToBase64(blob)
      const res = await plugins.Filesystem.writeFile({
        path: filename,
        data,
        directory: 'CACHE',
        recursive: true,
      })
      if (res?.uri) {
        await plugins.Share.share({ title, files: [res.uri] })
        return 'shared'
      }
    } catch (err) {
      if (isAbort(err)) throw err
      /* fall through */
    }
  }

  // Web Share API with files (Chrome Android / iOS Safari)
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      const file = new File([blob], filename, { type: blob.type || 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title })
        return 'shared'
      }
    } catch (err) {
      if (isAbort(err)) throw err
      /* fall through */
    }
  }

  // Nothing shareable → just save it instead
  return saveImageToDevice(blob, filename)
}
