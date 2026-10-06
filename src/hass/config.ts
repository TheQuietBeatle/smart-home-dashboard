export interface HassConfig {
  url: string
  token: string
}

const STORAGE_KEY = 'hass-config-v1'

function normalizeUrl(url: string): string {
  let out = url.trim().replace(/\/+$/, '')
  if (out && !/^https?:\/\//i.test(out)) out = `http://${out}`
  return out
}

export function readConfig(): HassConfig | null {
  const envUrl = import.meta.env.VITE_HA_URL
  const envToken = import.meta.env.VITE_HA_TOKEN
  const raw =
    typeof window === 'undefined'
      ? null
      : window.localStorage.getItem(STORAGE_KEY)

  let stored: Partial<HassConfig> = {}
  if (raw) {
    try {
      stored = JSON.parse(raw) as Partial<HassConfig>
    } catch {
      stored = {}
    }
  }

  const url = normalizeUrl(stored.url || envUrl || '')
  const token = (stored.token || envToken || '').trim()

  if (!url || !token) return null
  return { url, token }
}

export function writeConfig(config: HassConfig): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ url: normalizeUrl(config.url), token: config.token }),
  )
}

export function clearConfig(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}
