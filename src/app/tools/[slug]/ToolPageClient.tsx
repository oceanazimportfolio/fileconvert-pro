'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ChevronRight, Zap, Shield, Globe, Home, ArrowLeft,
  Sparkles, ChevronDown, ArrowRight
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
  defaultConversionType?: string
  lockedMode?: boolean
  relatedToolsOverride?: string[]
  faq?: { q: string; a: string }[]
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
        return (
          <ImageConverter
            defaultConversionType={tool.defaultConversionType ?? 'png_jpg'}
            lockedMode={tool.lockedMode ?? false}
            toolSlug={slug}
          />
        )
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
        return <ImageConverter defaultConversionType="png_jpg" lockedMode={false} toolSlug={slug} />
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

  // FAQ schema (if FAQ data exists)
  const faqSchema = tool.faq && tool.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": tool.faq.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  } : null

  const isConversionPage = tool.category === 'Image Conversion'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
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
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                All Tools
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-y-1 gap-x-1.5 text-sm">
            <li className="flex items-center gap-1.5">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-slate-400 whitespace-nowrap">{tool.breadcrumb}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            </li>
            <li>
              <span className="text-slate-200 font-medium truncate">{tool.schemaData.name}</span>
            </li>
          </ol>
        </nav>

        {/* Tool Hero */}
        <div className="text-center mb-8 sm:mb-10">
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/25 px-3 py-1 text-xs font-medium">
            <Sparkles className="w-3 h-3 mr-1.5" />
            {tool.category}
          </Badge>

          {/* H1 */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-4 leading-tight px-4">
            {tool.h1}
          </h1>

          {/* H2 */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
            {tool.h2}
          </p>
        </div>

        {/* Main Tool Area with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-6">
          {/* Tool Content */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700/50 shadow-xl shadow-black/20">
              <CardContent className="p-4 md:p-6">
                {renderTool()}
              </CardContent>
            </Card>

            {/* Sibling conversion links for dedicated pages */}
            {isConversionPage && relatedTools.length > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                  Also try these converters
                </p>
                <div className="flex flex-wrap gap-2">
                  {relatedTools.map((rt) => (
                    <Link key={rt.id} href={`/tools/${rt.id}/`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs bg-slate-800/60 border-slate-600/60 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500 hover:text-white transition-all duration-150"
                      >
                        {rt.title}
                        <ArrowRight className="w-3 h-3 ml-1.5 opacity-60" />
                      </Button>
                    </Link>
                  ))}
                  <Link href="/tools/image-converter/">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-slate-500 hover:text-slate-300 border border-slate-700/50 hover:border-slate-600"
                    >
                      All image formats →
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* About Tool Section */}
            <section className="mt-10 py-8 border-t border-slate-700/40">
              <h2 className="text-2xl font-bold text-white mb-5">About this tool</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed mb-6">
                  {tool.seoContent?.about || tool.description}
                </p>

                {tool.seoContent?.features && (
                  <>
                    <h3 className="text-xl font-semibold text-white mt-8 mb-4">Key features</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose">
                      {tool.seoContent.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                          <span className="text-slate-300 text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <h3 className="text-xl font-semibold text-white mt-8 mb-4">Why use this tool?</h3>
                <p className="text-slate-300 leading-relaxed">
                  {tool.seoContent?.benefits || 'Our tools are optimized for fast performance and privacy. Browser-based processing keeps your files local.'}
                </p>
              </div>
            </section>

            {/* FAQ Section */}
            {tool.faq && tool.faq.length > 0 && (
              <section className="mt-8 py-8 border-t border-slate-700/40">
                <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {tool.faq.map((item, index) => (
                    <div key={index} className="rounded-xl bg-slate-800/40 border border-slate-700/40 overflow-hidden">
                      <details className="group">
                        <summary className="flex items-center justify-between gap-4 p-4 sm:p-5 cursor-pointer list-none hover:bg-slate-700/20 transition-colors">
                          <span className="font-medium text-white text-sm sm:text-base leading-snug">{item.q}</span>
                          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 group-open:rotate-180 transition-transform duration-200" />
                        </summary>
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                          <p className="text-slate-300 text-sm leading-relaxed border-t border-slate-700/40 pt-3">{item.a}</p>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Tools Section */}
            <section className="mt-8 py-8 border-t border-slate-700/40">
              <h2 className="text-xl font-bold text-white mb-5">Related Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {relatedTools.map((rt) => (
                  <Link key={rt.id} href={`/tools/${rt.id}/`} className="group">
                    <Card className="bg-slate-800/30 border-slate-700/30 hover:border-blue-500/40 hover:bg-slate-800/60 transition-all duration-200 h-full cursor-pointer shadow-sm hover:shadow-blue-500/5 hover:shadow-md">
                      <CardContent className="p-4">
                        <h3 className="text-white font-medium text-sm mb-1.5 group-hover:text-blue-300 transition-colors">{rt.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{rt.desc}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <div className="mt-5 text-center">
                <Link href="/">
                  <Button variant="outline" size="sm" className="text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white transition-all">
                    View All Tools
                  </Button>
                </Link>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-1 order-first lg:order-last">
            <div className="sticky top-20 space-y-4">
              {/* Trust Features Card */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-4 text-sm">Why ConvertFiles?</h3>
                  <div className="space-y-3.5">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-7 h-7 rounded-lg bg-green-500/15 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-3.5 h-3.5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm leading-snug">Privacy-Focused</p>
                        <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">Files processed locally in your browser. Nothing is uploaded.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-7 h-7 rounded-lg bg-yellow-500/15 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm leading-snug">Fast Results</p>
                        <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">No upload wait time. Conversions complete in seconds.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm leading-snug">No Account Needed</p>
                        <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">No sign-up, no subscription. Free and unlimited.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generic image converter link for dedicated pages */}
              {isConversionPage && (
                <Card className="bg-blue-500/5 border-blue-500/20">
                  <CardContent className="p-4">
                    <p className="text-blue-300 font-medium text-sm mb-1.5">Need more formats?</p>
                    <p className="text-slate-400 text-xs mb-3 leading-relaxed">Our all-in-one converter supports PNG, JPG, WebP, and AVIF in any combination.</p>
                    <Link href="/tools/image-converter/">
                      <Button size="sm" className="w-full bg-blue-600/80 hover:bg-blue-600 text-white text-xs transition-all">
                        Open Image Converter
                        <ArrowRight className="w-3 h-3 ml-1.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
