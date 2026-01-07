export const isChromium = (() => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }
  const uaData = (navigator as any).userAgentData
  if (uaData?.brands?.length) {
    return uaData.brands.some((b: any) =>
      ['Google Chrome', 'Microsoft Edge', 'Chromium', 'Brave'].includes(b.brand),
    )
  }
  const ua = navigator.userAgent.toLowerCase()
  return /chrome|chromium|edg\/|brave/.test(ua) && !/firefox|safari/.test(ua)
})()

/**
 * Resolve canvas element from id string or HTMLCanvasElement.
 * 将传入的 canvas 参数解析为真实的 HTMLCanvasElement
 */
export function resolveCanvas(canvas: string | HTMLCanvasElement): HTMLCanvasElement {
  const el = typeof canvas === 'string'
    ? document.getElementById(canvas)
    : canvas
  if (!el || !(el instanceof HTMLCanvasElement)) {
    throw new Error('Invalid Canvas element')
  }
  return el
}

/**
 * Load image bitmap via fetch + blob.
 * 使用 fetch + blob 加载图片并创建 ImageBitmap（Chromium）
 */
export async function loadBitmapByFetch(url: string, signal?: AbortSignal, width?: number, height?: number): Promise<ImageBitmap> {
  const res = await fetch(url, { mode: 'cors', cache: 'force-cache', signal })
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status}`)
  }
  const blob = await res.blob()
  return createImageBitmap(blob, {
    resizeQuality: 'medium',
    ...(width ? { resizeWidth: width } : null),
    ...(height ? { resizeHeight: height } : null),
  })
}

/**
 * Load image bitmap via <img> + decode().
 * 使用 <img> + decode() 加载并创建 ImageBitmap（非 Chromium）
 */
export async function loadBitmapByImage(url: string, signal?: AbortSignal, width?: number, height?: number): Promise<ImageBitmap> {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError')
  }

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.decoding = 'async'

  const abortHandler = () => {
    img.src = ''
  }
  signal?.addEventListener('abort', abortHandler)

  try {
    img.src = url
    await img.decode().catch(() => undefined)
    if (!img.complete) {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
      })
    }
    return createImageBitmap(img, {
      ...(width ? { resizeWidth: width } : null),
      ...(height ? { resizeHeight: height } : null),
    })
  }
  finally {
    signal?.removeEventListener('abort', abortHandler)
  }
}
