import { Check, RotateCcw } from 'lucide-react'
import { useArrangeMode } from './arrangeContext'
import type { WidgetLayout, WidgetRenderers } from './types'
import { useWidgetLayout } from './useWidgetLayout'
import { WidgetFrame } from './WidgetFrame'

interface WidgetGridProps {
  layout: readonly WidgetLayout[]
  renderers: WidgetRenderers
  containerClassName?: string
}

export function WidgetGrid({
  layout,
  renderers,
  containerClassName = '',
}: WidgetGridProps) {
  const { move, moveTo, cycleSize, resetLayout } = useWidgetLayout()
  const { arrangeOn, toggleArrangeMode } = useArrangeMode()

  return (
    <>
      <div
        className={`grid min-h-full [grid-auto-flow:row_dense] lg:[grid-auto-rows:minmax(min-content,1fr)] ${containerClassName}`}
      >
        {layout.map((w, i) => {
          const renderer = renderers[w.id]
          return (
            <WidgetFrame
              key={w.id}
              id={w.id}
              size={w.size}
              arrangeOn={arrangeOn}
              fixedHeight={renderer.fixedHeight}
              isFirst={i === 0}
              isLast={i === layout.length - 1}
              onMove={(dir) => move(w.id, dir)}
              onCycleSize={() => cycleSize(w.id)}
              onDragOver={(target) => moveTo(w.id, target)}
            >
              {renderer.render(w.size)}
            </WidgetFrame>
          )
        })}
      </div>

      {arrangeOn && (
        <div className="glass fixed bottom-11 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full p-1 text-[13px] font-medium">
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
      )}
    </>
  )
}
