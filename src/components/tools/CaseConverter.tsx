'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  CaseSensitive, Copy, CheckCircle, Trash2, 
  Type, ArrowRightLeft
} from 'lucide-react'

type CaseType = 
  | 'upper' 
  | 'lower' 
  | 'title' 
  | 'sentence' 
  | 'camel' 
  | 'pascal' 
  | 'snake' 
  | 'kebab' 
  | 'constant'

export function CaseConverter() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const caseTypes: { id: CaseType; label: string; example: string }[] = [
    { id: 'upper', label: 'UPPERCASE', example: 'HELLO WORLD' },
    { id: 'lower', label: 'lowercase', example: 'hello world' },
    { id: 'title', label: 'Title Case', example: 'Hello World' },
    { id: 'sentence', label: 'Sentence case', example: 'Hello world' },
    { id: 'camel', label: 'camelCase', example: 'helloWorld' },
    { id: 'pascal', label: 'PascalCase', example: 'HelloWorld' },
    { id: 'snake', label: 'snake_case', example: 'hello_world' },
    { id: 'kebab', label: 'kebab-case', example: 'hello-world' },
    { id: 'constant', label: 'CONSTANT_CASE', example: 'HELLO_WORLD' },
  ]

  const convertCase = (text: string, caseType: CaseType): string => {
    if (!text) return ''
    
    // Split into words
    const words = text
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 0)

    switch (caseType) {
      case 'upper':
        return text.toUpperCase()
      case 'lower':
        return text.toLowerCase()
      case 'title':
        return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
      case 'sentence':
        return words
          .map((w, i) => i === 0 
            ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() 
            : w.toLowerCase()
          )
          .join(' ')
      case 'camel':
        return words
          .map((w, i) => i === 0 
            ? w.toLowerCase() 
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
          )
          .join('')
      case 'pascal':
        return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')
      case 'snake':
        return words.map(w => w.toLowerCase()).join('_')
      case 'kebab':
        return words.map(w => w.toLowerCase()).join('-')
      case 'constant':
        return words.map(w => w.toUpperCase()).join('_')
      default:
        return text
    }
  }

  const results = useMemo(() => {
    return caseTypes.map(ct => ({
      ...ct,
      result: convertCase(input, ct.id)
    }))
  }, [input])

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSwap = (text: string) => {
    setInput(text)
  }

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0
  const charCount = input.length

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="bg-purple-500/10 border-purple-500/30 p-4">
        <div className="flex items-start gap-3">
          <CaseSensitive className="w-5 h-5 text-purple-400 mt-0.5" />
          <div>
            <p className="text-purple-400 font-medium">Text Case Converter</p>
            <p className="text-sm text-slate-400 mt-1">
              Convert text between different cases instantly. Supports UPPERCASE, lowercase, 
              Title Case, camelCase, snake_case, and more.
            </p>
          </div>
        </div>
      </Card>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-white">Enter Text</Label>
          <div className="flex gap-2 text-xs text-slate-400">
            <span>{charCount} characters</span>
            <span>•</span>
            <span>{wordCount} words</span>
          </div>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste your text here..."
          className="min-h-32 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
        />
      </div>

      {/* Results Grid */}
      <div className="space-y-3">
        <Label className="text-white">Converted Results</Label>
        <div className="grid gap-3">
          {results.map((item) => (
            <Card 
              key={item.id} 
              className="bg-slate-800/30 border-slate-700/30 p-4 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="secondary" 
                    className="bg-purple-500/20 text-purple-400 border-purple-500/30 min-w-28 justify-center"
                  >
                    {item.label}
                  </Badge>
                  <p className="text-white font-mono text-sm truncate max-w-md">
                    {item.result || <span className="text-slate-500">Result will appear here...</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSwap(item.result)}
                    disabled={!item.result}
                    title="Use as input"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(item.result, item.id)}
                    disabled={!item.result}
                  >
                    {copied === item.id ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Examples */}
      <Card className="bg-slate-800/30 border-slate-700/30 p-4">
        <p className="text-sm text-slate-400 mb-3">Quick Examples:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'hello world',
            'THE QUICK BROWN FOX',
            'my_variable_name',
            'camelCaseExample'
          ].map((example) => (
            <Button
              key={example}
              variant="outline"
              size="sm"
              onClick={() => setInput(example)}
              className="text-xs"
            >
              {example}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  )
}
