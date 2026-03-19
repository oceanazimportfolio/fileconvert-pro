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
    <div className="space-y-8">
      {/* Banner Card */}
      <Card className="bg-primary/5 border-primary/20 p-6">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
            <CaseSensitive className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Case Converter</h2>
            <p className="text-sm mt-1 font-medium text-muted-foreground">
              Transform text between different cases instantly. Supports UPPERCASE, lowercase, 
              Title Case, camelCase, snake_case, and more.
            </p>
          </div>
        </div>
      </Card>

      {/* Input Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Input Text</Label>
          <div className="flex gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            <span>{charCount} Characters</span>
            <span className="opacity-30">•</span>
            <span>{wordCount} Words</span>
          </div>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste your text here to transform it..."
          className="min-h-40 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          {['hello world', 'THE QUICK BROWN FOX', 'my_variable_name', 'camelCaseExample'].map((example) => (
            <Button
              key={example}
              variant="secondary"
              size="sm"
              onClick={() => setInput(example)}
              className="text-[10px] h-7 font-bold uppercase tracking-wider"
            >
              {example}
            </Button>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setInput('')}
            className="text-[10px] h-7 font-bold uppercase tracking-wider ml-auto text-destructive hover:text-white"
          >
            <Trash2 className="w-3 h-3 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Transformation Results</Label>
        <div className="grid gap-3">
          {results.map((item) => (
            <Card 
              key={item.id} 
              className="p-4 hover:bg-muted/30 transition-all border-border/50 group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Badge 
                    className="w-32 justify-center font-black uppercase tracking-widest text-[10px] h-8 shrink-0"
                  >
                    {item.label}
                  </Badge>
                  <p className="text-white font-mono text-sm truncate bg-black/20 px-3 py-1.5 rounded-lg border border-white/5 flex-1">
                    {item.result || <span className="text-muted-foreground/30 italic">Pending input...</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSwap(item.result)}
                    disabled={!item.result}
                    className="size-9 rounded-lg hover:text-primary"
                    title="Move to input"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(item.result, item.id)}
                    disabled={!item.result}
                    className="size-9 rounded-lg hover:text-emerald-400"
                  >
                    {copied === item.id ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
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
    </div>
  )
}
