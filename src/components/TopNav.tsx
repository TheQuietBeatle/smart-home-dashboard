import {
  Building,
  Building2,
  Car,
  House,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Pencil,
  Search,
  Server,
  Tv,
  Users,
  Warehouse,
} from 'lucide-react'
import { useState } from 'react'

const TABS = [
  { icon: House, label: 'Home' },
  { icon: Building, label: 'Ground floor' },
  { icon: Building2, label: 'First floor' },
  { icon: House, label: 'Garden' },
  { icon: Warehouse, label: 'Garage' },
  { icon: Server, label: 'System' },
  { icon: Tv, label: 'Media' },
  { icon: Users, label: 'People' },
  { icon: Car, label: 'Auto' },
  { icon: LayoutDashboard, label: 'Overview' },
]

export function TopNav() {
  const [tab, setTab] = useState(TABS.length - 1)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="relative z-30 flex h-11 shrink-0 items-center gap-1 bg-bar px-3">
      <button
        type="button"
        aria-label="Menu"
        onClick={() => setMenuOpen((v) => !v)}
        className="press grid h-8 w-8 shrink-0 place-items-center rounded-lg text-fg hover:bg-tile"
      >
        <Menu size={18} />
      </button>

      <nav
        aria-label="Views"
        className="scroll-thin flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto px-1"
      >
        {TABS.map(({ icon: Icon, label }, i) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            aria-current={tab === i}
            onClick={() => setTab(i)}
            className={`press grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
              tab === i
                ? 'bg-tile-hi text-fg'
                : 'text-fg-dim hover:bg-tile hover:text-fg'
            }`}
          >
            <Icon size={16} />
          </button>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-0.5">
        {searchOpen && (
          <input
            autoFocus
            placeholder="Search devices…"
            className="h-8 w-36 rounded-lg bg-tile px-2 text-xs text-fg outline-none placeholder:text-fg-dim"
            onBlur={() => setSearchOpen(false)}
          />
        )}
        {[
          { icon: Search, label: 'Search', onClick: () => setSearchOpen(true) },
          { icon: MessageSquare, label: 'Assistant' },
          { icon: Pencil, label: 'Edit dashboard' },
        ].map(({ icon: Icon, label, onClick }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            onClick={onClick}
            className="press grid h-8 w-8 place-items-center rounded-lg text-fg hover:bg-tile"
          >
            <Icon size={16} />
          </button>
        ))}
      </div>

      {menuOpen && (
        <div className="absolute left-3 top-12 w-52 rounded-xl bg-tile p-2 shadow-2xl">
          {['Overview', 'Lights', 'Climate', 'Media', 'Automations', 'Settings'].map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMenuOpen(false)}
                className="press flex w-full items-center rounded-lg px-2.5 py-2 text-left text-xs text-fg hover:bg-tile-hi"
              >
                {item}
              </button>
            ),
          )}
        </div>
      )}
    </header>
  )
}
