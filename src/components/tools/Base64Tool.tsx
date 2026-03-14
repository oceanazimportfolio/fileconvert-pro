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
  Upload, Download
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
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="bg-indigo-500/10 border-indigo-500/30 p-4">
        <div className="flex items-start gap-3">
          <Binary className="w-5 h-5 text-indigo-400 mt-0.5" />
          <div>
            <p className="text-indigo-400 font-medium">Base64 Encoder & Decoder</p>
            <p className="text-sm text-slate-400 mt-1">
              Convert text to Base64 format and vice versa. Useful for encoding data, 
              creating data URLs, and handling binary data in text format.
            </p>
          </div>
        </div>
      </Card>

      {/* Mode Selection */}
      <Tabs value={mode} onValueChange={(v) => {
        setMode(v as 'encode' | 'decode')
        setOutput('')
        setError(null)
      }}>
        <TabsList className="bg-slate-800/50">
          <TabsTrigger value="encode" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
            Text → Base64
          </TabsTrigger>
          <TabsTrigger value="decode" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
            Base64 → Text
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-white">
            {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
          </Label>
          {mode === 'encode' && (
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button variant="ghost" size="sm" asChild>
                  <span className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload File
                  </span>
                </Button>
              </label>
            </div>
          )}
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' 
            ? 'Enter text to encode...' 
            : 'Enter Base64 string to decode...'
          }
          className="min-h-32 bg-slate-800/50 border-slate-600 text-white font-mono"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          onClick={handleConvert}
          className="gap-2 bg-indigo-500 hover:bg-indigo-600"
        >
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </Button>
        <Button variant="outline" onClick={handleSwap} disabled={!output} className="gap-2">
          <ArrowRightLeft className="w-4 h-4" />
          Swap
        </Button>
        <Button variant="outline" onClick={handleClear} className="gap-2">
          <Trash2 className="w-4 h-4" />
          Clear
        </Button>
      </div>

      {/* Error */}
      {error && (
        <Card className="bg-red-500/10 border-red-500/30 p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </Card>
      )}

      {/* Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-white">
            {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
          </Label>
          {output && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          )}
        </div>
        <div className="min-h-32 p-4 rounded-lg bg-slate-800/50 border border-slate-600 font-mono text-sm break-all">
          {output || <span className="text-slate-500">Output will appear here...</span>}
        </div>
      </div>

      {/* Stats */}
      {output && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-slate-800/30 border-slate-700/30 p-3 text-center">
            <p className="text-2xl font-bold text-white">{input.length}</p>
            <p className="text-xs text-slate-400">Input chars</p>
          </Card>
          <Card className="bg-slate-800/30 border-slate-700/30 p-3 text-center">
            <p className="text-2xl font-bold text-white">{output.length}</p>
            <p className="text-xs text-slate-400">Output chars</p>
          </Card>
          <Card className="bg-slate-800/30 border-slate-700/30 p-3 text-center">
            <p className="text-2xl font-bold text-indigo-400">
              {mode === 'encode' 
                ? `+${Math.round((output.length / input.length - 1) * 100)}%`
                : `-${Math.round((1 - output.length / input.length) * 100)}%`
              }
            </p>
            <p className="text-xs text-slate-400">Size change</p>
          </Card>
        </div>
      )}

      {/* Common Use Cases */}
      <Card className="bg-slate-800/30 border-slate-700/30 p-4">
        <p className="text-sm text-white font-medium mb-2">Common Use Cases:</p>
        <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
          <li>Encode images and files as Data URLs</li>
          <li>Encode credentials for API authentication</li>
          <li>Store binary data in JSON/Text format</li>
          <li>Simple obfuscation of text data</li>
        </ul>
      </Card>
    </div>
  )
}
