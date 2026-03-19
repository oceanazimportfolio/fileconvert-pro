'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Braces, Copy, CheckCircle, AlertCircle, Trash2,
  Minimize2, Maximize2, Download
} from 'lucide-react'
import { trackConversion } from '@/lib/analytics'

export function JsonFormatter() {
  const [input, setInput] = useState('')
  const [indent, setIndent] = useState(2)
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<'format' | 'minify'>('format')

  const result = useMemo(() => {
    if (!input.trim()) return { valid: true, output: '' }

    try {
      const parsed = JSON.parse(input)
      const output = mode === 'format'
        ? JSON.stringify(parsed, null, indent)
        : JSON.stringify(parsed)
      return { valid: true, output }
    } catch (error) {
      return {
        valid: false,
        output: error instanceof Error ? error.message : 'Invalid JSON'
      }
    }
  }, [input, indent, mode])

  const handleCopy = async () => {
    if (!result.output) return
    await navigator.clipboard.writeText(result.output)
    setCopied(true)
    trackConversion('json-formatter', 'copy', 'json')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!result.output) return
    const blob = new Blob([result.output], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'formatted.json'
    link.click()
    URL.revokeObjectURL(url)
    trackConversion('json-formatter', 'download', 'json')
  }

  const handleClear = () => {
    setInput('')
  }

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText()
    setInput(text)
  }

  const loadSample = () => {
    setInput(JSON.stringify({
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "New York",
        country: "USA"
      },
      hobbies: ["reading", "gaming", "coding"],
      active: true
    }, null, 2))
  }

  return (
    <div className="space-y-8">
      {/* Banner Card */}
      <Card className="bg-primary/5 border-primary/20 p-6">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
            <Braces className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">JSON Formatter & Validator</h2>
            <p className="text-sm mt-1 font-medium text-muted-foreground">
              Format, validate, and minify your JSON data instantly. Perfect for 
              debugging and optimizing your data structures.
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
              <Tabs value={mode} onValueChange={(v) => setMode(v as 'format' | 'minify')} className="w-full">
                <TabsList className="bg-black/20 p-1 h-12 rounded-xl w-full border border-white/5">
                  <TabsTrigger value="format" className="flex-1 gap-2 font-bold data-[state=active]:bg-primary">
                    <Maximize2 className="w-4 h-4" />
                    Format
                  </TabsTrigger>
                  <TabsTrigger value="minify" className="flex-1 gap-2 font-bold data-[state=active]:bg-primary">
                    <Minimize2 className="w-4 h-4" />
                    Minify
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {mode === 'format' && (
              <div className="space-y-4">
                <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Indentation</Label>
                <div className="flex gap-2">
                  {[2, 4, 8].map((size) => (
                    <Button
                      key={size}
                      variant={indent === size ? 'default' : 'secondary'}
                      size="sm"
                      onClick={() => setIndent(size)}
                      className="flex-1 h-10 font-black uppercase text-[10px] tracking-widest"
                    >
                      {size} Spaces
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Input JSON</Label>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={loadSample} className="h-7 text-[10px] font-black uppercase tracking-widest hover:text-primary">
                  Sample
                </Button>
                <Button variant="ghost" size="sm" onClick={handlePaste} className="h-7 text-[10px] font-black uppercase tracking-widest hover:text-primary">
                  Paste
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClear} className="h-7 text-[10px] font-black uppercase tracking-widest hover:text-destructive">
                  Clear
                </Button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"key": "value"}'
              className="w-full h-[400px] p-6 rounded-2xl bg-black/40 border border-border/50 text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30"
            />
          </div>
        </div>

        {/* Right Column: Results & Stats */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between h-10">
              <div className="flex items-center gap-3">
                <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Output Results</Label>
                {input && (
                  <Badge className={`font-black uppercase tracking-widest text-[9px] h-6 px-2 ${result.valid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                    {result.valid ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                    {result.valid ? 'Valid JSON' : 'Invalid'}
                  </Badge>
                ) as any}
              </div>
              {result.valid && result.output && (
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={handleCopy} className="h-8 text-[10px] font-black uppercase tracking-widest gap-2">
                    {copied ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button variant="default" size="sm" onClick={handleDownload} className="h-8 text-[10px] font-black uppercase tracking-widest gap-2">
                    <Download className="w-3 h-3" />
                    Download
                  </Button>
                </div>
              )}
            </div>
            <div
              className={`w-full h-[400px] p-6 rounded-2xl border font-mono text-sm overflow-auto transition-colors ${result.valid
                ? 'bg-muted/10 border-border/50 text-emerald-400/90'
                : 'bg-destructive/5 border-destructive/20 text-destructive'
              }`}
            >
              <pre className="whitespace-pre-wrap break-all leading-relaxed">
                {result.output || <span className="text-muted-foreground/20 italic">Validated output will appear here...</span>}
              </pre>
            </div>
          </div>

          {/* Stats Section */}
          {input && result.valid && (
            <Card className="p-6 bg-primary/5 border-primary/10">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Input Size', val: `${(input.length / 1024).toFixed(2)} KB` },
                  { label: 'Output Size', val: `${(result.output.length / 1024).toFixed(2)} KB` },
                  { 
                    label: 'Reduction', 
                    val: mode === 'minify' ? `${Math.round((1 - result.output.length / input.length) * 100)}%` : '0%',
                    color: 'text-emerald-400' 
                  },
                  { label: 'Root Objects', val: (input.match(/{/g) || []).length },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                    <p className={`text-xl font-black ${stat.color || 'text-white'}`}>{stat.val}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
