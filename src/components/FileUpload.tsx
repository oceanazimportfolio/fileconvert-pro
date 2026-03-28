'use client'

import { useCallback, useState, useEffect, useId } from 'react'
import { X, File, Image, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmbeddedBrowserNotice } from '@/components/EmbeddedBrowserNotice'
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
  const inputId = useId()
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
      e.target.value = ''
    }
  }, [processFiles])

  const IconComponent = icon === 'image' ? Image : icon === 'pdf' ? FileText : File

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <input
        id={inputId}
        type="file"
        multiple={multiple}
        accept={accept.map(a => `.${a}`).join(',')}
        onChange={handleFileInput}
        className="sr-only"
      />
      <label
        htmlFor={inputId}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative block cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition-all duration-300 sm:rounded-3xl sm:p-8 lg:p-10
          active:scale-[0.99] touch-manipulation
          ${isDragging
            ? 'border-primary bg-primary/10 scale-[1.01]'
            : 'border-border hover:border-primary/40 bg-card/30 hover:bg-card/50 shadow-sm'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <div className="flex flex-col items-center gap-5 sm:gap-6">
          <div className={`
            flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 sm:h-20 sm:w-20
            ${isDragging ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-muted/50'}
          `}>
            <IconComponent className={`h-8 w-8 sm:h-10 sm:w-10 ${isDragging ? 'text-primary-foreground' : 'text-primary'}`} />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-black tracking-tight text-white sm:text-2xl">{label}</h2>
            <p className="max-w-xl text-sm font-medium text-muted-foreground sm:text-[15px]">{description}</p>
          </div>

          <span className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20">
            Choose files
          </span>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <Badge variant="outline" className="border-border bg-muted/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider sm:text-[11px]">
              {accept.join(', ').toUpperCase()}
            </Badge>
            <Badge variant="outline" className="border-border bg-muted/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider sm:text-[11px]">
              MAX {formatFileSize(maxSize)}
            </Badge>
            {multiple && (
              <Badge variant="outline" className="border-border bg-muted/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider sm:text-[11px]">
                Up to {maxFiles} files
              </Badge>
            )}
          </div>
        </div>
      </label>

      <EmbeddedBrowserNotice context="upload" />

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

          <div className="grid max-h-[20rem] gap-3 overflow-y-auto pr-1 sm:max-h-[26rem] sm:pr-2 custom-scrollbar">
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
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white sm:pr-4">
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
                    className="size-9 self-start rounded-lg border-transparent text-muted-foreground shadow-none hover:bg-destructive/10 hover:text-destructive sm:self-center"
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
