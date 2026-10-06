import { SIZE_SPAN, type WidgetLayout } from './types'

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
 * Packs widgets, in layout order, into pages of PAGE_COLS x PAGE_ROWS cells.
 * Each widget takes the first free slot on the earliest page with room, so a
 * small widget can fill a gap left on an earlier page.
 */
export function paginate(layout: readonly WidgetLayout[]): PlacedWidget[][] {
  const grids: Occupancy[] = []
  const pages: PlacedWidget[][] = []

  for (const widget of layout) {
    const span = SIZE_SPAN[widget.size]
    const rows = Math.min(span.rows, PAGE_ROWS)
    let placed = false

    for (let p = 0; p <= grids.length && !placed; p++) {
      if (p === grids.length) {
        grids.push(emptyPage())
        pages.push([])
      }
      const slot = findSlot(grids[p], span.cols, rows)
      if (!slot) continue
      for (let dr = 0; dr < rows; dr++) {
        for (let dc = 0; dc < span.cols; dc++) {
          grids[p][slot.r + dr][slot.c + dc] = true
        }
      }
      pages[p].push({ widget, col: slot.c + 1, row: slot.r + 1 })
      placed = true
    }
  }

  return pages
}
