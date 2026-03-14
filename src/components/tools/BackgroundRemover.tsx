'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Eraser, Download, RefreshCw, Copy, Check, Image as ImageIcon,
  Palette, Wand2, Layers, Sparkles, Cpu, User
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
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      {/* Tool Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Eraser className="w-5 h-5 text-pink-400" />
            AI Background Remover
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Remove backgrounds with TensorFlow.js AI
          </p>
        </div>
        <div className="flex items-center gap-2">
          {tfReady ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 rounded-full border border-green-500/30">
              <Cpu className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs text-green-400 font-medium">AI Ready</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 rounded-full border border-yellow-500/30">
              <RefreshCw className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
              <span className="text-xs text-yellow-400 font-medium">Loading AI...</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Status Card */}
      <Card className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
            <div className="flex-1">
              <p className="text-pink-300 font-medium flex items-center gap-2">
                TensorFlow.js BodyPix AI
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">100% Free</span>
              </p>
              <p className="text-slate-400 text-sm mt-1">
                AI-powered background removal. Runs entirely in your browser - no server uploads, no API limits, complete privacy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Controls */}
        <div className="space-y-4">
          {/* Upload */}
          {!image ? (
            <div 
              className="relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                border-slate-600 hover:border-pink-500 bg-slate-800/30"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center">
                  <Eraser className="w-8 h-8 text-pink-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-white">Drop image to remove background</p>
                  <p className="text-sm text-slate-400 mt-1">or click to browse</p>
                </div>
                <div className="text-xs text-slate-500">Works best with photos of people or solid backgrounds</div>
              </div>
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Original Image</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setImage(null); setProcessedImage(null) }}
                    className="text-slate-400 hover:text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Change
                  </Button>
                </div>
                <canvas
                  ref={displayCanvasRef}
                  className="w-full rounded-lg"
                  style={{ maxHeight: '250px' }}
                />
              </CardContent>
            </Card>
          )}

          {/* Mode Selection */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 space-y-4">
              <Label className="text-slate-300 text-sm font-medium">Removal Mode</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={mode === 'auto' ? 'default' : 'outline'}
                  onClick={() => setMode('auto')}
                  className={`h-auto py-4 flex-col items-center gap-1 ${
                    mode === 'auto' 
                      ? 'bg-pink-600 border-pink-500 text-white' 
                      : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Wand2 className="w-5 h-5" />
                  <span className="font-medium">Auto</span>
                  <span className="text-xs opacity-80">Solid backgrounds</span>
                </Button>
                <Button
                  variant={mode === 'person' ? 'default' : 'outline'}
                  onClick={() => setMode('person')}
                  className={`h-auto py-4 flex-col items-center gap-1 ${
                    mode === 'person' 
                      ? 'bg-pink-600 border-pink-500 text-white' 
                      : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Person AI</span>
                  <span className="text-xs opacity-80">Portrait photos</span>
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                {mode === 'person' 
                  ? '🧠 Uses AI to detect and keep people, removes everything else'
                  : '🎨 Detects background color and removes similar colors'}
              </p>
            </CardContent>
          </Card>

          {/* Background Preview */}
          {processedImage && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 space-y-3">
                <Label className="text-slate-300 text-sm font-medium">Preview Background</Label>
                <div className="flex gap-2">
                  <Button
                    variant={showCheckerboard ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowCheckerboard(true)}
                    className={showCheckerboard ? 'bg-pink-600' : 'border-slate-600'}
                  >
                    <Layers className="w-4 h-4 mr-1" />
                    Transparent
                  </Button>
                  <Button
                    variant={!showCheckerboard ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowCheckerboard(false)}
                    className={!showCheckerboard ? 'bg-pink-600' : 'border-slate-600'}
                  >
                    <Palette className="w-4 h-4 mr-1" />
                    Color
                  </Button>
                </div>
                {!showCheckerboard && (
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 p-1 bg-slate-800 border-slate-600"
                    />
                    <span className="text-sm text-slate-400">{bgColor}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Button */}
          <Button
            onClick={() => removeBackgroundAI(mode === 'person')}
            disabled={!image || isProcessing || !tfReady}
            className="w-full h-14 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                AI Processing... ({progress}%)
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Remove Background {mode === 'person' ? '(Person AI)' : '(Auto)'}
              </>
            )}
          </Button>
        </div>

        {/* Right: Preview */}
        <div className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400">
                  {processedImage ? 'Result (Transparent PNG)' : 'Preview'}
                </span>
                {processedImage && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={copyImage}>
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={downloadImage}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div 
                className="min-h-[280px] rounded-lg flex items-center justify-center overflow-hidden"
                style={{
                  background: processedImage && showCheckerboard 
                    ? 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 20px 20px'
                    : processedImage && !showCheckerboard 
                    ? bgColor
                    : '#0f172a'
                }}
              >
                {processedImage ? (
                  <img src={processedImage} alt="No Background" className="w-full h-auto max-h-[350px] object-contain" />
                ) : image ? (
                  <div className="text-center text-slate-400 p-4">
                    <Eraser className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>Click "Remove Background"</p>
                    <p className="text-xs mt-1">AI will detect and remove the background</p>
                  </div>
                ) : (
                  <div className="text-center text-slate-500">
                    <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>Upload an image</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {processedImage && (
            <Button onClick={downloadImage} className="w-full bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Download Transparent PNG
            </Button>
          )}

          <Card className="bg-slate-800/30 border-slate-700/50 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-pink-400 mt-0.5" />
              <div className="text-sm">
                <p className="text-white font-medium">AI-Powered Background Removal</p>
                <p className="text-slate-400 mt-1">
                  Uses TensorFlow.js BodyPix model for person detection. 
                  For non-person images, uses smart color detection. 
                  All processing happens locally in your browser.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
