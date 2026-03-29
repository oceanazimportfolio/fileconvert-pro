'use client'

import imageCompression from 'browser-image-compression'
import UPNG from 'upng-js/UPNG.js'

export type SupportedImageFormat = 'png' | 'jpg' | 'jpeg' | 'webp' | 'avif' | 'gif'
export type OutputImageFormat = 'png' | 'jpeg' | 'webp'
export type OptimizationSeverity = 'smaller' | 'similar' | 'significantly-larger' | 'much-larger'
export type OptimizationTone = 'success' | 'neutral' | 'warning'
export type OptimizationMode = 'convert' | 'compress' | 'resize' | 'background-remove'

export interface SmartSuggestion {
  href: string
  label: string
}

export interface ImageOptimizationResult {
  blob: Blob
  width: number
  height: number
  sourceFormat: SupportedImageFormat
  outputFormat: OutputImageFormat
  inputSize: number
  outputSize: number
  deltaBytes: number
  deltaRatio: number
  severity: OptimizationSeverity
  tone: OptimizationTone
  optimizationEnabled: boolean
  optimized: boolean
  qualityLabel: string
  explanation: string
  suggestionTitle?: string
  suggestions: SmartSuggestion[]
}

export interface ResizeDimensionsOptions {
  width?: number
  height?: number
  maxWidth?: number
  maxHeight?: number
  maintainAspectRatio?: boolean
}

export interface ProcessImageFileOptions {
  outputFormat: OutputImageFormat
  optimizeOutput?: boolean
  quality?: number
  mode?: OptimizationMode
  resize?: ResizeDimensionsOptions
  fillColor?: string
  allowPngQuantization?: boolean
}

export interface CompressImageFileOptions {
  optimizeOutput?: boolean
  maxSizeMB: number
  maxWidthOrHeight?: number
}

export interface OptimizeCanvasOutputOptions {
  sourceFormat: SupportedImageFormat
  inputSize: number
  outputFormat?: OutputImageFormat
  optimizeOutput?: boolean
  quality?: number
  fillColor?: string
  allowPngQuantization?: boolean
  mode?: OptimizationMode
  maxSizeMB?: number
}

const DEFAULT_LOSSY_QUALITY: Record<'jpeg' | 'webp', number> = {
  jpeg: 0.82,
  webp: 0.8,
}

const UNOPTIMIZED_LOSSY_QUALITY: Record<'jpeg' | 'webp', number> = {
  jpeg: 0.92,
  webp: 0.9,
}

export const SIZE_GUARD_THRESHOLDS = {
  significantlyLarger: 1.5,
  muchLarger: 2,
} as const

export async function processImageFile(
  file: File,
  options: ProcessImageFileOptions
): Promise<ImageOptimizationResult> {
  const sourceFormat = getFormatFromFile(file)
  const decoded = await loadImageFromBlob(file)
  const dimensions = calculateDimensions(decoded.width, decoded.height, options.resize)

  const canvas = drawImageToCanvas(decoded.image, {
    width: dimensions.width,
    height: dimensions.height,
    format: options.outputFormat,
    fillColor: options.fillColor,
  })

  return optimizeCanvasOutput(canvas, {
    sourceFormat,
    inputSize: file.size,
    outputFormat: options.outputFormat,
    optimizeOutput: options.optimizeOutput,
    quality: options.quality,
    fillColor: options.fillColor,
    allowPngQuantization: options.allowPngQuantization,
    mode: options.mode ?? 'convert',
  })
}

export async function compressImageFile(
  file: File,
  options: CompressImageFileOptions
): Promise<ImageOptimizationResult> {
  const sourceFormat = getFormatFromFile(file)
  const outputFormat = getPreferredOutputFormat(file)
  const decoded = await loadImageFromBlob(file)
  const dimensions = calculateDimensions(decoded.width, decoded.height, {
    maxWidth: options.maxWidthOrHeight,
    maxHeight: options.maxWidthOrHeight,
    maintainAspectRatio: true,
  })
  const canvas = drawImageToCanvas(decoded.image, {
    width: dimensions.width,
    height: dimensions.height,
    format: outputFormat,
    fillColor: '#FFFFFF',
  })

  return optimizeCanvasOutput(canvas, {
    sourceFormat,
    inputSize: file.size,
    outputFormat,
    optimizeOutput: options.optimizeOutput,
    mode: 'compress',
    maxSizeMB: options.maxSizeMB,
  })
}

export async function optimizeCanvasOutput(
  canvas: HTMLCanvasElement,
  options: OptimizeCanvasOutputOptions
): Promise<ImageOptimizationResult> {
  const outputFormat = options.outputFormat ?? 'png'
  const optimized = options.optimizeOutput ?? true
  const quality = getEffectiveQuality(outputFormat, options.quality, optimized)

  await yieldToMainThread()

  let blob: Blob
  const rawBlob = await exportRawCanvasBlob(canvas, outputFormat, quality)
  let optimizedBlob = rawBlob

  if (optimized) {
    optimizedBlob = outputFormat === 'png'
      ? await encodeCanvasAsOptimizedPng(canvas, options.allowPngQuantization ?? false)
      : await refineLossyBlob(rawBlob, outputFormat, quality, options.maxSizeMB)
  }

  blob = optimized && optimizedBlob.size < rawBlob.size ? optimizedBlob : rawBlob

  return buildOptimizationResult({
    blob,
    width: canvas.width,
    height: canvas.height,
    sourceFormat: options.sourceFormat,
    outputFormat,
    inputSize: options.inputSize,
    optimizationEnabled: optimized,
    optimized: optimized && optimizedBlob.size < rawBlob.size,
    qualityLabel: getQualityLabel(outputFormat, quality),
    mode: options.mode ?? 'convert',
  })
}

export async function getImageDimensions(
  source: Blob
): Promise<{ width: number; height: number }> {
  const decoded = await loadImageFromBlob(source)
  return {
    width: decoded.width,
    height: decoded.height,
  }
}

export function getFormatFromFile(file: File | Blob): SupportedImageFormat {
  const byMime = getFormatFromMimeType(file.type)
  if (byMime) {
    return byMime
  }

  if ('name' in file && typeof file.name === 'string') {
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'webp' || extension === 'avif' || extension === 'gif') {
      return extension as SupportedImageFormat
    }
  }

  return 'png'
}

export function getFormatLabel(format: SupportedImageFormat | OutputImageFormat): string {
  return format === 'jpeg' ? 'JPG' : format.toUpperCase()
}

export function getOutputExtension(format: OutputImageFormat): string {
  return format === 'jpeg' ? 'jpg' : format
}

export function getPreferredOutputFormat(file: File): OutputImageFormat {
  const format = getFormatFromFile(file)
  if (format === 'png' || format === 'gif') {
    return 'png'
  }
  if (format === 'webp') {
    return 'webp'
  }
  return 'jpeg'
}

function getFormatFromMimeType(mimeType?: string): SupportedImageFormat | null {
  switch (mimeType) {
    case 'image/png':
      return 'png'
    case 'image/jpeg':
      return 'jpeg'
    case 'image/webp':
      return 'webp'
    case 'image/avif':
      return 'avif'
    case 'image/gif':
      return 'gif'
    default:
      return null
  }
}

function getMimeTypeForFormat(format: OutputImageFormat): string {
  switch (format) {
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    default:
      return 'image/jpeg'
  }
}

function getQualityLabel(format: OutputImageFormat, quality?: number): string {
  if (format === 'png') {
    return 'lossless quality'
  }

  if (!quality) {
    return 'balanced quality'
  }

  return `quality ${Math.round(quality * 100)}%`
}

function getEffectiveQuality(
  format: OutputImageFormat,
  requestedQuality: number | undefined,
  optimizeOutput: boolean
): number | undefined {
  if (format === 'png') {
    return undefined
  }

  if (typeof requestedQuality === 'number') {
    return clampQuality(requestedQuality)
  }

  return optimizeOutput ? DEFAULT_LOSSY_QUALITY[format] : UNOPTIMIZED_LOSSY_QUALITY[format]
}

function clampQuality(value: number): number {
  return Math.min(1, Math.max(0.1, value))
}

function calculateDimensions(
  sourceWidth: number,
  sourceHeight: number,
  resize?: ResizeDimensionsOptions
): { width: number; height: number } {
  if (!resize) {
    return { width: sourceWidth, height: sourceHeight }
  }

  const maintainAspectRatio = resize.maintainAspectRatio ?? true
  let width = resize.width ?? sourceWidth
  let height = resize.height ?? sourceHeight

  if (maintainAspectRatio) {
    if (resize.maxWidth && resize.maxHeight) {
      const ratio = Math.min(resize.maxWidth / sourceWidth, resize.maxHeight / sourceHeight, 1)
      width = Math.round(sourceWidth * ratio)
      height = Math.round(sourceHeight * ratio)
    } else if (resize.maxWidth) {
      const ratio = Math.min(resize.maxWidth / sourceWidth, 1)
      width = Math.round(sourceWidth * ratio)
      height = Math.round(sourceHeight * ratio)
    } else if (resize.maxHeight) {
      const ratio = Math.min(resize.maxHeight / sourceHeight, 1)
      width = Math.round(sourceWidth * ratio)
      height = Math.round(sourceHeight * ratio)
    } else if (resize.width && !resize.height) {
      const ratio = resize.width / sourceWidth
      width = resize.width
      height = Math.round(sourceHeight * ratio)
    } else if (resize.height && !resize.width) {
      const ratio = resize.height / sourceHeight
      width = Math.round(sourceWidth * ratio)
      height = resize.height
    }
  }

  return {
    width: Math.max(1, Math.round(width)),
    height: Math.max(1, Math.round(height)),
  }
}

function drawImageToCanvas(
  image: CanvasImageSource,
  options: {
    width: number
    height: number
    format: OutputImageFormat
    fillColor?: string
  }
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = options.width
  canvas.height = options.height

  const ctx = canvas.getContext('2d', { alpha: options.format !== 'jpeg' })
  if (!ctx) {
    throw new Error('Could not get canvas context')
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  if (options.format === 'jpeg') {
    ctx.fillStyle = options.fillColor ?? '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas
}

async function loadImageFromBlob(source: Blob): Promise<{ image: HTMLImageElement; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(source)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        image,
        width: image.naturalWidth,
        height: image.naturalHeight,
      })
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    image.src = url
  })
}

async function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('Failed to export image'))
      }
    }, mimeType, quality)
  })
}

async function exportRawCanvasBlob(
  canvas: HTMLCanvasElement,
  outputFormat: OutputImageFormat,
  quality?: number
): Promise<Blob> {
  return canvasToBlob(canvas, getMimeTypeForFormat(outputFormat), quality)
}

async function encodeCanvasAsOptimizedPng(canvas: HTMLCanvasElement, allowPngQuantization: boolean): Promise<Blob> {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    throw new Error('Could not get canvas context')
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const colorCount = allowPngQuantization ? 256 : 0
  const buffer = UPNG.encode([imageData.data.buffer], canvas.width, canvas.height, colorCount)

  await yieldToMainThread()

  return new Blob([buffer], { type: 'image/png' })
}

async function refineLossyBlob(
  blob: Blob,
  outputFormat: 'jpeg' | 'webp',
  quality?: number,
  maxSizeMB?: number
): Promise<Blob> {
  const blobSizeMB = blob.size / (1024 * 1024)
  if (blobSizeMB <= 0.05) {
    return blob
  }

  const targetSizeMB = maxSizeMB
    ? Math.min(maxSizeMB, Math.max(0.05, blobSizeMB * 0.9))
    : Math.max(0.05, blobSizeMB * 0.9)
  const file = new File([blob], `optimized.${getOutputExtension(outputFormat)}`, {
    type: getMimeTypeForFormat(outputFormat),
  })

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: targetSizeMB,
      useWebWorker: true,
      fileType: file.type,
      initialQuality: quality ?? DEFAULT_LOSSY_QUALITY[outputFormat],
      alwaysKeepResolution: true,
      maxIteration: 6,
    })

    return compressed.size < blob.size ? compressed : blob
  } catch {
    return blob
  }
}

function buildOptimizationResult(input: {
  blob: Blob
  width: number
  height: number
  sourceFormat: SupportedImageFormat
  outputFormat: OutputImageFormat
  inputSize: number
  optimizationEnabled: boolean
  optimized: boolean
  qualityLabel: string
  mode: OptimizationMode
}): ImageOptimizationResult {
  const outputSize = input.blob.size
  const deltaBytes = outputSize - input.inputSize
  const ratio = input.inputSize > 0 ? outputSize / input.inputSize : 1
  const severity = classifySizeChange(ratio)
  const tone = getToneForSeverity(severity)

  return {
    blob: input.blob,
    width: input.width,
    height: input.height,
    sourceFormat: input.sourceFormat,
    outputFormat: input.outputFormat,
    inputSize: input.inputSize,
    outputSize,
    deltaBytes,
    deltaRatio: ratio,
    severity,
    tone,
    optimizationEnabled: input.optimizationEnabled,
    optimized: input.optimized,
    qualityLabel: input.qualityLabel,
    explanation: buildExplanation({
      sourceFormat: input.sourceFormat,
      outputFormat: input.outputFormat,
      severity,
      optimized: input.optimized,
      mode: input.mode,
    }),
    suggestionTitle: getSuggestionTitle({
      sourceFormat: input.sourceFormat,
      outputFormat: input.outputFormat,
      severity,
    }),
    suggestions: buildSuggestions({
      sourceFormat: input.sourceFormat,
      outputFormat: input.outputFormat,
      severity,
    }),
  }
}

function classifySizeChange(ratio: number): OptimizationSeverity {
  if (ratio >= SIZE_GUARD_THRESHOLDS.muchLarger) {
    return 'much-larger'
  }

  if (ratio >= SIZE_GUARD_THRESHOLDS.significantlyLarger) {
    return 'significantly-larger'
  }

  if (ratio <= 0.95) {
    return 'smaller'
  }

  return 'similar'
}

function getToneForSeverity(severity: OptimizationSeverity): OptimizationTone {
  if (severity === 'smaller') {
    return 'success'
  }

  if (severity === 'significantly-larger' || severity === 'much-larger') {
    return 'warning'
  }

  return 'neutral'
}

function buildExplanation(input: {
  sourceFormat: SupportedImageFormat
  outputFormat: OutputImageFormat
  severity: OptimizationSeverity
  optimized: boolean
  mode: OptimizationMode
}): string {
  const sourceLabel = getFormatLabel(input.sourceFormat)
  const outputLabel = getFormatLabel(input.outputFormat)

  if (input.severity === 'smaller') {
    if (input.mode === 'compress') {
      return `${outputLabel} output was optimized successfully and reduced the original file size.`
    }

    if (input.sourceFormat === 'png' && (input.outputFormat === 'jpeg' || input.outputFormat === 'webp')) {
      return `${outputLabel} is usually much smaller than PNG, so this conversion is a strong choice for web delivery.`
    }

    return `${outputLabel} output was optimized successfully and is smaller than the original ${sourceLabel} file.`
  }

  if (input.severity === 'similar') {
    if (input.outputFormat === 'png' && isLosslessPngTradeoff(input.sourceFormat)) {
      return `PNG is lossless, so a slightly larger result can be normal when converting from ${sourceLabel}.`
    }

    return `${outputLabel} stays close to the original size here, which is normal for this format combination.`
  }

  if (input.outputFormat === 'png' && input.mode === 'background-remove') {
    return 'Transparent PNG keeps clean edges and alpha data, so larger output can be expected after background removal.'
  }

  if (input.severity === 'much-larger' && input.outputFormat === 'png' && isLosslessPngTradeoff(input.sourceFormat)) {
    return 'PNG is lossless and may be much larger than AVIF, WebP, or JPG. Keep PNG if you need transparency or edit-friendly quality.'
  }

  if (input.outputFormat === 'png' && isLosslessPngTradeoff(input.sourceFormat)) {
    return `PNG preserves lossless image data, so converting from ${sourceLabel} can increase file size noticeably.`
  }

  if (!input.optimized) {
    return `${outputLabel} export completed with optimization turned off, so the result may prioritize quality over size.`
  }

  return `${outputLabel} export completed, but this format can still run larger than the original in some cases.`
}

function getSuggestionTitle(input: {
  sourceFormat: SupportedImageFormat
  outputFormat: OutputImageFormat
  severity: OptimizationSeverity
}): string | undefined {
  if (input.outputFormat === 'png' && (input.severity === 'significantly-larger' || input.severity === 'much-larger')) {
    return 'Want a smaller file instead?'
  }

  if (input.sourceFormat === 'png' && (input.outputFormat === 'jpeg' || input.outputFormat === 'webp') && input.severity === 'smaller') {
    return 'Smaller web-ready output'
  }

  return undefined
}

function buildSuggestions(input: {
  sourceFormat: SupportedImageFormat
  outputFormat: OutputImageFormat
  severity: OptimizationSeverity
}): SmartSuggestion[] {
  const suggestions: SmartSuggestion[] = []

  if (input.outputFormat === 'png' && (input.severity === 'significantly-larger' || input.severity === 'much-larger')) {
    if (input.sourceFormat === 'webp' || input.sourceFormat === 'avif') {
      suggestions.push({
        label: 'Convert to JPG',
        href: getConversionHref(`${normalizeSourceFormat(input.sourceFormat)}_jpg`),
      })
    }

    if (input.sourceFormat === 'jpg' || input.sourceFormat === 'jpeg' || input.sourceFormat === 'avif') {
      suggestions.push({
        label: 'Convert to WebP',
        href: getConversionHref(`${normalizeSourceFormat(input.sourceFormat)}_webp`),
      })
    }

    suggestions.push({
      label: 'Compress image',
      href: '/tools/image-compress/',
    })
  }

  if (input.sourceFormat === 'png' && input.outputFormat === 'jpeg' && input.severity === 'smaller') {
    suggestions.push({
      label: 'Open PNG to JPG',
      href: '/tools/png-to-jpg/',
    })
  }

  return suggestions
}

function getConversionHref(conversionType: string): string {
  switch (conversionType) {
    case 'png_jpg':
      return '/tools/png-to-jpg/'
    case 'jpg_png':
    case 'jpeg_png':
      return '/tools/jpg-to-png/'
    case 'webp_png':
      return '/tools/webp-to-png/'
    case 'webp_jpg':
      return '/tools/webp-to-jpg/'
    case 'avif_png':
      return '/tools/avif-to-png/'
    case 'png_webp':
    case 'jpg_webp':
    case 'jpeg_webp':
    case 'avif_jpg':
    case 'avif_webp':
      return `/tools/image-converter/?conversion=${conversionType}`
    default:
      return `/tools/image-converter/?conversion=${conversionType}`
  }
}

function normalizeSourceFormat(format: SupportedImageFormat): SupportedImageFormat {
  return format === 'jpeg' ? 'jpg' : format
}

function isLosslessPngTradeoff(sourceFormat: SupportedImageFormat): boolean {
  return sourceFormat === 'jpg' || sourceFormat === 'jpeg' || sourceFormat === 'webp' || sourceFormat === 'avif'
}

export async function yieldToMainThread(): Promise<void> {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 0)
  })
}
