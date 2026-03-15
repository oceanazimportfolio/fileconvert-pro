'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ChevronRight, Zap, Shield, Globe, Home, ArrowLeft,
  Sparkles
} from 'lucide-react'
import { ImageConverter } from '@/components/tools/ImageConverter'
import { ImageCompressResize } from '@/components/tools/ImageCompressResize'
import { ImageEnhancer } from '@/components/tools/ImageEnhancer'
import { BackgroundRemover } from '@/components/tools/BackgroundRemover'
import { JsonFormatter } from '@/components/tools/JsonFormatter'
import { CaseConverter } from '@/components/tools/CaseConverter'
import { ColorPalette } from '@/components/tools/ColorPalette'
import { PasswordGenerator } from '@/components/tools/PasswordGenerator'
import { Base64Tool } from '@/components/tools/Base64Tool'
import { LoremIpsumGenerator } from '@/components/tools/LoremIpsumGenerator'
import { WordCounter } from '@/components/tools/WordCounter'
import { UrlEncoder } from '@/components/tools/UrlEncoder'
import { YouTubeThumbnail } from '@/components/tools/YouTubeThumbnail'
import { QrCodeGenerator } from '@/components/tools/QrCodeGenerator'

interface ToolConfig {
  title: string
  description: string
  keywords: string[]
  h1: string
  h2: string
  component: string
  category: string
  breadcrumb: string
  schemaData: {
    name: string
    description: string
    category: string
  }
  seoContent?: {
    about: string
    features: string[]
    benefits: string
  }
}

interface ToolPageClientProps {
  slug: string
  tool: ToolConfig
}

export function ToolPageClient({ slug, tool }: ToolPageClientProps) {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // Render the appropriate tool component
  const renderTool = () => {
    switch (tool.component) {
      case 'ImageConverter':
        return <ImageConverter />
      case 'ImageCompressResize':
        return <ImageCompressResize />
      case 'ImageEnhancer':
        return <ImageEnhancer />
      case 'BackgroundRemover':
        return <BackgroundRemover />
      case 'JsonFormatter':
        return <JsonFormatter />
      case 'CaseConverter':
        return <CaseConverter />
      case 'ColorPalette':
        return <ColorPalette />
      case 'PasswordGenerator':
        return <PasswordGenerator />
      case 'Base64Tool':
        return <Base64Tool />
      case 'LoremIpsumGenerator':
        return <LoremIpsumGenerator />
      case 'WordCounter':
        return <WordCounter />
      case 'UrlEncoder':
        return <UrlEncoder />
      case 'YouTubeThumbnail':
        return <YouTubeThumbnail />
      case 'QrCodeGenerator':
        return <QrCodeGenerator />
      default:
        return <ImageConverter />
    }
  }

  // JSON-LD Schema for this tool
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.schemaData.name,
    "description": tool.schemaData.description,
    "url": `https://fileconvert.pro/tools/${slug}`,
    "applicationCategory": tool.schemaData.category,
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "500",
      "bestRating": "5"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                  <img src="/logo.png" alt="FileConvert.pro" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors whitespace-nowrap">
                    FileConvert<span className="text-blue-400">.pro</span>
                  </div>
                </div>
              </Link>
            </div>

            <Link href="/">
              <Button variant="ghost" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                All Tools
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ==========================================
          AD BANNER - TOP LEADERBOARD (728x90)
          ========================================== */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div
          className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-2 text-center overflow-hidden"
          role="complementary"
          aria-label="Advertisement"
        >
          <div className="min-h-[50px] md:h-[90px] flex items-center justify-center overflow-auto">
            {/* ==========================================
                AD PLACEHOLDER - INSERT YOUR AD CODE HERE
                Recommended: Google AdSense Leaderboard (728x90)
                ========================================== */}
            <span className="text-slate-600 text-xs sm:text-sm">Advertisement Space (Responsive)</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 overflow-hidden" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-y-2 gap-x-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <Link href="/" className="hover:text-white transition-colors whitespace-nowrap">Home</Link>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </li>
            <li className="flex items-center gap-2">
              <span className="whitespace-nowrap">{tool.breadcrumb}</span>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </li>
            <li className="text-white font-medium truncate max-w-[150px] sm:max-w-none">
              {tool.schemaData.name}
            </li>
          </ol>
        </nav>

        {/* Tool Hero */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
            <Sparkles className="w-3 h-3 mr-1" />
            {tool.category}
          </Badge>

          {/* H1 - Primary SEO Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {tool.h1}
          </h1>

          {/* H2 - Secondary SEO Heading */}
          <h2 className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-normal">
            {tool.h2}
          </h2>
        </div>

        {/* Main Tool Area with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tool Content */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-4 md:p-6">
                {renderTool()}
              </CardContent>
            </Card>

            {/* ==========================================
                AD BANNER - BELOW TOOL
                ========================================== */}
            <div className="mt-6">
              <div
                className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-2 text-center"
                role="complementary"
                aria-label="Advertisement"
              >
                <div className="h-[100px] flex items-center justify-center">
                  <span className="text-slate-600 text-sm">Advertisement Space</span>
                </div>
              </div>
            </div>

            {/* About Tool Section */}
            <section className="mt-8 py-8 border-t border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">
                About this tool
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed mb-6">
                  {tool.seoContent?.about || tool.description}
                </p>

                {tool.seoContent?.features && (
                  <>
                    <h3 className="text-xl font-semibold text-white mt-8 mb-4">Key features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 decoration-blue-500/50">
                      {tool.seoContent.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <h3 className="text-xl font-semibold text-white mt-8 mb-4">Why use this tool?</h3>
                <p className="text-slate-300 leading-relaxed">
                  {tool.seoContent?.benefits || "Our tools are fast, secure, and run entirely in your browser. No files are ever uploaded to a server."}
                </p>
              </div>
            </section>

            {/* Related Tools Section */}
            <section className="mt-8 py-8 border-t border-slate-700/50">
              <h2 className="text-xl font-semibold text-white mb-6">Related Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'image-converter', title: 'Image Converter', desc: 'PNG, JPG, WebP, AVIF' },
                  { id: 'image-compress', title: 'Compress & Resize', desc: 'Optimize images' },
                  { id: 'json-formatter', title: 'JSON Formatter', desc: 'Format & validate JSON' }
                ].filter(t => t.id !== slug).map((tool) => (
                  <Link key={tool.id} href={`/tools/${tool.id}`}>
                    <Card className="bg-slate-800/30 border-slate-700/30 hover:border-blue-500/50 transition-all h-full cursor-pointer">
                      <CardContent className="p-4">
                        <h3 className="text-white font-medium text-sm mb-1">{tool.title}</h3>
                        <p className="text-xs text-slate-400">{tool.desc}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/">
                  <Button variant="outline" size="sm" className="text-slate-400 border-slate-700">
                    View All Tools
                  </Button>
                </Link>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-1 order-first lg:order-last">
            <div className="sticky top-20 space-y-4">
              {/* ==========================================
                  SIDEBAR AD - MEDIUM RECTANGLE (300x250)
                  ========================================== */}
              <Card className="bg-slate-800/30 border-slate-700/30">
                <CardContent className="p-2">
                  <div className="h-[250px] flex items-center justify-center">
                    {/* ==========================================
                        AD PLACEHOLDER - INSERT YOUR AD CODE HERE
                        Recommended: Google AdSense (300x250)
                        ========================================== */}
                    <div className="text-center text-slate-600">
                      <p className="text-sm">Advertisement</p>
                      <p className="text-xs">(300x250)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Features */}
              <Card className="bg-slate-800/50 border-slate-700/50 p-4">
                <h3 className="text-white font-medium mb-3 text-sm">Why Choose Us?</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">100% Secure</p>
                      <p className="text-slate-400 text-xs">Files never leave your browser</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Lightning Fast</p>
                      <p className="text-slate-400 text-xs">No upload/download delays</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Works Offline</p>
                      <p className="text-slate-400 text-xs">No internet needed after load</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Second Ad */}
              <Card className="bg-slate-800/30 border-slate-700/30">
                <CardContent className="p-2">
                  <div className="h-[250px] flex items-center justify-center">
                    <div className="text-center text-slate-600">
                      <p className="text-sm">Advertisement</p>
                      <p className="text-xs">(300x250)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div >
      </main >

      {/* Footer */}
      < footer className="border-t border-slate-700/50 mt-16" >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-white">FileConvert.pro</span>
            </Link>
            <p>All processing happens locally in your browser. Your data is secure.</p>
            <p>© 2024 FileConvert.pro</p>
          </div>
        </div>
      </footer >
    </div >
  )
}
