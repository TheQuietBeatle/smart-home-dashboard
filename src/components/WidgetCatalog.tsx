import { Check, Plus, X } from 'lucide-react'
import { useArrangeMode } from '../widgets/arrangeContext'
import { WIDGET_META, type WidgetId } from '../widgets/types'
import { useWidgetLayout } from '../widgets/useWidgetLayout'

const ORDER = Object.keys(WIDGET_META) as WidgetId[]

/** Full-screen "Add widgets" overlay listing every widget module. */
export function WidgetCatalog() {
  const { catalogOpen, closeCatalog, followRef } = useArrangeMode()
  const { layout, add, remove } = useWidgetLayout()

  if (!catalogOpen) return null

  const hidden = (id: WidgetId) => layout.find((w) => w.id === id)?.hidden === true

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="widget-catalog-title"
      className="fixed inset-0 z-50 flex flex-col overscroll-contain bg-bg"
    >
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 pl-5 pr-2">
        <h2 id="widget-catalog-title" className="flex-1 text-[22px] font-medium text-fg">
          Add widgets
        </h2>
        <button
          type="button"
          autoFocus
          aria-label="Close"
          onClick={closeCatalog}
          className="press grid h-12 w-12 place-items-center rounded-full text-fg hover:bg-white/10"
        >
          <X size={22} />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ORDER.map((id) => {
            const { name, description, icon: Icon } = WIDGET_META[id]
            const isHidden = hidden(id)
            return (
              <li
                key={id}
                className="flex min-w-0 flex-col gap-2 rounded-2xl bg-tile p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-sky">
                    <Icon size={20} />
                  </span>
                  <span className="min-w-0 truncate text-[17px] font-medium text-fg">
                    {name}
                  </span>
                </div>
                <p className="truncate text-[14px] text-fg-dim">{description}</p>

                <div className="mt-auto flex items-center gap-2">
                  {isHidden ? (
                    <button
                      type="button"
                      aria-label={`Add ${name}`}
                      onClick={() => {
                        followRef.current = id
                        add(id)
                        closeCatalog()
                      }}
                      className="press flex h-12 items-center gap-2 rounded-full bg-teal px-5 text-[15px] font-medium text-fg"
                    >
                      <Plus size={18} />
                      Add
                    </button>
                  ) : (
                    <>
                      <span className="flex h-12 items-center gap-1.5 rounded-full bg-white/5 px-4 text-[14px] text-fg-dim">
                        <Check size={16} />
                        On dashboard
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${name}`}
                        onClick={() => remove(id)}
                        className="press h-12 rounded-full px-3 text-[15px] font-medium text-amber hover:bg-white/5"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
