import { ChevronLeft, ChevronRight, GripVertical, X } from 'lucide-react'
import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from 'react'
import {
  SIZE_LABEL,
  SIZE_SPAN,
  WIDGET_META,
  type WidgetId,
  type WidgetSize,
} from './types'

interface WidgetFrameProps {
  id: WidgetId
  size: WidgetSize
  arrangeOn: boolean
  fixedHeight?: boolean
  /** Explicit position on a page (paged mode); otherwise the grid flows. */
  placement?: { col: number; row: number; rows: number }
  isFirst: boolean
  isLast: boolean
  onMove: (dir: 'left' | 'right') => void
  onCycleSize: () => void
  onDragOver: (targetId: WidgetId) => void
  onRemove: () => void
  children: ReactNode
}

const TOOL =
  'press grid h-12 w-12 shrink-0 place-items-center rounded-full text-fg hover:bg-white/10 disabled:opacity-35 disabled:hover:bg-transparent'

export function WidgetFrame({
  id,
  size,
  arrangeOn,
  fixedHeight = false,
  placement,
  isFirst,
  isLast,
  onMove,
  onCycleSize,
  onDragOver,
  onRemove,
  children,
}: WidgetFrameProps) {
  const span = SIZE_SPAN[size]
  const name = WIDGET_META[id].name
  const [dragging, setDragging] = useState(false)
  const lastTarget = useRef<WidgetId | null>(null)

  // Pointer-based drag so the handle works with touch as well as a mouse.
  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    lastTarget.current = null
    setDragging(true)
  }
  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return
    const el = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest<HTMLElement>('[data-widget-id]')
    const target = (el?.dataset.widgetId ?? null) as WidgetId | null
    if (!target || target === id) {
      lastTarget.current = null
      return
    }
    if (target !== lastTarget.current) {
      lastTarget.current = target
      onDragOver(target)
    }
  }
  const endDrag = () => setDragging(false)

  return (
    <div
      data-widget-id={id}
      style={
        placement
          ? {
              gridColumn: `${placement.col} / span ${span.cols}`,
              gridRow: `${placement.row} / span ${placement.rows}`,
            }
          : ({ '--cols': span.cols, '--rows': span.rows } as CSSProperties)
      }
      className={`relative flex min-w-0 flex-col ${
        placement
          ? 'min-h-0'
          : 'col-span-12 md:col-span-6 lg:[grid-column:span_var(--cols)] lg:[grid-row:span_var(--rows)]'
      } ${
        fixedHeight
          ? 'min-h-0 overflow-hidden'
          : placement
            ? 'overflow-hidden'
            : ''
      } ${
        arrangeOn
          ? 'rounded-2xl outline-2 outline-offset-2 outline-dashed outline-sky/60'
          : ''
      } ${dragging ? 'z-30 outline-amber' : ''}`}
    >
      {children}

      {arrangeOn && (
        <>
          {/* Blocks taps on the card's own controls while arranging. */}
          <div
            aria-hidden
            className="absolute inset-0 z-10 rounded-2xl bg-bg/35"
          />
          {/* Top-right corner: remove on its own, the toolbar right below it,
              so neither covers the drag handle even in a 3-column cell. */}
          <button
            type="button"
            aria-label={`Remove ${name}`}
            onClick={onRemove}
            className="press glass glass-amber absolute right-0 top-0 z-20 grid h-12 w-12 place-items-center rounded-full text-bg"
          >
            <X size={20} strokeWidth={2.4} />
          </button>
          <div
            role="toolbar"
            aria-label={`Arrange ${name}`}
            className="glass absolute right-0 top-[52px] z-20 flex items-center rounded-full"
          >
            <button
              type="button"
              aria-label={`Drag ${name}`}
              className={`${TOOL} cursor-grab touch-none active:cursor-grabbing`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              <GripVertical size={18} />
            </button>
            <button
              type="button"
              aria-label={`Move ${name} left`}
              disabled={isFirst}
              onClick={() => onMove('left')}
              className={TOOL}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label={`${name} size: ${SIZE_LABEL[size]}. Change size`}
              onClick={onCycleSize}
              className={`${TOOL} text-[15px] font-bold uppercase`}
            >
              {size}
            </button>
            <button
              type="button"
              aria-label={`Move ${name} right`}
              disabled={isLast}
              onClick={() => onMove('right')}
              className={TOOL}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
