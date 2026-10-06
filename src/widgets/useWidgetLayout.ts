import { useSyncExternalStore } from 'react'
import {
  DEFAULT_LAYOUT,
  SIZE_ORDER,
  type WidgetId,
  type WidgetLayout,
  type WidgetSize,
} from './types'

const STORAGE_KEY = 'casa-layout-v1'

function mergeWithDefaults(saved: unknown): readonly WidgetLayout[] {
  if (!Array.isArray(saved)) return DEFAULT_LAYOUT
  const out: WidgetLayout[] = []
  const seen = new Set<WidgetId>()
  for (const item of saved) {
    const entry = item as Partial<WidgetLayout> | null
    const fallback = DEFAULT_LAYOUT.find((w) => w.id === entry?.id)
    if (!fallback || seen.has(fallback.id)) continue
    seen.add(fallback.id)
    out.push({
      id: fallback.id,
      size: SIZE_ORDER.includes(entry?.size as WidgetSize)
        ? (entry?.size as WidgetSize)
        : fallback.size,
    })
  }
  for (const w of DEFAULT_LAYOUT) if (!seen.has(w.id)) out.push(w)
  return out
}

function load(): readonly WidgetLayout[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? mergeWithDefaults(JSON.parse(raw)) : DEFAULT_LAYOUT
  } catch {
    return DEFAULT_LAYOUT
  }
}

// One shared store, so every useWidgetLayout() caller sees the same layout.
let current: readonly WidgetLayout[] =
  typeof window === 'undefined' ? DEFAULT_LAYOUT : load()
const listeners = new Set<() => void>()

function commit(next: readonly WidgetLayout[]) {
  current = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage unavailable (private mode, quota): keep the in-memory layout.
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function move(id: WidgetId, dir: 'left' | 'right') {
  const i = current.findIndex((w) => w.id === id)
  const j = dir === 'left' ? i - 1 : i + 1
  if (i < 0 || j < 0 || j >= current.length) return
  const next = [...current]
  ;[next[i], next[j]] = [next[j], next[i]]
  commit(next)
}

function moveTo(id: WidgetId, targetId: WidgetId) {
  const from = current.findIndex((w) => w.id === id)
  const to = current.findIndex((w) => w.id === targetId)
  if (from < 0 || to < 0 || from === to) return
  const next = [...current]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  commit(next)
}

function cycleSize(id: WidgetId) {
  commit(
    current.map((w) =>
      w.id === id
        ? {
            ...w,
            size: SIZE_ORDER[(SIZE_ORDER.indexOf(w.size) + 1) % SIZE_ORDER.length],
          }
        : w,
    ),
  )
}

function resetLayout() {
  commit(DEFAULT_LAYOUT)
}

export function useWidgetLayout() {
  const layout = useSyncExternalStore(
    subscribe,
    () => current,
    () => DEFAULT_LAYOUT,
  )
  return { layout, move, moveTo, cycleSize, resetLayout }
}
