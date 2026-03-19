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
          relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer
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
            w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-300
            ${isDragging ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-muted/50'}
          `}>
            <IconComponent className={`w-8 h-8 sm:w-10 h-10 ${isDragging ? 'text-primary-foreground' : 'text-primary'}`} />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{label}</h2>
            <p className="text-sm text-muted-foreground mt-2 font-medium">{description}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="bg-muted/50 border-border">
              {accept.join(', ').toUpperCase()}
            </Badge>
            <Badge variant="outline" className="bg-muted/50 border-border">
              MAX {formatFileSize(maxSize)}
            </Badge>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
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

          <div className="grid gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {files.map((file) => (
              <Card
                key={file.id}
                className={`bg-card/50 border-border p-4 hover:bg-card transition-all ${file.error ? 'border-destructive/50' : ''
                  }`}
              >
                <div className="flex items-center gap-4">
                  {/* Preview or Icon */}
                  <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-border">
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
                    <p className="text-sm font-bold text-white truncate pr-4">
                      {file.file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground font-medium">
                        {formatFileSize(file.file.size)}
                      </span>
                      {file.error && (
                        <Badge variant="destructive" className="h-4 py-0 px-1 text-[8px]">ERROR</Badge>
                      )}
                    </div>
                    {file.error && (
                      <p className="text-[10px] text-destructive mt-1 font-medium">{file.error}</p>
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
