'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Binary, Copy, CheckCircle, ArrowRightLeft, Trash2,
  Upload, Download, Shield
} from 'lucide-react'

export function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConvert = () => {
    setError(null)

    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      if (mode === 'encode') {
        // Encode text to Base64
        const encoded = btoa(unescape(encodeURIComponent(input)))
        setOutput(encoded)
      } else {
        // Decode Base64 to text
        const decoded = decodeURIComponent(escape(atob(input)))
        setOutput(decoded)
      }
    } catch (err) {
      setError('Invalid input for ' + (mode === 'encode' ? 'encoding' : 'decoding'))
      setOutput('')
    }
  }

  const handleSwap = () => {
    if (output) {
      setInput(output)
      setOutput('')
      setMode(mode === 'encode' ? 'decode' : 'decode')
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError(null)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      if (mode === 'encode') {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1]
          setOutput(base64)
          setInput(`[File: ${file.name}]`)
        }
        reader.readAsDataURL(file)
      }
    } catch {
      setError('Failed to read file')
    }
  }

  const handleDownload = () => {
    if (!output) return

    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Banner Card */}
      <Card className="bg-primary/5 border-primary/20 p-6">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
            <Binary className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Base64 Encoder & Decoder</h2>
            <p className="text-sm mt-1 font-medium text-muted-foreground">
              Convert text to Base64 format and vice versa. Useful for encoding data,
              creating data URLs, and handling binary data in text format.
            </p>
          </div>
        </div>
      </Card>

      {/* Mode Selection */}
      <div className="space-y-4">
        <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Operation Mode</Label>
        <Tabs value={mode} onValueChange={(v) => {
          setMode(v as 'encode' | 'decode')
          setOutput('')
          setError(null)
        }}>
          <TabsList className="bg-muted/50 p-1 h-14 rounded-xl w-full border border-border">
            <TabsTrigger value="encode" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 h-11 font-bold rounded-lg transition-all">
              Text → Base64
            </TabsTrigger>
            <TabsTrigger value="decode" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 h-11 font-bold rounded-lg transition-all">
              Base64 → Text
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Input Area</Label>
            {mode === 'encode' && (
              <label className="cursor-pointer">
                <input type="file" onChange={handleFileUpload} className="hidden" />
                <Button variant="ghost" size="sm" asChild className="h-8 text-muted-foreground hover:text-white">
                  <span className="gap-2">
                    <Upload className="w-3.5 h-3.5" />
                    Upload File
                  </span>
                </Button>
              </label>
            )}
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
            className="min-h-48 font-mono text-sm"
          />
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleConvert}
              className="gap-2 h-12 uppercase tracking-widest font-black flex-1"
            >
              {mode === 'encode' ? 'Encode' : 'Decode'}
              <ArrowRightLeft className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="secondary" onClick={handleClear} className="w-12 h-12 rounded-xl text-muted-foreground hover:text-destructive p-0">
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>

          {error && (
            <Card className="bg-destructive/5 border-destructive/20 p-4">
              <p className="text-destructive text-xs font-bold uppercase tracking-widest">{error}</p>
            </Card>
          )}
        </div>

        {/* Right Column: Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Output Area</Label>
            {output && (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleSwap} className="h-8 text-muted-foreground">
                  <ArrowRightLeft className="w-3.5 h-3.5 mr-2" />
                  Swap to Input
                </Button>
              </div>
            )}
          </div>
          <div className="min-h-48 p-4 rounded-xl bg-muted/30 border border-border font-mono text-sm break-all text-white relative group">
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {output || <span className="text-muted-foreground/50 italic">Output will appear here...</span>}
            </div>
            {output && (
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" onClick={handleCopy} className="size-8 rounded-lg">
                  {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button variant="secondary" size="icon" onClick={handleDownload} className="size-8 rounded-lg">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          {output && (
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-muted/20 border-dashed">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Character Count</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-white">{output.length}</span>
                  <span className="text-[10px] text-muted-foreground mb-1.5">
                    {mode === 'encode'
                      ? `(+${Math.round((output.length / input.length - 1) * 100)}%)`
                      : `(-${Math.round((1 - output.length / input.length) * 100)}%)`
                    }
                  </span>
                </div>
              </Card>
              <Card className="p-4 bg-primary/5 border-primary/20">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-black text-white uppercase">{mode}DED</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Use Cases Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-5 hover:bg-muted/30 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-bold text-white uppercase tracking-tight">Encode images for CSS/Data URLs</p>
          </div>
        </Card>
        <Card className="p-5 hover:bg-muted/30 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-bold text-white uppercase tracking-tight">API Auth & Header Obfuscation</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
