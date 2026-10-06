import { useEffect, useState } from 'react'

export interface Clock {
  now: Date
  time: string
  date: string
  shortDate: string
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function useClock(): Clock {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return {
    now,
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    date: `${DAYS[now.getDay()]}, ${pad(now.getDate())}.${
      pad(now.getMonth() + 1)
    }.${now.getFullYear()}`,
    shortDate: `${DAYS[now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]}`,
  }
}
