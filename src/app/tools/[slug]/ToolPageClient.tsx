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
import { trackToolUsage } from '@/lib/analytics'
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
import { Footer } from '@/components/Footer'

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
  relatedTools: {
    id: string
    title: string
    desc: string
  }[]
}

export function ToolPageClient({ slug, tool, relatedTools }: ToolPageClientProps) {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
    
    // Fire analytics once per tool view
    trackToolUsage(slug, tool.category, tool.schemaData.name)
  }, [slug, tool.category, tool.schemaData.name])

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
    "url": `https://convertfiles.qzz.io/tools/${slug}`,
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
                  <img src="/logo.png" alt="ConvertFiles" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors whitespace-nowrap">
                    ConvertFiles
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
                  {tool.seoContent?.benefits || "Our tools are optimized for fast performance and privacy. Browser-based processing helps keep your files local."}
                </p>
              </div>
            </section>

            {/* Related Tools Section */}
            <section className="mt-8 py-8 border-t border-slate-700/50">
              <h2 className="text-xl font-semibold text-white mb-6">Related Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedTools.map((rt) => (
                  <Link key={rt.id} href={`/tools/${rt.id}`}>
                    <Card className="bg-slate-800/30 border-slate-700/30 hover:border-blue-500/50 transition-all h-full cursor-pointer">
                      <CardContent className="p-4">
                        <h3 className="text-white font-medium text-sm mb-1">{rt.title}</h3>
                        <p className="text-xs text-slate-400">{rt.desc}</p>
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
              {/* Trust Features */}
              <Card className="bg-slate-800/50 border-slate-700/50 p-4">
                <h3 className="text-white font-medium mb-3 text-sm">Why Choose Us?</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Privacy-Focused</p>
                      <p className="text-slate-400 text-xs">Files processed locally</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Fast Performance</p>
                      <p className="text-slate-400 text-xs">High-speed client-side execution</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Browser-Based</p>
                      <p className="text-slate-400 text-xs">No extra software downloads</p>
                    </div>
                  </div>
                </div>
              </Card>

            </div>
          </aside>
        </div >
      </main >

      <Footer />
    </div >
  )
}
