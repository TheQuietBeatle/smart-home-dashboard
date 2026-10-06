import { useState } from 'react'

const PILLS = ['Music', 'Washer', 'Rooms', 'Devices', 'Sensors', 'Appliances']

export function QuickPills() {
  const [active, setActive] = useState('Devices')

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] content-start gap-1.5">
      {PILLS.map((pill) => {
        const on = pill === active
        return (
          <button
            key={pill}
            type="button"
            aria-pressed={on}
            onClick={() => setActive(pill)}
            className={`press h-12 rounded-full px-2 text-[14px] font-medium leading-tight ${
              on ? 'glass glass-teal text-fg' : 'glass text-fg-dim hover:text-fg'
            }`}
          >
            {pill}
          </button>
        )
      })}
    </div>
  )
}
