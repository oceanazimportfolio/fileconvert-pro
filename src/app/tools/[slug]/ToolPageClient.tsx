'use client'

import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Globe, Home, ListChecks, Shield, Sparkles, Zap } from 'lucide-react'
import { Footer } from '@/components/Footer'
import { trackToolUsage } from '@/lib/analytics'
import { BackgroundRemover } from '@/components/tools/BackgroundRemover'
import { BanglaConverter } from '@/components/tools/BanglaConverter'
import { Base64Tool } from '@/components/tools/Base64Tool'
import { CaseConverter } from '@/components/tools/CaseConverter'
import { ColorPalette } from '@/components/tools/ColorPalette'
import { ImageCompressResize } from '@/components/tools/ImageCompressResize'
import { ImageConverter } from '@/components/tools/ImageConverter'
import { ImageEnhancer } from '@/components/tools/ImageEnhancer'
import { JsonFormatter } from '@/components/tools/JsonFormatter'
import { LoremIpsumGenerator } from '@/components/tools/LoremIpsumGenerator'
import { PasswordGenerator } from '@/components/tools/PasswordGenerator'
import { QrCodeGenerator } from '@/components/tools/QrCodeGenerator'
import { UrlEncoder } from '@/components/tools/UrlEncoder'
import { WordCounter } from '@/components/tools/WordCounter'
import { YouTubeThumbnail } from '@/components/tools/YouTubeThumbnail'

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
  schemaData: { name: string; description: string; category: string }
  seoContent?: { about: string; features: string[]; benefits: string }
}

interface ToolPageClientProps {
  slug: string
  tool: ToolConfig
  relatedTools: { id: string; title: string; desc: string }[]
}

interface LinkItem {
  href: string
  label: string
  description: string
}

const conversionNotes: Record<string, string[]> = {
  png_jpg: ['Input: PNG', 'Output: JPG', 'Best for smaller file sizes', 'Transparency is flattened'],
  jpg_png: ['Input: JPG or JPEG', 'Output: PNG', 'Best for editing workflows', 'Lossless output'],
  webp_png: ['Input: WebP', 'Output: PNG', 'Transparency preserved when available', 'Best for compatibility'],
  webp_jpg: ['Input: WebP', 'Output: JPG', 'Best for universal compatibility', 'Balanced lossy compression'],
  avif_png: ['Input: AVIF', 'Output: PNG', 'Best for editing and compatibility', 'May be larger because PNG is lossless'],
  unicodeToBijoy: ['Input: Unicode Bangla', 'Output: Bijoy text', 'Good for older publishing apps', 'Browser-based copy and paste'],
  bijoyToUnicode: ['Input: Bijoy Bangla', 'Output: Unicode text', 'Good for web and modern apps', 'Browser-based copy and paste'],
}

const stripMarkdown = (value?: string) => (value || '').replace(/\*\*/g, '')

function getHowToSteps(tool: ToolConfig) {
  if (tool.component === 'ImageConverter' && tool.lockedMode) return ['Upload the source image.', 'Review the fixed output format.', 'Keep size optimization on when helpful.', 'Download single files or the ZIP.']
  if (tool.component === 'ImageConverter') return ['Upload one or more images.', 'Choose the output format you need.', 'Review file summaries and warnings.', 'Download the converted results.']
  if (tool.component === 'ImageCompressResize') return ['Upload one or more images.', 'Choose compression or resize settings.', 'Review the before and after summary.', 'Download the optimized files.']
  if (tool.component === 'BackgroundRemover') return ['Upload an image with a clear subject.', 'Let the tool generate the cutout.', 'Review the transparent PNG output.', 'Download the finished image.']
  if (tool.component === 'BanglaConverter') return ['Paste Bangla text into the input area.', 'Choose the conversion direction.', 'Review the converted output.', 'Copy the result into your target app.']
  if (tool.category.includes('Developer')) return ['Paste or upload the source data.', 'Use the main action for this workflow.', 'Review the cleaned or generated result.', 'Copy the output when it looks right.']
  if (tool.category.includes('Text')) return ['Paste text into the main input area.', 'Choose the conversion or analysis mode.', 'Check the updated result panel.', 'Copy the output into your next workflow.']
  if (tool.category.includes('Utilities')) return ['Enter the source value or settings.', 'Run the tool once the input is ready.', 'Review the generated result.', 'Copy or download the output.']
  return ['Add your input.', 'Use the main controls for this workflow.', 'Review the result panel.', 'Copy or download the final output.']
}

function getWorkflowNotes(tool: ToolConfig) {
  if (tool.defaultConversionType && conversionNotes[tool.defaultConversionType]) return conversionNotes[tool.defaultConversionType]
  if (tool.component === 'ImageConverter') return ['Supports PNG, JPG, WebP, and AVIF workflows.', 'Useful for quick conversions and batches.', 'Shows size-aware output guidance.', 'Best when you need several image formats in one place.']
  if (tool.component === 'ImageCompressResize') return ['Supports PNG, JPG, and WebP optimization.', 'Useful for web uploads and smaller downloads.', 'Shows before and after size summaries.', 'Good when page speed or storage matters.']
  if (tool.component === 'BackgroundRemover') return ['Produces transparent PNG output.', 'Useful for product photos and design assets.', 'Preserves transparency for downloads.', 'Shows file-size guidance for lossless PNG output.']
  if (tool.category.includes('Developer')) return ['Designed for quick data cleanup and developer tasks.', 'Runs directly in the browser for faster iteration.', 'Keeps the output easy to copy back into your workflow.', 'Pairs naturally with related developer utilities.']
  if (tool.category.includes('Text')) return ['Built for text cleanup, conversion, and writing support.', 'Keeps the workflow simple enough for quick copy-paste tasks.', 'Useful for editing, publishing, and content prep.', 'Works well alongside related text tools.']
  if (tool.category.includes('Utilities')) return ['Focused on one practical task at a time.', 'Fast enough for quick repeat use.', 'Keeps the output easy to review and reuse.', 'Useful as part of a broader browser-based toolkit.']
  return ['Browser-based workflow.', 'Built for quick task completion.', 'Clear result presentation.', 'Useful alongside related ConvertFiles tools.']
}

function getFallbackBenefits(tool: ToolConfig) {
  if (tool.category.includes('Image')) return 'This tool keeps image work focused on speed, privacy, and clearer downloads without adding extra friction.'
  if (tool.category.includes('Developer')) return 'This tool helps you clean up or generate technical output quickly, with less overhead and a cleaner browser workflow.'
  if (tool.category.includes('Text')) return 'This tool is useful when you need quick text cleanup or conversion without bouncing between heavier apps.'
  if (tool.category.includes('Utilities')) return 'This tool keeps a common one-off task fast and easy to finish in the browser.'
  return 'This tool is designed for browser-based workflows with clearer results and less friction.'
}

function getNextStepLinks(slug: string, tool: ToolConfig, relatedTools: ToolPageClientProps['relatedTools']) {
  const categoryLinks: Record<string, LinkItem[]> = {
    image: [
      { href: '/tools/image-converter/', label: 'Open image converter', description: 'Switch formats when you need a different image output.' },
      { href: '/tools/image-compress/', label: 'Compress images', description: 'Reduce file size for uploads, email, or page speed.' },
      { href: '/tools/background-remover/', label: 'Remove backgrounds', description: 'Create transparent cutouts for design and ecommerce work.' },
    ],
    text: [
      { href: '/tools/word-counter/', label: 'Word counter', description: 'Check word count, reading time, and text length.' },
      { href: '/tools/case-converter/', label: 'Case converter', description: 'Switch text into uppercase, lowercase, title case, and more.' },
      { href: '/tools/lorem-ipsum-generator/', label: 'Lorem ipsum generator', description: 'Create placeholder copy for layouts and drafts.' },
    ],
    developer: [
      { href: '/tools/json-formatter/', label: 'JSON formatter', description: 'Beautify and validate structured JSON quickly.' },
      { href: '/tools/base64-encoder/', label: 'Base64 encoder', description: 'Encode or decode text and asset data in the browser.' },
      { href: '/tools/url-encoder/', label: 'URL encoder', description: 'Encode query strings and decode URLs cleanly.' },
    ],
    utility: [
      { href: '/tools/password-generator/', label: 'Password generator', description: 'Create secure passwords for new accounts and resets.' },
      { href: '/tools/qr-code-generator/', label: 'QR code generator', description: 'Turn links or text into downloadable QR codes.' },
      { href: '/all-tools/', label: 'Browse all tools', description: 'See other quick browser-based utilities in one place.' },
    ],
    design: [
      { href: '/tools/color-palette/', label: 'Color palette generator', description: 'Build palettes and export design-ready colors.' },
      { href: '/tools/image-enhancer/', label: 'Image enhancer', description: 'Adjust image quality before exporting or sharing.' },
      { href: '/tools/background-remover/', label: 'Background remover', description: 'Prepare cleaner assets for layouts and mockups.' },
    ],
    social: [
      { href: '/tools/youtube-thumbnail/', label: 'YouTube thumbnail downloader', description: 'Grab video thumbnails for research and content planning.' },
      { href: '/tools/qr-code-generator/', label: 'QR code generator', description: 'Create shareable QR codes for campaigns and links.' },
      { href: '/all-tools/', label: 'Browse all tools', description: 'See more utilities for publishing and content workflows.' },
    ],
  }

  const categoryKey = tool.category.includes('Image')
    ? 'image'
    : tool.category.includes('Text')
      ? 'text'
      : tool.category.includes('Developer')
        ? 'developer'
        : tool.category.includes('Design')
          ? 'design'
          : tool.category.includes('Social')
            ? 'social'
            : 'utility'

  const links = [
    ...relatedTools.map((item) => ({ href: `/tools/${item.id}/`, label: item.title, description: item.desc })),
    ...categoryLinks[categoryKey],
    { href: '/all-tools/', label: 'Browse all tools', description: 'Compare more workflows in the full directory.' },
  ]

  return links.filter((item, index, array) => item.href !== `/tools/${slug}/` && array.findIndex((entry) => entry.href === item.href) === index).slice(0, 6)
}

export function ToolPageClient({ slug, tool, relatedTools }: ToolPageClientProps) {
  useEffect(() => {
    window.scrollTo(0, 0)
    trackToolUsage(slug, tool.category, tool.schemaData.name)
  }, [slug, tool.category, tool.schemaData.name])

  const toolUrl = `https://convertfiles.qzz.io/tools/${slug}/`
  const faqItems = tool.faq && tool.faq.length > 0 ? tool.faq : []
  const howToSteps = getHowToSteps(tool)
  const workflowNotes = getWorkflowNotes(tool)
  const nextStepLinks = getNextStepLinks(slug, tool, relatedTools)
  const aboutCopy = stripMarkdown(tool.seoContent?.about || tool.description)
  const benefitsCopy = stripMarkdown(tool.seoContent?.benefits || getFallbackBenefits(tool))
  const isConversionPage = tool.category === 'Image Conversion'

  const renderTool = () => {
    switch (tool.component) {
      case 'ImageConverter':
        return <ImageConverter defaultConversionType={tool.defaultConversionType ?? 'png_jpg'} lockedMode={tool.lockedMode ?? false} toolSlug={slug} />
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
      case 'BanglaConverter':
        return <BanglaConverter defaultDirection={tool.defaultConversionType as any} title={tool.h1} description={tool.h2} />
      default:
        return <ImageConverter defaultConversionType="png_jpg" lockedMode={false} toolSlug={slug} />
    }
  }

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.schemaData.name,
    description: tool.schemaData.description,
    url: toolUrl,
    applicationCategory: tool.schemaData.category,
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: (tool.seoContent?.features && tool.seoContent.features.length > 0) ? tool.seoContent.features.slice(0, 5) : workflowNotes,
  }

  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  } : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://convertfiles.qzz.io/' },
      { '@type': 'ListItem', position: 2, name: 'All Tools', item: 'https://convertfiles.qzz.io/all-tools/' },
      { '@type': 'ListItem', position: 3, name: tool.schemaData.name, item: toolUrl },
    ],
  }

  return (
    <div className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="container-standard py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 sm:h-10 sm:w-10">
                <img src="/logo.png" alt="ConvertFiles" className="h-full w-full object-cover" />
              </div>
              <div className="text-lg font-bold text-white transition-colors group-hover:text-blue-400 sm:text-xl">ConvertFiles</div>
            </Link>

            <Link href="/all-tools/">
              <Button variant="ghost" size="sm" className="text-slate-400 transition-all hover:bg-slate-800/60 hover:text-white">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                All Tools
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container-standard py-6 sm:py-8 lg:py-10">
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
            <li className="flex items-center gap-1.5">
              <Link href="/" className="flex items-center gap-1 text-slate-400 transition-colors hover:text-white">
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
              <span className="text-slate-600">/</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Link href="/all-tools/" className="text-slate-400 transition-colors hover:text-white">All Tools</Link>
              <span className="text-slate-600">/</span>
            </li>
            <li><span className="truncate font-medium text-slate-200">{tool.schemaData.name}</span></li>
          </ol>
        </nav>

        <div className="mx-auto mb-8 max-w-4xl text-center sm:mb-10">
          <Badge className="mb-4 border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
            <Sparkles className="mr-1.5 h-3 w-3" />
            {tool.category}
          </Badge>
          <h1 className="mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text px-4 text-3xl font-bold leading-tight text-transparent sm:text-4xl lg:text-5xl">{tool.h1}</h1>
          <p className="mx-auto max-w-2xl px-4 text-base leading-relaxed text-slate-400 sm:text-lg">{tool.h2}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">Free and secure</Badge>
            <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-300">No upload required</Badge>
            <Badge variant="outline" className="border-amber-500/20 bg-amber-500/10 text-amber-300">Instant browser workflow</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-8">
          <div className="min-w-0">
            <Card className="tool-surface border-slate-700/50 bg-slate-800/50">
              <CardContent className="p-4 md:p-6 lg:p-8">
                <Suspense fallback={<div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-700/40 bg-slate-900/30 text-sm text-slate-400">Loading tool...</div>}>
                  {renderTool()}
                </Suspense>
              </CardContent>
            </Card>

            {isConversionPage && relatedTools.length > 0 && (
              <div className="mt-6 rounded-2xl border border-slate-700/30 bg-slate-800/30 p-4 sm:p-5">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Also try these related converters</p>
                <div className="flex flex-wrap gap-2">
                  {relatedTools.map((item) => (
                    <Link key={item.id} href={`/tools/${item.id}/`}>
                      <Button variant="outline" size="sm" className="text-xs text-slate-300 transition-all duration-150 hover:border-slate-500 hover:bg-slate-700/60 hover:text-white">
                        {item.title}
                        <ArrowRight className="ml-1.5 h-3 w-3 opacity-60" />
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <section className="mt-10 border-t border-slate-700/40 py-8">
              <h2 className="mb-5 text-2xl font-bold text-white">What is {tool.schemaData.name}?</h2>
              <p className="leading-relaxed text-slate-300">{aboutCopy}</p>
            </section>

            <section className="border-t border-slate-700/40 py-7">
              <div className="mb-5 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">How to use this tool</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {howToSteps.map((step, index) => (
                  <Card key={step} className="border-slate-700/35 bg-slate-800/30">
                    <CardContent className="p-5">
                      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/15 text-sm font-semibold text-blue-300">{index + 1}</div>
                      <p className="text-sm leading-relaxed text-slate-300">{step}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="border-t border-slate-700/40 py-7">
              <h2 className="mb-5 text-2xl font-bold text-white">Why use this tool?</h2>
              <p className="leading-relaxed text-slate-300">{benefitsCopy}</p>
              {tool.seoContent?.features && tool.seoContent.features.length > 0 && (
                <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {tool.seoContent.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 rounded-2xl border border-slate-700/35 bg-slate-800/25 p-4">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                      <span className="text-sm leading-relaxed text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="border-t border-slate-700/40 py-7">
              <h2 className="mb-5 text-2xl font-bold text-white">Supported formats and workflows</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {workflowNotes.map((note) => (
                  <Card key={note} className="border-slate-700/35 bg-slate-800/25">
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed text-slate-300">{note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="border-t border-slate-700/40 py-7">
              <h2 className="mb-5 text-2xl font-bold text-white">Useful next steps</h2>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {nextStepLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="group">
                    <Card className="h-full border-slate-700/35 bg-slate-800/30 transition-colors hover:border-blue-500/40 hover:bg-slate-800/55">
                      <CardContent className="p-4">
                        <h3 className="mb-1 text-sm font-semibold text-white transition-colors group-hover:text-blue-300">{item.label}</h3>
                        <p className="text-xs leading-relaxed text-slate-400">{item.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            {faqItems.length > 0 && (
            <section className="border-t border-slate-700/40 py-7">
              <h2 className="mb-6 text-2xl font-bold text-white">Frequently asked questions</h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={`${item.q}-${index}`} className="overflow-hidden rounded-xl border border-slate-700/40 bg-slate-800/40">
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 transition-colors hover:bg-slate-700/20 sm:p-5">
                        <span className="text-sm font-medium leading-snug text-white sm:text-base">{item.q}</span>
                        <ChevronDown className="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180" />
                      </summary>
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                        <p className="border-t border-slate-700/40 pt-3 text-sm leading-relaxed text-slate-300">{item.a}</p>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </section>
            )}

            <section className="border-t border-slate-700/40 py-7">
              <h2 className="mb-5 text-xl font-bold text-white">Related tools</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {relatedTools.map((item) => (
                  <Link key={item.id} href={`/tools/${item.id}/`} className="group">
                    <Card className="h-full cursor-pointer border-slate-700/30 bg-slate-800/30 shadow-sm transition-all duration-200 hover:border-blue-500/40 hover:bg-slate-800/60 hover:shadow-md hover:shadow-blue-500/5">
                      <CardContent className="p-4">
                        <h3 className="mb-1.5 text-sm font-medium text-white transition-colors group-hover:text-blue-300">{item.title}</h3>
                        <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="order-last xl:order-none">
            <div className="space-y-4 xl:sticky xl:top-20">
              <Card className="tool-surface border-slate-700/50 bg-slate-800/50">
                <CardContent className="p-5">
                  <h2 className="mb-4 text-sm font-semibold text-white">Why ConvertFiles?</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-green-500/20 bg-green-500/15">
                        <Shield className="h-3.5 w-3.5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-snug text-white">Privacy-focused processing</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-400">Common workflows stay in your browser instead of a remote upload queue.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-yellow-500/20 bg-yellow-500/15">
                        <Zap className="h-3.5 w-3.5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-snug text-white">Faster task completion</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-400">The platform is built for quick inputs, readable outputs, and low friction.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/15">
                        <Globe className="h-3.5 w-3.5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-snug text-white">Free and easy to access</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-400">No software install and no account wall for the main workflow.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="tool-surface border-blue-500/20 bg-blue-500/5">
                <CardContent className="p-5">
                  <p className="mb-1.5 text-sm font-medium text-blue-300">Need another workflow?</p>
                  <p className="mb-4 text-sm leading-relaxed text-slate-400">Jump to a related tool, browse the full directory, or learn more about the platform.</p>
                  <div className="space-y-2">
                    {nextStepLinks.slice(0, 4).map((item) => (
                      <Link key={item.href} href={item.href} className="block rounded-xl border border-slate-700/40 px-3 py-3 text-sm text-slate-200 transition-colors hover:border-blue-500/40 hover:bg-slate-900/40">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
