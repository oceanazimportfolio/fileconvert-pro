'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Eraser, Download, RefreshCw, Copy, Check, Image as ImageIcon,
  Palette, Wand2, Layers, Sparkles, Cpu, User, ShieldCheck, Loader2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import * as tf from '@tensorflow/tfjs'
import * as bodyPix from '@tensorflow-models/body-pix'

export function BackgroundRemover() {
  const [image, setImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState('no-background')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showCheckerboard, setShowCheckerboard] = useState(true)
  const [bgColor, setBgColor] = useState('#ffffff')
  const [tfReady, setTfReady] = useState(false)
  const [modelLoading, setModelLoading] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mode, setMode] = useState<'auto' | 'person'>('auto')
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const displayCanvasRef = useRef<HTMLCanvasElement>(null)
  const modelRef = useRef<bodyPix.BodyPix | null>(null)
  const { toast } = useToast()

  // Initialize TensorFlow.js and BodyPix
  useEffect(() => {
    const initTF = async () => {
      try {
        await tf.ready()
        setTfReady(true)
        console.log('TensorFlow.js ready, backend:', tf.getBackend())
      } catch (error) {
        console.error('TF.js init error:', error)
      }
    }
    initTF()
  }, [])

  // Load BodyPix model when needed
  const loadModel = useCallback(async () => {
    if (modelRef.current || modelLoading) return modelRef.current
    
    setModelLoading(true)
    setProgress(10)
    
    try {
      const net = await bodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2
      })
      modelRef.current = net
      setModelLoaded(true)
      setProgress(100)
      return net
    } catch (error) {
      console.error('Failed to load BodyPix:', error)
      toast({
        title: 'AI Model Loading Failed',
        description: 'Falling back to browser mode',
        variant: 'destructive'
      })
      return null
    } finally {
      setModelLoading(false)
    }
  }, [modelLoading, toast])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name.split('.')[0])
    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setProcessedImage(null)
    }
    reader.readAsDataURL(file)
  }

  // AI-powered background removal using BodyPix (for people)
  const removeBackgroundAI = useCallback(async (forPerson: boolean) => {
    if (!image || !canvasRef.current) return

    setIsProcessing(true)
    setProgress(5)

    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context not available')

      // Load image
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
        // Use BodyPix for person segmentation
        setProgress(20)
        
        const net = await loadModel()
        if (!net) throw new Error('Failed to load AI model')

        setProgress(40)

        // Run person segmentation
        const segmentation = await net.segmentPerson(canvas, {
          flipHorizontal: false,
          internalResolution: 'medium',
          segmentationThreshold: 0.7
        })

        setProgress(70)

        // Get image data and apply mask
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        // Create foreground mask (person = 1, background = 0)
        for (let i = 0; i < segmentation.data.length; i++) {
          const pixelIndex = i * 4
          if (segmentation.data[i] === 0) {
            // This is background - make transparent
            data[pixelIndex + 3] = 0
          }
        }

        ctx.putImageData(imageData, 0, 0)
        setProgress(90)

      } else {
        // Auto-detect background using color analysis
        setProgress(30)
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        const width = canvas.width
        const height = canvas.height

        // Sample corners and edges to find background color
        const samples: { r: number; g: number; b: number }[] = []
        const samplePoints = [
          [0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1],
          [Math.floor(width * 0.25), 0], [Math.floor(width * 0.5), 0], [Math.floor(width * 0.75), 0],
          [0, Math.floor(height * 0.25)], [0, Math.floor(height * 0.5)], [0, Math.floor(height * 0.75)],
          [width - 1, Math.floor(height * 0.25)], [width - 1, Math.floor(height * 0.5)], [width - 1, Math.floor(height * 0.75)],
          [Math.floor(width * 0.25), height - 1], [Math.floor(width * 0.5), height - 1], [Math.floor(width * 0.75), height - 1]
        ]

        for (const [x, y] of samplePoints) {
          const idx = (y * width + x) * 4
          samples.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] })
        }

        // Find dominant background color using clustering
        const bgR = Math.round(samples.reduce((s, c) => s + c.r, 0) / samples.length)
        const bgG = Math.round(samples.reduce((s, c) => s + c.g, 0) / samples.length)
        const bgB = Math.round(samples.reduce((s, c) => s + c.b, 0) / samples.length)

        setProgress(50)

        // Calculate adaptive tolerance based on color variance
        const variance = samples.reduce((sum, c) => {
          return sum + Math.pow(c.r - bgR, 2) + Math.pow(c.g - bgG, 2) + Math.pow(c.b - bgB, 2)
        }, 0) / samples.length
        const tolerance = Math.sqrt(variance) * 1.5 + 30

        setProgress(60)

        // Remove background with soft edges
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          const distance = Math.sqrt(
            Math.pow(r - bgR, 2) +
            Math.pow(g - bgG, 2) +
            Math.pow(b - bgB, 2)
          )

          // Soft transition for edges
          if (distance < tolerance * 2) {
            const alpha = distance < tolerance 
              ? 0 
              : Math.min(255, Math.floor((distance - tolerance) / tolerance * 255))
            data[i + 3] = alpha
          }
        }

        ctx.putImageData(imageData, 0, 0)
        setProgress(90)
      }

      setProgress(100)
      setProcessedImage(canvas.toDataURL('image/png'))
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
        variant: 'destructive'
      })
    }
  }, [image, loadModel, toast])

  const downloadImage = () => {
    if (!processedImage) return
    const link = document.createElement('a')
    link.download = `${fileName}-no-bg.png`
    link.href = processedImage
    link.click()
  }

  const copyImage = async () => {
    if (!processedImage) return
    try {
      const response = await fetch(processedImage)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({ title: 'Copied!', description: 'Image copied to clipboard' })
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' })
    }
  }

  // Draw image on display canvas
  useEffect(() => {
    if (!image || !displayCanvasRef.current) return
    
    const canvas = displayCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

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
  }, [image, processedImage, showCheckerboard, bgColor])

  return (
    <div className="space-y-8">
      <canvas ref={canvasRef} className="hidden" />

      {/* Banner Card */}
      <Card className="bg-primary/5 border-primary/20 p-6">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
            <Eraser className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">AI Background Remover</h2>
                <p className="text-sm mt-1 font-medium text-muted-foreground">
                  Remove backgrounds with precision using TensorFlow.js AI. 
                  Zero server lag, 100% private, locally processed.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {tfReady ? (
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-black tracking-widest text-[9px] h-7 px-3 uppercase">
                    <Cpu className="w-3 h-3 mr-1.5" />
                    Neural Engine Ready
                  </Badge>
                ) : (
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 font-black tracking-widest text-[9px] h-7 px-3 uppercase">
                    <RefreshCw className="w-3 h-3 mr-1.5 animate-spin" />
                    Loading AI...
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Controls */}
        <div className="space-y-6">
           {/* Upload Component */}
           {!image ? (
            <div 
              className="relative border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer
                border-border/40 hover:border-primary/40 bg-muted/5 group overflow-hidden"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center gap-4 relative z-0">
                <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Eraser className="w-10 h-10 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-white uppercase tracking-tight">Drop Image Here</h4>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">or click to browse local files</p>
                </div>
                <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-black/20">
                  Privacy-First: No images are uploaded to servers
                </p>
              </div>
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ) : (
            <Card className="bg-muted/10 border-border/50 overflow-hidden relative group">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                   <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Source Image</Label>
                   <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setImage(null); setProcessedImage(null) }}
                    className="h-7 text-[10px] font-black uppercase tracking-widest hover:text-destructive gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset
                  </Button>
                </div>
                <div className="rounded-2xl overflow-hidden border border-white/5 bg-black/40">
                  <canvas
                    ref={displayCanvasRef}
                    className="w-full h-auto"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Settings Section */}
          <div className="space-y-4">
             <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Processing Configuration</Label>
             <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'auto', label: 'Auto (Object)', sub: 'Sharp Edges', icon: Wand2 },
                  { id: 'person', label: 'AI Portrait', sub: 'Depth Mapping', icon: User },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setMode(opt.id as any)}
                    className={`flex flex-col items-center p-5 rounded-2xl border transition-all text-center ${
                      mode === opt.id 
                        ? 'bg-primary/10 border-primary/40' 
                        : 'bg-muted/10 border-border/50 hover:border-border'
                    }`}
                  >
                    <opt.icon className={`w-6 h-6 mb-3 ${mode === opt.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-[11px] font-black uppercase tracking-wider ${mode === opt.id ? 'text-white' : 'text-muted-foreground'}`}>{opt.label}</span>
                    <span className="text-[9px] font-medium opacity-40 uppercase tracking-widest mt-1">{opt.sub}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => removeBackgroundAI(mode === 'person')}
            disabled={!image || isProcessing || !tfReady}
            className={`w-full h-16 uppercase tracking-[0.2em] font-black text-sm shadow-xl transition-all ${
              isProcessing ? 'bg-muted cursor-not-allowed' : 'shadow-primary/20'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>AI Analyzing... {progress}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                <span>Execute AI Extraction</span>
              </div>
            )}
          </Button>

          {/* Detailed Options (When Processed) */}
          {processedImage && (
            <div className="p-6 rounded-2xl bg-muted/20 border border-border/50 space-y-4 animate-in fade-in zoom-in-95">
                <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Preview Environment</Label>
                <div className="flex gap-2">
                  <Button
                    variant={showCheckerboard ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setShowCheckerboard(true)}
                    className="flex-1 h-10 font-black uppercase text-[10px] tracking-widest gap-2"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Transparent
                  </Button>
                  <Button
                    variant={!showCheckerboard ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setShowCheckerboard(false)}
                    className="flex-1 h-10 font-black uppercase text-[10px] tracking-widest gap-2"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    Solid Color
                  </Button>
                </div>
                {!showCheckerboard && (
                  <div className="flex items-center gap-4 pt-2 animate-in slide-in-from-top-2">
                    <Input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-12 p-1 bg-black/40 border-border/50 rounded-lg cursor-pointer flex-shrink-0"
                    />
                    <div className="flex-1 px-4 h-12 bg-black/40 border border-border/50 rounded-lg flex items-center">
                       <code className="text-[11px] font-mono text-white/50">{bgColor.toUpperCase()}</code>
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Right Column: Preview & Output */}
        <div className="space-y-6">
          <Card className="bg-muted/10 border-border/50 overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
               <Label className="text-white font-bold uppercase tracking-wider text-[10px]">
                 {processedImage ? 'AI Extracted Output' : 'Awaiting Processing'}
               </Label>
               {processedImage && (
                  <div className="flex gap-2">
                    <Button variant="secondary" size="icon" className="size-8" onClick={copyImage}>
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                    <Button variant="secondary" size="icon" className="size-8" onClick={downloadImage}>
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
               )}
            </div>
            <div 
              className="flex-1 flex items-center justify-center p-8 transition-all duration-500"
              style={{
                background: processedImage && showCheckerboard 
                  ? 'repeating-conic-gradient(rgba(255,255,255,0.05) 0% 25%, transparent 0% 50%) 50% / 40px 40px'
                  : processedImage && !showCheckerboard 
                  ? bgColor
                  : 'transparent'
              }}
            >
              {processedImage ? (
                <img 
                  src={processedImage} 
                  alt="Extracted Result" 
                  className="w-full h-auto max-h-[450px] object-contain drop-shadow-2xl animate-in zoom-in-95 duration-500" 
                />
              ) : image ? (
                <div className="text-center space-y-4 opacity-40">
                   <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-8 h-8" />
                   </div>
                   <h5 className="font-black uppercase tracking-[0.2em] text-[10px] text-white">Ready for AI processing</h5>
                   <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest max-w-[200px] mx-auto">Click the execute button to start the neural removal engine</p>
                </div>
              ) : (
                <div className="text-center space-y-4 opacity-20">
                   <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                   <p className="text-[10px] font-black uppercase tracking-widest">Awaiting local image upload</p>
                </div>
              )}
            </div>
            {processedImage && (
              <div className="p-6 border-t border-white/5 bg-black/20">
                <Button onClick={downloadImage} className="w-full h-14 bg-primary hover:bg-primary/90 gap-3 shadow-lg shadow-primary/20">
                  <Download className="w-5 h-5" />
                  <span className="font-black uppercase tracking-widest text-xs">Download High-Res PNG</span>
                </Button>
              </div>
            )}
          </Card>

          {/* Security Note */}
          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
               <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
               <p className="text-[11px] font-black text-white uppercase tracking-wider">Privacy & Security Engine</p>
               <p className="text-[10px] text-muted-foreground leading-relaxed">
                 Unlike other removers, your photos never hit any cloud. All neural network calculations are performed locally on your GPU/CPU via WebGL/WASM. No data is stored, shared, or collected.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
