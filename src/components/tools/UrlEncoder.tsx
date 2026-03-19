'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Copy, ArrowRightLeft, Trash2, Check, Link, Unlink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { trackConversion } from '@/lib/analytics'

export function UrlEncoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const { toast } = useToast()

  const encodeUrl = (text: string) => {
    try {
      return encodeURIComponent(text)
    } catch {
      return 'Error encoding URL'
    }
  }

  const decodeUrl = (text: string) => {
    try {
      return decodeURIComponent(text)
    } catch {
      return 'Error: Invalid encoded URL'
    }
  }

  const handleConvert = () => {
    if (!input.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to convert",
        variant: "destructive"
      })
      return
    }

    const result = mode === 'encode' ? encodeUrl(input) : decodeUrl(input)
    setOutput(result)
    trackConversion('url-encoder-decoder', 'convert', mode)
  }

  const handleSwap = () => {
    if (output) {
      setInput(output)
      setOutput('')
      setMode(mode === 'encode' ? 'decode' : 'encode')
    }
  }

  const copyToClipboard = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      trackConversion('url-encoder-decoder', 'copy', 'text')
      toast({
        title: "Copied!",
        description: "Output copied to clipboard"
      })
    } catch {
      toast({
        title: "Failed to copy",
        variant: "destructive"
      })
    }
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
  }

  return (
    <div className="space-y-8">
      {/* Banner Card */}
      <Card className="bg-primary/5 border-primary/20 p-6">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
            {mode === 'encode' ? <Link className="w-7 h-7 text-primary" /> : <Unlink className="w-7 h-7 text-primary" />}
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">URL {mode === 'encode' ? 'Encoder' : 'Decoder'}</h2>
            <p className="text-sm mt-1 font-medium text-muted-foreground">
              {mode === 'encode' 
                ? 'Convert text to URL-safe format instantly.' 
                : 'Convert encoded URL back to readable text.'}
              Secure, browser-based processing.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Input & Controls */}
        <div className="space-y-6">
          <div className="flex flex-col gap-6 p-6 rounded-2xl bg-muted/20 border border-border/50">
            <div className="space-y-4">
              <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Processing Mode</Label>
              <div className="flex gap-2">
                <Button 
                  variant={mode === 'encode' ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setMode('encode')}
                  className="flex-1 h-11 font-black uppercase text-[10px] tracking-widest gap-2"
                >
                  <Link className="w-4 h-4" />
                  Encode
                </Button>
                <Button 
                  variant={mode === 'decode' ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setMode('decode')}
                  className="flex-1 h-11 font-black uppercase text-[10px] tracking-widest gap-2"
                >
                  <Unlink className="w-4 h-4" />
                  Decode
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white font-bold uppercase tracking-wider text-[10px]">
                {mode === 'encode' ? 'Plain Text Input' : 'Encoded URL Input'}
              </Label>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-[10px] font-black uppercase tracking-widest hover:text-destructive">
                  Clear
                </Button>
              </div>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' 
                ? 'Enter text to encode...' 
                : 'Enter encoded URL to decode...'}
              className="w-full h-[300px] p-6 rounded-2xl bg-black/40 border border-border/50 text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30"
            />
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                {input.length} Characters
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleConvert} className="flex-1 h-14 uppercase tracking-[0.2em] font-black text-sm shadow-xl shadow-primary/20">
              {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
            </Button>
            <Button variant="secondary" onClick={handleSwap} className="h-14 px-6 border-border/50">
              <ArrowRightLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Right Column: Output & Examples */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between h-10">
              <Label className="text-white font-bold uppercase tracking-wider text-[10px]">
                {mode === 'encode' ? 'URL Encoded Result' : 'Decoded Text Result'}
              </Label>
              {output && (
                <Button variant="secondary" size="sm" onClick={copyToClipboard} className="h-8 text-[10px] font-black uppercase tracking-widest gap-2 animate-in fade-in slide-in-from-right-2">
                  <Copy className="w-3 h-3" />
                  Copy Result
                </Button>
              )}
            </div>
            <div
              className={`w-full h-[300px] p-6 rounded-2xl border font-mono text-sm overflow-auto transition-colors bg-muted/10 border-border/50 ${
                output.startsWith('Error') ? 'text-destructive border-destructive/20 bg-destructive/5' : 'text-emerald-400/90'
              }`}
            >
              <pre className="whitespace-pre-wrap break-all leading-relaxed">
                {output || <span className="text-muted-foreground/20 italic">Output will appear here...</span>}
              </pre>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                {output.length} Characters
              </span>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <Label className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[9px]">Fast Presets</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Space & Symbols', text: 'hello world?#!' },
                { label: 'Full URL Path', text: 'https://example.com/api?v=1' },
                { label: 'Unicode/Emoji', text: '✓ Emoji 🎉' },
                { label: 'Parameters', text: 'id=123&name=test' },
              ].map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => {
                    setInput(ex.text)
                    setMode('encode')
                    // Small delay to ensure state update before execution if needed
                  }}
                  className="flex flex-col items-start p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all group text-left"
                >
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest mb-1 opacity-60 group-hover:opacity-100">{ex.label}</span>
                  <code className="text-xs text-white/70 font-mono truncate w-full">{ex.text}</code>
                </button>
              ))}
            </div>
          </div>

          {/* Educational Note */}
          <Card className="p-4 bg-black/40 border-dashed border-2 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-muted/50">
              <Link className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-white font-bold uppercase tracking-wider">About RFC 3986</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                URL encoding (Percent-encoding) is used in the main part of a URL (Uniform Resource Identifier) to convert characters that have special meaning into a safe format for transmission.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
