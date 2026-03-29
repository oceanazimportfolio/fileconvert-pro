import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { RecentlyUsedTools } from '@/components/landing/RecentlyUsedTools'
import { TrackedLink } from '@/components/TrackedLink'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toolsConfig } from '@/app/tools/[slug]/page'
import { categoryHubs } from '@/lib/discoveryContent'
import { absoluteUrl } from '@/lib/site'
import { ArrowRight, Compass, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tool Categories | ConvertFiles',
  description:
    'Browse ConvertFiles by category, including image tools, Bangla workflows, developer utilities, text tools, and lightweight browser utilities.',
  alternates: {
    canonical: absoluteUrl('/categories/'),
  },
  openGraph: {
    title: 'Tool Categories | ConvertFiles',
    description:
      'Discover ConvertFiles through image, Bangla, developer, text, and utility hubs built for clearer browsing and stronger internal linking.',
    url: absoluteUrl('/categories/'),
    siteName: 'ConvertFiles',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tool Categories | ConvertFiles',
    description:
      'Start with a category hub if you know the workflow type but not the exact tool yet.',
  },
}

const hubOrder = ['image-tools', 'bangla-tools', 'developer-tools']

const recentToolItems = Array.from(
  new Set(hubOrder.flatMap((slug) => categoryHubs[slug].featuredSlugs))
)
  .map((slug) => {
    const tool = toolsConfig[slug]
    if (!tool) return null

    return {
      slug,
      title: tool.schemaData.name,
      description: tool.schemaData.description,
    }
  })
  .filter(Boolean)

export default function CategoriesIndexPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: absoluteUrl('/categories/') },
    ],
  }

  return (
    <div className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="container-standard py-10 md:py-14">
        <section className="mx-auto max-w-4xl text-center">
          <Badge className="mb-5 border-blue-500/25 bg-blue-500/10 text-blue-300">
            <Compass className="mr-2 h-3.5 w-3.5" />
            Category hubs
          </Badge>
          <h1 className="mb-4 text-balance text-4xl font-black text-white md:text-5xl">
            Start with the workflow category
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300">
            Category hubs are built for people who know the job but not the exact page name yet. They connect the
            strongest tool pages, decision-stage content, and next-step links inside one curated surface.
          </p>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-2">
          {hubOrder.map((slug) => {
            const hub = categoryHubs[slug]

            return (
              <TrackedLink
                key={slug}
                href={`/categories/${slug}/`}
                eventName="search_click_landing"
                eventParams={{ slug, destination_group: 'category_hub' }}
                className="group h-full"
              >
                <Card className="h-full border-slate-700/40 bg-slate-800/35 transition-all hover:border-blue-500/35 hover:bg-slate-800/55">
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                        <Sparkles className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white transition-colors group-hover:text-blue-300">
                          {hub.title}
                        </h2>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                          {hub.featuredSlugs.length} featured routes
                        </p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-300">{hub.description}</p>
                    <p className="mt-4 text-sm leading-relaxed text-slate-400">
                      <span className="font-semibold text-white">Audience:</span> {hub.audience}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{hub.highlight}</p>
                  </CardContent>
                </Card>
              </TrackedLink>
            )
          })}
        </section>

        <section className="mt-14 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="border-slate-700/40 bg-slate-800/35">
            <CardContent className="p-6 md:p-8">
              <h2 className="mb-4 text-3xl font-black text-white">Why these hubs matter</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: 'Clearer discovery',
                    description:
                      'Users can browse by task family instead of guessing the exact tool name or query variant.',
                  },
                  {
                    title: 'Stronger internal linking',
                    description:
                      'Each hub routes searchers into tools, guides, and comparison pages that reinforce the same topic cluster.',
                  },
                  {
                    title: 'Better repeat usage',
                    description:
                      'A category page can become the return point for people who repeatedly use the same family of tools.',
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-700/40 bg-slate-900/45 p-4">
                    <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <TrackedLink
                  href="/guides/"
                  eventName="search_click_landing"
                  eventParams={{ slug: 'categories-index', destination_group: 'guides' }}
                >
                  <Button className="bg-blue-600 px-6 font-semibold hover:bg-blue-500">
                    Browse guides
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </TrackedLink>
                <TrackedLink
                  href="/compare/"
                  eventName="search_click_landing"
                  eventParams={{ slug: 'categories-index', destination_group: 'compare' }}
                >
                  <Button variant="outline" className="border-slate-700 px-6 text-slate-200 hover:text-white">
                    Open comparisons
                  </Button>
                </TrackedLink>
              </div>
            </CardContent>
          </Card>

          <RecentlyUsedTools items={recentToolItems} />
        </section>
      </main>

      <Footer />
    </div>
  )
}
