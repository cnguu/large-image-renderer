import type { DrawBigImageOptions } from './types'
import { buildDrawPlan } from './drawPlan'
import { isChromium, loadBitmapByFetch, loadBitmapByImage, resolveCanvas } from './util'

/**
 * High-performance large image rendering (optimized for different browsers)
 * 高性能渲染大图（针对不同浏览器优化）
 */
export async function largeImageRenderer(options: DrawBigImageOptions): Promise<void> {
  const {
    imageUrl,
    canvas,
    width,
    height,
    fitCanvasSize = true,
    mode = 'aspectFill',
    signal,
    ctxOptions,
  } = options

  const canvasEl = resolveCanvas(canvas)

  let bitmap: ImageBitmap | undefined

  try {
    bitmap = isChromium
      ? await loadBitmapByFetch(imageUrl, signal)
      : await loadBitmapByImage(imageUrl, signal)

    const plan = buildDrawPlan({
      mode,
      imgW: bitmap.width,
      imgH: bitmap.height,
      width,
      height,
    })

    if (fitCanvasSize) {
      if (canvasEl.width !== plan.boxW) {
        canvasEl.width = plan.boxW
      }
      if (canvasEl.height !== plan.boxH) {
        canvasEl.height = plan.boxH
      }
    }

    const ctx = canvasEl.getContext('2d', {
      alpha: true,
      desynchronized: true,
      ...ctxOptions,
    })
    if (!ctx) {
      throw new Error('Failed to get Canvas 2D context')
    }
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
    if (plan.needClip) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, plan.boxW, plan.boxH)
      ctx.clip()
    }
    ctx.drawImage(
      bitmap,
      plan.sx,
      plan.sy,
      plan.sw,
      plan.sh,
      plan.dx,
      plan.dy,
      plan.dw,
      plan.dh,
    )
    if (plan.needClip) {
      ctx.restore()
    }
  }
  catch (err) {
    if ((err as any)?.name === 'AbortError') {
      throw err
    }
    throw new Error(`Render failed: ${(err as Error).message}`)
  }
  finally {
    bitmap?.close()
  }
}
