import type { Metadata } from 'next'
import Link from 'next/link'
import { AdsenseAd } from '@/components/AdsenseAd'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getAdPlacement } from '@/lib/adsense'
import { TrackedLink } from '@/components/TrackedLink'
import { RecentlyUsedTools } from '@/components/landing/RecentlyUsedTools'
import { ToolIcon } from '@/components/ToolIcon'
import {
  ArrowRight,
  Globe,
  Image as ImageIcon,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Footer } from '@/components/Footer'
import type { ToolIconSlug } from '@/lib/toolIcons'

export const metadata: Metadata = {
  title: 'Free Online File Converter and Browser Tools',
  description:
    'Convert images, compress files, format JSON, generate passwords, create QR codes, and use privacy-first browser tools with no upload required.',
  alternates: {
    canonical: 'https://convertfiles.qzz.io/',
  },
  openGraph: {
    title: 'ConvertFiles | Free Browser-Based File Converter and Utilities',
    description:
      'Use image converters, compression tools, JSON utilities, text tools, and more without sending files to a server.',
    url: 'https://convertfiles.qzz.io/',
    siteName: 'ConvertFiles',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ConvertFiles | Free Browser-Based File Converter and Utilities',
    description:
      'Free online tools for image conversion, compression, formatting, passwords, QR codes, and more.',
  },
}

const tools = [
  {
    id: 'bangla-converter' as ToolIconSlug,
    title: 'Bangla Converter',
    description: 'Unicode and Bijoy conversion for browser-based Bangla workflows.',
    category: 'text',
  },
  {
    id: 'image-converter' as ToolIconSlug,
    title: 'Image Converter',
    description: 'Convert PNG, JPG, WebP, and AVIF files with clear output choices.',
    category: 'image',
  },
  {
    id: 'image-compress' as ToolIconSlug,
    title: 'Compress and Resize',
    description: 'Reduce image size and resize assets for web, email, and upload workflows.',
    category: 'image',
  },
  {
    id: 'image-enhancer' as ToolIconSlug,
    title: 'Image Enhancer',
    description: 'Adjust brightness, contrast, saturation, and sharpness directly in the browser.',
    category: 'image',
  },
  {
    id: 'background-remover' as ToolIconSlug,
    title: 'Background Remover',
    description: 'Create transparent cutouts and cleaner product visuals without leaving the site.',
    category: 'image',
  },
  {
    id: 'json-formatter' as ToolIconSlug,
    title: 'JSON Formatter',
    description: 'Beautify, validate, and inspect JSON with fast browser-based formatting.',
    category: 'developer',
  },
  {
    id: 'base64-encoder' as ToolIconSlug,
    title: 'Base64 Encoder',
    description: 'Encode and decode text or image data without exposing it to a server.',
    category: 'developer',
  },
  {
    id: 'url-encoder' as ToolIconSlug,
    title: 'URL Encoder',
    description: 'Encode or decode URLs and query strings quickly.',
    category: 'developer',
  },
  {
    id: 'case-converter' as ToolIconSlug,
    title: 'Case Converter',
    description: 'Switch text between uppercase, lowercase, title case, and more.',
    category: 'text',
  },
  {
    id: 'word-counter' as ToolIconSlug,
    title: 'Word Counter',
    description: 'Count words, characters, and reading time for writing and SEO workflows.',
    category: 'text',
  },
  {
    id: 'lorem-ipsum-generator' as ToolIconSlug,
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for layouts, mockups, and drafts.',
    category: 'text',
  },
  {
    id: 'color-palette' as ToolIconSlug,
    title: 'Color Palette Generator',
    description: 'Build palettes, export color tokens, and explore combinations for design work.',
    category: 'design',
  },
  {
    id: 'password-generator' as ToolIconSlug,
    title: 'Password Generator',
    description: 'Create strong browser-generated passwords with adjustable complexity.',
    category: 'utility',
  },
  {
    id: 'qr-code-generator' as ToolIconSlug,
    title: 'QR Code Generator',
    description: 'Create QR codes for text, URLs, and more with instant PNG output.',
    category: 'utility',
  },
  {
    id: 'youtube-thumbnail' as ToolIconSlug,
    title: 'YouTube Thumbnail Downloader',
    description: 'Fetch video thumbnails quickly for research and content workflows.',
    category: 'social',
  },
]

const categories = [
  { id: 'image', name: 'Image Tools', count: 4 },
  { id: 'developer', name: 'Developer Utilities', count: 3 },
  { id: 'text', name: 'Text Tools', count: 4 },
  { id: 'design', name: 'Design Tools', count: 1 },
  { id: 'utility', name: 'Utilities', count: 2 },
  { id: 'social', name: 'Social Media', count: 1 },
]

const workflowHighlights = [
  {
    slug: 'how-to-convert-webp-to-png',
    title: 'How to convert WebP to PNG',
    description: 'A compatibility-first guide for transparent assets and older workflows.',
    href: '/guides/how-to-convert-webp-to-png/',
  },
  {
    slug: 'reduce-image-size-for-website',
    title: 'Reduce image size for website speed',
    description: 'A problem-first page for performance-focused image cleanup.',
    href: '/guides/reduce-image-size-for-website/',
  },
  {
    slug: 'how-to-open-webp-files',
    title: 'How to open WebP files',
    description: 'A practical troubleshooting guide for users who need to open or convert WebP images fast.',
    href: '/guides/how-to-open-webp-files/',
  },
]

const banglaHighlights = [
  {
    slug: 'bijoy-to-unicode-online',
    title: 'Bijoy to Unicode online',
    description: 'Move legacy Bangla text into a modern, shareable format.',
    href: '/guides/bijoy-to-unicode-online/',
  },
  {
    slug: 'unicode-to-bijoy-online',
    title: 'Unicode to Bijoy online',
    description: 'Bridge modern Bangla typing back into older publishing workflows.',
    href: '/guides/unicode-to-bijoy-online/',
  },
  {
    slug: 'bijoy-vs-unicode',
    title: 'Bijoy vs Unicode',
    description: 'Compare standards before deciding which direction to convert.',
    href: '/compare/bijoy-vs-unicode/',
  },
]

const categoryHighlights = [
  {
    slug: 'image-tools',
    title: 'Image tools hub',
    description: 'The main growth cluster for conversion, compression, and asset cleanup.',
    href: '/categories/image-tools/',
  },
  {
    slug: 'bangla-tools',
    title: 'Bangla tools hub',
    description: 'The strongest lower-competition cluster for Bangladesh-focused search intent.',
    href: '/categories/bangla-tools/',
  },
  {
    slug: 'developer-tools',
    title: 'Developer tools hub',
    description: 'A smaller cluster with strong community-sharing potential.',
    href: '/categories/developer-tools/',
  },
]

const comparisonHighlights = [
  ['PNG vs JPG', '/compare/png-vs-jpg/'],
  ['WebP vs PNG', '/compare/webp-vs-png/'],
  ['JSON Formatter vs JSON Validator', '/compare/json-formatter-vs-json-validator/'],
  ['Bijoy vs Unicode', '/compare/bijoy-vs-unicode/'],
]

const recentToolItems = tools.map((tool) => ({
  slug: tool.id,
  title: tool.title,
  description: tool.description,
}))

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ConvertFiles',
  url: 'https://convertfiles.qzz.io/',
  description:
    'Free browser-based tool platform for image conversion, file optimization, developer utilities, and text workflows.',
}

export default function Home() {
  const homepageAd = getAdPlacement('homepage_in_content')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <header className="sticky top-0 z-50 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container-standard py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3 transition-all active:scale-95">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-primary shadow-lg shadow-primary/20">
                <img src="/logo.png" alt="ConvertFiles" className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="text-xl font-black tracking-tight text-white">ConvertFiles</div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Free Online Tools</p>
              </div>
            </Link>

            <div className="hidden items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground md:flex">
              <span className="flex items-center gap-1.5 hover:text-white">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                Instant use
              </span>
              <span className="flex items-center gap-1.5 hover:text-white">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                Privacy first
              </span>
              <span className="flex items-center gap-1.5 hover:text-white">
                <Globe className="h-3.5 w-3.5 text-primary" />
                No upload required
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container-standard py-10 md:py-16 lg:py-20">
        <section className="mx-auto mb-16 max-w-5xl text-center">
          <Badge variant="outline" className="mb-6 border-primary/20 bg-primary/5 px-4 py-1 text-primary">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Browser-based tools for faster workflows
          </Badge>

          <h1 className="mb-6 text-balance">
            Free online <span className="accent-gradient">file converter</span> and everyday tools
          </h1>

          <p className="mx-auto max-w-3xl text-lg md:text-xl">
            Convert images, compress assets, remove backgrounds, format JSON, generate passwords, and finish routine
            tasks without shipping your files to a server. ConvertFiles is built for speed, privacy, and clearer results.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/tools/image-converter/">
              <Button size="lg" className="bg-primary px-7 font-semibold hover:bg-primary/90">
                <ToolIcon slug="image-converter" className="mr-2 h-4 w-4" />
                Open image converter
              </Button>
            </Link>
            <Link href="/all-tools/">
              <Button size="lg" variant="secondary" className="px-7 font-semibold text-white">
                Browse all tools
              </Button>
            </Link>
          </div>
        </section>

        <section className="mb-12 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: 'Free and secure',
              description: 'Most workflows stay local in your browser, which keeps simple tasks more private.',
            },
            {
              icon: Zap,
              title: 'Faster perceived performance',
              description: 'Skipping remote uploads reduces friction and helps users get to the result sooner.',
            },
            {
              icon: Sparkles,
              title: 'Built for clear outcomes',
              description: 'Tool pages focus on strong guidance, readable results, and useful next-step links.',
            },
          ].map((item) => (
            <Card key={item.title} className="tool-surface border-slate-700/40 bg-slate-800/35 p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-white">{item.title}</h2>
              <p className="text-sm leading-relaxed text-slate-400">{item.description}</p>
            </Card>
          ))}
        </section>

        <section className="mb-12" aria-labelledby="popular-conversions">
          <div className="mb-6 flex flex-col items-start justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-center">
            <div>
              <h2 id="popular-conversions" className="flex items-center gap-2 text-xl font-bold text-white">
                <ImageIcon className="h-5 w-5 text-blue-400" />
                Popular image conversions
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                High-intent converter pages for the most common image format changes.
              </p>
            </div>
            <Link href="/tools/image-converter/">
              <Button variant="ghost" className="px-0 text-primary hover:text-primary/80">
                View all image formats
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[
              { label: 'PNG to JPG', href: '/tools/png-to-jpg/', slug: 'png-to-jpg' as ToolIconSlug },
              { label: 'WebP to PNG', href: '/tools/webp-to-png/', slug: 'webp-to-png' as ToolIconSlug },
              { label: 'JPG to PNG', href: '/tools/jpg-to-png/', slug: 'jpg-to-png' as ToolIconSlug },
              { label: 'WebP to JPG', href: '/tools/webp-to-jpg/', slug: 'webp-to-jpg' as ToolIconSlug },
              { label: 'AVIF to PNG', href: '/tools/avif-to-png/', slug: 'avif-to-png' as ToolIconSlug },
              { label: 'JFIF to PNG', href: '/tools/jfif-to-png/', slug: 'jfif-to-png' as ToolIconSlug },
            ].map((item) => (
              <Link key={item.slug} href={item.href}>
                <Button variant="outline" className="h-12 w-full justify-start gap-2 rounded-xl border-border/50 bg-card px-4 text-sm shadow-sm transition-all hover:scale-[1.01] hover:bg-muted hover:text-foreground">
                  <ToolIcon slug={item.slug} className="h-4 w-4 text-primary" />
                  <span className="truncate">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
          <Card className="tool-surface border-slate-700/40 bg-slate-800/35 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                <Sparkles className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Search-first workflow guides</h2>
                <p className="text-sm text-slate-400">Pages written for problem-based queries, not only tool names.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {workflowHighlights.map((item) => (
                <TrackedLink
                  key={item.slug}
                  href={item.href}
                  eventName="search_click_landing"
                  eventParams={{ slug: item.slug, destination_group: 'homepage_guide' }}
                  className="group h-full"
                >
                  <Card className="h-full border-slate-700/40 bg-slate-900/45 transition-all hover:border-blue-500/35 hover:bg-slate-800/70">
                    <div className="p-5">
                      <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-blue-300">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-400">{item.description}</p>
                    </div>
                  </Card>
                </TrackedLink>
              ))}
            </div>
          </Card>

          <Card className="tool-surface border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="mb-5">
              <h2 className="text-2xl font-black text-white">Popular in Bangladesh</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Bangla conversion pages can capture more specific intent and route those users into the wider tool set.
              </p>
            </div>

            <div className="space-y-3">
              {banglaHighlights.map((item) => (
                <TrackedLink
                  key={item.slug}
                  href={item.href}
                  eventName="search_click_landing"
                  eventParams={{ slug: item.slug, destination_group: 'homepage_bangla' }}
                  className="block rounded-2xl border border-emerald-500/20 bg-slate-900/45 p-4 transition-colors hover:border-emerald-400/35"
                >
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.description}</p>
                </TrackedLink>
              ))}
            </div>
          </Card>
        </section>

        {homepageAd && (
          <AdsenseAd
            slot={homepageAd.slot}
            format={homepageAd.format}
            fullWidthResponsive={homepageAd.fullWidthResponsive}
            minHeight={homepageAd.minHeight}
          />
        )}

        <section className="grid gap-12 border-t border-border py-16 md:grid-cols-3" aria-labelledby="platform-benefits">
          <article>
            <h2 id="platform-benefits" className="mb-4 text-white">Why browser-based tools help</h2>
            <p className="text-sm leading-relaxed">
              Browser-first processing reduces upload wait time, removes extra steps for simple workflows, and makes the
              platform easier to trust when you are handling screenshots, drafts, code, or internal assets.
            </p>
          </article>
          <article>
            <h2 className="mb-4 text-white">Built for individual page intent</h2>
            <p className="text-sm leading-relaxed">
              Dedicated converter pages like PNG to JPG or WebP to PNG help users land directly on the workflow they need,
              while the shared converter and tool directory connect those pages into a stronger internal-link mesh.
            </p>
          </article>
          <article>
            <h2 className="mb-4 text-white">Useful beyond image conversion</h2>
            <p className="text-sm leading-relaxed">
              ConvertFiles also supports developer, text, and utility jobs like JSON formatting, password generation,
              QR code creation, and word counting, which makes the site more broadly useful and easier to recommend.
            </p>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  )
}
