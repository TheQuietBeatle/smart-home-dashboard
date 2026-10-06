import { Check, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useArrangeMode } from './arrangeContext'
import { paginate, PAGE_ROWS } from './paginate'
import { SIZE_SPAN, type WidgetLayout, type WidgetRenderers } from './types'
import { useMediaQuery } from './useMediaQuery'
import { useWidgetLayout } from './useWidgetLayout'
import { WidgetFrame } from './WidgetFrame'

interface WidgetGridProps {
  layout: readonly WidgetLayout[]
  renderers: WidgetRenderers
  containerClassName?: string
}

/** Same breakpoint as the theme's `lg` (56rem): pages at tablet width and up. */
const PAGED_QUERY = '(min-width: 56rem)'

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
  const current = Math.min(page, pages.length - 1)

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
        onMove={(dir) => move(w.id, dir)}
        onCycleSize={() => cycleSize(w.id)}
        onDragOver={(target) => moveTo(w.id, target)}
      >
        {renderer.render(w.size)}
      </WidgetFrame>
    )
  }

  const goTo = (index: number) => {
    const el = scroller.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({
      left: index * el.clientWidth,
      behavior: reduce ? 'auto' : 'smooth',
    })
  }

  // Arrow keys page too, for a mouse or keyboard without swipe.
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

  const arrangeBar = arrangeOn && (
    <div className="glass fixed bottom-14 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full p-1 text-[13px] font-medium">
      <button
        type="button"
        onClick={resetLayout}
        className="press flex h-9 items-center gap-1.5 rounded-full px-3 text-fg hover:bg-white/10"
      >
        <RotateCcw size={14} />
        Reset layout
      </button>
      <button
        type="button"
        onClick={toggleArrangeMode}
        className="press glass glass-teal flex h-9 items-center gap-1.5 rounded-full px-3 text-fg"
      >
        <Check size={14} />
        Done
      </button>
    </div>
  )

  if (!paged) {
    return (
      <>
        <div className={`grid [grid-auto-flow:row_dense] ${containerClassName}`}>
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
            <div
              className={`grid h-full grid-rows-2 ${containerClassName}`}
            >
              {items.map((it) => frame(it.widget, { col: it.col, row: it.row }))}
            </div>
          </section>
        ))}
      </div>

      {pages.length > 1 && (
        <nav
          aria-label="Pages"
          className="flex h-5 shrink-0 items-center justify-center gap-1"
        >
          {pages.map((items, p) => (
            <button
              key={items[0]?.widget.id ?? p}
              type="button"
              aria-label={`Page ${p + 1}`}
              aria-current={p === current ? 'page' : undefined}
              onClick={() => goTo(p)}
              className="grid h-5 w-6 place-items-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-[width,background-color] duration-200 ${
                  p === current ? 'w-4 bg-fg' : 'w-1.5 bg-fg-dim/50'
                }`}
              />
            </button>
          ))}
        </nav>
      )}

      {arrangeBar}
    </div>
  )
}
