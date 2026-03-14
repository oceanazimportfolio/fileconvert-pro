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

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="bg-pink-500/10 border-pink-500/30 p-4">
        <div className="flex items-start gap-3">
          <Palette className="w-5 h-5 text-pink-400 mt-0.5" />
          <div>
            <p className="text-pink-400 font-medium">Color Palette Generator</p>
            <p className="text-sm text-slate-400 mt-1">
              Generate beautiful color palettes for your designs. Lock colors you like 
              and regenerate the rest. Export as CSS or JSON.
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button 
          onClick={generatePalette}
          className="gap-2 bg-pink-500 hover:bg-pink-600"
        >
          <RefreshCw className="w-4 h-4" />
          Generate New
        </Button>
        <Button variant="outline" onClick={copyAll} className="gap-2">
          {copied === 'all' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied === 'all' ? 'Copied!' : 'Copy All'}
        </Button>
        <Button variant="outline" onClick={downloadCSS} className="gap-2">
          <Download className="w-4 h-4" />
          CSS
        </Button>
        <Button variant="outline" onClick={downloadJSON} className="gap-2">
          <Download className="w-4 h-4" />
          JSON
        </Button>
      </div>

      {/* Color Palette */}
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color, index) => (
          <div
            key={index}
            className="group relative"
            style={{ backgroundColor: color.hex }}
          >
            <div 
              className="aspect-[3/4] flex flex-col items-center justify-center cursor-pointer transition-all"
              onClick={() => copyColor(color.hex)}
            >
              {/* Lock Button */}
              <Button
                variant="ghost"
                size="icon"
              onClick={(e) => {
                  e.stopPropagation()
                  toggleLock(index)
                }}
                className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                  color.locked ? 'opacity-100' : ''
                }`}
                style={{ 
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  color: getContrastColor(color.hex)
                }}
              >
                {color.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </Button>

              {/* HEX Display */}
              <div 
                className="text-lg font-bold font-mono mb-2"
                style={{ color: getContrastColor(color.hex) }}
              >
                {color.hex}
              </div>

              {/* Copy Indicator */}
              {copied === color.hex && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/20"
                >
                  <CheckCircle 
                    className="w-8 h-8"
                    style={{ color: getContrastColor(color.hex) }}
                  />
                </div>
              )}
            </div>

            {/* Color Input */}
            <div className="p-2 bg-black/10">
              <Input
                type="text"
                value={color.hex}
                onChange={(e) => updateColor(index, e.target.value.toUpperCase())}
                className="w-full h-8 text-center font-mono text-sm bg-transparent border-0 p-0"
                style={{ color: getContrastColor(color.hex) }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Color Picker */}
      <div className="grid grid-cols-5 gap-4">
        {colors.map((color, index) => (
          <div key={index} className="space-y-2">
            <Label className="text-slate-400 text-xs">Color {index + 1}</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={color.hex}
                onChange={(e) => updateColor(index, e.target.value.toUpperCase())}
                className="w-10 h-10 p-1 bg-slate-800 border-slate-600"
              />
              <Input
                type="text"
                value={color.hex}
                onChange={(e) => updateColor(index, e.target.value.toUpperCase())}
                className="flex-1 bg-slate-800/50 border-slate-600 text-white font-mono"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Keyboard Hint */}
      <Card className="bg-slate-800/30 border-slate-700/30 p-4">
        <p className="text-sm text-slate-400">
          <span className="text-white font-medium">Tip:</span> Click on any color to copy its HEX code. 
          Lock colors to keep them while generating new ones. Press{' '}
          <Badge variant="secondary" className="mx-1">Space</Badge> to generate a new palette.
        </p>
      </Card>
    </div>
  )
}
