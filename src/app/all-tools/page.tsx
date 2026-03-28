import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { toolsConfig } from '@/app/tools/[slug]/page'
import {
  ArrowLeft,
  Binary,
  FileText,
  Image as ImageIcon,
  Key,
  Palette,
  Shield,
  Sparkles,
  Youtube,
  Zap,
} from 'lucide-react'

const getCategoryIcon = (category: string) => {
  if (category.includes('Image')) return ImageIcon
  if (category.includes('Developer')) return Binary
  if (category.includes('Text')) return FileText
  if (category.includes('Design')) return Palette
  if (category.includes('Social')) return Youtube
  return Key
}

export const metadata: Metadata = {
  title: 'All Tools Directory | Free Browser-Based Converters and Utilities',
  description:
    'Browse every ConvertFiles tool in one place, from image converters and compressors to JSON, password, QR, and text utilities.',
  alternates: {
    canonical: 'https://convertfiles.qzz.io/all-tools/',
  },
  openGraph: {
    title: 'All Tools Directory | ConvertFiles',
    description:
      'Explore the complete ConvertFiles tool directory with browser-based image, developer, text, and utility workflows.',
    url: 'https://convertfiles.qzz.io/all-tools/',
    siteName: 'ConvertFiles',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Tools Directory | ConvertFiles',
    description:
      'Find image converters, JSON tools, password generators, QR creators, and more in one organized tool directory.',
  },
}

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'ConvertFiles tool directory',
  itemListElement: Object.keys(toolsConfig).map((slug, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `https://convertfiles.qzz.io/tools/${slug}/`,
    name: toolsConfig[slug].schemaData.name,
  })),
}

export default function AllToolsPage() {
  const categorizedTools = Object.entries(toolsConfig).reduce((acc, [slug, tool]) => {
    if (!acc[tool.category]) {
      acc[tool.category] = []
    }

    acc[tool.category].push({ slug, ...tool })
    return acc
  }, {} as Record<string, Array<{ slug: string } & (typeof toolsConfig)[string]>>)

  const categoryOrder = [
    'Image Tools',
    'Image Conversion',
    'Text Tools',
    'Developer Tools',
    'Design Tools',
    'Utilities',
    'Social Media',
  ]

  Object.keys(categorizedTools).forEach((category) => {
    if (!categoryOrder.includes(category)) categoryOrder.push(category)
  })

  const featuredSlugs = [
    'image-converter',
    'image-compress',
    'background-remover',
    'json-formatter',
    'password-generator',
    'qr-code-generator',
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
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
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tool Directory</p>
              </div>
            </Link>

            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container-standard py-10 md:py-12">
        <section className="mx-auto mb-12 max-w-4xl text-center">
          <Badge className="mb-5 border-primary/20 bg-primary/10 text-primary">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Free browser-based tools in one place
          </Badge>
          <h1 className="mb-4 text-balance text-4xl font-black text-white md:text-5xl">
            Browse every ConvertFiles tool
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Use this directory to discover high-intent image converters, privacy-first utilities, and everyday browser
            tools. Every page is designed to be usable on its own, with clear descriptions and quick paths to related workflows.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/tools/image-converter/">
              <Button className="bg-primary px-6 font-semibold hover:bg-primary/90">
                Start with image conversion
              </Button>
            </Link>
            <Link href="/about/">
              <Button variant="outline" className="border-border px-6 text-foreground hover:text-white">
                Why ConvertFiles?
              </Button>
            </Link>
          </div>
        </section>

        <section className="mb-12 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: 'Privacy-first workflows',
              description: 'Most tools keep processing in your browser so files and text do not need to be uploaded.',
            },
            {
              icon: Zap,
              title: 'Fast task completion',
              description: 'The platform is built to get users from input to result quickly without extra friction.',
            },
            {
              icon: Sparkles,
              title: 'Useful page-level depth',
              description: 'Every tool page includes guidance, FAQs, and related links to help users choose the right next step.',
            },
          ].map((item) => (
            <Card key={item.title} className="tool-surface border-slate-700/40 bg-slate-800/35">
              <CardContent className="p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-white">{item.title}</h2>
                <p className="text-sm leading-relaxed text-slate-400">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mb-14" aria-labelledby="featured-tools">
          <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10">
              <Sparkles className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h2 id="featured-tools" className="text-2xl font-black text-white">Popular starting points</h2>
              <p className="text-sm text-muted-foreground">High-traffic tools that cover the most common workflows.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {featuredSlugs.map((slug) => {
              const tool = toolsConfig[slug]

              return (
                <Link key={slug} href={`/tools/${slug}/`} className="group h-full">
                  <Card className="h-full overflow-hidden border-amber-400/20 bg-amber-400/5 p-5 transition-all duration-300 hover:border-amber-400/40 hover:bg-amber-400/10 hover:shadow-xl hover:shadow-amber-400/10">
                    <div className="flex h-full flex-col">
                      <h3 className="mb-2 text-lg font-bold leading-tight text-white transition-colors group-hover:text-amber-300">
                        {tool.schemaData.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{tool.schemaData.description}</p>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        <div className="space-y-14">
          {categoryOrder.map((categoryName) => {
            const currentGroup = categorizedTools[categoryName]
            if (!currentGroup || currentGroup.length === 0) return null

            const IconComponent = getCategoryIcon(categoryName)

            return (
              <section key={categoryName} aria-labelledby={`category-${categoryName.replace(/\s+/g, '-')}`}>
                <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <h2 id={`category-${categoryName.replace(/\s+/g, '-')}`} className="text-2xl font-black text-white">
                    {categoryName}
                  </h2>
                  <Badge variant="secondary" className="ml-auto">
                    {currentGroup.length} tools
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {currentGroup.map((tool) => (
                    <Link key={tool.slug} href={`/tools/${tool.slug}/`} className="group h-full">
                      <Card className="h-full overflow-hidden p-5 transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-xl hover:shadow-primary/5">
                        <div className="flex h-full flex-col">
                          <h3 className="mb-2 text-base font-bold leading-tight text-white transition-colors group-hover:text-primary">
                            {tool.schemaData.name}
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">{tool.schemaData.description}</p>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        <section className="mt-16 rounded-3xl border border-slate-700/40 bg-slate-800/35 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-white">How to choose the right tool</h2>
              <p className="text-sm leading-relaxed text-slate-300">
                Start with the job you need to finish. If you need a specific image format, open a dedicated converter.
                If you want more control over size or quality, use the compressor or the all-in-one image converter.
                For text, JSON, QR, or password tasks, the tool pages focus on one clear job so the workflow stays easy to scan.
              </p>
            </div>
            <div className="grid gap-3">
              <Link href="/tools/image-compress/" className="rounded-2xl border border-slate-700/50 bg-slate-900/45 p-4 transition-colors hover:border-primary/40">
                <h3 className="text-base font-semibold text-white">Need smaller image files?</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">Use Image Compressor and Resizer for faster pages and lighter downloads.</p>
              </Link>
              <Link href="/tools/json-formatter/" className="rounded-2xl border border-slate-700/50 bg-slate-900/45 p-4 transition-colors hover:border-primary/40">
                <h3 className="text-base font-semibold text-white">Cleaning API or config data?</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">JSON Formatter helps you validate and read complex payloads quickly.</p>
              </Link>
              <Link href="/about/" className="rounded-2xl border border-slate-700/50 bg-slate-900/45 p-4 transition-colors hover:border-primary/40">
                <h3 className="text-base font-semibold text-white">Want to understand the privacy model?</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">Read about ConvertFiles and how browser-based processing reduces friction.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
