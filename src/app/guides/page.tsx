import type { Metadata } from 'next'
import { guideOrder, guidePages } from '@/lib/discoveryContent'
import { Footer } from '@/components/Footer'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrackedLink } from '@/components/TrackedLink'
import { absoluteUrl } from '@/lib/site'
import { ArrowRight, BookOpenText, Globe2, Languages, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Guides | ConvertFiles Search and Workflow Library',
  description:
    'Browse ConvertFiles guides for image conversion, compression, transparent PNG workflows, website image decisions, and Bangla text conversion help.',
  alternates: {
    canonical: absoluteUrl('/guides/'),
  },
  openGraph: {
    title: 'Guides | ConvertFiles Search and Workflow Library',
    description:
      'Workflow guides for image conversion, compression, transparent PNGs, and Bangla compatibility tasks.',
    url: absoluteUrl('/guides/'),
    siteName: 'ConvertFiles',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guides | ConvertFiles Search and Workflow Library',
    description:
      'Practical browser-first guides for conversion, compression, transparent PNG, and Bangla workflows.',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: absoluteUrl('/guides/') },
  ],
}

export default function GuidesIndexPage() {
  const orderedGuides = guideOrder.map((slug) => guidePages[slug]).filter(Boolean)
  const englishGuides = orderedGuides.filter((guide) => guide.language === 'en')
  const banglaGuides = orderedGuides.filter((guide) => guide.language !== 'en')

  return (
    <div className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="container-standard py-10 md:py-14">
        <section className="mx-auto max-w-4xl text-center">
          <Badge className="mb-5 border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-emerald-300">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Search-first workflow content
          </Badge>
          <h1 className="mb-5 text-balance text-4xl font-black text-white md:text-5xl">
            Conversion guides, troubleshooting pages, and quick workflow playbooks
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300">
            These pages are built to help people land directly on the job they need to finish, then move into the right
            ConvertFiles tool without extra friction.
          </p>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Globe2,
              title: 'Image workflow coverage',
              description: 'Conversion, compression, and transparent PNG pages built around common browser and website tasks.',
            },
            {
              icon: BookOpenText,
              title: 'Problem-led pages',
              description: 'Guides are framed around the real job to be done, not just the raw tool name.',
            },
            {
              icon: Languages,
              title: 'Bangla search intent',
              description: 'Dedicated pages support Bijoy and Unicode compatibility workflows for Bangladesh-focused users.',
            },
          ].map((item) => (
            <Card key={item.title} className="border-slate-700/40 bg-slate-800/35">
              <CardContent className="p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                  <item.icon className="h-5 w-5 text-emerald-300" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-white">{item.title}</h2>
                <p className="text-sm leading-relaxed text-slate-400">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-14">
          <div className="mb-6 flex items-center gap-3">
            <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-300">
              English cluster
            </Badge>
            <p className="text-sm text-slate-400">Fast-win image and workflow queries</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {englishGuides.map((guide) => (
              <TrackedLink
                key={guide.slug}
                href={`/guides/${guide.slug}/`}
                eventName="search_click_landing"
                eventParams={{ slug: guide.slug, page_group: 'guides_index' }}
                className="group"
              >
                <Card className="h-full border-slate-700/35 bg-slate-900/45 transition-colors hover:border-blue-500/35 hover:bg-slate-900/75">
                  <CardContent className="p-5">
                    <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-blue-300">
                      {guide.title}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-slate-400">{guide.description}</p>
                    <div className="inline-flex items-center text-sm font-medium text-blue-300">
                      Read guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </TrackedLink>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-6 flex items-center gap-3">
            <Badge variant="outline" className="border-amber-500/20 bg-amber-500/10 text-amber-300">
              Bangla cluster
            </Badge>
            <p className="text-sm text-slate-400">Legacy publishing and modern Unicode compatibility help</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {banglaGuides.map((guide) => (
              <TrackedLink
                key={guide.slug}
                href={`/guides/${guide.slug}/`}
                eventName="search_click_landing"
                eventParams={{ slug: guide.slug, page_group: 'guides_index' }}
                className="group"
              >
                <Card className="h-full border-slate-700/35 bg-slate-900/45 transition-colors hover:border-amber-500/35 hover:bg-slate-900/75">
                  <CardContent className="p-5">
                    <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-amber-300">
                      {guide.title}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-slate-400">{guide.description}</p>
                    <div className="inline-flex items-center text-sm font-medium text-amber-300">
                      Read guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </TrackedLink>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-slate-700/40 bg-slate-800/30 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-3 text-2xl font-black text-white">Use the guide, then use the tool</h2>
              <p className="text-sm leading-relaxed text-slate-300">
                Each guide is designed to capture search intent and push the user into the most relevant tool page with
                clearer context, fewer wrong clicks, and stronger follow-on usage.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <TrackedLink
                href="/categories/image-tools/"
                eventName="organic_guide_cta_click"
                eventParams={{ slug: 'guides-index', destination_group: 'image-tools' }}
              >
                <Button className="bg-blue-600 px-6 font-semibold hover:bg-blue-500">Explore image hubs</Button>
              </TrackedLink>
              <TrackedLink
                href="/categories/bangla-tools/"
                eventName="organic_guide_cta_click"
                eventParams={{ slug: 'guides-index', destination_group: 'bangla-tools' }}
              >
                <Button variant="outline" className="border-slate-700 px-6 text-slate-200 hover:text-white">
                  Explore Bangla hubs
                </Button>
              </TrackedLink>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
