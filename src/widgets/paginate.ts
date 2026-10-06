import { SIZE_SPAN, type WidgetId, type WidgetLayout } from './types'

export const PAGE_COLS = 12
export const PAGE_ROWS = 2

export interface PlacedWidget {
  widget: WidgetLayout
  /** 1-based grid lines within its page. */
  col: number
  row: number
}

type Occupancy = boolean[][]

const emptyPage = (): Occupancy =>
  Array.from({ length: PAGE_ROWS }, () => Array<boolean>(PAGE_COLS).fill(false))

function findSlot(grid: Occupancy, cols: number, rows: number) {
  for (let r = 0; r + rows <= PAGE_ROWS; r++) {
    for (let c = 0; c + cols <= PAGE_COLS; c++) {
      let free = true
      for (let dr = 0; dr < rows && free; dr++) {
        for (let dc = 0; dc < cols && free; dc++) {
          if (grid[r + dr][c + dc]) free = false
        }
      }
      if (free) return { r, c }
    }
  }
  return null
}

/**
 * Packs widgets in layout order into pages of PAGE_COLS x PAGE_ROWS cells.
 * Each widget takes the first free slot on the current page; when it does not
 * fit, a new page starts. Earlier pages are never revisited and a widget never
 * splits across pages. Pages are derived at render time, never stored.
 */
export function paginate(layout: readonly WidgetLayout[]): PlacedWidget[][] {
  const pages: PlacedWidget[][] = []
  let grid = emptyPage()
  let page: PlacedWidget[] = []

  for (const widget of layout) {
    const span = SIZE_SPAN[widget.size]
    const rows = Math.min(span.rows, PAGE_ROWS)
    let slot = findSlot(grid, span.cols, rows)
    if (!slot) {
      pages.push(page)
      grid = emptyPage()
      page = []
      slot = findSlot(grid, span.cols, rows)
    }
    if (!slot) continue // Wider than a page: impossible with the presets.
    for (let dr = 0; dr < rows; dr++) {
      for (let dc = 0; dc < span.cols; dc++) {
        grid[slot.r + dr][slot.c + dc] = true
      }
    }
    page.push({ widget, col: slot.c + 1, row: slot.r + 1 })
  }
  if (page.length) pages.push(page)

  return pages
}

export function pageOf(pages: PlacedWidget[][], id: WidgetId): number {
  return pages.findIndex((p) => p.some((it) => it.widget.id === id))
}
