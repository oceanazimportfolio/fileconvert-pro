import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { CopyPageLinkButton } from '@/components/landing/CopyPageLinkButton'
import { TrackedLink } from '@/components/TrackedLink'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toolsConfig } from '@/app/tools/[slug]/page'
import { categoryHubs, comparisonPages, guidePages, guideOrder } from '@/lib/discoveryContent'
import { absoluteUrl } from '@/lib/site'
import { ArrowRight, Compass, Sparkles } from 'lucide-react'

const comparisonByHub: Record<string, string[]> = {
  'image-tools': ['png-vs-jpg', 'webp-vs-png'],
  'developer-tools': ['json-formatter-vs-json-validator'],
  'bangla-tools': ['bijoy-vs-unicode'],
}

export const dynamicParams = false

export async function generateStaticParams() {
  return Object.keys(categoryHubs).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const hub = categoryHubs[slug]

  if (!hub) {
    return { title: 'Category Not Found | ConvertFiles' }
  }

  const url = absoluteUrl(`/categories/${slug}/`)

  return {
    title: `${hub.title} | ConvertFiles`,
    description: hub.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${hub.title} | ConvertFiles`,
      description: hub.metaDescription,
      url,
      siteName: 'ConvertFiles',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${hub.title} | ConvertFiles`,
      description: hub.metaDescription,
    },
  }
}

export default async function CategoryHubPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const hub = categoryHubs[slug]

  if (!hub) notFound()

  const url = absoluteUrl(`/categories/${slug}/`)
  const featuredTools = hub.featuredSlugs
    .map((toolSlug) => {
      const tool = toolsConfig[toolSlug]
      if (!tool) return null

      return {
        slug: toolSlug,
        title: tool.schemaData.name,
        description: tool.schemaData.description,
      }
    })
    .filter(Boolean) as Array<{ slug: string; title: string; description: string }>

  const relatedGuides = guideOrder
    .map((guideSlug) => guidePages[guideSlug])
    .filter((guide) => hub.featuredSlugs.includes(guide.toolSlug))
    .slice(0, 4)

  const relatedComparisons = (comparisonByHub[slug] || [])
    .map((comparisonSlug) => comparisonPages[comparisonSlug])
    .filter(Boolean)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: absoluteUrl('/categories/') },
      { '@type': 'ListItem', position: 3, name: hub.title, item: url },
    ],
  }

  return (
    <div className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="container-standard py-10 md:py-14">
        <section className="mx-auto max-w-4xl">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge className="border-blue-500/25 bg-blue-500/10 text-blue-300">
              <Compass className="mr-2 h-3.5 w-3.5" />
              Category hub
            </Badge>
            <Badge variant="outline" className="border-slate-700 text-slate-300">
              {featuredTools.length} featured tools
            </Badge>
          </div>

          <h1 className="mb-4 text-balance text-4xl font-black text-white md:text-5xl">{hub.title}</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-300">{hub.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {featuredTools[0] && (
              <TrackedLink
                href={`/tools/${featuredTools[0].slug}/`}
                eventName="search_click_landing"
                eventParams={{ slug: hub.slug, destination_group: 'primary_tool' }}
              >
                <Button className="bg-blue-600 px-6 font-semibold hover:bg-blue-500">
                  Open featured tool
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </TrackedLink>
            )}
            <CopyPageLinkButton url={url} pageType="category" slug={hub.slug} />
          </div>
        </section>

        <section className="mt-12 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <Card className="border-slate-700/40 bg-slate-800/35">
              <CardContent className="p-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Audience</p>
                <p className="text-sm leading-relaxed text-slate-300">{hub.audience}</p>
                <div className="mt-5 rounded-2xl border border-slate-700/40 bg-slate-900/45 p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Why this hub matters</p>
                  <p className="text-sm leading-relaxed text-slate-300">{hub.highlight}</p>
                </div>
              </CardContent>
            </Card>

            <section>
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <h2 className="text-2xl font-black text-white">Featured tools</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {featuredTools.map((tool) => (
                  <TrackedLink
                    key={tool.slug}
                    href={`/tools/${tool.slug}/`}
                    eventName="search_click_landing"
                    eventParams={{ slug: hub.slug, destination_group: 'featured_tool' }}
                    className="group h-full"
                  >
                    <Card className="h-full border-slate-700/40 bg-slate-800/30 transition-all hover:border-blue-500/35 hover:bg-slate-800/55">
                      <CardContent className="p-5">
                        <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-blue-300">
                          {tool.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-400">{tool.description}</p>
                      </CardContent>
                    </Card>
                  </TrackedLink>
                ))}
              </div>
            </section>

            {relatedGuides.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-black text-white">Useful guides in this cluster</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {relatedGuides.map((guide) => (
                    <TrackedLink
                      key={guide.slug}
                      href={`/guides/${guide.slug}/`}
                      eventName="search_click_landing"
                      eventParams={{ slug: hub.slug, destination_group: 'cluster_guide' }}
                      className="group h-full"
                    >
                      <Card className="h-full border-slate-700/40 bg-slate-800/30 transition-all hover:border-emerald-500/30 hover:bg-slate-800/55">
                        <CardContent className="p-5">
                          <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-emerald-300">
                            {guide.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-slate-400">{guide.description}</p>
                        </CardContent>
                      </Card>
                    </TrackedLink>
                  ))}
                </div>
              </section>
            )}

            {relatedComparisons.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-black text-white">Compare before choosing</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {relatedComparisons.map((page) => (
                    <TrackedLink
                      key={page.slug}
                      href={`/compare/${page.slug}/`}
                      eventName="search_click_landing"
                      eventParams={{ slug: hub.slug, destination_group: 'cluster_compare' }}
                      className="group h-full"
                    >
                      <Card className="h-full border-slate-700/40 bg-slate-800/30 transition-all hover:border-amber-500/30 hover:bg-slate-800/55">
                        <CardContent className="p-5">
                          <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-amber-300">
                            {page.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-slate-400">{page.summary}</p>
                        </CardContent>
                      </Card>
                    </TrackedLink>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-5">
            <Card className="border-slate-700/40 bg-slate-800/35">
              <CardContent className="p-5">
                <h2 className="mb-3 text-xl font-bold text-white">Use this next</h2>
                <div className="space-y-3">
                  {hub.relatedLinks.map((link) => (
                    <TrackedLink
                      key={link.href}
                      href={link.href}
                      eventName="search_click_landing"
                      eventParams={{ slug: hub.slug, destination_group: 'related_link' }}
                      className="block rounded-2xl border border-slate-700/40 bg-slate-900/45 p-4 transition-colors hover:border-blue-500/35"
                    >
                      <h3 className="text-sm font-semibold text-white">{link.label}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">{link.description}</p>
                    </TrackedLink>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  )
}
