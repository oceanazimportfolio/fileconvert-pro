'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Image as ImageIcon, Minimize2, QrCode, Youtube,
  Sparkles, Zap, Shield, Globe, CaseSensitive,
  Key, Binary, FileText, Hash, Link as LinkIcon, Palette,
  Eraser, Wand2, Type, ArrowRight
} from 'lucide-react'
import { Footer } from '@/components/Footer'

export default function Home() {
  const tools = [
    {
      id: 'bangla-converter',
      title: 'Bangla Converter',
      description: 'Unicode ↔ Bijoy (Avro)',
      icon: Type,
      category: 'text',
      keywords: ['bangla converter', 'unicode to bijoy', 'avro to bijoy', 'bijoy to unicode', 'sutonnymj'],
      isNew: true
    },
    {
      id: 'image-converter',
      title: 'Image Converter',
      description: 'PNG, JPG, WebP, AVIF',
      icon: ImageIcon,
      category: 'image',
      keywords: ['png to jpg', 'jpg to png', 'webp converter', 'avif converter', 'image format']
    },
    {
      id: 'image-compress',
      title: 'Compress & Resize',
      description: 'Optimize images',
      icon: Minimize2,
      category: 'image',
      keywords: ['compress image', 'resize image', 'reduce file size', 'image optimizer']
    },
    {
      id: 'image-enhancer',
      title: 'Image Enhancer',
      description: 'Brightness, contrast, sharpen',
      icon: Wand2,
      category: 'image',
      keywords: ['image enhancer', 'photo enhancer', 'enhance image quality', 'sharpen image'],
      isNew: true
    },
    {
      id: 'background-remover',
      title: 'Background Remover',
      description: 'Remove backgrounds',
      icon: Eraser,
      category: 'image',
      keywords: ['background remover', 'remove background', 'transparent background', 'bg remover'],
      isNew: true
    },
    {
      id: 'json-formatter',
      title: 'JSON Formatter',
      description: 'Format & validate JSON',
      icon: Binary,
      category: 'developer',
      keywords: ['json formatter', 'json validator', 'json beautify', 'json minify']
    },
    {
      id: 'base64-encoder',
      title: 'Base64 Encoder',
      description: 'Encode & decode',
      icon: Binary,
      category: 'developer',
      keywords: ['base64 encoder', 'base64 decoder', 'encode decode', 'base64 tool']
    },
    {
      id: 'url-encoder',
      title: 'URL Encoder',
      description: 'Encode & decode URLs',
      icon: LinkIcon,
      category: 'developer',
      keywords: ['url encoder', 'url decoder', 'encode url', 'percent encoding']
    },
    {
      id: 'case-converter',
      title: 'Case Converter',
      description: 'Transform text case',
      icon: CaseSensitive,
      category: 'text',
      keywords: ['case converter', 'uppercase', 'lowercase', 'title case', 'camel case']
    },
    {
      id: 'word-counter',
      title: 'Word Counter',
      description: 'Count & analyze text',
      icon: Hash,
      category: 'text',
      keywords: ['word counter', 'character count', 'text analyzer', 'word count tool']
    },
    {
      id: 'lorem-ipsum-generator',
      title: 'Lorem Ipsum',
      description: 'Generate placeholder',
      icon: FileText,
      category: 'text',
      keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'text generator']
    },
    {
      id: 'color-palette',
      title: 'Color Palette',
      description: 'Generate palettes',
      icon: Palette,
      category: 'design',
      keywords: ['color palette', 'color generator', 'hex colors', 'design colors']
    },
    {
      id: 'password-generator',
      title: 'Password Generator',
      description: 'Secure passwords',
      icon: Key,
      category: 'utility',
      keywords: ['password generator', 'secure password', 'random password', 'strong password']
    },
    {
      id: 'qr-code-generator',
      title: 'QR Generator',
      description: 'Create QR codes',
      icon: QrCode,
      category: 'utility',
      keywords: ['qr code generator', 'qr creator', 'barcode generator', 'qr code maker']
    },
    {
      id: 'youtube-thumbnail',
      title: 'YouTube Thumbnail',
      description: 'Download thumbnails',
      icon: Youtube,
      category: 'social',
      keywords: ['youtube thumbnail', 'thumbnail downloader', 'video thumbnail', 'yt thumbnail']
    },
  ]

  const categories = [
    { id: 'image', name: 'Image Tools', icon: ImageIcon, count: 4, color: 'text-blue-400' },
    { id: 'developer', name: 'Developer', icon: Binary, count: 3, color: 'text-amber-400' },
    { id: 'text', name: 'Text Tools', icon: FileText, count: 4, color: 'text-teal-400' },
    { id: 'design', name: 'Design', icon: Palette, count: 1, color: 'text-pink-400' },
    { id: 'utility', name: 'Utilities', icon: Key, count: 2, color: 'text-cyan-400' },
    { id: 'social', name: 'Social Media', icon: Youtube, count: 1, color: 'text-red-400' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container-standard py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group transition-all active:scale-95">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-primary shadow-lg shadow-primary/20">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xl font-black text-white tracking-tight">ConvertFiles</div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Free Online Tools</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Fast & Free
              </span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Secure
              </span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Globe className="w-3.5 h-3.5 text-primary" />
                No Uploads
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container-standard section-gap">
        {/* Hero Section */}
        <section className="text-center mb-16 max-w-4xl mx-auto" aria-labelledby="hero-title">
          <Badge variant="outline" className="mb-6 py-1 px-4 bg-primary/5 text-primary border-primary/20">
            <Sparkles className="w-3 h-3 mr-2" />
            100% Browser-based - Privacy First
          </Badge>

          <h1 id="hero-title" className="mb-6">
            Free Online <span className="accent-gradient">File Converter</span> & Tools
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Process images, format JSON, generate passwords, and more.
            Everything happens locally in your browser — fast, private, and secure.
          </p>
        </section>

        {/* Category Navigation */}
        <nav aria-label="Tool categories" className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <Badge
                key={cat.id}
                variant="outline"
                className="cursor-pointer py-2 px-4 hover:bg-muted hover:text-foreground transition-all active:scale-95 text-sm"
              >
                <cat.icon className={`w-3.5 h-3.5 mr-2 ${cat.color}`} />
                {cat.name}
              </Badge>
            ))}
          </div>
        </nav>

        {/* Popular Conversions */}
        <section className="mb-12" aria-labelledby="popular-conversions">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <h2 id="popular-conversions" className="text-xl font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-400" />
                Popular Conversions
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Quick access to the most used image conversions</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/tools/png-to-jpg/">
              <Button variant="outline" className="bg-card hover:bg-muted hover:text-foreground text-sm h-12 px-6 rounded-xl border-border/50 transition-all hover:scale-105 shadow-sm">
                PNG <ArrowRight className="w-3.5 h-3.5 mx-2 text-muted-foreground" /> JPG
              </Button>
            </Link>
            <Link href="/tools/webp-to-png/">
              <Button variant="outline" className="bg-card hover:bg-muted hover:text-foreground text-sm h-12 px-6 rounded-xl border-border/50 transition-all hover:scale-105 shadow-sm">
                WebP <ArrowRight className="w-3.5 h-3.5 mx-2 text-muted-foreground" /> PNG
              </Button>
            </Link>
            <Link href="/tools/jpg-to-png/">
              <Button variant="outline" className="bg-card hover:bg-muted hover:text-foreground text-sm h-12 px-6 rounded-xl border-border/50 transition-all hover:scale-105 shadow-sm">
                JPG <ArrowRight className="w-3.5 h-3.5 mx-2 text-muted-foreground" /> PNG
              </Button>
            </Link>
            <Link href="/tools/webp-to-jpg/">
              <Button variant="outline" className="bg-card hover:bg-muted hover:text-foreground text-sm h-12 px-6 rounded-xl border-border/50 transition-all hover:scale-105 shadow-sm">
                WebP <ArrowRight className="w-3.5 h-3.5 mx-2 text-muted-foreground" /> JPG
              </Button>
            </Link>
            <Link href="/tools/avif-to-png/">
              <Button variant="outline" className="bg-card hover:bg-muted hover:text-foreground text-sm h-12 px-6 rounded-xl border-border/50 transition-all hover:scale-105 shadow-sm">
                AVIF <ArrowRight className="w-3.5 h-3.5 mx-2 text-muted-foreground" /> PNG
              </Button>
            </Link>
          </div>
        </section>

        {/* Featured Utilities */}
        <section className="mb-12 border-t border-border pt-12" aria-labelledby="featured-utilities">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 id="featured-utilities" className="text-xl font-bold text-white">Essential Utilities:</h2>
            <Badge variant="outline" className="ml-2 border-amber-400/20 text-amber-400 bg-amber-400/5">Prioritized</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              tools.find(t => t.id === 'image-compress'),
              tools.find(t => t.id === 'json-formatter'),
              tools.find(t => t.id === 'password-generator'),
              tools.find(t => t.id === 'qr-code-generator'),
              tools.find(t => t.id === 'word-counter'),
              tools.find(t => t.id === 'color-palette'),
            ].filter(Boolean).map((tool) => (
              <Link key={`feat-${tool!.id}`} href={`/tools/${tool!.id}/`} className="group">
                <Card className="h-full hover:border-amber-400/30 hover:bg-card hover:shadow-xl hover:shadow-amber-400/5 active:scale-[0.98] transition-all duration-300 p-4 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center mb-3 group-hover:bg-amber-400/10 transition-colors">
                    {tool!.icon && (() => {
                      const Icon = tool!.icon
                      return <Icon className="w-5 h-5 text-amber-400" />
                    })()}
                  </div>
                  <h3 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">{tool!.title}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Tool Grid */}
        <div className="flex items-center gap-2 mb-6 mt-12">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-white">All Utilities Directory</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-24">
          {tools.map((tool) => {
            const catColor = categories.find(c => c.id === tool.category)?.color || 'text-primary'
            return (
              <Link key={tool.id} href={`/tools/${tool.id}`} className="group h-full">
                <Card className="h-full hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98] transition-all duration-300 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-3">
                    {tool.isNew && (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[8px] px-1.5 h-4">NEW</Badge>
                    )}
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                      <tool.icon className={`w-7 h-7 ${catColor} group-hover:text-primary-foreground transition-colors duration-300`} />
                    </div>
                    <h3 className="text-sm font-black text-white group-hover:text-primary transition-colors">{tool.title}</h3>
                    <p className="text-xs mt-2 line-clamp-2">{tool.description}</p>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* SEO Content Section */}
        <section className="py-16 border-t border-border" aria-labelledby="seo-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <article>
              <h3 className="text-white mb-4">Fast & Private Processing</h3>
              <p className="text-sm leading-relaxed">
                Our tools process your files directly in your browser. Unlike other converters,
                your data never leaves your computer, ensuring 100% privacy and lightning-fast results.
              </p>
            </article>
            <article>
              <h3 className="text-white mb-4">No Installation Required</h3>
              <p className="text-sm leading-relaxed">
                Access a suite of powerful developer, image, and text utilities without downloading bulky software.
                Everything is optimized for web performance across all modern browsers.
              </p>
            </article>
            <article>
              <h3 className="text-white mb-4">Modern Workflow</h3>
              <p className="text-sm leading-relaxed">
                Designed for efficiency. Batch process images, format complex JSON structures,
                and generate secure assets instantly. Perfect for web developers and content creators.
              </p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
