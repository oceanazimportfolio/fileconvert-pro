import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { TrackedLink } from '@/components/TrackedLink'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { comparisonOrder, comparisonPages } from '@/lib/discoveryContent'
import { absoluteUrl } from '@/lib/site'
import { ArrowRight, Scale, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Compare Formats and Workflows | ConvertFiles',
  description:
    'Compare image formats, Bangla workflows, and developer tasks so you can choose the right ConvertFiles tool or format faster.',
  alternates: {
    canonical: absoluteUrl('/compare/'),
  },
  openGraph: {
    title: 'Compare Formats and Workflows | ConvertFiles',
    description:
      'Practical format and workflow comparisons for image conversion, Bangla publishing, and developer utilities.',
    url: absoluteUrl('/compare/'),
    siteName: 'ConvertFiles',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Formats and Workflows | ConvertFiles',
    description:
      'Use practical comparison pages to choose the right format or workflow before you convert.',
  },
}

const englishComparisonSlugs = comparisonOrder.filter((slug) => comparisonPages[slug]?.language !== 'bn')
const banglaComparisonSlugs = comparisonOrder.filter((slug) => comparisonPages[slug]?.language === 'bn')

export default function CompareIndexPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: absoluteUrl('/compare/') },
    ],
  }

  return (
    <div className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="container-standard py-10 md:py-14">
        <section className="mx-auto max-w-4xl text-center">
          <Badge className="mb-5 border-amber-500/25 bg-amber-500/10 text-amber-300">
            <Scale className="mr-2 h-3.5 w-3.5" />
            Comparison library
          </Badge>
          <h1 className="mb-4 text-balance text-4xl font-black text-white md:text-5xl">
            Compare formats before you convert
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300">
            These pages are designed for the decision stage. Use them when you are not sure which format, standard, or
            workflow fits the next step best, then jump straight into the matching tool or guide.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <TrackedLink
              href="/categories/image-tools/"
              eventName="search_click_landing"
              eventParams={{ slug: 'compare-index', destination_group: 'image_category' }}
            >
              <Button className="bg-blue-600 px-6 font-semibold hover:bg-blue-500">
                Explore image tools
              </Button>
            </TrackedLink>
            <TrackedLink
              href="/guides/"
              eventName="search_click_landing"
              eventParams={{ slug: 'compare-index', destination_group: 'guides' }}
            >
              <Button variant="outline" className="border-slate-700 px-6 text-slate-200 hover:text-white">
                Browse workflow guides
              </Button>
            </TrackedLink>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
              <Sparkles className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Image and developer comparisons</h2>
              <p className="text-sm text-slate-400">High-intent English pages for common conversion and debugging decisions.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {englishComparisonSlugs.map((slug) => {
              const page = comparisonPages[slug]

              return (
                <TrackedLink
                  key={slug}
                  href={`/compare/${slug}/`}
                  eventName="search_click_landing"
                  eventParams={{ slug, destination_group: 'comparison_page' }}
                  className="group h-full"
                >
                  <Card className="h-full border-slate-700/40 bg-slate-800/35 transition-all hover:border-blue-500/35 hover:bg-slate-800/55">
                    <CardContent className="p-5">
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                        {page.primaryIntent}
                      </p>
                      <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-blue-300">
                        {page.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-400">{page.summary}</p>
                    </CardContent>
                  </Card>
                </TrackedLink>
              )
            })}
          </div>
        </section>

        {banglaComparisonSlugs.length > 0 && (
          <section className="mt-14 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8">
            <div className="mb-5 max-w-3xl">
              <h2 className="text-2xl font-black text-white">Bangla publishing comparisons</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                These decision pages support Bangladesh-focused search intent where users are often choosing between
                legacy and modern text standards before they convert a document or production workflow.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {banglaComparisonSlugs.map((slug) => {
                const page = comparisonPages[slug]

                return (
                  <TrackedLink
                    key={slug}
                    href={`/compare/${slug}/`}
                    eventName="search_click_landing"
                    eventParams={{ slug, destination_group: 'bangla_comparison' }}
                    className="group h-full"
                  >
                    <Card className="h-full border-emerald-500/20 bg-slate-900/55 transition-all hover:border-emerald-400/35">
                      <CardContent className="p-5">
                        <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-emerald-300">
                          {page.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-300">{page.bestChoice}</p>
                      </CardContent>
                    </Card>
                  </TrackedLink>
                )
              })}
            </div>
          </section>
        )}

        <section className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Compare first, then act',
              description:
                'These pages help searchers who are still deciding between formats before they reach a converter or optimizer.',
            },
            {
              title: 'Built for internal linking',
              description:
                'Every comparison page routes users into the next best tool, guide, or category hub instead of ending at the answer.',
            },
            {
              title: 'Better for CTR and retention',
              description:
                'Decision-stage content captures broader intent and gives users clearer reasons to keep exploring the site.',
            },
          ].map((item) => (
            <Card key={item.title} className="border-slate-700/40 bg-slate-800/30">
              <CardContent className="p-5">
                <h2 className="mb-2 text-lg font-bold text-white">{item.title}</h2>
                <p className="text-sm leading-relaxed text-slate-400">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  )
}
