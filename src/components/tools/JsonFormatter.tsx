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
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="bg-amber-500/10 border-amber-500/30 p-4">
        <div className="flex items-start gap-3">
          <Braces className="w-5 h-5 text-amber-400 mt-0.5" />
          <div>
            <p className="text-amber-400 font-medium">JSON Formatter & Validator</p>
            <p className="text-sm text-slate-400 mt-1">
              Format, validate, and minify JSON data. Instantly beautify messy JSON
              or compress it for production use.
            </p>
          </div>
        </div>
      </Card>

      {/* Mode Selection */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'format' | 'minify')}>
        <TabsList className="bg-slate-800/50">
          <TabsTrigger value="format" className="gap-2">
            <Maximize2 className="w-4 h-4" />
            Format
          </TabsTrigger>
          <TabsTrigger value="minify" className="gap-2">
            <Minimize2 className="w-4 h-4" />
            Minify
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Indent Selection (only for format mode) */}
      {mode === 'format' && (
        <div>
          <Label className="text-white mb-2 block">Indentation</Label>
          <div className="flex gap-2">
            {[2, 4, 8].map((size) => (
              <Button
                key={size}
                variant="outline"
                size="sm"
                onClick={() => setIndent(size)}
                className={indent === size
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-slate-800/50 border-slate-600 text-slate-300'
                }
              >
                {size} spaces
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input/Output */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-white">Input JSON</Label>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={loadSample} className="text-xs">
                Sample
              </Button>
              <Button variant="ghost" size="sm" onClick={handlePaste} className="text-xs">
                Paste
              </Button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full h-64 p-4 rounded-lg bg-slate-800/50 border border-slate-600 text-white font-mono text-sm resize-none focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-white">Output</Label>
              {input && (
                result.valid ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Valid JSON
                  </Badge>
                ) : (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Invalid
                  </Badge>
                )
              )}
            </div>
            {result.valid && result.output && (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs">
                  {copied ? <CheckCircle className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            )}
          </div>
          <div
            className={`w-full h-64 p-4 rounded-lg border font-mono text-sm overflow-auto ${result.valid
                ? 'bg-slate-800/50 border-slate-600 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
          >
            <pre className="whitespace-pre-wrap break-all">
              {result.output || 'Formatted JSON will appear here...'}
            </pre>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleClear} className="gap-2 flex-1 sm:flex-none">
          <Trash2 className="w-4 h-4" />
          Clear
        </Button>
        {result.valid && result.output && (
          <Button onClick={handleDownload} className="gap-2 flex-1 sm:flex-none bg-primary hover:bg-primary/90 font-bold">
            <Download className="w-4 h-4" />
            Download JSON
          </Button>
        )}
      </div>

      {/* Stats */}
      {input && result.valid && (
        <Card className="bg-slate-800/30 border-slate-700/30 p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{input.length}</p>
              <p className="text-xs text-slate-400">Input Bytes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{result.output.length}</p>
              <p className="text-xs text-slate-400">Output Bytes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">
                {mode === 'minify' && input.length > 0
                  ? `${Math.round((1 - result.output.length / input.length) * 100)}%`
                  : '-'
                }
              </p>
              <p className="text-xs text-slate-400">Reduced</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {(input.match(/{/g) || []).length}
              </p>
              <p className="text-xs text-slate-400">Objects</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
