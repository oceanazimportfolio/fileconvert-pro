'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, Copy, CheckCircle, RefreshCw, Lock, 
  Unlock, Download, Heart
} from 'lucide-react'

interface ColorItem {
  hex: string
  locked: boolean
}

export function ColorPalette() {
  const [colors, setColors] = useState<ColorItem[]>([
    { hex: '#FF6B6B', locked: false },
    { hex: '#4ECDC4', locked: false },
    { hex: '#45B7D1', locked: false },
    { hex: '#96CEB4', locked: false },
    { hex: '#FFEAA7', locked: false },
  ])
  const [copied, setCopied] = useState<string | null>(null)

  const generateRandomColor = useCallback((): string => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }, [])

  const generatePalette = useCallback(() => {
    setColors(prev => prev.map(c => ({
      hex: c.locked ? c.hex : generateRandomColor(),
      locked: c.locked
    })))
  }, [generateRandomColor])

  const toggleLock = (index: number) => {
    setColors(prev => prev.map((c, i) => 
      i === index ? { ...c, locked: !c.locked } : c
    ))
  }

  const updateColor = (index: number, hex: string) => {
    if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
      setColors(prev => prev.map((c, i) => 
        i === index ? { ...c, hex: hex.toUpperCase() } : c
      ))
    }
  }

  const copyColor = async (hex: string) => {
    await navigator.clipboard.writeText(hex)
    setCopied(hex)
    setTimeout(() => setCopied(null), 2000)
  }

  const copyAll = async () => {
    const palette = colors.map(c => c.hex).join(', ')
    await navigator.clipboard.writeText(palette)
    setCopied('all')
    setTimeout(() => setCopied(null), 2000)
  }

  const downloadCSS = () => {
    const css = `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`
    const blob = new Blob([css], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'palette.css'
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadJSON = () => {
    const json = JSON.stringify({ colors: colors.map(c => c.hex) }, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'palette.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const getContrastColor = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000000' : '#FFFFFF'
  }

  // Keyboard listener for Space key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && e.target === document.body) {
      e.preventDefault()
      generatePalette()
    }
  }, [generatePalette])

  useState(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown)
    }
  })

  return (
    <div className="space-y-8">
      {/* Banner Card */}
      <Card className="bg-primary/5 border-primary/20 p-6">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
            <Palette className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Pro Palette Generator</h2>
            <p className="text-sm mt-1 font-medium text-muted-foreground">
              Generate elite color schemes for your brand and UI.
              Lock colors to keep them while regenerating the rest.
              Export to CSS, JSON, or copy HEX.
            </p>
          </div>
        </div>
      </Card>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <Button 
            onClick={generatePalette}
            size="lg"
            className="h-12 px-8 uppercase tracking-[0.2em] font-black text-[10px] shadow-xl shadow-primary/20 gap-3"
          >
            <RefreshCw className="w-4 h-4" />
            Generate New
          </Button>
          <Button variant="secondary" onClick={copyAll} className="h-12 px-6 uppercase tracking-widest font-black text-[10px] border-border/50 gap-3">
            {copied === 'all' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied === 'all' ? 'Copied All' : 'Sync Palette'}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={downloadCSS} className="h-10 px-5 uppercase tracking-widest font-black text-[9px] border-border/50 gap-2 hover:bg-white/5">
            <Download className="w-3.5 h-3.5" />
            CSS Variable
          </Button>
          <Button variant="outline" onClick={downloadJSON} className="h-10 px-5 uppercase tracking-widest font-black text-[9px] border-border/50 gap-2 hover:bg-white/5">
            <Download className="w-3.5 h-3.5" />
            JSON Export
          </Button>
        </div>
      </div>

      {/* Main Palette View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {colors.map((color, index) => (
          <Card 
            key={index} 
            className="group relative overflow-hidden border-border/50 bg-muted/20 hover:border-primary/30 transition-all duration-500"
          >
            <div
              className="aspect-[4/5] flex flex-col items-center justify-center cursor-pointer relative overflow-hidden active:scale-95 transition-transform duration-300"
              style={{ backgroundColor: color.hex }}
              onClick={() => copyColor(color.hex)}
            >
              {/* Overlay for status */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Lock Control */}
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleLock(index)
                }}
                className={`absolute top-3 right-3 h-10 w-10 rounded-xl backdrop-blur-md border-white/10 transition-all duration-300 z-20 ${
                  color.locked 
                    ? 'bg-black/60 text-white opacity-100' 
                    : 'bg-black/40 text-white/50 opacity-0 group-hover:opacity-100'
                }`}
              >
                {color.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </Button>

              {/* HEX Value */}
              <div className="flex flex-col items-center gap-1 z-10 select-none">
                <span 
                  className="text-2xl font-black tracking-tighter drop-shadow-sm"
                  style={{ color: getContrastColor(color.hex) }}
                >
                  {color.hex.replace('#', '')}
                </span>
                <span 
                  className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40"
                  style={{ color: getContrastColor(color.hex) }}
                >
                  HEX CODE
                </span>
              </div>

              {/* Copy Indicator */}
              {copied === color.hex && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                  <div className="flex flex-col items-center gap-3 scale-110">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Captured!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Manual Edit Area */}
            <div className="p-4 bg-black/40 border-t border-white/5 backdrop-blur-sm">
               <div className="flex items-center gap-3">
                 <div className="relative h-8 w-8 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) => updateColor(index, e.target.value.toUpperCase())}
                      className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer"
                    />
                 </div>
                 <Input
                    type="text"
                    value={color.hex}
                    onChange={(e) => updateColor(index, e.target.value.toUpperCase())}
                    className="h-8 bg-transparent border-0 p-0 text-xs font-black uppercase tracking-widest focus-visible:ring-0"
                    placeholder="#FFFFFF"
                 />
               </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Keyboard Hint */}
      <Card className="bg-muted/10 border-border/50 p-6 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Lock className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-1 mt-0.5">
            <p className="text-[11px] font-black text-white uppercase tracking-wider">Workflow Optimization</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed uppercase font-bold tracking-tight">
              Tap <Badge variant="secondary" className="mx-1 bg-white/5 border-white/10 font-black px-2 mt-[-2px]">SPACEBAR</Badge> to instantly cycle colors. 
              Click any slab to copy value. Lock items to prevent drift during generation.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
