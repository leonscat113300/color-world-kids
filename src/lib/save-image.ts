// Robust "really save / really share it on the phone" helpers for artwork PNGs.
//
// The plain `<a download>` trick silently fails inside WebViews (Capacitor APK)
// and older mobile browsers — this module tries every real path in order and
// falls through until one works:
//
//   1. Capacitor Share plugin (APK build)       → hands the file to the native
//      Android/iOS share sheet (WhatsApp, Telegram, "Save to gallery", …)
//   2. Web Share API with files                 → Android Chrome / iOS Safari
//      native share sheet (called while the user's tap is still "fresh")
//   3. Capacitor Filesystem plugin (APK build)  → writes into the device
//      Documents folder (native file save)
//   4. File System Access API (desktop Chromium) → real "Save as…" dialog
//   5. Classic blob <a download>                → Chrome/Firefox/Safari
//      (goes straight into the phone's Downloads folder)
//
// Sharing is always tried BEFORE saving so the phone's real share sheet opens
// whenever the platform allows it.
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

// ------------------------------------------------------------- share (native)

export type SaveResult = 'saved' | 'downloaded' | 'shared'

/**
 * Open the phone's REAL share sheet for an image blob.
 * Works in the Capacitor APK (native plugin) and in mobile browsers
 * (Web Share API with files). Falls back to saving when neither exists.
 */
export async function shareImageBlob(blob: Blob, title: string): Promise<SaveResult> {
  const filename = safeFileName(title)
  const plugins = capPlugins()

  // 1) Capacitor APK → native share sheet with the cached file URI
  if (plugins?.Share) {
    try {
      let fileUri: string | undefined
      if (plugins.Filesystem) {
        try {
          const data = await blobToBase64(blob)
          const res = await plugins.Filesystem.writeFile({
            path: filename,
            data,
            directory: 'CACHE',
            recursive: true,
          })
          fileUri = res?.uri
        } catch {
          /* cache write failed → try share without files */
        }
      }
      await plugins.Share.share({ title, ...(fileUri ? { files: [fileUri] } : { text: title }) })
      return 'shared'
    } catch (err) {
      if (isAbort(err)) throw err // user closed the share sheet — not an error
      /* fall through */
    }
  }

  // 2) Web Share API with files (Chrome Android / iOS Safari)
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      const file = new File([blob], filename, { type: blob.type || 'image/png' })
      if (!navigator.canShare || navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title })
        return 'shared'
      }
    } catch (err) {
      if (isAbort(err)) throw err
      /* fall through */
    }
  }

  // 3) Nothing shareable → just save it instead
  return saveImageToDevice(blob, filename)
}

/** Share an artwork by URL (kept for compatibility). */
export async function shareImage(url: string, title: string): Promise<SaveResult> {
  const blob = await fetchImageBlob(url)
  return shareImageBlob(blob, title)
}

// ------------------------------------------------------------- save to device

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
