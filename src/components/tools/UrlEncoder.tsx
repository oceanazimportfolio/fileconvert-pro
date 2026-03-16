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
    <div className="space-y-4">
      {/* Tool Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {mode === 'encode' ? <Link className="w-5 h-5" /> : <Unlink className="w-5 h-5" />}
            URL {mode === 'encode' ? 'Encoder' : 'Decoder'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {mode === 'encode' 
              ? 'Convert text to URL-safe format' 
              : 'Convert encoded URL back to text'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')}
            className="border-slate-600"
          >
            <ArrowRightLeft className="w-4 h-4 mr-1" />
            Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <Label className="text-slate-300">
            {mode === 'encode' ? 'Plain Text' : 'Encoded URL'}
          </Label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' 
              ? 'Enter text to encode (e.g., hello world?param=value)' 
              : 'Enter encoded URL to decode (e.g., hello%20world%3Fparam%3Dvalue)'}
            className="min-h-[200px] bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
          />
          <p className="text-xs text-slate-500">
            Characters: {input.length}
          </p>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">
              {mode === 'encode' ? 'Encoded URL' : 'Decoded Text'}
            </Label>
            {output && (
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="text-slate-400 hover:text-white"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            )}
          </div>
          <div className="min-h-[200px] bg-slate-900/50 border border-slate-600 rounded-md p-3">
            <p className={`text-sm whitespace-pre-wrap break-all ${output.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {output || 'Output will appear here...'}
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Characters: {output.length}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleConvert} className="flex-1 bg-blue-600 hover:bg-blue-700">
          {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
        </Button>
        <Button variant="outline" onClick={handleSwap} className="border-slate-600">
          <ArrowRightLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" onClick={clearAll} className="border-slate-600">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Examples */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-white mb-3">Quick Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setInput('hello world')
                setMode('encode')
              }}
              className="justify-start text-slate-400 hover:text-white"
            >
              <Badge variant="secondary" className="mr-2 bg-slate-700">Encode</Badge>
              "hello world" → "hello%20world"
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setInput('price: $100 (20% off)')
                setMode('encode')
              }}
              className="justify-start text-slate-400 hover:text-white"
            >
              <Badge variant="secondary" className="mr-2 bg-slate-700">Encode</Badge>
              Special characters
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setInput('https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dtest')
                setMode('decode')
              }}
              className="justify-start text-slate-400 hover:text-white"
            >
              <Badge variant="secondary" className="mr-2 bg-slate-700">Decode</Badge>
              Full URL decode
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setInput('%E2%9C%93%20%E4%B8%AD%E6%96%87')
                setMode('decode')
              }}
              className="justify-start text-slate-400 hover:text-white"
            >
              <Badge variant="secondary" className="mr-2 bg-slate-700">Decode</Badge>
              Unicode characters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SEO Content */}
      <div className="mt-6 text-sm text-slate-500 space-y-2">
        <h3 className="font-medium text-slate-400">About URL Encoding</h3>
        <p>
          URL encoding converts characters into a format that can be transmitted over the Internet. 
          Characters that are not allowed in URLs (like spaces, special symbols, and non-ASCII characters) 
          are replaced with a "%" followed by two hexadecimal digits.
        </p>
        <p>
          Common encoded characters: space → %20, @ → %40, # → %23, ? → %3F, &amp; → %26, = → %3D
        </p>
      </div>
    </div>
  )
}
