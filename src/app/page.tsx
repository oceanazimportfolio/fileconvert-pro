'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Image as ImageIcon, Minimize2, QrCode, Youtube,
  Sparkles, Zap, Shield, Globe, CaseSensitive,
  Key, Binary, FileText, Hash, Link as LinkIcon, Palette,
  Eraser, Wand2
} from 'lucide-react'
import { Footer } from '@/components/Footer'

export default function Home() {
  // ==========================================
  // TOOLS CONFIGURATION
  // Organized by category for better UX and SEO
  // Each tool links to its own SEO-optimized page
  // ==========================================
  const tools = [
    // === IMAGE TOOLS - HIGH TRAFFIC ===
    {
      id: 'image-converter',
      title: 'Image Converter',
      description: 'PNG, JPG, WebP, AVIF',
      icon: ImageIcon,
      color: 'from-blue-500 to-cyan-500',
      category: 'image',
      keywords: ['png to jpg', 'jpg to png', 'webp converter', 'avif converter', 'image format']
    },
    {
      id: 'image-compress',
      title: 'Compress & Resize',
      description: 'Optimize images',
      icon: Minimize2,
      color: 'from-green-500 to-emerald-500',
      category: 'image',
      keywords: ['compress image', 'resize image', 'reduce file size', 'image optimizer']
    },
    {
      id: 'image-enhancer',
      title: 'Image Enhancer',
      description: 'Brightness, contrast, sharpen',
      icon: Wand2,
      color: 'from-purple-500 to-violet-500',
      category: 'image',
      keywords: ['image enhancer', 'photo enhancer', 'enhance image quality', 'sharpen image'],
      isNew: true
    },
    {
      id: 'background-remover',
      title: 'Background Remover',
      description: 'Remove backgrounds',
      icon: Eraser,
      color: 'from-pink-500 to-rose-500',
      category: 'image',
      keywords: ['background remover', 'remove background', 'transparent background', 'bg remover'],
      isNew: true
    },

    // === DEVELOPER TOOLS - HIGH CPC ===
    {
      id: 'json-formatter',
      title: 'JSON Formatter',
      description: 'Format & validate JSON',
      icon: Binary,
      color: 'from-amber-500 to-orange-500',
      category: 'developer',
      keywords: ['json formatter', 'json validator', 'json beautify', 'json minify']
    },
    {
      id: 'base64-encoder',
      title: 'Base64 Encoder',
      description: 'Encode & decode',
      icon: Binary,
      color: 'from-indigo-500 to-blue-500',
      category: 'developer',
      keywords: ['base64 encoder', 'base64 decoder', 'encode decode', 'base64 tool']
    },
    {
      id: 'url-encoder',
      title: 'URL Encoder',
      description: 'Encode & decode URLs',
      icon: LinkIcon,
      color: 'from-violet-500 to-purple-500',
      category: 'developer',
      keywords: ['url encoder', 'url decoder', 'encode url', 'percent encoding']
    },

    // === TEXT TOOLS ===
    {
      id: 'case-converter',
      title: 'Case Converter',
      description: 'Transform text case',
      icon: CaseSensitive,
      color: 'from-teal-500 to-cyan-500',
      category: 'text',
      keywords: ['case converter', 'uppercase', 'lowercase', 'title case', 'camel case']
    },
    {
      id: 'word-counter',
      title: 'Word Counter',
      description: 'Count & analyze text',
      icon: Hash,
      color: 'from-slate-500 to-gray-500',
      category: 'text',
      keywords: ['word counter', 'character count', 'text analyzer', 'word count tool']
    },
    {
      id: 'lorem-ipsum-generator',
      title: 'Lorem Ipsum',
      description: 'Generate placeholder',
      icon: FileText,
      color: 'from-stone-500 to-neutral-500',
      category: 'text',
      keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'text generator']
    },

    // === DESIGN TOOLS ===
    {
      id: 'color-palette',
      title: 'Color Palette',
      description: 'Generate palettes',
      icon: Palette,
      color: 'from-fuchsia-500 to-pink-500',
      category: 'design',
      keywords: ['color palette', 'color generator', 'hex colors', 'design colors']
    },

    // === UTILITY TOOLS ===
    {
      id: 'password-generator',
      title: 'Password Generator',
      description: 'Secure passwords',
      icon: Key,
      color: 'from-emerald-500 to-green-500',
      category: 'utility',
      keywords: ['password generator', 'secure password', 'random password', 'strong password']
    },
    {
      id: 'qr-code-generator',
      title: 'QR Generator',
      description: 'Create QR codes',
      icon: QrCode,
      color: 'from-cyan-500 to-blue-500',
      category: 'utility',
      keywords: ['qr code generator', 'qr creator', 'barcode generator', 'qr code maker']
    },

    // === SOCIAL MEDIA TOOLS ===
    {
      id: 'youtube-thumbnail',
      title: 'YouTube Thumbnail',
      description: 'Download thumbnails',
      icon: Youtube,
      color: 'from-red-600 to-red-500',
      category: 'social',
      keywords: ['youtube thumbnail', 'thumbnail downloader', 'video thumbnail', 'yt thumbnail']
    },
  ]

  const categories = [
    { id: 'image', name: 'Image Tools', icon: ImageIcon, count: 4 },
    { id: 'developer', name: 'Developer', icon: Binary, count: 3 },
    { id: 'text', name: 'Text Tools', icon: FileText, count: 3 },
    { id: 'design', name: 'Design', icon: Palette, count: 1 },
    { id: 'utility', name: 'Utilities', icon: Key, count: 2 },
    { id: 'social', name: 'Social Media', icon: Youtube, count: 1 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* ==========================================
          HEADER SECTION
          ========================================== */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                <img src="/logo.png" alt="FileConvert.pro Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">FileConvert<span className="text-blue-400">.pro</span></div>
                <p className="text-xs text-slate-400">Free Online Tools</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                Fast & Free
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-green-400" />
                Secure
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                Browser-based
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ==========================================
          AD BANNER - TOP LEADERBOARD (728x90)
          ========================================== */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div
          className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-2 text-center"
          role="complementary"
          aria-label="Advertisement"
        >
          <div className="h-[90px] flex items-center justify-center">
            {/* ==========================================
                AD PLACEHOLDER - INSERT YOUR AD CODE HERE
                Recommended: Google AdSense Leaderboard (728x90)
                ========================================== */}
            <span className="text-slate-600 text-sm">Advertisement Space (728x90)</span>
          </div>
        </div>
      </div>

      {/* ==========================================
          MAIN CONTENT AREA
          ========================================== */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* ==========================================
            HERO SECTION - SEO OPTIMIZED H1/H2
            ========================================== */}
        <section className="text-center mb-8" aria-labelledby="hero-title">
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
            <Sparkles className="w-3 h-3 mr-1" />
            100% Browser-based - No Server Uploads
          </Badge>

          <h1 id="hero-title" className="text-3xl md:text-4xl font-bold text-white mb-3">
            Free Online <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">File Converter</span> & Tools
          </h1>

          <h2 className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-normal">
            Image converter, enhancer, background remover, JSON formatter, password generator, and more.
            All processing happens locally in your browser — fast, free, and secure.
          </h2>
        </section>

        {/* ==========================================
            TOOL NAVIGATION - CATEGORIZED
            ========================================== */}
        <nav aria-label="Tool categories" className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {categories.map((cat) => (
              <Badge
                key={cat.id}
                variant="outline"
                className="cursor-pointer hover:bg-slate-700/50 border-slate-600 text-slate-300"
              >
                <cat.icon className="w-3 h-3 mr-1" />
                {cat.name}
                <span className="ml-1 text-slate-500">({cat.count})</span>
              </Badge>
            ))}
          </div>
        </nav>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 mb-8">
          {tools.map((tool) => (
            <Link key={tool.id} href={`/tools/${tool.id}`}>
              <Card
                className="cursor-pointer transition-all duration-200 hover:scale-105 hover:border-blue-500/50 h-full
                  bg-slate-800/50 border-slate-700/50"
                role="button"
              >
                <CardContent className="p-4 text-center">
                  <div className="relative inline-block">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mx-auto mb-3`}>
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    {tool.isNew && (
                      <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-white text-sm">{tool.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{tool.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* ==========================================
            SEO CONTENT SECTION
            ========================================== */}
        <section className="mt-12 py-8 border-t border-slate-700/50" aria-labelledby="seo-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Image Tools SEO */}
            <article>
              <h2 className="text-lg font-semibold text-white mb-3">Free Image Tools</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Convert, compress, enhance, and remove backgrounds from images instantly. Our image tools support
                PNG, JPG, WebP, AVIF, and more. Batch convert multiple images at once. All processing happens
                in your browser - no uploads to servers. Perfect for web developers, designers, photographers,
                and anyone needing quick image editing.
              </p>
            </article>

            {/* Developer Tools SEO */}
            <article>
              <h2 className="text-lg font-semibold text-white mb-3">Developer Utility Tools</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Essential tools for developers: JSON formatter and validator, Base64 encoder/decoder,
                URL encoder/decoder. Format and validate JSON data instantly, encode strings for
                web transmission, and handle URL encoding effortlessly. All tools work offline
                in your browser - no data sent to external servers.
              </p>
            </article>

            {/* Text Tools SEO */}
            <article>
              <h2 className="text-lg font-semibold text-white mb-3">Text & Content Tools</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Transform text with our case converter, count words and characters, generate
                Lorem Ipsum placeholder text. Perfect for writers, students, and content creators.
                Convert between uppercase, lowercase, title case, camelCase, snake_case, and more.
                Get detailed text statistics including word count and reading time.
              </p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
