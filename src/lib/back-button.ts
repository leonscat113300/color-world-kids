'use client'

import { useEffect, useRef } from 'react'

/**
 * Android hardware back-button integration (Capacitor).
 *
 * The app keeps a stack of "back blockers" — usually open dialogs or sheets.
 * When the hardware back button fires:
 *   1. the top-most blocker gets a chance to consume the event (close itself);
 *   2. otherwise the caller decides the screen-level action
 *      (go up one level, or show the friendly exit confirmation).
 *
 * In a normal browser nothing is registered, so this is all a no-op.
 */

type BackHandler = () => boolean

const stack: BackHandler[] = []

/** Register a handler; returns an unregister function. */
export function pushBackHandler(fn: BackHandler): () => void {
  stack.push(fn)
  return () => {
    const i = stack.indexOf(fn)
    if (i >= 0) stack.splice(i, 1)
  }
}

/** Let the top-most handler consume the back press. Returns true if consumed. */
export function popBack(): boolean {
  for (let i = stack.length - 1; i >= 0; i--) {
    try {
      if (stack[i]()) return true
    } catch {
      /* a broken handler must never trap the back button */
    }
  }
  return false
}

/**
 * While `active` is true the given handler consumes the hardware back press
 * (used to close dialogs/sheets instead of leaving the screen).
 */
export function useBackBlock(active: boolean, handler: () => boolean) {
  const ref = useRef(handler)
  useEffect(() => {
    ref.current = handler
  }, [handler])
  useEffect(() => {
    if (!active) return
    return pushBackHandler(() => ref.current())
  }, [active])
}

interface CapacitorAppPlugin {
  addListener: (event: string, cb: () => void) => { remove?: () => void } | Promise<{ remove?: () => void }>
  exitApp?: () => void
  minimizeApp?: () => void
}

/** The native Capacitor App plugin, or null outside the APK WebView. */
export function capacitorApp(): CapacitorAppPlugin | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { Capacitor?: { Plugins?: Record<string, CapacitorAppPlugin> } }
  const app = w.Capacitor?.Plugins?.App
  return app && typeof app.addListener === 'function' ? app : null
}

/**
 * Listen for the Android hardware back button. Registering the listener
 * disables the default "suddenly close the app" behaviour — every press is
 * routed through the blocker stack first.
 */
export function initBackButton(onUnhandled: () => void): () => void {
  const app = capacitorApp()
  if (!app) return () => undefined
  let removed = false
  let removeFn: (() => void) | null = null
  try {
    const sub = app.addListener('backButton', () => {
      if (!popBack()) onUnhandled()
    })
    if (sub && typeof sub.then === 'function') {
      sub.then((s) => {
        if (removed) s?.remove?.()
        else removeFn = () => s?.remove?.()
      })
    } else if (sub) {
      removeFn = () => sub.remove?.()
    }
  } catch {
    /* not in Capacitor — ignore */
  }
  return () => {
    removed = true
    removeFn?.()
  }
}

/** Close the app from the exit confirmation (APK only). */
export function exitApp() {
  const app = capacitorApp()
  try {
    // gentle first: send the app to the background instead of killing it
    if (app?.minimizeApp) app.minimizeApp()
    else if (app?.exitApp) app.exitApp()
  } catch {
    /* ignore */
  }
}
