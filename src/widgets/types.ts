import type { ReactNode } from 'react'

export type WidgetId =
  | 'weather'
  | 'status'
  | 'climate'
  | 'roomba'
  | 'automations'
  | 'lighting'
  | 'media'
  | 'energy'
  | 'pills'

/** s = 3x1, m = 4x1, w = 6x1, l = 3x2 on a 12-column grid. */
export type WidgetSize = 's' | 'm' | 'w' | 'l'

export interface WidgetLayout {
  id: WidgetId
  size: WidgetSize
}

export interface WidgetRenderer {
  render: (size: WidgetSize) => ReactNode
  /** Clip to the grid cell instead of growing with content (charts). */
  fixedHeight?: boolean
}

export type WidgetRenderers = Record<WidgetId, WidgetRenderer>

export const SIZE_ORDER: readonly WidgetSize[] = ['s', 'm', 'w', 'l']

export const SIZE_SPAN: Record<WidgetSize, { cols: number; rows: number }> = {
  s: { cols: 3, rows: 1 },
  m: { cols: 4, rows: 1 },
  w: { cols: 6, rows: 1 },
  l: { cols: 3, rows: 2 },
}

export const SIZE_LABEL: Record<WidgetSize, string> = {
  s: 'Small',
  m: 'Medium',
  w: 'Wide',
  l: 'Large',
}

export const WIDGET_LABEL: Record<WidgetId, string> = {
  weather: 'Weather',
  status: 'Status',
  climate: 'Climate',
  roomba: 'Roomba',
  automations: 'Automations',
  lighting: 'Lighting',
  media: 'Media',
  energy: 'Energy',
  pills: 'Quick filters',
}

// Ordered so the first page holds the four main panels side by side and the
// second page the smaller controls.
export const DEFAULT_LAYOUT: readonly WidgetLayout[] = [
  { id: 'weather', size: 'l' },
  { id: 'status', size: 'l' },
  { id: 'climate', size: 'l' },
  { id: 'lighting', size: 'l' },
  { id: 'media', size: 'w' },
  { id: 'automations', size: 'w' },
  { id: 'roomba', size: 'm' },
  { id: 'energy', size: 'm' },
  { id: 'pills', size: 's' },
]

/**
 * Density gate for cards. An element of tier `tier` shows at `size` once the
 * size reaches that tier, or reaches the card's default size, so whatever a
 * card shows today at its default size never disappears at that size.
 */
export function shows(size: WidgetSize, tier: WidgetSize, def: WidgetSize) {
  const rank = (s: WidgetSize) => SIZE_ORDER.indexOf(s)
  return rank(size) >= Math.min(rank(tier), rank(def))
}
