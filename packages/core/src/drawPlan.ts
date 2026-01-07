import type { Mode } from './types'

interface DrawPlan {
  // source rect (crop)
  sx: number
  sy: number
  sw: number
  sh: number
  // dest rect (draw in container)
  dx: number
  dy: number
  dw: number
  dh: number
  // container size
  boxW: number
  boxH: number
  // whether we need clip (for position modes)
  needClip: boolean
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function parseAnchor(mode: Mode): { ax: 0 | 0.5 | 1, ay: 0 | 0.5 | 1 } {
  // ax: 0 left, 0.5 center, 1 right
  // ay: 0 top, 0.5 center, 1 bottom
  switch (mode) {
    case 'top': return { ax: 0.5, ay: 0 }
    case 'bottom': return { ax: 0.5, ay: 1 }
    case 'center': return { ax: 0.5, ay: 0.5 }
    case 'left': return { ax: 0, ay: 0.5 }
    case 'right': return { ax: 1, ay: 0.5 }
    case 'top left': return { ax: 0, ay: 0 }
    case 'top right': return { ax: 1, ay: 0 }
    case 'bottom left': return { ax: 0, ay: 1 }
    case 'bottom right': return { ax: 1, ay: 1 }
    default: return { ax: 0.5, ay: 0.5 }
  }
}

/**
 * Build draw plan similar to WeChat mini-program <image mode="...">
 * 构造绘制计划：尽量贴近小程序 mode 语义
 */
export function buildDrawPlan(params: {
  mode: Mode
  imgW: number
  imgH: number
  // user-provided container size (may be undefined)
  width?: number
  height?: number
}): DrawPlan {
  const { mode, imgW, imgH } = params
  const imgRatio = imgW / imgH

  // container size inference:
  let boxW = params.width ?? imgW
  let boxH = params.height ?? imgH

  // widthFix / heightFix: keep aspect ratio by fixing one side
  if (mode === 'widthFix') {
    // width is container width; height is auto
    boxW = params.width ?? imgW
    boxH = Math.round(boxW / imgRatio)
  }
  else if (mode === 'heightFix') {
    boxH = params.height ?? imgH
    boxW = Math.round(boxH * imgRatio)
  }
  else {
    // if only one dimension provided, default the other to image dimension
    // (不强行按比例补全，和小程序容器概念更一致)
    boxW = params.width ?? imgW
    boxH = params.height ?? imgH
  }

  // scaleToFill: stretch to fill
  if (mode === 'scaleToFill' || mode === 'widthFix' || mode === 'heightFix') {
    return {
      sx: 0,
      sy: 0,
      sw: imgW,
      sh: imgH,
      dx: 0,
      dy: 0,
      dw: boxW,
      dh: boxH,
      boxW,
      boxH,
      needClip: false,
    }
  }

  // aspectFit: contain (letterbox)
  if (mode === 'aspectFit') {
    const boxRatio = boxW / boxH
    let dw = boxW
    let dh = boxH
    if (imgRatio > boxRatio) {
      // image wider
      dw = boxW
      dh = boxW / imgRatio
    }
    else {
      // image taller
      dh = boxH
      dw = boxH * imgRatio
    }
    const dx = (boxW - dw) / 2
    const dy = (boxH - dh) / 2
    return {
      sx: 0,
      sy: 0,
      sw: imgW,
      sh: imgH,
      dx,
      dy,
      dw,
      dh,
      boxW,
      boxH,
      needClip: false,
    }
  }

  // aspectFill: cover (crop)
  if (mode === 'aspectFill') {
    const boxRatio = boxW / boxH

    // crop in source space
    let sw = imgW
    let sh = imgH
    let sx = 0
    let sy = 0

    if (imgRatio > boxRatio) {
      // image wider -> crop left/right
      sh = imgH
      sw = imgH * boxRatio
      sx = (imgW - sw) / 2
    }
    else {
      // image taller -> crop top/bottom
      sw = imgW
      sh = imgW / boxRatio
      sy = (imgH - sh) / 2
    }

    // ensure bounds
    sx = clamp(sx, 0, imgW)
    sy = clamp(sy, 0, imgH)
    sw = clamp(sw, 0, imgW - sx)
    sh = clamp(sh, 0, imgH - sy)

    return {
      sx,
      sy,
      sw,
      sh,
      dx: 0,
      dy: 0,
      dw: boxW,
      dh: boxH,
      boxW,
      boxH,
      needClip: false,
    }
  }

  // position modes: no scale, just place and clip to container
  const { ax, ay } = parseAnchor(mode)
  const dx = (boxW - imgW) * ax
  const dy = (boxH - imgH) * ay

  return {
    sx: 0,
    sy: 0,
    sw: imgW,
    sh: imgH,
    dx,
    dy,
    dw: imgW,
    dh: imgH,
    boxW,
    boxH,
    needClip: true,
  }
}
