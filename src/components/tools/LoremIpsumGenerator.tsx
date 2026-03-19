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
    <div className="space-y-8">
      {/* Banner Card */}
      <Card className="bg-primary/5 border-primary/20 p-6">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
            <FileText className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Lorem Ipsum Generator</h2>
            <p className="text-sm mt-1 font-medium text-muted-foreground">
              Generate premium placeholder text for your designs. Choose between 
              paragraphs, sentences, or word counts.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Configuration */}
        <div className="space-y-8">
          {/* Content Type Selection */}
          <div className="space-y-4">
            <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Content Type</Label>
            <Tabs value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
              <TabsList className="bg-muted/50 p-1 h-14 rounded-xl w-full border border-border">
                {[
                  { value: 'paragraphs', icon: AlignLeft, label: 'Paragraphs' },
                  { value: 'sentences', icon: Type, label: 'Sentences' },
                  { value: 'words', icon: Hash, label: 'Words' },
                ].map((type) => (
                  <TabsTrigger
                    key={type.value}
                    value={type.value}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 h-11 font-bold rounded-lg transition-all"
                  >
                    <type.icon className="w-4 h-4 mr-2" />
                    {type.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Count Slider */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-white font-bold uppercase tracking-wider text-[10px]">
                Count
              </Label>
              <Badge variant="outline" className="bg-muted px-2 py-0.5">
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
          </div>

          {/* Options */}
          <div className="space-y-4">
            <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Options</Label>
            <div 
              className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border cursor-pointer group"
              onClick={() => setStartWithClassic(!startWithClassic)}
            >
              <span className="text-sm font-bold text-white uppercase tracking-tight">Start with "Lorem ipsum..."</span>
              <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${startWithClassic ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                {startWithClassic && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
            </div>
          </div>

          <Button 
            onClick={generate}
            className="w-full h-14 gap-3 uppercase tracking-widest font-black text-base shadow-xl shadow-primary/20"
          >
            <RefreshCw className="w-5 h-5" />
            Generate Text
          </Button>
        </div>

        {/* Right Column: Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Generated Output</Label>
            {output && (
              <div className="flex gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                <span>{wordCount} Words</span>
                <span className="opacity-30">•</span>
                <span>{charCount} Characters</span>
              </div>
            )}
          </div>
          <div className="relative group">
            <Textarea
              value={output}
              readOnly
              placeholder="Your placeholder text will appear here..."
              className="min-h-[300px] text-base leading-relaxed bg-black/20"
            />
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

          {/* Quick Actions */}
          <div className="space-y-3">
            <Label className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[9px]">Quick Presets</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="text-[10px] font-bold uppercase h-9"
                onClick={() => {
                  navigator.clipboard.writeText('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1000)
                }}
              >
                Sentence
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="text-[10px] font-bold uppercase h-9"
                onClick={() => {
                  setCount(3)
                  setContentType('paragraphs')
                  generate()
                }}
              >
                3 Paras
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="text-[10px] font-bold uppercase h-9"
                onClick={() => {
                  navigator.clipboard.writeText('Lorem ipsum dolor sit amet')
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1000)
                }}
              >
                5 Words
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Dummy function to fix TypeScript error
function setInput(_: string) {}
