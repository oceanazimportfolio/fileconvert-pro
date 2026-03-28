import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Footer } from '@/components/Footer'
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle,
  Code2,
  Globe,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react'

const repoUrl = 'https://github.com/oceanazimportfolio/fileconvert-pro'

export const metadata: Metadata = {
  title: 'About ConvertFiles | Privacy-First Online Tool Platform',
  description:
    'Learn how ConvertFiles works, why browser-based processing matters, and what makes our free online tool platform private, fast, and trustworthy.',
  alternates: {
    canonical: 'https://convertfiles.qzz.io/about/',
  },
  openGraph: {
    title: 'About ConvertFiles | Privacy-First Online Tool Platform',
    description:
      'Discover the mission, trust signals, and browser-first approach behind ConvertFiles.',
    url: 'https://convertfiles.qzz.io/about/',
    siteName: 'ConvertFiles',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About ConvertFiles | Privacy-First Online Tool Platform',
    description:
      'See how ConvertFiles keeps tools fast, secure, and browser-based without forcing uploads.',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://convertfiles.qzz.io/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'About ConvertFiles',
      item: 'https://convertfiles.qzz.io/about/',
    },
  ],
}

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About ConvertFiles',
  url: 'https://convertfiles.qzz.io/about/',
  description:
    'Background, positioning, and trust information for the ConvertFiles browser-based tool platform.',
  isPartOf: {
    '@type': 'WebSite',
    name: 'ConvertFiles',
    url: 'https://convertfiles.qzz.io/',
  },
  about: {
    '@type': 'Organization',
    name: 'ConvertFiles',
    url: 'https://convertfiles.qzz.io/',
  },
}

export default function AboutPage() {
  return (
    <div className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="container-standard py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <img src="/logo.png" alt="ConvertFiles" className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="text-xl font-bold text-white transition-colors group-hover:text-blue-400">
                  ConvertFiles
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
                  Privacy-First Tool Platform
                </p>
              </div>
            </Link>

            <Link href="/all-tools/">
              <Button variant="ghost" className="text-slate-400 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Tools
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container-standard py-12 md:py-16">
        <section className="mx-auto max-w-4xl text-center">
          <Badge className="mb-5 border-blue-500/25 bg-blue-500/10 px-4 py-1 text-blue-400">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Built for privacy, speed, and clarity
          </Badge>
          <h1 className="mb-6 text-balance text-4xl font-black text-white md:text-5xl">
            About ConvertFiles
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
            ConvertFiles is a browser-first tool platform for image conversion, compression, data formatting,
            password creation, QR generation, and other practical workflows. The goal is simple: make everyday tools
            faster, safer, and easier to trust.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/all-tools/">
              <Button size="lg" className="bg-blue-600 px-7 font-semibold hover:bg-blue-500">
                Explore all tools
              </Button>
            </Link>
            <Link href="/privacy-policy/">
              <Button size="lg" variant="outline" className="border-slate-700 px-7 text-slate-200 hover:text-white">
                Read privacy policy
              </Button>
            </Link>
          </div>
        </section>

        <section className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: 'No upload required',
              description: 'Most workflows run directly in your browser, which means your files stay on your device.',
            },
            {
              icon: Zap,
              title: 'Fast by design',
              description: 'Skipping server uploads reduces wait time and makes simple tasks feel instant.',
            },
            {
              icon: Globe,
              title: 'Easy to access',
              description: 'Open a page, use a tool, and download the result without installing extra software.',
            },
          ].map((item) => (
            <Card key={item.title} className="tool-surface border-slate-700/50 bg-slate-800/50">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                  <item.icon className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="mb-2 text-xl font-bold text-white">{item.title}</h2>
                <p className="text-sm leading-relaxed text-slate-400">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <Card className="tool-surface border-slate-700/50 bg-slate-800/45">
            <CardContent className="p-6 md:p-8">
              <h2 className="mb-4 text-3xl font-bold text-white">How the platform works</h2>
              <div className="space-y-4 text-slate-300">
                <p>
                  Many online tools rely on remote servers to upload, process, and return your files. That can create
                  privacy concerns, add friction, and slow simple workflows down. ConvertFiles takes a more practical
                  approach by leaning on modern browser APIs so common tasks can happen locally whenever possible.
                </p>
                <p>
                  This approach works especially well for image conversion, compression, formatting, and lightweight
                  generation tasks. It keeps the experience fast, reduces the amount of trust a user has to place in a
                  third-party service, and makes the product easier to recommend in privacy-sensitive contexts.
                </p>
                <p>
                  The site is built to be useful page by page. Every tool has its own optimized landing page, clear
                  supporting content, and internal links to related workflows so users can move from one task to the
                  next without hunting around.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-700/50 bg-slate-900/60 p-5">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Under the hood</p>
                <code className="block whitespace-pre-wrap text-sm leading-relaxed text-blue-300">
                  {`loadInput(file)
  -> processInBrowser()
  -> previewResult()
  -> downloadCleanOutput()`}
                </code>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="tool-surface border-slate-700/50 bg-slate-800/45">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold text-white">Why people trust it</h2>
                <ul className="space-y-3">
                  {[
                    'Free browser tools with no forced signup',
                    'Dedicated pages for high-intent conversions and utilities',
                    'Readable result states designed to reduce confusion',
                    'Privacy and local-processing messaging that matches the product behavior',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="tool-surface border-slate-700/50 bg-slate-800/45">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold text-white">Public project links</h2>
                <div className="space-y-3 text-sm">
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-medium text-white transition-colors hover:text-blue-400"
                  >
                    <Code2 className="h-4 w-4" />
                    GitHub repository
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <p className="leading-relaxed text-slate-400">
                    Useful for transparency, product listings, and anyone who wants a cleaner picture of the project
                    behind the tools.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-slate-700/50 bg-slate-800/35 p-6 md:p-8">
          <h2 className="mb-5 text-3xl font-bold text-white">What ConvertFiles is best at</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: 'Image workflows',
                description:
                  'Convert PNG, JPG, WebP, and AVIF files, reduce file size, resize assets, and remove backgrounds with clearer output summaries.',
                href: '/tools/image-converter/',
                label: 'Open image tools',
              },
              {
                title: 'Developer and content utilities',
                description:
                  'Format JSON, encode Base64, generate passwords, count words, and create QR codes with straightforward browser-first interfaces.',
                href: '/all-tools/',
                label: 'Browse utility tools',
              },
            ].map((item) => (
              <Card key={item.title} className="border-slate-700/40 bg-slate-900/45">
                <CardContent className="p-5">
                  <h3 className="mb-2 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-slate-400">{item.description}</p>
                  <Link href={item.href}>
                    <Button variant="outline" className="border-slate-700 text-slate-200 hover:text-white">
                      {item.label}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
