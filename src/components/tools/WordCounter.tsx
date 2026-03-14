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
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="bg-blue-500/10 border-blue-500/30 p-4">
        <div className="flex items-start gap-3">
          <Hash className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <p className="text-blue-400 font-medium">Word & Character Counter</p>
            <p className="text-sm text-slate-400 mt-1">
              Count words, characters, sentences, paragraphs, and get reading time estimates. 
              Perfect for writers, students, and content creators.
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.slice(0, 8).map((stat, index) => (
          <Card key={index} className="bg-slate-800/30 border-slate-700/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs text-slate-400">{stat.label}</span>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-white">Enter Your Text</Label>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handlePaste}>
              Paste
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here to see statistics..."
          className="min-h-64 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
        />
      </div>

      {/* Additional Info */}
      {stats.longestWord && stats.longestWord.length > 0 && (
        <Card className="bg-slate-800/30 border-slate-700/30 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-slate-400 text-sm">Longest word:</p>
              <p className="text-white font-medium">
                {stats.longestWord.replace(/[^a-zA-Z]/g, '')} 
                <span className="text-slate-500 ml-2">
                  ({stats.longestWord.replace(/[^a-zA-Z]/g, '').length} letters)
                </span>
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-slate-800/30 border-slate-700/30 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5" />
          <div className="text-sm text-slate-400">
            <p className="text-white font-medium mb-1">Reading Time Estimates</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Average reading speed: 200 words/minute</li>
              <li>Average speaking speed: 150 words/minute</li>
              <li>These are estimates - actual time varies by content complexity</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Character Limits Reference */}
      <Card className="bg-slate-800/30 border-slate-700/30 p-4">
        <p className="text-white font-medium mb-3">Common Character Limits</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            { platform: 'Tweet', limit: 280 },
            { platform: 'SMS', limit: 160 },
            { platform: 'Meta Description', limit: 160 },
            { platform: 'Title Tag', limit: 60 },
          ].map((item) => {
            const percentage = stats.chars > 0 ? Math.min((stats.chars / item.limit) * 100, 100) : 0
            const isOver = stats.chars > item.limit
            
            return (
              <div key={item.platform}>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>{item.platform}</span>
                  <span className={isOver ? 'text-red-400' : ''}>
                    {stats.chars}/{item.limit}
                  </span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      isOver ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
