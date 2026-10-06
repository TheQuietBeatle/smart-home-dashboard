import { Check, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useArrangeMode } from './arrangeContext'
import { pageOf, paginate, PAGE_ROWS } from './paginate'
import {
  SIZE_SPAN,
  type WidgetId,
  type WidgetLayout,
  type WidgetRenderers,
} from './types'
import { useMediaQuery } from './useMediaQuery'
import { useWidgetLayout } from './useWidgetLayout'
import { WidgetFrame } from './WidgetFrame'

interface WidgetGridProps {
  layout: readonly WidgetLayout[]
  renderers: WidgetRenderers
  /** Extra classes for each page's grid (or the stacked grid). */
  containerClassName?: string
}

/** Landscape tablets and up get pages; portrait phones get one column. */
const PAGED_QUERY = '(min-width: 40rem) and (orientation: landscape)'

/** 12 columns x 2 rows; 8px gap and padding, 6px under `short:`. */
const PAGE_GRID =
  'grid h-full grid-cols-12 grid-rows-2 gap-2 p-2 short:gap-1.5 short:p-1.5'

export function WidgetGrid({
  layout,
  renderers,
  containerClassName = '',
}: WidgetGridProps) {
  const { move, moveTo, cycleSize, resetLayout } = useWidgetLayout()
  const { arrangeOn, toggleArrangeMode } = useArrangeMode()
  const paged = useMediaQuery(PAGED_QUERY)
  const pages = useMemo(() => paginate(layout), [layout])
  const scroller = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const followId = useRef<WidgetId | null>(null)
  const current = Math.min(page, Math.max(pages.length - 1, 0))

  const goTo = (index: number) => {
    const el = scroller.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({
      left: index * el.clientWidth,
      behavior: reduce ? 'auto' : 'smooth',
    })
  }

  // After a move or resize, bring the moved widget's page into view.
  useEffect(() => {
    const id = followId.current
    followId.current = null
    if (!id || !paged) return
    const target = pageOf(pages, id)
    if (target >= 0 && target !== current) goTo(target)
  }, [pages, paged, current])

  // Arrow keys page too, for a mouse or keyboard.
  useEffect(() => {
    if (!paged) return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (e.key === 'ArrowRight') goTo(Math.min(current + 1, pages.length - 1))
      if (e.key === 'ArrowLeft') goTo(Math.max(current - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [paged, current, pages.length])

  const frame = (w: WidgetLayout, placement?: { col: number; row: number }) => {
    const i = layout.indexOf(w)
    const renderer = renderers[w.id]
    return (
      <WidgetFrame
        key={w.id}
        id={w.id}
        size={w.size}
        arrangeOn={arrangeOn}
        fixedHeight={renderer.fixedHeight}
        placement={
          placement && {
            ...placement,
            rows: Math.min(SIZE_SPAN[w.size].rows, PAGE_ROWS),
          }
        }
        isFirst={i === 0}
        isLast={i === layout.length - 1}
        onMove={(dir) => {
          followId.current = w.id
          move(w.id, dir)
        }}
        onCycleSize={() => {
          followId.current = w.id
          cycleSize(w.id)
        }}
        onDragOver={(target) => moveTo(w.id, target)}
      >
        {renderer.render(w.size)}
      </WidgetFrame>
    )
  }

  const arrangeBar = arrangeOn && (
    <div className="glass fixed bottom-14 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full p-1 text-[15px] font-medium">
      <button
        type="button"
        onClick={() => {
          resetLayout()
          goTo(0)
        }}
        className="press flex h-12 items-center gap-2 rounded-full px-4 text-fg hover:bg-white/10"
      >
        <RotateCcw size={16} />
        Reset layout
      </button>
      <button
        type="button"
        onClick={toggleArrangeMode}
        className="press glass glass-teal flex h-12 items-center gap-2 rounded-full px-4 text-fg"
      >
        <Check size={16} />
        Done
      </button>
    </div>
  )

  if (!paged) {
    return (
      <>
        <div
          className={`grid grid-cols-12 gap-2 p-2 [grid-auto-flow:row_dense] ${containerClassName}`}
        >
          {layout.map((w) => frame(w))}
        </div>
        {arrangeBar}
      </>
    )
  }

  return (
    <div className="relative flex h-full flex-col">
      <div
        ref={scroller}
        onScroll={(e) => {
          const el = e.currentTarget
          setPage(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1)))
        }}
        className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {pages.map((items, p) => (
          <section
            key={items.map((it) => it.widget.id).join('-')}
            aria-label={`Page ${p + 1} of ${pages.length}`}
            className="h-full w-full shrink-0 snap-start snap-always"
          >
            <div className={`${PAGE_GRID} ${containerClassName}`}>
              {items.map((it) => frame(it.widget, { col: it.col, row: it.row }))}
            </div>
          </section>
        ))}
      </div>

      {/* 24px strip; each dot's 48px tap target overhangs it by 12px. */}
      <nav
        aria-label="Pages"
        className="pointer-events-none relative z-20 flex h-6 shrink-0 items-center justify-center"
      >
        {pages.length > 1 &&
          pages.map((items, p) => (
            <button
              key={items[0]?.widget.id ?? p}
              type="button"
              aria-label={`Page ${p + 1} of ${pages.length}`}
              aria-current={p === current ? 'page' : undefined}
              onClick={() => goTo(p)}
              className="pointer-events-auto -my-3 grid h-12 w-12 place-items-center"
            >
              <span
                className={`block h-2 rounded-full transition-[width,background-color] duration-200 ${
                  p === current ? 'w-5 bg-fg' : 'w-2 bg-fg-dim/60'
                }`}
              />
            </button>
          ))}
      </nav>

      {arrangeBar}
    </div>
  )
}
