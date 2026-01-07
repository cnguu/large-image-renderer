export type Mode
  = | 'scaleToFill'
    | 'aspectFit'
    | 'aspectFill'
    | 'widthFix'
    | 'heightFix'
    | 'top'
    | 'bottom'
    | 'center'
    | 'left'
    | 'right'
    | 'top left'
    | 'top right'
    | 'bottom left'
    | 'bottom right'

export interface DrawBigImageOptions {
  /**
   * Image URL (CORS required if cross-origin)
   * 图片 URL（跨域必须支持 CORS，否则可能污染 canvas）
   */
  imageUrl: string

  /**
   * Canvas element or element id string
   * Canvas 元素或 Canvas id 字符串
   */
  canvas: string | HTMLCanvasElement

  /**
   * Target render width
   * 目标绘制宽度
   */
  width?: number

  /**
   * Target render height
   * 目标绘制高度
   */
  height?: number

  /**
   * Whether to resize canvas to match target size
   * 是否将 canvas 尺寸自动调整为目标尺寸
   * @default true
   */
  fitCanvasSize?: boolean

  /**
   * render mode
   * 渲染模式，类似微信小程序 image 组件的 mode
   * @default 'aspectFill'
   */
  mode?: Mode

  /**
   * AbortSignal to cancel image loading
   * 取消加载
   */
  signal?: AbortSignal

  /**
   * Additional CanvasRenderingContext2D options
   * 额外的 Canvas 2D context 初始化参数
   */
  ctxOptions?: CanvasRenderingContext2DSettings
}
