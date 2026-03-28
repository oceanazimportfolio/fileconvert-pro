'use client'

import { useCallback, useState, useEffect } from 'react'
import { Upload, X, File, Image, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
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

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

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

  const fileInputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      // Focus ref can go here if needed
    }
  }, [])

  const onZoneClick = () => {
    const input = document.getElementById('file-upload-input') as HTMLInputElement
    if (input) input.click()
  }

  const IconComponent = icon === 'image' ? Image : icon === 'pdf' ? FileText : File

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onClick={onZoneClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300 sm:rounded-3xl sm:p-10
          active:scale-[0.99] touch-manipulation
          ${isDragging
            ? 'border-primary bg-primary/10 scale-[1.01]'
            : 'border-border hover:border-primary/40 bg-card/30 hover:bg-card/50 shadow-sm'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          id="file-upload-input"
          type="file"
          multiple={multiple}
          accept={accept.map(a => `.${a}`).join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ display: 'none' }}
        />

        <div className="flex flex-col items-center gap-6">
          <div className={`
            flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 sm:h-20 sm:w-20
            ${isDragging ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-muted/50'}
          `}>
            <IconComponent className={`h-8 w-8 sm:h-10 sm:w-10 ${isDragging ? 'text-primary-foreground' : 'text-primary'}`} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">{label}</h2>
            <p className="max-w-xl text-sm font-medium text-muted-foreground">{description}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <Badge variant="outline" className="border-border bg-muted/50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
              {accept.join(', ').toUpperCase()}
            </Badge>
            <Badge variant="outline" className="border-border bg-muted/50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
              MAX {formatFileSize(maxSize)}
            </Badge>
            {multiple && (
              <Badge variant="outline" className="border-border bg-muted/50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                Up to {maxFiles} files
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-muted-foreground hover:text-destructive transition-colors h-8"
            >
              Clear all
            </Button>
          </div>

          <div className="grid max-h-[26rem] gap-3 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
            {files.map((file) => (
              <Card
                key={file.id}
                className={`border-border bg-card/50 p-3 transition-all hover:bg-card sm:p-4 ${file.error ? 'border-destructive/50' : ''
                  }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Preview or Icon */}
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/50">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <File className="w-6 h-6 text-primary" />
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate pr-4 text-sm font-bold text-white">
                      {file.file.name}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {formatFileSize(file.file.size)}
                      </span>
                      <Badge variant="outline" className="border-white/10 bg-black/20 text-[10px] uppercase tracking-wide text-slate-300">
                        {file.file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                      </Badge>
                      {file.error && (
                        <Badge variant="destructive" className="h-4 py-0 px-1 text-[8px]">ERROR</Badge>
                      )}
                    </div>
                    {file.error && (
                      <p className="mt-2 text-[10px] font-medium text-destructive">{file.error}</p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => onFileRemove(file.id)}
                    className="size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-transparent shadow-none"
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
