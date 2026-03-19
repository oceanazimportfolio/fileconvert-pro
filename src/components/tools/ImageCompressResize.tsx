'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  Image as ImageIcon, ArrowRight, Download, Loader2,
  CheckCircle, Minimize2, Maximize2
} from 'lucide-react'
import { FileUpload, UploadedFile } from '@/components/FileUpload'
import {
  compressImage,
  resizeImage,
  getImageDimensions
} from '@/lib/imageUtils'
import {
  downloadFile,
  downloadAsZip,
  formatFileSize,
  calculateCompressionRatio
} from '@/lib/fileUtils'

interface ProcessingFile extends UploadedFile {
  status: 'pending' | 'processing' | 'done' | 'error'
  result?: Blob
  resultSize?: number
  dimensions?: { width: number; height: number }
  compressionRatio?: number
}

export function ImageCompressResize() {
  const [files, setFiles] = useState<ProcessingFile[]>([])
  const [mode, setMode] = useState<'compress' | 'resize'>('compress')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  // Compression settings
  const [maxSizeMB, setMaxSizeMB] = useState(1)
  const [maxDimension, setMaxDimension] = useState(1920)

  // Resize settings
  const [resizeWidth, setResizeWidth] = useState(800)
  const [resizeHeight, setResizeHeight] = useState(600)
  const [maintainAspect, setMaintainAspect] = useState(true)

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

  const handleProcess = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending' && !f.error)
    if (pendingFiles.length === 0) return

    setIsProcessing(true)
    setProgress(0)

    for (let i = 0; i < pendingFiles.length; i++) {
      const file = pendingFiles[i]

      setFiles(prev => prev.map(f =>
        f.id === file.id ? { ...f, status: 'processing' } : f
      ))

      try {
        let result: Blob

        if (mode === 'compress') {
          result = await compressImage(file.file, {
            maxSizeMB,
            maxWidthOrHeight: maxDimension
          })
        } else {
          result = await resizeImage(file.file, {
            width: resizeWidth,
            height: resizeHeight,
            maintainAspectRatio: maintainAspect
          })
        }

        const compressionRatio = calculateCompressionRatio(file.file.size, result.size)

        setFiles(prev => prev.map(f =>
          f.id === file.id ? {
            ...f,
            status: 'done',
            result,
            resultSize: result.size,
            compressionRatio
          } : f
        ))
      } catch {
        setFiles(prev => prev.map(f =>
          f.id === file.id ? { ...f, status: 'error' } : f
        ))
      }

      setProgress(((i + 1) / pendingFiles.length) * 100)
    }

    setIsProcessing(false)
  }

  const handleDownload = (file: ProcessingFile) => {
    if (!file.result) return
    downloadFile(file.result, file.file.name)
  }

  const handleDownloadAll = async () => {
    const doneFiles = files.filter(f => f.status === 'done' && f.result)
    if (doneFiles.length === 0) return

    await downloadAsZip(
      doneFiles.map(f => ({ blob: f.result!, name: f.file.name })),
      `${mode === 'compress' ? 'compressed' : 'resized'}_images.zip`
    )
  }

  const validFiles = files.filter(f => !f.error)
  const doneFiles = files.filter(f => f.status === 'done')
  const pendingFilesCount = validFiles.filter(f => f.status === 'pending').length

  return (
    <div className="space-y-8">
      {/* Banner Card */}
      <Card className="bg-primary/5 border-primary/20 p-6">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
            {mode === 'compress' ? <Minimize2 className="w-7 h-7 text-primary" /> : <Maximize2 className="w-7 h-7 text-primary" />}
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Image {mode === 'compress' ? 'Compressor' : 'Resizer'}</h2>
            <p className="text-sm mt-1 font-medium text-muted-foreground">
              {mode === 'compress' 
                ? 'Reduce file size without losing quality.' 
                : 'Change image dimensions with pixel-perfect accuracy.'}
              Locally processed for maximum privacy.
            </p>
          </div>
        </div>
      </Card>

      {/* Main Configuration Grid */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-muted/20 border-border/50">
            <Tabs value={mode} onValueChange={(v) => setMode(v as 'compress' | 'resize')} className="space-y-6">
              <div className="space-y-4">
                <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Processing Mode</Label>
                <TabsList className="grid w-full grid-cols-2 bg-black/20 p-1 h-12 rounded-xl">
                  <TabsTrigger value="compress" className="rounded-lg font-black uppercase text-[10px] tracking-widest gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Minimize2 className="w-3.5 h-3.5" />
                    Compress
                  </TabsTrigger>
                  <TabsTrigger value="resize" className="rounded-lg font-black uppercase text-[10px] tracking-widest gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Maximize2 className="w-3.5 h-3.5" />
                    Resize
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="compress" className="space-y-8 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Target Size Limit</Label>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-black h-6">{maxSizeMB} MB</Badge>
                  </div>
                  <Slider
                    value={[maxSizeMB]}
                    onValueChange={([value]) => setMaxSizeMB(value)}
                    min={0.1}
                    max={10}
                    step={0.1}
                    className="py-4"
                  />
                  <p className="text-[10px] text-muted-foreground font-medium italic">Recommended: 0.5MB - 1MB for web usage.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Max Dimension Bounds</Label>
                    <Badge variant="secondary" className="bg-muted text-white/50 font-black h-6">{maxDimension}px</Badge>
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

              <TabsContent value="resize" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Width (px)</Label>
                    <Input
                      type="number"
                      value={resizeWidth}
                      onChange={(e) => setResizeWidth(parseInt(e.target.value) || 0)}
                      className="h-12 bg-black/40 border-border/50 text-white font-mono"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Height (px)</Label>
                    <Input
                      type="number"
                      value={resizeHeight}
                      onChange={(e) => setResizeHeight(parseInt(e.target.value) || 0)}
                      className="h-12 bg-black/40 border-border/50 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5">
                  <div className="space-y-0.5">
                    <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Maintain Aspect</Label>
                    <p className="text-[9px] text-muted-foreground uppercase font-black opacity-40">Prevent distortion</p>
                  </div>
                  <Switch
                    checked={maintainAspect}
                    onCheckedChange={setMaintainAspect}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Action Call */}
          {pendingFilesCount > 0 && (
            <Button
              onClick={handleProcess}
              disabled={isProcessing}
              className="w-full h-16 uppercase tracking-[0.2em] font-black text-xs shadow-xl shadow-primary/20 relative overflow-hidden group"
            >
              {isProcessing ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Queue...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {mode === 'compress' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  <span>Execute {mode === 'compress' ? 'Compression' : 'Resize'}</span>
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

        {/* Upload & Results Area */}
        <div className="lg:col-span-2 space-y-8">
          <FileUpload
            accept={['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif']}
            multiple
            maxFiles={30}
            maxSize={25 * 1024 * 1024}
            onFilesSelected={handleFilesSelected}
            files={files.filter(f => f.status === 'pending' || f.error)}
            onFileRemove={handleRemoveFile}
            onClearAll={handleClearAll}
            label={`Drop assets to ${mode}`}
            description="Supports high-res PNG, JPG, WebP"
            icon="image"
          />

          {/* Results List */}
          {doneFiles.length > 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                   Processed Queue
                   <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{doneFiles.length}</Badge>
                 </h3>
                 {doneFiles.length > 1 && (
                  <Button onClick={handleDownloadAll} variant="secondary" size="sm" className="h-9 gap-2 font-black uppercase text-[10px] tracking-widest border-border/50">
                    <Download className="w-3.5 h-3.5" />
                    Export All (.ZIP)
                  </Button>
                 )}
              </div>

              <div className="grid gap-4">
                {doneFiles.map((file) => (
                  <Card key={file.id} className="group bg-muted/10 border-border/50 hover:bg-muted/20 transition-all duration-300 overflow-hidden">
                    <div className="p-4 flex items-center gap-6">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-black/40 border border-white/5 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                        {file.preview ? (
                          <img src={file.preview} alt={file.file.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/20" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <p className="text-xs font-black text-white uppercase tracking-tight truncate">{file.file.name}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{formatFileSize(file.file.size)}</span>
                            <ArrowRight className="w-3 h-3 text-muted-foreground/30" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{formatFileSize(file.resultSize || 0)}</span>
                          </div>
                          
                          {file.compressionRatio !== undefined && file.compressionRatio > 0 && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] font-black h-5 uppercase tracking-tighter">
                              -{file.compressionRatio}%
                            </Badge>
                          )}
                        </div>

                        {file.dimensions && (
                          <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">
                            Output: {file.dimensions.width} × {file.dimensions.height}px
                          </p>
                        )}
                      </div>

                      <Button
                        onClick={() => handleDownload(file)}
                        variant="secondary"
                        size="sm"
                        className="h-10 px-6 font-black uppercase text-[10px] tracking-widest border-border/50 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
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
