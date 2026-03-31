import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { CopyPageLinkButton } from '@/components/landing/CopyPageLinkButton'
import { TrackedLink } from '@/components/TrackedLink'
import { ToolIcon } from '@/components/ToolIcon'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { comparisonOrder, comparisonPages } from '@/lib/discoveryContent'
import { absoluteUrl } from '@/lib/site'
import { ArrowRight, CheckCircle2, Scale, Sparkles } from 'lucide-react'
import { getToolSlugFromHref } from '@/lib/toolIcons'

export const dynamicParams = false

export async function generateStaticParams() {
  return comparisonOrder.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = comparisonPages[slug]

  if (!page) {
    return { title: 'Comparison Not Found | ConvertFiles' }
  }

  const url = absoluteUrl(`/compare/${slug}/`)

  return {
    title: page.searchTitle,
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: page.searchTitle,
      description: page.metaDescription,
      url,
      siteName: 'ConvertFiles',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.searchTitle,
      description: page.metaDescription,
    },
  }
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = comparisonPages[slug]

  if (!page) notFound()

  const url = absoluteUrl(`/compare/${slug}/`)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: absoluteUrl('/compare/') },
      { '@type': 'ListItem', position: 3, name: page.title, item: url },
    ],
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.searchTitle,
    description: page.metaDescription,
    mainEntityOfPage: url,
    dateModified: page.lastReviewed,
    author: { '@type': 'Organization', name: page.reviewer },
    about: page.primaryIntent,
  }

  const primaryToolSlug = page.relatedLinks[0] ? getToolSlugFromHref(page.relatedLinks[0].href) : null
  const [leftOption = 'Option A', rightOption = 'Option B'] = page.title.split(' vs ')

  return (
    <div className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <main className="container-standard py-10 md:py-14">
        <section className="mx-auto max-w-4xl">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge className="border-amber-500/25 bg-amber-500/10 text-amber-300">
              <Scale className="mr-2 h-3.5 w-3.5" />
              {page.language === 'bn' ? 'Bangla comparison' : 'Format comparison'}
            </Badge>
            <Badge variant="outline" className="border-slate-700 text-slate-300">
              Last reviewed {page.lastReviewed}
            </Badge>
          </div>

          <h1 className="mb-4 text-balance text-4xl font-black text-white md:text-5xl">{page.title}</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-300">{page.summary}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {page.relatedLinks[0] && (
              <TrackedLink
                href={page.relatedLinks[0].href}
                eventName="search_click_landing"
                eventParams={{ slug: page.slug, destination_group: 'primary_related_link' }}
              >
                <Button className="bg-blue-600 px-6 font-semibold hover:bg-blue-500">
                  {primaryToolSlug ? <ToolIcon slug={primaryToolSlug} className="mr-2 h-4 w-4" /> : null}
                  Try the next step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </TrackedLink>
            )}
            <CopyPageLinkButton url={url} pageType="compare" slug={page.slug} />
          </div>
        </section>

        <section className="mt-12 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <Card className="border-slate-700/40 bg-slate-800/35">
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <h2 className="text-xl font-bold text-white">Best quick answer</h2>
                </div>
                <p className="text-base leading-relaxed text-slate-300">{page.bestChoice}</p>
              </CardContent>
            </Card>

            <section>
              <h2 className="mb-4 text-2xl font-black text-white">Side-by-side comparison</h2>
              <div className="space-y-3 md:hidden">
                {page.comparisonRows.map((row) => (
                  <Card key={row.label} className="overflow-hidden border-slate-700/40 bg-slate-800/25">
                    <CardContent className="p-0">
                      <div className="border-b border-slate-700/30 bg-slate-900/70 px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                        {row.label}
                      </div>
                      <div className="grid gap-0">
                        <div className="px-4 py-3">
                          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{leftOption}</p>
                          <p className="text-sm leading-relaxed text-slate-300">{row.left}</p>
                        </div>
                        <div className="border-t border-slate-700/30 px-4 py-3">
                          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{rightOption}</p>
                          <p className="text-sm leading-relaxed text-slate-300">{row.right}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="hidden overflow-hidden rounded-3xl border border-slate-700/40 md:block">
                <div className="overflow-x-auto">
                  <div className="min-w-[720px]">
                    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-slate-700/40 bg-slate-900/70">
                      <div className="p-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Criteria</div>
                      <div className="border-l border-slate-700/40 p-4 text-sm font-bold text-white">{leftOption}</div>
                      <div className="border-l border-slate-700/40 p-4 text-sm font-bold text-white">{rightOption}</div>
                    </div>

                    {page.comparisonRows.map((row) => (
                      <div
                        key={row.label}
                        className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] border-t border-slate-700/30 bg-slate-800/25"
                      >
                        <div className="p-4 text-sm font-semibold text-slate-200">{row.label}</div>
                        <div className="border-l border-slate-700/30 p-4 text-sm leading-relaxed text-slate-300">{row.left}</div>
                        <div className="border-l border-slate-700/30 p-4 text-sm leading-relaxed text-slate-300">{row.right}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-black text-white">Winner scenarios</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {page.winnerScenarios.map((item) => (
                  <Card key={item} className="border-slate-700/40 bg-slate-800/30">
                    <CardContent className="flex items-start gap-3 p-5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                      <p className="text-sm leading-relaxed text-slate-300">{item}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-black text-white">Frequently asked questions</h2>
              <div className="space-y-4">
                {page.faq.map((item) => (
                  <Card key={item.q} className="border-slate-700/40 bg-slate-800/30">
                    <CardContent className="p-5">
                      <h3 className="mb-2 text-base font-semibold text-white">{item.q}</h3>
                      <p className="text-sm leading-relaxed text-slate-300">{item.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <Card className="border-slate-700/40 bg-slate-800/35">
              <CardContent className="p-5">
                <h2 className="mb-3 text-xl font-bold text-white">Use this next</h2>
                <div className="space-y-3">
                  {page.relatedLinks.map((link) => {
                    const toolSlug = getToolSlugFromHref(link.href)

                    return (
                      <TrackedLink
                        key={link.href}
                        href={link.href}
                        eventName="search_click_landing"
                        eventParams={{ slug: page.slug, destination_group: 'related_link' }}
                        className="block rounded-2xl border border-slate-700/40 bg-slate-900/45 p-4 transition-colors hover:border-blue-500/35"
                      >
                        <div className="flex items-start gap-2.5 sm:gap-3">
                          {toolSlug ? (
                            <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-blue-500/15 bg-blue-500/10 sm:h-9 sm:w-9 sm:rounded-xl">
                              <ToolIcon slug={toolSlug} className="h-4 w-4 text-blue-300" />
                            </div>
                          ) : null}
                          <div className="min-w-0 flex-1">
                            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">{link.label}</h3>
                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">{link.description}</p>
                          </div>
                        </div>
                      </TrackedLink>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-700/40 bg-slate-800/35">
              <CardContent className="p-5">
                <h2 className="mb-3 text-xl font-bold text-white">Editorial notes</h2>
                <p className="text-sm leading-relaxed text-slate-300">
                  Primary intent: <span className="font-semibold text-white">{page.primaryIntent}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Reviewed by {page.reviewer} on {page.lastReviewed}.
                </p>
              </CardContent>
            </Card>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  )
}
