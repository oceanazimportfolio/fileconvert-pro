'use client'

import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Image as ImageIcon,
  Download,
  Loader2,
  CheckCircle,
  Minimize2,
  Maximize2,
} from 'lucide-react'
import { FileUpload, UploadedFile } from '@/components/FileUpload'
import { ConversionOptimizationPanel } from '@/components/tools/ConversionOptimizationPanel'
import {
  compressImageFile,
  getImageDimensions,
  getOutputExtension,
  getPreferredOutputFormat,
  processImageFile,
  type ImageOptimizationResult,
} from '@/lib/imagePipeline'
import {
  downloadFile,
  downloadAsZip,
  changeFileExtension,
} from '@/lib/fileUtils'

interface ProcessingFile extends UploadedFile {
  status: 'pending' | 'processing' | 'done' | 'error'
  resultInfo?: ImageOptimizationResult
  dimensions?: { width: number; height: number }
}

export function ImageCompressResize() {
  const [files, setFiles] = useState<ProcessingFile[]>([])
  const [mode, setMode] = useState<'compress' | 'resize'>('compress')
  const [optimizeOutput, setOptimizeOutput] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const [maxSizeMB, setMaxSizeMB] = useState(1)
  const [maxDimension, setMaxDimension] = useState(1920)

  const [resizeWidth, setResizeWidth] = useState(800)
  const [resizeHeight, setResizeHeight] = useState(600)
  const [maintainAspect, setMaintainAspect] = useState(true)

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

  const handleProcess = async () => {
    const pendingFiles = files.filter((file) => file.status === 'pending' && !file.error)
    if (pendingFiles.length === 0) {
      return
    }

    setIsProcessing(true)
    setProgress(0)

    for (let index = 0; index < pendingFiles.length; index += 1) {
      const file = pendingFiles[index]
      setFiles((previousFiles) => previousFiles.map((item) => (
        item.id === file.id ? { ...item, status: 'processing' } : item
      )))

      try {
        const resultInfo = mode === 'compress'
          ? await compressImageFile(file.file, {
            optimizeOutput,
            maxSizeMB,
            maxWidthOrHeight: maxDimension,
          })
          : await processImageFile(file.file, {
            outputFormat: getPreferredOutputFormat(file.file),
            optimizeOutput,
            mode: 'resize',
            resize: {
              width: resizeWidth,
              height: resizeHeight,
              maintainAspectRatio: maintainAspect,
            },
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

    const outputExtension = getOutputExtension(file.resultInfo.outputFormat)
    const downloadName = changeFileExtension(file.file.name, outputExtension)
    downloadFile(file.resultInfo.blob, downloadName)
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
      `${mode === 'compress' ? 'compressed' : 'resized'}_images.zip`
    )
  }

  const validFiles = files.filter((file) => !file.error)
  const doneFiles = files.filter((file) => file.status === 'done' && file.resultInfo)
  const pendingFilesCount = validFiles.filter((file) => file.status === 'pending').length

  return (
    <div className="space-y-8">
      <Card className="border-primary/20 bg-primary/5 p-6">
        <div className="flex items-start gap-6">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            {mode === 'compress'
              ? <Minimize2 className="h-7 w-7 text-primary" />
              : <Maximize2 className="h-7 w-7 text-primary" />}
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">
              Image {mode === 'compress' ? 'Compressor' : 'Resizer'}
            </h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {mode === 'compress'
                ? 'Reduce file size with format-aware optimization and clearer result guidance.'
                : 'Resize images while keeping output format handling and size analysis consistent.'}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid items-start gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-border/50 bg-muted/20 p-6">
            <Tabs value={mode} onValueChange={(value) => setMode(value as 'compress' | 'resize')} className="space-y-6">
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-white">
                  Processing mode
                </Label>
                <TabsList className="grid h-12 w-full grid-cols-2 rounded-xl bg-black/20 p-1">
                  <TabsTrigger value="compress" className="gap-2 rounded-lg text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Minimize2 className="h-3.5 w-3.5" />
                    Compress
                  </TabsTrigger>
                  <TabsTrigger value="resize" className="gap-2 rounded-lg text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Maximize2 className="h-3.5 w-3.5" />
                    Resize
                  </TabsTrigger>
                </TabsList>
              </div>

              <ConversionOptimizationPanel
                optimizeOutput={optimizeOutput}
                onOptimizeOutputChange={setOptimizeOutput}
                className="shadow-none"
              />

              <TabsContent value="compress" className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-white">
                      Target size limit
                    </Label>
                    <Badge variant="secondary" className="h-6 border-primary/20 bg-primary/10 font-black text-primary">
                      {maxSizeMB} MB
                    </Badge>
                  </div>
                  <Slider
                    value={[maxSizeMB]}
                    onValueChange={([value]) => setMaxSizeMB(value)}
                    min={0.1}
                    max={10}
                    step={0.1}
                    className="py-4"
                  />
                  <p className="text-[10px] font-medium italic text-muted-foreground">
                    Recommended: 0.5MB to 1MB for faster web delivery.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-white">
                      Max dimension bounds
                    </Label>
                    <Badge variant="secondary" className="h-6 bg-muted font-black text-white/60">
                      {maxDimension}px
                    </Badge>
                  </div>
                  <Slider
                    value={[maxDimension]}
                    onValueChange={([value]) => setMaxDimension(value)}
                    min={500}
                    max={4000}
                    step={100}
                    className="py-4"
                  />
                </div>
              </TabsContent>

              <TabsContent value="resize" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-white">
                      Width (px)
                    </Label>
                    <Input
                      type="number"
                      value={resizeWidth}
                      onChange={(event) => setResizeWidth(parseInt(event.target.value, 10) || 0)}
                      className="h-12 border-border/50 bg-black/40 font-mono text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-white">
                      Height (px)
                    </Label>
                    <Input
                      type="number"
                      value={resizeHeight}
                      onChange={(event) => setResizeHeight(parseInt(event.target.value, 10) || 0)}
                      className="h-12 border-border/50 bg-black/40 font-mono text-white"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="space-y-0.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-white">
                      Maintain aspect ratio
                    </Label>
                    <p className="text-[10px] text-muted-foreground">
                      Keeps the image from stretching while resizing.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant={maintainAspect ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMaintainAspect((value) => !value)}
                      className="h-9 text-[10px] font-black uppercase tracking-widest"
                    >
                      {maintainAspect ? 'Aspect lock on' : 'Aspect lock off'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {pendingFilesCount > 0 && (
            <Button
              onClick={handleProcess}
              disabled={isProcessing}
              className="relative h-16 w-full overflow-hidden text-xs font-black uppercase tracking-[0.2em]"
            >
              {isProcessing ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing queue...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {mode === 'compress'
                    ? <Minimize2 className="h-4 w-4" />
                    : <Maximize2 className="h-4 w-4" />}
                  <span>Execute {mode === 'compress' ? 'compression' : 'resize'}</span>
                </div>
              )}
              {isProcessing && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-white/20 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              )}
            </Button>
          )}
        </div>

        <div className="space-y-8 lg:col-span-2">
          <FileUpload
            accept={['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif']}
            multiple
            maxFiles={30}
            maxSize={25 * 1024 * 1024}
            onFilesSelected={handleFilesSelected}
            files={files.filter((file) => file.status === 'pending' || file.error)}
            onFileRemove={handleRemoveFile}
            onClearAll={handleClearAll}
            label={`Drop assets to ${mode}`}
            description="Supports high-res PNG, JPG, WebP, AVIF, and GIF"
            icon="image"
          />

          {doneFiles.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-white">
                  Processed queue
                  <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                    {doneFiles.length}
                  </Badge>
                </h3>
                {doneFiles.length > 1 && (
                  <Button onClick={handleDownloadAll} variant="secondary" size="sm" className="h-9 gap-2 border-border/50 text-[10px] font-black uppercase tracking-widest">
                    <Download className="h-3.5 w-3.5" />
                    Export all (.zip)
                  </Button>
                )}
              </div>

              <div className="grid gap-4">
                {doneFiles.map((file) => (
                  <Card key={file.id} className="overflow-hidden border-border/50 bg-muted/10">
                    <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-start">
                      <div className="flex min-w-0 flex-1 items-start gap-4">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-white/5 bg-black/40">
                          {file.preview ? (
                            <img src={file.preview} alt={file.file.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                            <p className="truncate text-xs font-black uppercase tracking-tight text-white">
                              {file.file.name}
                            </p>
                          </div>

                          <ConversionOptimizationPanel
                            optimizeOutput={optimizeOutput}
                            result={file.resultInfo}
                            compact
                          />
                        </div>
                      </div>

                      <Button
                        onClick={() => handleDownload(file)}
                        variant="secondary"
                        size="sm"
                        className="h-10 px-6 text-[10px] font-black uppercase tracking-widest"
                      >
                        Download
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
