import imageCompression from 'browser-image-compression'
import { readFileAsDataURL } from './fileUtils'

// Supported image formats
export const SUPPORTED_IMAGE_FORMATS = ['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif']

// Image conversion options
export interface ImageConversionOptions {
  format: 'png' | 'jpeg' | 'webp'
  quality: number // 0-100
}

// Image resize options
export interface ImageResizeOptions {
  maxWidth?: number
  maxHeight?: number
  width?: number
  height?: number
  maintainAspectRatio: boolean
}

// Image compression options
export interface ImageCompressionOptions {
  maxSizeMB: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
}

// Convert image to different format
export async function convertImage(
  file: File,
  options: ImageConversionOptions
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }
      
      // Fill with white background for JPEG (which doesn't support transparency)
      if (options.format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      ctx.drawImage(img, 0, 0)
      
      const mimeType = `image/${options.format}`
      const quality = options.quality / 100
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to convert image'))
          }
        },
        mimeType,
        quality
      )
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    
    img.src = url
  })
}

// Resize image
export async function resizeImage(
  file: File,
  options: ImageResizeOptions
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      
      let newWidth = options.width || img.naturalWidth
      let newHeight = options.height || img.naturalHeight
      
      // Calculate dimensions maintaining aspect ratio
      if (options.maintainAspectRatio) {
        if (options.maxWidth && options.maxHeight) {
          const ratio = Math.min(
            options.maxWidth / img.naturalWidth,
            options.maxHeight / img.naturalHeight
          )
          newWidth = Math.round(img.naturalWidth * ratio)
          newHeight = Math.round(img.naturalHeight * ratio)
        } else if (options.maxWidth) {
          const ratio = options.maxWidth / img.naturalWidth
          newWidth = options.maxWidth
          newHeight = Math.round(img.naturalHeight * ratio)
        } else if (options.maxHeight) {
          const ratio = options.maxHeight / img.naturalHeight
          newWidth = Math.round(img.naturalWidth * ratio)
          newHeight = options.maxHeight
        }
      }
      
      const canvas = document.createElement('canvas')
      canvas.width = newWidth
      canvas.height = newHeight
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }
      
      // Enable smooth scaling
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      
      ctx.drawImage(img, 0, 0, newWidth, newHeight)
      
      // Determine output format based on input
      const outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      const quality = outputFormat === 'image/jpeg' ? 0.92 : undefined
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to resize image'))
          }
        },
        outputFormat,
        quality
      )
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    
    img.src = url
  })
}

// Compress image
export async function compressImage(
  file: File,
  options: ImageCompressionOptions
): Promise<Blob> {
  const defaultOptions = {
    maxSizeMB: options.maxSizeMB || 1,
    maxWidthOrHeight: options.maxWidthOrHeight || 1920,
    useWebWorker: options.useWebWorker ?? true,
    fileType: file.type
  }
  
  try {
    const compressedBlob = await imageCompression(file, defaultOptions)
    return compressedBlob
  } catch (error) {
    console.error('Compression error:', error)
    throw new Error('Failed to compress image')
  }
}

// Get image dimensions
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    
    img.src = url
  })
}

// Create image preview URL
export async function createImagePreview(file: File): Promise<string> {
  return readFileAsDataURL(file)
}

// Batch convert images
export async function batchConvertImages(
  files: File[],
  options: ImageConversionOptions,
  onProgress?: (current: number, total: number) => void
): Promise<{ blob: Blob; name: string }[]> {
  const results: { blob: Blob; name: string }[] = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const blob = await convertImage(file, options)
    const extension = options.format === 'jpeg' ? 'jpg' : options.format
    const name = file.name.replace(/\.[^/.]+$/, '') + '.' + extension
    results.push({ blob, name })
    
    if (onProgress) {
      onProgress(i + 1, files.length)
    }
  }
  
  return results
}

// Batch compress images
export async function batchCompressImages(
  files: File[],
  options: ImageCompressionOptions,
  onProgress?: (current: number, total: number) => void
): Promise<{ blob: Blob; name: string; originalSize: number; newSize: number }[]> {
  const results: { blob: Blob; name: string; originalSize: number; newSize: number }[] = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const blob = await compressImage(file, options)
    results.push({
      blob,
      name: file.name,
      originalSize: file.size,
      newSize: blob.size
    })
    
    if (onProgress) {
      onProgress(i + 1, files.length)
    }
  }
  
  return results
}
