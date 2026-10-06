import { useEffect, useState } from 'react'

const SAMPLE = 16

/**
 * Average colour of an image, sampled on a tiny canvas. Very dark and very
 * light pixels are skipped so the result is the art's body colour. Returns
 * null while loading, on load errors, and when the canvas is CORS-tainted:
 * callers fall back to a neutral background.
 */
export function useDominantColor(url: string | null): string | null {
  const [result, setResult] = useState<{ url: string; color: string | null } | null>(
    null,
  )

  useEffect(() => {
    if (!url) return
    let cancelled = false
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    const done = (color: string | null) => {
      if (!cancelled) setResult({ url, color })
    }
    img.onload = () => done(sample(img))
    img.onerror = () => done(null)
    img.src = url
    return () => {
      cancelled = true
    }
  }, [url])

  return result && result.url === url ? result.color : null
}

function sample(img: HTMLImageElement): string | null {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = SAMPLE
    canvas.height = SAMPLE
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null
    ctx.drawImage(img, 0, 0, SAMPLE, SAMPLE)
    const { data } = ctx.getImageData(0, 0, SAMPLE, SAMPLE) // throws if tainted
    let r = 0
    let g = 0
    let b = 0
    let n = 0
    for (let i = 0; i < data.length; i += 4) {
      const max = Math.max(data[i], data[i + 1], data[i + 2])
      const min = Math.min(data[i], data[i + 1], data[i + 2])
      if (max < 24 || min > 232) continue
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
      n++
    }
    if (!n) return null
    return `rgb(${Math.round(r / n)} ${Math.round(g / n)} ${Math.round(b / n)})`
  } catch {
    return null
  }
}
