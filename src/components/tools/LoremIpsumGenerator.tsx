'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { 
  FileText, Copy, CheckCircle, RefreshCw, Download,
  AlignLeft, Type, Hash
} from 'lucide-react'

type ContentType = 'paragraphs' | 'sentences' | 'words'

export function LoremIpsumGenerator() {
  const [output, setOutput] = useState('')
  const [contentType, setContentType] = useState<ContentType>('paragraphs')
  const [count, setCount] = useState(3)
  const [startWithClassic, setStartWithClassic] = useState(true)
  const [copied, setCopied] = useState(false)

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
    'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
    'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
    'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
    'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit',
    'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione', 'sequi',
    'nesciunt', 'neque', 'porro', 'quisquam', 'dolorem', 'adipisci', 'numquam',
    'eius', 'modi', 'tempora', 'magnam', 'quaerat'
  ]

  const classicStart = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'

  const generateWords = (num: number): string[] => {
    const words: string[] = []
    for (let i = 0; i < num; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)])
    }
    return words
  }

  const generateSentence = (wordCount: number = 8): string => {
    const words = generateWords(wordCount)
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    return words.join(' ') + '.'
  }

  const generateParagraph = (sentenceCount: number = 5): string => {
    const sentences: string[] = []
    for (let i = 0; i < sentenceCount; i++) {
      const wordCount = Math.floor(Math.random() * 8) + 6
      sentences.push(generateSentence(wordCount))
    }
    return sentences.join(' ')
  }

  const generate = () => {
    let result = ''

    if (contentType === 'paragraphs') {
      for (let i = 0; i < count; i++) {
        let para = generateParagraph(5 + Math.floor(Math.random() * 3))
        
        if (i === 0 && startWithClassic) {
          para = classicStart + para.charAt(0).toLowerCase() + para.slice(1)
        }
        
        result += para + '\n\n'
      }
    } else if (contentType === 'sentences') {
      for (let i = 0; i < count; i++) {
        let sentence = generateSentence(10 + Math.floor(Math.random() * 5))
        
        if (i === 0 && startWithClassic) {
          sentence = classicStart + ', ' + 
            sentence.charAt(0).toLowerCase() + sentence.slice(1)
        }
        
        result += sentence + ' '
      }
    } else {
      const words = generateWords(count)
      if (startWithClassic && count >= 5) {
        const classicWords = classicStart.split(' ')
        words.splice(0, 5, ...classicWords)
      }
      result = words.join(' ')
    }

    setOutput(result.trim())
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'lorem-ipsum.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const wordCount = output.trim() ? output.trim().split(/\s+/).length : 0
  const charCount = output.length

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="bg-teal-500/10 border-teal-500/30 p-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-teal-400 mt-0.5" />
          <div>
            <p className="text-teal-400 font-medium">Lorem Ipsum Generator</p>
            <p className="text-sm text-slate-400 mt-1">
              Generate placeholder text for your designs, documents, and mockups. 
              Choose paragraphs, sentences, or words.
            </p>
          </div>
        </div>
      </Card>

      {/* Content Type Selection */}
      <div className="space-y-4">
        <Label className="text-white">Content Type</Label>
        <Tabs value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
          <TabsList className="bg-slate-800/50">
            <TabsTrigger value="paragraphs" className="gap-2">
              <AlignLeft className="w-4 h-4" />
              Paragraphs
            </TabsTrigger>
            <TabsTrigger value="sentences" className="gap-2">
              <Type className="w-4 h-4" />
              Sentences
            </TabsTrigger>
            <TabsTrigger value="words" className="gap-2">
              <Hash className="w-4 h-4" />
              Words
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Count Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-white">
            Number of {contentType}
          </Label>
          <Badge variant="secondary" className="bg-teal-500/20 text-teal-400 border-teal-500/30">
            {count} {contentType}
          </Badge>
        </div>
        <Slider
          value={[count]}
          onValueChange={([value]) => setCount(value)}
          min={1}
          max={contentType === 'words' ? 500 : contentType === 'sentences' ? 20 : 10}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>1</span>
          <span>
            Max: {contentType === 'words' ? 500 : contentType === 'sentences' ? 20 : 10}
          </span>
        </div>
      </div>

      {/* Options */}
      <div className="flex items-center gap-4">
        <Button
          variant={startWithClassic ? 'default' : 'outline'}
          onClick={() => setStartWithClassic(!startWithClassic)}
          className={startWithClassic ? 'bg-teal-500 hover:bg-teal-600' : ''}
        >
          {startWithClassic ? '✓ ' : ''}
          Start with "Lorem ipsum dolor..."
        </Button>
      </div>

      {/* Generate Button */}
      <Button 
        onClick={generate}
        className="w-full h-12 gap-2 bg-teal-500 hover:bg-teal-600"
      >
        <RefreshCw className="w-5 h-5" />
        Generate Lorem Ipsum
      </Button>

      {/* Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Label className="text-white">Generated Text</Label>
            {output && (
              <div className="flex gap-2 text-xs text-slate-400">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{charCount} characters</span>
              </div>
            )}
          </div>
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
        <Textarea
          value={output}
          readOnly
          placeholder="Click Generate to create placeholder text..."
          className="min-h-64 bg-slate-800/50 border-slate-600 text-white"
        />
      </div>

      {/* Quick Copy Buttons */}
      <div className="space-y-2">
        <Label className="text-slate-400 text-sm">Quick Copy</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard.writeText('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')}
          >
            One Sentence
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInput('3')
              setContentType('paragraphs')
              generate()
            }}
          >
            3 Paragraphs
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText('Lorem ipsum dolor sit amet')
            }}
          >
            5 Words
          </Button>
        </div>
      </div>
    </div>
  )
}

// Dummy function to fix TypeScript error
function setInput(_: string) {}
