'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
  Image as ImageIcon,
  ArrowRight,
  Download,
  Loader2,
  CheckCircle,
} from 'lucide-react'
import { FileUpload, UploadedFile } from '@/components/FileUpload'
import { ConversionOptimizationPanel } from '@/components/tools/ConversionOptimizationPanel'
import {
  getImageDimensions,
  type ImageOptimizationResult,
  type OutputImageFormat,
  getOutputExtension,
  processImageFile,
} from '@/lib/imagePipeline'
import {
  downloadFile,
  downloadAsZip,
  formatFileSize,
  changeFileExtension,
} from '@/lib/fileUtils'
import { trackConversion } from '@/lib/analytics'

interface ProcessingFile extends UploadedFile {
  status: 'pending' | 'processing' | 'done' | 'error'
  resultInfo?: ImageOptimizationResult
  dimensions?: { width: number; height: number }
}

const CONVERT_OPTIONS = [
  { from: 'png', to: 'jpg', label: 'PNG -> JPG' },
  { from: 'png', to: 'webp', label: 'PNG -> WebP' },
  { from: 'jpg', to: 'png', label: 'JPG -> PNG' },
  { from: 'jpg', to: 'webp', label: 'JPG -> WebP' },
  { from: 'webp', to: 'png', label: 'WebP -> PNG' },
  { from: 'webp', to: 'jpg', label: 'WebP -> JPG' },
  { from: 'avif', to: 'png', label: 'AVIF -> PNG' },
  { from: 'avif', to: 'jpg', label: 'AVIF -> JPG' },
  { from: 'avif', to: 'webp', label: 'AVIF -> WebP' },
] as const

const AVAILABLE_CONVERSIONS = new Set(
  CONVERT_OPTIONS.map((option) => `${option.from}_${option.to}`)
)

interface ImageConverterProps {
  defaultConversionType?: string
  lockedMode?: boolean
  toolSlug?: string
}

function toOutputFormat(value: string): OutputImageFormat {
  return value === 'jpg' ? 'jpeg' : (value as OutputImageFormat)
}

function isQualityControlled(conversionType: string): boolean {
  return conversionType.endsWith('_jpg') || conversionType.endsWith('_webp')
}

export function ImageConverter({
  defaultConversionType = 'png_jpg',
  lockedMode = false,
  toolSlug = 'image-converter',
}: ImageConverterProps = {}) {
  const searchParams = useSearchParams()
  const requestedConversion = !lockedMode ? searchParams.get('conversion') : null
  const initialConversionType = requestedConversion && AVAILABLE_CONVERSIONS.has(requestedConversion)
    ? requestedConversion
    : defaultConversionType
  const [files, setFiles] = useState<ProcessingFile[]>([])
  const [conversionType, setConversionType] = useState<string>(initialConversionType)
  const [quality, setQuality] = useState(82)
  const [optimizeOutput, setOptimizeOutput] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!requestedConversion || !AVAILABLE_CONVERSIONS.has(requestedConversion) || requestedConversion === conversionType) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setConversionType(requestedConversion)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [conversionType, requestedConversion])

  const handleConversionTypeChange = useCallback((nextConversionType: string) => {
    setConversionType(nextConversionType)

    if (!lockedMode && window.location.search) {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [lockedMode])

  const handleFilesSelected = useCallback(async (newFiles: UploadedFile[]) => {
    const processedFiles: ProcessingFile[] = await Promise.all(
      newFiles.map(async (file) => {
        let dimensions
        try {
          dimensions = await getImageDimensions(file.file)
        } catch {
          dimensions = undefined
        }

        return {
          ...file,
          status: 'pending',
          dimensions,
        }
      })
    )

    setFiles((previousFiles) => [...previousFiles, ...processedFiles])
  }, [])

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((previousFiles) => {
      const file = previousFiles.find((item) => item.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }

      return previousFiles.filter((item) => item.id !== id)
    })
  }, [])

  const handleClearAll = useCallback(() => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })

    setFiles([])
    setProgress(0)
  }, [files])

  const handleConvert = async () => {
    const pendingFiles = files.filter((file) => file.status === 'pending' && !file.error)
    if (pendingFiles.length === 0) {
      return
    }

    const [, targetFormat] = conversionType.split('_')
    trackConversion(toolSlug, 'convert', targetFormat)

    setIsProcessing(true)
    setProgress(0)

    for (let index = 0; index < pendingFiles.length; index += 1) {
      const file = pendingFiles[index]
      setFiles((previousFiles) => previousFiles.map((item) => (
        item.id === file.id ? { ...item, status: 'processing' } : item
      )))

      try {
        const resultInfo = await processImageFile(file.file, {
          outputFormat: toOutputFormat(targetFormat),
          optimizeOutput,
          quality: quality / 100,
          mode: 'convert',
          fillColor: '#FFFFFF',
        })

        setFiles((previousFiles) => previousFiles.map((item) => (
          item.id === file.id
            ? {
              ...item,
              status: 'done',
              resultInfo,
            }
            : item
        )))
      } catch {
        setFiles((previousFiles) => previousFiles.map((item) => (
          item.id === file.id ? { ...item, status: 'error' } : item
        )))
      }

      setProgress(((index + 1) / pendingFiles.length) * 100)
    }

    setIsProcessing(false)
  }

  const handleDownload = (file: ProcessingFile) => {
    if (!file.resultInfo) {
      return
    }

    const nextExtension = getOutputExtension(file.resultInfo.outputFormat)
    const nextName = changeFileExtension(file.file.name, nextExtension)
    downloadFile(file.resultInfo.blob, nextName)
    trackConversion(toolSlug, 'download', nextExtension)
  }

  const handleDownloadAll = async () => {
    const doneFiles = files.filter((file) => file.status === 'done' && file.resultInfo)
    if (doneFiles.length === 0) {
      return
    }

    await downloadAsZip(
      doneFiles.map((file) => ({
        blob: file.resultInfo!.blob,
        name: changeFileExtension(file.file.name, getOutputExtension(file.resultInfo!.outputFormat)),
      })),
      'converted_images.zip'
    )

    trackConversion(toolSlug, 'download', 'zip')
  }

  const validFiles = files.filter((file) => !file.error && file.status !== 'error')
  const doneFiles = files.filter((file) => file.status === 'done' && file.resultInfo)
  const [fromFormat, targetFormat] = conversionType.split('_')
  const currentLabel = CONVERT_OPTIONS.find((option) => `${option.from}_${option.to}` === conversionType)?.label
    ?? conversionType.replace('_', ' -> ').toUpperCase()

  return (
    <div className="space-y-8">
      {lockedMode && (
        <Card className="border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <ImageIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-bold tracking-tight text-white">{currentLabel} Conversion</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Format locked for this page</p>
            </div>
          </div>
        </Card>
      )}

      {!lockedMode && (
        <div className="space-y-4">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-white">
            Select conversion format
          </Label>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {CONVERT_OPTIONS.map((option) => {
              const optionValue = `${option.from}_${option.to}`
              const isActive = conversionType === optionValue

              return (
                <Button
                  key={optionValue}
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => handleConversionTypeChange(optionValue)}
                  className="h-12 justify-center"
                >
                  <span className="text-xs font-black">{option.label}</span>
                </Button>
              )
            })}
          </div>

          <div className="rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
            <p className="mb-3 text-sm font-medium text-white">
              Or use dedicated pages for faster conversion
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/tools/png-to-jpg/">
                <Button variant="outline" size="sm" className="h-8 rounded-full border-border/50 bg-card px-4 text-xs font-bold">
                  PNG -&gt; JPG
                </Button>
              </Link>
              <Link href="/tools/webp-to-png/">
                <Button variant="outline" size="sm" className="h-8 rounded-full border-border/50 bg-card px-4 text-xs font-bold">
                  WebP -&gt; PNG
                </Button>
              </Link>
              <Link href="/tools/avif-to-png/">
                <Button variant="outline" size="sm" className="h-8 rounded-full border-border/50 bg-card px-4 text-xs font-bold">
                  AVIF -&gt; PNG
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {isQualityControlled(conversionType) && (
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <Label className="font-bold text-white">Output Quality</Label>
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
          <div className="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>Compact</span>
            <span className="text-primary/70">Balanced (80-85%)</span>
            <span>High quality</span>
          </div>
        </Card>
      )}

      <ConversionOptimizationPanel
        optimizeOutput={optimizeOutput}
        onOptimizeOutputChange={setOptimizeOutput}
      />

      <FileUpload
        accept={lockedMode
          ? [fromFormat === 'jpg' ? 'jpeg' : fromFormat, fromFormat === 'jpg' ? 'jpg' : fromFormat]
          : ['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif']}
        multiple
        maxFiles={30}
        maxSize={25 * 1024 * 1024}
        onFilesSelected={handleFilesSelected}
        files={files.filter((file) => file.status === 'pending' || file.error)}
        onFileRemove={handleRemoveFile}
        onClearAll={handleClearAll}
        label={lockedMode ? `Drop ${fromFormat.toUpperCase()} images here` : 'Drop images here'}
        description={lockedMode ? `Support .${fromFormat} files up to 25MB` : 'Supports PNG, JPG, WebP, AVIF up to 25MB'}
        icon="image"
      />

      {isProcessing && (
        <Card className="border-primary/20 bg-primary/5 p-6">
          <div className="mb-4 flex items-center gap-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-white">
              Processing {progress.toFixed(0)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>
      )}

      {doneFiles.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">
              Ready for download ({doneFiles.length})
            </h2>
            {doneFiles.length > 1 && (
              <Button onClick={handleDownloadAll} variant="secondary" size="sm" className="w-full gap-2 sm:w-auto">
                <Download className="h-4 w-4" />
                Download zip
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            {doneFiles.map((file) => (
              <Card key={file.id} className="border-border/60 p-4 transition-all hover:border-primary/30">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
                      {file.preview ? (
                        <img src={file.preview} alt={file.file.name} className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <p className="truncate text-sm font-black text-white">{file.file.name}</p>
                      </div>

                      <ConversionOptimizationPanel
                        optimizeOutput={optimizeOutput}
                        result={file.resultInfo}
                        compact
                      />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 lg:min-w-[150px]">
                    <div className="text-right text-xs text-muted-foreground">
                      Original: {formatFileSize(file.file.size)}
                    </div>
                    <Button
                      onClick={() => handleDownload(file)}
                      size="sm"
                      className="w-full gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {validFiles.filter((file) => file.status === 'pending').length > 0 && (
        <Button
          onClick={handleConvert}
          disabled={isProcessing}
          size="lg"
          className="h-16 w-full text-lg font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ArrowRight className="mr-3 h-6 w-6" />
              Start conversion
            </>
          )}
        </Button>
      )}
    </div>
  )
}
