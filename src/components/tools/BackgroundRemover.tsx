'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { EmbeddedBrowserNotice } from '@/components/EmbeddedBrowserNotice'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ConversionOptimizationPanel } from '@/components/tools/ConversionOptimizationPanel'
import {
  Eraser,
  Download,
  RefreshCw,
  Copy,
  Check,
  Image as ImageIcon,
  Palette,
  Wand2,
  Layers,
  Sparkles,
  Cpu,
  User,
  ShieldCheck,
  Loader2,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import * as tf from '@tensorflow/tfjs'
import * as bodyPix from '@tensorflow-models/body-pix'
import { downloadFile } from '@/lib/fileUtils'
import {
  getFormatFromFile,
  optimizeCanvasOutput,
  type ImageOptimizationResult,
} from '@/lib/imagePipeline'

export function BackgroundRemover() {
  const [image, setImage] = useState<string | null>(null)
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [processedResult, setProcessedResult] = useState<ImageOptimizationResult | null>(null)
  const [fileName, setFileName] = useState('no-background')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showCheckerboard, setShowCheckerboard] = useState(true)
  const [bgColor, setBgColor] = useState('#ffffff')
  const [optimizeOutput, setOptimizeOutput] = useState(true)
  const [tfReady, setTfReady] = useState(false)
  const [modelLoading, setModelLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mode, setMode] = useState<'auto' | 'person'>('auto')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const displayCanvasRef = useRef<HTMLCanvasElement>(null)
  const modelRef = useRef<bodyPix.BodyPix | null>(null)
  const { toast } = useToast()

  const revokeProcessedImage = useCallback((url: string | null) => {
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  }, [])

  const resetProcessedOutput = useCallback(() => {
    setProcessedResult(null)
    setCopied(false)
    setProgress(0)
    setProcessedImage((currentValue) => {
      revokeProcessedImage(currentValue)
      return null
    })
  }, [revokeProcessedImage])

  useEffect(() => {
    const initTF = async () => {
      try {
        await tf.ready()
        setTfReady(true)
      } catch (error) {
        console.error('TF.js init error:', error)
      }
    }

    initTF()
  }, [])

  const loadModel = useCallback(async () => {
    if (modelRef.current || modelLoading) {
      return modelRef.current
    }

    setModelLoading(true)
    setProgress(10)

    try {
      const net = await bodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2,
      })
      modelRef.current = net
      setProgress(100)
      return net
    } catch (error) {
      console.error('Failed to load BodyPix:', error)
      toast({
        title: 'AI Model Loading Failed',
        description: 'Falling back to browser mode',
        variant: 'destructive',
      })
      return null
    } finally {
      setModelLoading(false)
    }
  }, [modelLoading, toast])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    resetProcessedOutput()
    setSourceFile(file)
    setFileName(file.name.split('.')[0])
    const reader = new FileReader()
    reader.onload = (readerEvent) => {
      setImage(readerEvent.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeBackgroundAI = useCallback(async (forPerson: boolean) => {
    if (!image || !canvasRef.current) {
      return
    }

    setIsProcessing(true)
    setProgress(5)

    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Canvas context not available')
      }

      const img = new window.Image()
      img.crossOrigin = 'anonymous'

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = image
      })

      setProgress(15)

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      if (forPerson) {
        setProgress(20)

        const net = await loadModel()
        if (!net) {
          throw new Error('Failed to load AI model')
        }

        setProgress(40)

        const segmentation = await net.segmentPerson(canvas, {
          flipHorizontal: false,
          internalResolution: 'medium',
          segmentationThreshold: 0.7,
        })

        setProgress(70)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        for (let index = 0; index < segmentation.data.length; index += 1) {
          const pixelIndex = index * 4
          if (segmentation.data[index] === 0) {
            data[pixelIndex + 3] = 0
          }
        }

        ctx.putImageData(imageData, 0, 0)
        setProgress(90)
      } else {
        setProgress(30)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        const width = canvas.width
        const height = canvas.height

        const samples: { r: number; g: number; b: number }[] = []
        const samplePoints = [
          [0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1],
          [Math.floor(width * 0.25), 0], [Math.floor(width * 0.5), 0], [Math.floor(width * 0.75), 0],
          [0, Math.floor(height * 0.25)], [0, Math.floor(height * 0.5)], [0, Math.floor(height * 0.75)],
          [width - 1, Math.floor(height * 0.25)], [width - 1, Math.floor(height * 0.5)], [width - 1, Math.floor(height * 0.75)],
          [Math.floor(width * 0.25), height - 1], [Math.floor(width * 0.5), height - 1], [Math.floor(width * 0.75), height - 1],
        ]

        for (const [x, y] of samplePoints) {
          const idx = (y * width + x) * 4
          samples.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] })
        }

        const bgR = Math.round(samples.reduce((sum, color) => sum + color.r, 0) / samples.length)
        const bgG = Math.round(samples.reduce((sum, color) => sum + color.g, 0) / samples.length)
        const bgB = Math.round(samples.reduce((sum, color) => sum + color.b, 0) / samples.length)

        setProgress(50)

        const variance = samples.reduce((sum, color) => (
          sum + Math.pow(color.r - bgR, 2) + Math.pow(color.g - bgG, 2) + Math.pow(color.b - bgB, 2)
        ), 0) / samples.length
        const tolerance = Math.sqrt(variance) * 1.5 + 30

        setProgress(60)

        for (let index = 0; index < data.length; index += 4) {
          const r = data[index]
          const g = data[index + 1]
          const b = data[index + 2]

          const distance = Math.sqrt(
            Math.pow(r - bgR, 2) +
            Math.pow(g - bgG, 2) +
            Math.pow(b - bgB, 2)
          )

          if (distance < tolerance * 2) {
            const alpha = distance < tolerance
              ? 0
              : Math.min(255, Math.floor(((distance - tolerance) / tolerance) * 255))
            data[index + 3] = alpha
          }
        }

        ctx.putImageData(imageData, 0, 0)
        setProgress(90)
      }

      const resultInfo = await optimizeCanvasOutput(canvas, {
        sourceFormat: sourceFile ? getFormatFromFile(sourceFile) : 'png',
        inputSize: sourceFile?.size ?? canvas.width * canvas.height * 4,
        outputFormat: 'png',
        optimizeOutput,
        mode: 'background-remove',
      })

      setProgress(100)
      setProcessedResult(resultInfo)
      setProcessedImage((currentValue) => {
        revokeProcessedImage(currentValue)
        return URL.createObjectURL(resultInfo.blob)
      })
      setIsProcessing(false)

      toast({
        title: 'Background Removed!',
        description: forPerson ? 'AI detected and kept the person' : 'Background color detected and removed',
      })
    } catch (error: unknown) {
      console.error('Background removal error:', error)
      setIsProcessing(false)
      setProgress(0)
      toast({
        title: 'Processing Failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    }
  }, [image, loadModel, optimizeOutput, revokeProcessedImage, sourceFile, toast])

  const downloadImage = () => {
    if (!processedResult) {
      return
    }

    downloadFile(processedResult.blob, `${fileName}-no-bg.png`)
  }

  const copyImage = async () => {
    if (!processedResult) {
      return
    }

    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': processedResult.blob }),
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({ title: 'Copied!', description: 'Image copied to clipboard' })
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' })
    }
  }

  useEffect(() => {
    if (!image || !displayCanvasRef.current) {
      return
    }

    const canvas = displayCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    const img = new window.Image()
    img.onload = () => {
      const maxSize = 350
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      if (showCheckerboard && processedImage) {
        const size = 10
        for (let y = 0; y < canvas.height; y += size) {
          for (let x = 0; x < canvas.width; x += size) {
            ctx.fillStyle = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0 ? '#ccc' : '#fff'
            ctx.fillRect(x, y, size, size)
          }
        }
      } else if (!showCheckerboard && processedImage) {
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }

    img.src = processedImage || image
  }, [bgColor, image, processedImage, showCheckerboard])

  useEffect(() => () => revokeProcessedImage(processedImage), [processedImage, revokeProcessedImage])

  return (
    <div className="space-y-8">
      <canvas ref={canvasRef} className="hidden" />

      <Card className="border-primary/20 bg-primary/5 p-6">
        <div className="flex items-start gap-6">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <Eraser className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white">
                  AI Background Remover
                </h2>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Remove backgrounds with local TensorFlow.js processing while preserving transparent PNG output.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {tfReady ? (
                  <Badge className="h-7 border-emerald-500/20 bg-emerald-500/10 px-3 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                    <Cpu className="mr-1.5 h-3 w-3" />
                    Neural Engine Ready
                  </Badge>
                ) : (
                  <Badge className="h-7 border-amber-500/20 bg-amber-500/10 px-3 text-[9px] font-black uppercase tracking-widest text-amber-400">
                    <RefreshCw className="mr-1.5 h-3 w-3 animate-spin" />
                    Loading AI...
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
        <div className="space-y-6">
          <EmbeddedBrowserNotice context="processing" />

          {!image ? (
            <div className="group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-border/40 bg-muted/5 p-6 text-center transition-all hover:border-primary/40 sm:p-12">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              />
              <div className="relative z-0 flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-110">
                  <Eraser className="h-10 w-10 text-primary opacity-40 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black uppercase tracking-tight text-white">Drop Image Here</h4>
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    or click to browse local files
                  </p>
                </div>
                <p className="rounded-full bg-black/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                  Privacy-First: No images are uploaded to servers
                </p>
              </div>
            </div>
          ) : (
            <Card className="overflow-hidden border-border/50 bg-muted/10">
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-white">
                    Source image
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setImage(null)
                      setSourceFile(null)
                      resetProcessedOutput()
                    }}
                    className="h-7 gap-1.5 text-[10px] font-black uppercase tracking-widest hover:text-destructive"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset
                  </Button>
                </div>
                <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/40">
                  <canvas
                    ref={displayCanvasRef}
                    className="h-auto w-full"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              </div>
            </Card>
          )}

          <Card className="border-border/50 bg-muted/15 p-5 sm:p-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-white">
                  Processing configuration
                </Label>
                <p className="text-sm text-muted-foreground">
                  Choose the extraction mode and output behavior before you run the remover.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { id: 'auto', label: 'Auto (Object)', sub: 'Sharp Edges', icon: Wand2 },
                  { id: 'person', label: 'AI Portrait', sub: 'Depth Mapping', icon: User },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setMode(option.id as 'auto' | 'person')}
                    className={`flex flex-col items-center rounded-2xl border p-5 text-center transition-all ${
                      mode === option.id
                        ? 'border-primary/40 bg-primary/10'
                        : 'border-border/50 bg-muted/10 hover:border-border'
                    }`}
                  >
                    <option.icon className={`mb-3 h-6 w-6 ${mode === option.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-[11px] font-black uppercase tracking-wider ${mode === option.id ? 'text-white' : 'text-muted-foreground'}`}>
                      {option.label}
                    </span>
                    <span className="mt-1 text-[9px] font-medium uppercase tracking-widest opacity-40">
                      {option.sub}
                    </span>
                  </button>
                ))}
              </div>

              <ConversionOptimizationPanel
                optimizeOutput={optimizeOutput}
                onOptimizeOutputChange={setOptimizeOutput}
                className="shadow-none"
              />
            </div>
          </Card>

          <Button
            onClick={() => removeBackgroundAI(mode === 'person')}
            disabled={!image || isProcessing || !tfReady}
            className={`h-16 w-full text-sm font-black uppercase tracking-[0.2em] shadow-xl transition-all ${
              isProcessing ? 'cursor-not-allowed bg-muted' : 'shadow-primary/20'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>AI Analyzing... {progress}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5" />
                <span>Execute AI Extraction</span>
              </div>
            )}
          </Button>

          {processedImage && (
            <div className="space-y-4 rounded-2xl border border-border/50 bg-muted/20 p-6">
              <EmbeddedBrowserNotice context="download" />

              <Label className="text-[10px] font-bold uppercase tracking-wider text-white">
                Preview environment
              </Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant={showCheckerboard ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setShowCheckerboard(true)}
                  className="h-10 flex-1 gap-2 text-[10px] font-black uppercase tracking-widest"
                >
                  <Layers className="h-3.5 w-3.5" />
                  Transparent
                </Button>
                <Button
                  variant={!showCheckerboard ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setShowCheckerboard(false)}
                  className="h-10 flex-1 gap-2 text-[10px] font-black uppercase tracking-widest"
                >
                  <Palette className="h-3.5 w-3.5" />
                  Solid Color
                </Button>
              </div>
              {!showCheckerboard && (
                <div className="flex items-center gap-4 pt-2">
                  <Input
                    type="color"
                    value={bgColor}
                    onChange={(event) => setBgColor(event.target.value)}
                    className="h-12 w-12 flex-shrink-0 cursor-pointer rounded-lg border-border/50 bg-black/40 p-1"
                  />
                  <div className="flex h-12 flex-1 items-center rounded-lg border border-border/50 bg-black/40 px-4">
                    <code className="text-[11px] text-white/50">{bgColor.toUpperCase()}</code>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="flex min-h-[420px] flex-col overflow-hidden border-border/50 bg-muted/10 sm:min-h-[500px]">
            <div className="flex flex-col gap-3 border-b border-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-white">
                {processedImage ? 'AI Extracted Output' : 'Awaiting Processing'}
              </Label>
              {processedImage && (
                <div className="flex gap-2">
                  <Button variant="secondary" size="icon" className="size-10" onClick={copyImage}>
                    {copied
                      ? <Check className="h-3.5 w-3.5 text-emerald-400" />
                      : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                  <Button variant="secondary" size="icon" className="size-10" onClick={downloadImage}>
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
            <div
              className="flex flex-1 items-center justify-center p-8 transition-all duration-500"
              style={{
                background: processedImage && showCheckerboard
                  ? 'repeating-conic-gradient(rgba(255,255,255,0.05) 0% 25%, transparent 0% 50%) 50% / 40px 40px'
                  : processedImage && !showCheckerboard
                    ? bgColor
                    : 'transparent',
              }}
            >
              {processedImage ? (
                <img
                  src={processedImage}
                  alt="Extracted Result"
                  className="h-auto max-h-[450px] w-full object-contain drop-shadow-2xl"
                />
              ) : image ? (
                <div className="space-y-4 text-center opacity-40">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    Ready for AI processing
                  </h5>
                  <p className="mx-auto max-w-[200px] text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    Click the execute button to start the neural removal engine
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-center opacity-20">
                  <ImageIcon className="mx-auto mb-4 h-16 w-16" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Awaiting local image upload
                  </p>
                </div>
              )}
            </div>
            {processedImage && (
              <div className="space-y-4 border-t border-white/5 bg-black/20 p-6">
                <ConversionOptimizationPanel
                  optimizeOutput={optimizeOutput}
                  result={processedResult ?? undefined}
                  compact
                />
                <Button onClick={downloadImage} className="h-14 w-full gap-3 bg-primary shadow-lg shadow-primary/20 hover:bg-primary/90">
                  <Download className="h-5 w-5" />
                  <span className="text-xs font-black uppercase tracking-widest">
                    Download Transparent PNG
                  </span>
                </Button>
              </div>
            )}
          </Card>

          <div className="flex items-start gap-5 rounded-2xl border border-primary/10 bg-primary/5 p-6">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase tracking-wider text-white">
                Privacy & Security Engine
              </p>
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                Unlike other removers, your photos never hit any cloud. All neural network calculations are performed locally on your GPU or CPU. No data is stored, shared, or collected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
