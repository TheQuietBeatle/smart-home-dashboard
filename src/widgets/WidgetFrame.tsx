import { ChevronLeft, ChevronRight, GripVertical } from 'lucide-react'
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
  WIDGET_LABEL,
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
  children: ReactNode
}

const TOOL =
  'press grid h-8 min-w-8 place-items-center rounded-full px-1.5 text-fg hover:bg-white/10 disabled:opacity-35 disabled:hover:bg-transparent'

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
  children,
}: WidgetFrameProps) {
  const span = SIZE_SPAN[size]
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
            ? 'scroll-thin overflow-y-auto overflow-x-hidden'
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
          <div
            role="toolbar"
            aria-label={`Arrange ${WIDGET_LABEL[id]}`}
            className="glass absolute right-1 top-1 z-20 flex items-center gap-0.5 rounded-full p-0.5"
          >
            <button
              type="button"
              aria-label={`Drag ${WIDGET_LABEL[id]}`}
              className={`${TOOL} cursor-grab touch-none active:cursor-grabbing`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              <GripVertical size={15} />
            </button>
            <button
              type="button"
              aria-label={`Move ${WIDGET_LABEL[id]} left`}
              disabled={isFirst}
              onClick={() => onMove('left')}
              className={TOOL}
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              aria-label={`${WIDGET_LABEL[id]} size: ${SIZE_LABEL[size]}. Change size`}
              onClick={onCycleSize}
              className={`${TOOL} text-[12px] font-bold uppercase`}
            >
              {size}
            </button>
            <button
              type="button"
              aria-label={`Move ${WIDGET_LABEL[id]} right`}
              disabled={isLast}
              onClick={() => onMove('right')}
              className={TOOL}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
