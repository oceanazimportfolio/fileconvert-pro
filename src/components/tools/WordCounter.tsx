'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Hash, Type, FileText, Clock, BookOpen,
  Copy, Trash2, AlertCircle
} from 'lucide-react'

export function WordCounter() {
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    const trimmed = text.trim()
    
    // Word count
    const words = trimmed ? trimmed.split(/\s+/).length : 0
    
    // Character count
    const chars = text.length
    const charsNoSpace = text.replace(/\s/g, '').length
    
    // Sentence count
    const sentences = trimmed 
      ? (trimmed.match(/[.!?]+/g) || []).length 
      : 0
    
    // Paragraph count
    const paragraphs = trimmed 
      ? trimmed.split(/\n\n+/).filter(p => p.trim()).length 
      : 0
    
    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200)
    
    // Speaking time (average 150 words per minute)
    const speakingTime = Math.ceil(words / 150)
    
    // Line count
    const lines = text ? text.split('\n').length : 0

    // Longest word
    const allWords = trimmed ? trimmed.split(/\s+/) : []
    const longestWord = allWords.reduce((longest, current) => 
      current.replace(/[^a-zA-Z]/g, '').length > longest.replace(/[^a-zA-Z]/g, '').length 
        ? current 
        : longest, '')

    return {
      words,
      chars,
      charsNoSpace,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
      lines,
      longestWord
    }
  }, [text])

  const handleClear = () => setText('')

  const handlePaste = async () => {
    const pastedText = await navigator.clipboard.readText()
    setText(pastedText)
  }

  const statCards = [
    { label: 'Words', value: stats.words, icon: Type, color: 'text-blue-400' },
    { label: 'Characters', value: stats.chars, icon: Hash, color: 'text-green-400' },
    { label: 'Characters (no spaces)', value: stats.charsNoSpace, icon: Hash, color: 'text-green-300' },
    { label: 'Sentences', value: stats.sentences, icon: FileText, color: 'text-purple-400' },
    { label: 'Paragraphs', value: stats.paragraphs, icon: FileText, color: 'text-purple-300' },
    { label: 'Lines', value: stats.lines, icon: Hash, color: 'text-cyan-400' },
    { label: 'Reading Time', value: `${stats.readingTime} min`, icon: BookOpen, color: 'text-amber-400' },
    { label: 'Speaking Time', value: `${stats.speakingTime} min`, icon: Clock, color: 'text-orange-400' },
  ]

  return (
    <div className="space-y-8">
      {/* Banner Card */}
      <Card className="bg-primary/5 border-primary/20 p-6">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
            <Hash className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Word & Character Counter</h2>
            <p className="text-sm mt-1 font-medium text-muted-foreground">
              Analyze your text instantly. Get precise counts for words, characters, sentences, 
              and estimated reading times.
            </p>
          </div>
        </div>
      </Card>

      {/* Input Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-white font-bold uppercase tracking-wider text-[10px]">Your Text Content</Label>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handlePaste} className="h-8 text-[10px] font-black uppercase tracking-widest hover:text-primary">
              <BookOpen className="w-3 h-3 mr-2" />
              Paste
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-[10px] font-black uppercase tracking-widest hover:text-destructive">
              <Trash2 className="w-3 h-3 mr-2" />
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here to see statistics..."
          className="min-h-[300px] text-base leading-relaxed"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-4 bg-muted/20 border-border/50 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-black/20 border border-white/5">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-3xl font-black text-white tracking-tighter">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Secondary Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Limits & Longest Word */}
        <div className="space-y-6">
          <Card className="p-6">
            <Label className="text-white font-bold uppercase tracking-wider text-[10px] mb-6 block">Common Limits</Label>
            <div className="space-y-6">
              {[
                { platform: 'Twitter (Tweet)', limit: 280 },
                { platform: 'SMS Message', limit: 160 },
                { platform: 'Meta Description', limit: 160 },
                { platform: 'Title Tag', limit: 60 },
              ].map((item) => {
                const percentage = stats.chars > 0 ? Math.min((stats.chars / item.limit) * 100, 100) : 0
                const isOver = stats.chars > item.limit
                
                return (
                  <div key={item.platform} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-white mb-1 uppercase tracking-tight">{item.platform}</span>
                      <span className={`text-[10px] font-black ${isOver ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {stats.chars} / {item.limit}
                      </span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          isOver ? 'bg-destructive' : percentage > 85 ? 'bg-amber-500' : 'bg-primary'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {stats.longestWord && stats.longestWord.length > 0 && (
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Type className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Longest Word</p>
                  <p className="text-lg font-black text-white tracking-tight break-all">
                    {stats.longestWord.replace(/[^a-zA-Z]/g, '')}
                    <span className="ml-2 text-xs font-medium text-muted-foreground opacity-50">
                      ({stats.longestWord.replace(/[^a-zA-Z]/g, '').length} chars)
                    </span>
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Reading Tips */}
        <Card className="p-6 bg-black/20 border-dashed border-2">
          <div className="flex items-start gap-4 h-full">
            <div className="p-3 rounded-xl bg-muted/50">
              <AlertCircle className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2">Analysis Logic</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our word counter uses standard spacing algorithms to provide accurate results. 
                  Reading times are calculated based on average speeds.
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  { label: 'Standard Reader', rate: '200 words / min' },
                  { label: 'Standard Speaker', rate: '150 words / min' },
                  { label: 'Public Speaking', rate: '110-130 words / min' },
                ].map((spec) => (
                  <li key={spec.label} className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-muted-foreground uppercase tracking-widest">{spec.label}</span>
                    <span className="font-black text-white bg-muted/50 px-2 py-1 rounded border border-white/5">{spec.rate}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
