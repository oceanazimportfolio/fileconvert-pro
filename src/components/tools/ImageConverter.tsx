'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
  Image as ImageIcon, ArrowRight, Download, Loader2, Trash2,
  CheckCircle, AlertCircle
} from 'lucide-react'
import { FileUpload, UploadedFile } from '@/components/FileUpload'
import {
  batchConvertImages,
  getImageDimensions
} from '@/lib/imageUtils'
import {
  downloadFile,
  downloadAsZip,
  formatFileSize,
  changeFileExtension,
  calculateCompressionRatio
} from '@/lib/fileUtils'

interface ProcessingFile extends UploadedFile {
  status: 'pending' | 'processing' | 'done' | 'error'
  result?: Blob
  resultSize?: number
  dimensions?: { width: number; height: number }
}

const CONVERT_OPTIONS = [
  { from: 'png', to: 'jpg', label: 'PNG → JPG' },
  { from: 'jpg', to: 'png', label: 'JPG → PNG' },
  { from: 'webp', to: 'png', label: 'WebP → PNG' },
  { from: 'webp', to: 'jpg', label: 'WebP → JPG' },
  { from: 'avif', to: 'png', label: 'AVIF → PNG' },
] as const

type ConversionType = string

export function ImageConverter() {
  const [files, setFiles] = useState<ProcessingFile[]>([])
  const [conversionType, setConversionType] = useState<string>('png_jpg')
  const [quality, setQuality] = useState(92)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFilesSelected = useCallback(async (newFiles: UploadedFile[]) => {
    const processedFiles: ProcessingFile[] = await Promise.all(
      newFiles.map(async (f) => {
        let dimensions
        try {
          dimensions = await getImageDimensions(f.file)
        } catch {
          // ignore dimension errors
        }
        return {
          ...f,
          status: 'pending' as const,
          dimensions
        }
      })
    )
    setFiles(prev => [...prev, ...processedFiles])
  }, [])

  const handleRemoveFile = useCallback((id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }, [])

  const handleClearAll = useCallback(() => {
    files.forEach(f => {
      if (f.preview) URL.revokeObjectURL(f.preview)
    })
    setFiles([])
  }, [files])

  const handleConvert = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending' && !f.error)
    if (pendingFiles.length === 0) return

    setIsProcessing(true)
    setProgress(0)

    const [fromFormat, toFormat] = conversionType.split('_')
    const outputFormat = toFormat as 'png' | 'jpeg' | 'webp'

    for (let i = 0; i < pendingFiles.length; i++) {
      const file = pendingFiles[i]

      setFiles(prev => prev.map(f =>
        f.id === file.id ? { ...f, status: 'processing' } : f
      ))

      try {
        const result = await batchConvertImages(
          [file.file],
          { format: outputFormat, quality },
          (current, total) => setProgress(((i * total + current) / (pendingFiles.length * total)) * 100)
        )

        setFiles(prev => prev.map(f =>
          f.id === file.id ? {
            ...f,
            status: 'done',
            result: result[0].blob,
            resultSize: result[0].blob.size
          } : f
        ))
      } catch {
        setFiles(prev => prev.map(f =>
          f.id === file.id ? { ...f, status: 'error' } : f
        ))
      }
    }

    setIsProcessing(false)
    setProgress(100)
  }

  const handleDownload = async (file: ProcessingFile) => {
    if (!file.result) return
    const [_, toFormat] = conversionType.split('_')
    const newName = changeFileExtension(file.file.name, toFormat)
    downloadFile(file.result, newName)
  }

  const handleDownloadAll = async () => {
    const doneFiles = files.filter(f => f.status === 'done' && f.result)
    if (doneFiles.length === 0) return

    const [_, toFormat] = conversionType.split('_')

    const filesToDownload = doneFiles.map(f => ({
      blob: f.result!,
      name: changeFileExtension(f.file.name, toFormat)
    }))

    await downloadAsZip(filesToDownload, `converted_images.zip`)
  }

  const validFiles = files.filter(f => !f.error && f.status !== 'error')
  const doneFiles = files.filter(f => f.status === 'done')

  return (
    <div className="space-y-6">
      {/* Conversion Type Selection */}
      <div>
        <Label className="text-white mb-3 block">Select Conversion Type</Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {CONVERT_OPTIONS.map((option) => (
            <Button
              key={`${option.from}_${option.to}`}
              variant="outline"
              onClick={() => setConversionType(`${option.from}_${option.to}`)}
              className={`
                justify-start text-left h-auto py-3 px-4
                ${conversionType === `${option.from}_${option.to}`
                  ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                  : 'bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                }
              `}
            >
              <ImageIcon className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{option.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Quality Slider (for JPG output) */}
      {conversionType.endsWith('_jpg') && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-white">Quality</Label>
            <Badge variant="secondary" className="bg-slate-700 text-white">
              {quality}%
            </Badge>
          </div>
          <Slider
            value={[quality]}
            onValueChange={([value]) => setQuality(value)}
            min={10}
            max={100}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-slate-500 mt-1">
            Lower quality = smaller file size. 85-95% is recommended for most images.
          </p>
        </div>
      )}

      {/* File Upload */}
      <FileUpload
        accept={['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif']}
        multiple
        maxFiles={30}
        maxSize={25 * 1024 * 1024}
        onFilesSelected={handleFilesSelected}
        files={files.filter(f => f.status === 'pending' || f.error)}
        onFileRemove={handleRemoveFile}
        onClearAll={handleClearAll}
        label="Drop images here to convert"
        description="or click to browse"
        icon="image"
      />

      {/* Progress */}
      {isProcessing && (
        <Card className="bg-slate-800/50 border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            <span className="text-white">Converting images...</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>
      )}

      {/* Results */}
      {doneFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Converted Files ({doneFiles.length})
            </h3>
            {doneFiles.length > 1 && (
              <Button onClick={handleDownloadAll} variant="secondary" className="gap-2 w-full sm:w-auto font-semibold">
                <Download className="w-4 h-4" />
                Download All (.zip)
              </Button>
            )}
          </div>

          <div className="grid gap-3">
            {doneFiles.map((file) => {
              const savedPercent = file.resultSize && file.resultSize < file.file.size
                ? calculateCompressionRatio(file.file.size, file.resultSize)
                : null

              return (
                <Card key={file.id} className="bg-slate-800/40 border-slate-700/50 p-4 sm:p-5 hover:bg-slate-800/60 transition-colors overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {/* File Info Area */}
                    <div className="flex items-center gap-4 w-full sm:flex-1 min-w-0">
                      {file.preview ? (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 shadow-lg ring-1 ring-white/10 rounded-lg overflow-hidden">
                          <img
                            src={file.preview}
                            alt={file.file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-700">
                          <ImageIcon className="w-7 h-7 text-slate-500" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <p className="text-white font-semibold truncate text-sm sm:text-base pr-2">{file.file.name}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
                          <span className="text-slate-400 font-medium">
                            {formatFileSize(file.file.size)}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                          <span className="text-emerald-400 font-bold whitespace-nowrap">
                            {formatFileSize(file.resultSize || 0)}
                          </span>
                          {savedPercent !== null && savedPercent > 0 && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] sm:text-xs font-bold py-0 h-5">
                              -{savedPercent}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Area */}
                    <Button
                      onClick={() => handleDownload(file)}
                      size="lg"
                      className="gap-2 w-full sm:w-auto font-bold px-8 shadow-blue-500/20"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Convert Button */}
      {validFiles.filter(f => f.status === 'pending').length > 0 && (
        <Button
          onClick={handleConvert}
          disabled={isProcessing}
          size="lg"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <ArrowRight className="w-5 h-5 mr-2" />
              Convert {validFiles.filter(f => f.status === 'pending').length} Image{validFiles.filter(f => f.status === 'pending').length !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      )}
    </div>
  )
}
