'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
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
import { trackConversion } from '@/lib/analytics'

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

interface ImageConverterProps {
  defaultConversionType?: string
  lockedMode?: boolean
  toolSlug?: string
}

export function ImageConverter({ defaultConversionType = 'png_jpg', lockedMode = false, toolSlug = 'image-converter' }: ImageConverterProps = {}) {
  const [files, setFiles] = useState<ProcessingFile[]>([])
  const [conversionType, setConversionType] = useState<string>(defaultConversionType)
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

    const [fromFmt, toFmt] = conversionType.split('_')
    trackConversion(toolSlug, 'convert', toFmt)

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
    trackConversion(toolSlug, 'download', toFormat)
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
    trackConversion(toolSlug, 'download', 'zip')
  }

  const validFiles = files.filter(f => !f.error && f.status !== 'error')
  const doneFiles = files.filter(f => f.status === 'done')

  const [fromFmt, toFmt] = conversionType.split('_')
  const currentLabel = CONVERT_OPTIONS.find(o => `${o.from}_${o.to}` === conversionType)?.label ?? conversionType.replace('_', ' → ').toUpperCase()

  return (
    <div className="space-y-8">
      {/* Locked Mode Banner */}
      {lockedMode && (
        <Card className="bg-primary/5 border-primary/20 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ImageIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-white font-bold tracking-tight">{currentLabel} Conversion</p>
              <p className="text-xs text-muted-foreground mt-0.5">Format locked for this page</p>
            </div>
          </div>
        </Card>
      )}

      {/* Conversion Type Selection — hidden in locked mode */}
      {!lockedMode && (
        <div className="space-y-4">
          <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Select Conversion Format</Label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {CONVERT_OPTIONS.map((option) => {
              const isActive = conversionType === `${option.from}_${option.to}`
              return (
                <Button
                  key={`${option.from}_${option.to}`}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => setConversionType(`${option.from}_${option.to}`)}
                  className="justify-center h-12"
                >
                  <span className="text-xs font-black">{option.label}</span>
                </Button>
              )
            })}
          </div>

          {/* ADDED SECTION FOR SEO OUTREACH */}
          <div className="mt-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <p className="text-white font-medium text-sm mb-3">Or use dedicated pages for faster conversion</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/tools/png-to-jpg/"><Button variant="outline" size="sm" className="bg-card hover:bg-muted font-bold text-xs rounded-full h-8 px-4 border-border/50">PNG → JPG</Button></Link>
              <Link href="/tools/jpg-to-png/"><Button variant="outline" size="sm" className="bg-card hover:bg-muted font-bold text-xs rounded-full h-8 px-4 border-border/50">JPG → PNG</Button></Link>
              <Link href="/tools/webp-to-png/"><Button variant="outline" size="sm" className="bg-card hover:bg-muted font-bold text-xs rounded-full h-8 px-4 border-border/50">WebP → PNG</Button></Link>
              <Link href="/tools/webp-to-jpg/"><Button variant="outline" size="sm" className="bg-card hover:bg-muted font-bold text-xs rounded-full h-8 px-4 border-border/50">WebP → JPG</Button></Link>
              <Link href="/tools/avif-to-png/"><Button variant="outline" size="sm" className="bg-card hover:bg-muted font-bold text-xs rounded-full h-8 px-4 border-border/50">AVIF → PNG</Button></Link>
            </div>
          </div>
        </div>
      )}

      {/* Quality Slider (for JPG output) */}
      {conversionType.endsWith('_jpg') && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Label className="text-white font-bold">Output Quality</Label>
            <Badge variant="default" className="font-mono">
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
          <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-4">
            <span>Compact</span>
            <span className="text-primary/70">Balanced (85-95%)</span>
            <span>HD Quality</span>
          </div>
        </Card>
      )}

      {/* File Upload */}
      <FileUpload
        accept={lockedMode
          ? [fromFmt === 'jpg' ? 'jpeg' : fromFmt, fromFmt === 'jpg' ? 'jpg' : fromFmt]
          : ['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif']}
        multiple
        maxFiles={30}
        maxSize={25 * 1024 * 1024}
        onFilesSelected={handleFilesSelected}
        files={files.filter(f => f.status === 'pending' || f.error)}
        onFileRemove={handleRemoveFile}
        onClearAll={handleClearAll}
        label={lockedMode
          ? `Drop ${fromFmt.toUpperCase()} images here`
          : 'Drop images here'}
        description={lockedMode
          ? `Support .${fromFmt} files up to 25MB`
          : 'Supports PNG, JPG, WebP, AVIF up to 25MB'}
        icon="image"
      />

      {/* Progress */}
      {isProcessing && (
        <Card className="p-6 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-4 mb-4">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="text-white font-bold uppercase tracking-widest text-xs">Processing {progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300 shadow-[0_0_10px_rgba(var(--primary),0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>
      )}

      {/* Results */}
      {doneFiles.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">
              Ready for Download ({doneFiles.length})
            </h2>
            {doneFiles.length > 1 && (
              <Button onClick={handleDownloadAll} variant="secondary" size="sm" className="gap-2 w-full sm:w-auto">
                <Download className="w-4 h-4" />
                Download Zip
              </Button>
            )}
          </div>

          <div className="grid gap-3">
            {doneFiles.map((file) => {
              const savedPercent = file.resultSize && file.resultSize < file.file.size
                ? calculateCompressionRatio(file.file.size, file.resultSize)
                : null

              return (
                <Card key={file.id} className="p-4 hover:border-primary/30 transition-all group">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex items-center gap-4 w-full sm:flex-1 min-w-0">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-border bg-muted flex-shrink-0">
                        {file.preview ? (
                          <img src={file.preview} alt={file.file.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <p className="text-white font-black truncate text-sm">{file.file.name}</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-muted-foreground font-medium">{formatFileSize(file.file.size)}</span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                          <span className="text-emerald-400 font-bold">{formatFileSize(file.resultSize || 0)}</span>
                          {savedPercent !== null && savedPercent > 0 && (
                            <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/5 text-[8px] h-4">-{savedPercent}%</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleDownload(file)}
                      size="sm"
                      className="gap-2 w-full sm:w-auto min-w-[140px]"
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
          className="w-full h-16 text-lg uppercase tracking-widest font-black transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          {isProcessing ? (
            <><Loader2 className="w-6 h-6 mr-3 animate-spin" />Processing...</>
          ) : (
            <><ArrowRight className="w-6 h-6 mr-3" />Start Conversion</>
          )}
        </Button>
      )}
    </div>
  )
}
