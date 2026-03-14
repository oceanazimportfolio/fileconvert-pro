'use client'

import { useCallback, useState } from 'react'
import { Upload, X, File, Image, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatFileSize, generateId, isValidFileType } from '@/lib/fileUtils'

export interface UploadedFile {
  id: string
  file: File
  preview?: string
  error?: string
}

interface FileUploadProps {
  accept: string[]
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in bytes
  onFilesSelected: (files: UploadedFile[]) => void
  files: UploadedFile[]
  onFileRemove: (id: string) => void
  onClearAll: () => void
  label?: string
  description?: string
  icon?: 'image' | 'pdf' | 'file'
}

export function FileUpload({
  accept,
  multiple = true,
  maxFiles = 20,
  maxSize = 50 * 1024 * 1024, // 50MB default
  onFilesSelected,
  files,
  onFileRemove,
  onClearAll,
  label = 'Drop files here',
  description = 'or click to browse',
  icon = 'file'
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const processFiles = useCallback(async (fileList: FileList | File[]) => {
    setIsProcessing(true)
    const fileArray = Array.from(fileList)
    const newFiles: UploadedFile[] = []

    for (const file of fileArray) {
      if (files.length + newFiles.length >= maxFiles) {
        break
      }

      // Validate file type
      if (!isValidFileType(file, accept)) {
        newFiles.push({
          id: generateId(),
          file,
          error: `Invalid file type. Accepted: ${accept.join(', ')}`
        })
        continue
      }

      // Validate file size
      if (file.size > maxSize) {
        newFiles.push({
          id: generateId(),
          file,
          error: `File too large. Max size: ${formatFileSize(maxSize)}`
        })
        continue
      }

      // Create preview for images
      let preview: string | undefined
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file)
      }

      newFiles.push({
        id: generateId(),
        file,
        preview
      })
    }

    onFilesSelected(newFiles)
    setIsProcessing(false)
  }, [accept, files.length, maxFiles, maxSize, onFilesSelected])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }, [processFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files)
    }
  }, [processFiles])

  const IconComponent = icon === 'image' ? Image : icon === 'pdf' ? FileText : File

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragging 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-slate-600 hover:border-slate-500 bg-slate-800/30'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          type="file"
          multiple={multiple}
          accept={accept.map(a => `.${a}`).join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${isDragging ? 'bg-blue-500/20' : 'bg-slate-700/50'}
          `}>
            <IconComponent className={`w-8 h-8 ${isDragging ? 'text-blue-400' : 'text-slate-400'}`} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-white">{label}</p>
            <p className="text-sm text-slate-400 mt-1">{description}</p>
          </div>
          
          <div className="flex gap-2 text-xs text-slate-500">
            <span>Accepted: {accept.join(', ').toUpperCase()}</span>
            <span>•</span>
            <span>Max: {formatFileSize(maxSize)}</span>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-slate-400 hover:text-white"
            >
              Clear all
            </Button>
          </div>

          <div className="grid gap-2 max-h-60 overflow-y-auto pr-2">
            {files.map((file) => (
              <Card
                key={file.id}
                className={`bg-slate-800/50 border-slate-700/50 p-3 ${
                  file.error ? 'border-red-500/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Preview or Icon */}
                  <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <File className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatFileSize(file.file.size)}
                    </p>
                    {file.error && (
                      <p className="text-xs text-red-400">{file.error}</p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onFileRemove(file.id)}
                    className="text-slate-400 hover:text-red-400 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
