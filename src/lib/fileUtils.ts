import { saveAs } from 'file-saver'
import JSZip from 'jszip'

function fallbackDownload(blob: Blob, filename: string): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    const objectUrl = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = objectUrl
    anchor.download = filename
    anchor.rel = 'noopener noreferrer'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
    return true
  } catch {
    return false
  }
}

// Format file size to human readable format
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Get file extension
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase()
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Read file as ArrayBuffer
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

// Read file as Data URL
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Read file as Text
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// Download single file
export function downloadFile(blob: Blob, filename: string): boolean {
  try {
    saveAs(blob, filename)
    return true
  } catch {
    return fallbackDownload(blob, filename)
  }
}

// Download multiple files as ZIP
export async function downloadAsZip(
  files: { blob: Blob; name: string }[],
  zipName: string = 'converted_files.zip'
): Promise<boolean> {
  const zip = new JSZip()
  
  files.forEach(({ blob, name }) => {
    zip.file(name, blob)
  })
  
  const zipBlob = await zip.generateAsync({ type: 'blob' })

  try {
    saveAs(zipBlob, zipName)
    return true
  } catch {
    return fallbackDownload(zipBlob, zipName)
  }
}

// Validate file type
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  const extension = getFileExtension(file.name)
  return allowedTypes.some(type => 
    type.toLowerCase() === extension || 
    file.type === type ||
    file.type.includes(type)
  )
}

// Get MIME type from extension
export function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'webp': 'image/webp',
    'avif': 'image/avif',
    'gif': 'image/gif',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream'
}

// Change file extension
export function changeFileExtension(filename: string, newExtension: string): string {
  const lastDotIndex = filename.lastIndexOf('.')
  const baseName = lastDotIndex > 0 ? filename.slice(0, lastDotIndex) : filename
  return `${baseName}.${newExtension}`
}

// Calculate compression ratio
export function calculateCompressionRatio(originalSize: number, newSize: number): number {
  if (originalSize === 0) return 0
  return Math.round(((originalSize - newSize) / originalSize) * 100)
}
