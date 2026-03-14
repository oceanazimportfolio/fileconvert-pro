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
  batchCompressImages,
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

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'compress' | 'resize')}>
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
          <TabsTrigger value="compress" className="gap-2">
            <Minimize2 className="w-4 h-4" />
            Compress
          </TabsTrigger>
          <TabsTrigger value="resize" className="gap-2">
            <Maximize2 className="w-4 h-4" />
            Resize
          </TabsTrigger>
        </TabsList>

        {/* Compression Options */}
        <TabsContent value="compress" className="space-y-4 mt-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-white">Target Size (MB)</Label>
              <Badge variant="secondary" className="bg-slate-700 text-white">
                {maxSizeMB} MB
              </Badge>
            </div>
            <Slider
              value={[maxSizeMB]}
              onValueChange={([value]) => setMaxSizeMB(value)}
              min={0.1}
              max={10}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-slate-500 mt-1">
              Image will be compressed to approximately this file size
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-white">Max Dimension (px)</Label>
              <Badge variant="secondary" className="bg-slate-700 text-white">
                {maxDimension}px
              </Badge>
            </div>
            <Slider
              value={[maxDimension]}
              onValueChange={([value]) => setMaxDimension(value)}
              min={500}
              max={4000}
              step={100}
              className="w-full"
            />
            <p className="text-xs text-slate-500 mt-1">
              Maximum width or height while maintaining aspect ratio
            </p>
          </div>
        </TabsContent>

        {/* Resize Options */}
        <TabsContent value="resize" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white mb-2 block">Width (px)</Label>
              <Input
                type="number"
                value={resizeWidth}
                onChange={(e) => setResizeWidth(parseInt(e.target.value) || 0)}
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-white mb-2 block">Height (px)</Label>
              <Input
                type="number"
                value={resizeHeight}
                onChange={(e) => setResizeHeight(parseInt(e.target.value) || 0)}
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Maintain Aspect Ratio</Label>
              <p className="text-xs text-slate-500">Image won't be stretched</p>
            </div>
            <Switch
              checked={maintainAspect}
              onCheckedChange={setMaintainAspect}
            />
          </div>
        </TabsContent>
      </Tabs>

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
        label={`Drop images here to ${mode}`}
        description="or click to browse"
        icon="image"
      />

      {/* Progress */}
      {isProcessing && (
        <Card className="bg-slate-800/50 border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            <span className="text-white">
              {mode === 'compress' ? 'Compressing' : 'Resizing'} images...
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>
      )}

      {/* Results */}
      {doneFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {mode === 'compress' ? 'Compressed' : 'Resized'} Files ({doneFiles.length})
            </h3>
            {doneFiles.length > 1 && (
              <Button onClick={handleDownloadAll} className="gap-2">
                <Download className="w-4 h-4" />
                Download All as ZIP
              </Button>
            )}
          </div>

          <div className="grid gap-2">
            {doneFiles.map((file) => (
              <Card key={file.id} className="bg-slate-800/50 border-slate-700/50 p-4">
                <div className="flex items-center gap-4">
                  {file.preview ? (
                    <img 
                      src={file.preview} 
                      alt={file.file.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-slate-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <p className="text-white font-medium truncate">{file.file.name}</p>
                    </div>
                    
                    {/* Size comparison */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-400">
                        {formatFileSize(file.file.size)}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                      <span className="text-green-400 font-medium">
                        {formatFileSize(file.resultSize || 0)}
                      </span>
                      {file.compressionRatio !== undefined && file.compressionRatio > 0 && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-2">
                          -{file.compressionRatio}%
                        </Badge>
                      )}
                    </div>

                    {/* Dimensions */}
                    {file.dimensions && (
                      <p className="text-xs text-slate-500 mt-1">
                        {file.dimensions.width} × {file.dimensions.height}px
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => handleDownload(file)}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Process Button */}
      {validFiles.filter(f => f.status === 'pending').length > 0 && (
        <Button
          onClick={handleProcess}
          disabled={isProcessing}
          size="lg"
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {mode === 'compress' ? 'Compressing' : 'Resizing'}...
            </>
          ) : (
            <>
              {mode === 'compress' ? <Minimize2 className="w-5 h-5 mr-2" /> : <Maximize2 className="w-5 h-5 mr-2" />}
              {mode === 'compress' ? 'Compress' : 'Resize'} {validFiles.filter(f => f.status === 'pending').length} Image{validFiles.filter(f => f.status === 'pending').length !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      )}
    </div>
  )
}
