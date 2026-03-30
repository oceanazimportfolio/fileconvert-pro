import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { guideOrder, guidePages } from '@/lib/discoveryContent'
import { absoluteUrl } from '@/lib/site'
import { Footer } from '@/components/Footer'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CopyPageLinkButton } from '@/components/landing/CopyPageLinkButton'
import { TrackedLink } from '@/components/TrackedLink'
import { ToolIcon } from '@/components/ToolIcon'
import { ArrowRight, CheckCircle2, ListChecks, Sparkles } from 'lucide-react'
import { getToolSlugFromHref } from '@/lib/toolIcons'

export const dynamicParams = false

export async function generateStaticParams() {
  return guideOrder.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const guide = guidePages[slug]

  if (!guide) {
    return { title: 'Guide Not Found | ConvertFiles' }
  }

  const url = absoluteUrl(`/guides/${slug}/`)

  return {
    title: guide.searchTitle,
    description: guide.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: guide.searchTitle,
      description: guide.metaDescription,
      url,
      siteName: 'ConvertFiles',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.searchTitle,
      description: guide.metaDescription,
    },
  }
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const guide = guidePages[slug]

  if (!guide) notFound()

  const url = absoluteUrl(`/guides/${slug}/`)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: absoluteUrl('/guides/') },
      { '@type': 'ListItem', position: 3, name: guide.title, item: url },
    ],
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.searchTitle,
    description: guide.metaDescription,
    mainEntityOfPage: url,
    dateModified: guide.lastReviewed,
    author: { '@type': 'Organization', name: guide.reviewer },
    about: guide.primaryIntent,
  }

  return (
    <div className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <main className="container-standard py-10 md:py-14">
        <section className="mx-auto max-w-4xl">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              {guide.language === 'bn' ? 'Bangla workflow guide' : 'Workflow guide'}
            </Badge>
            <Badge variant="outline" className="border-slate-700 text-slate-300">
              Last reviewed {guide.lastReviewed}
            </Badge>
          </div>

          <h1 className="mb-4 text-balance text-4xl font-black text-white md:text-5xl">{guide.title}</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-300">{guide.intro}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <TrackedLink
              href={`/tools/${guide.toolSlug}/`}
              eventName="organic_guide_cta_click"
              eventParams={{ slug: guide.slug, destination_group: 'tool_page' }}
            >
              <Button className="bg-blue-600 px-6 font-semibold hover:bg-blue-500">
                <ToolIcon slug={guide.toolSlug} className="mr-2 h-4 w-4" />
                Open related tool
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </TrackedLink>
            <CopyPageLinkButton url={url} pageType="guide" slug={guide.slug} />
          </div>
        </section>

        <section className="mt-12 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <Card className="border-slate-700/40 bg-slate-800/35">
              <CardContent className="grid gap-5 p-6 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Example input</p>
                  <p className="text-sm leading-relaxed text-slate-300">{guide.heroExample.input}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Expected output</p>
                  <p className="text-sm leading-relaxed text-slate-300">{guide.heroExample.output}</p>
                </div>
                <div className="md:col-span-2 rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4 text-sm leading-relaxed text-slate-400">
                  {guide.heroExample.note}
                </div>
              </CardContent>
            </Card>

            <section>
              <div className="mb-4 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-blue-400" />
                <h2 className="text-2xl font-black text-white">Step-by-step</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {guide.steps.map((step, index) => (
                  <Card key={step} className="border-slate-700/40 bg-slate-800/35">
                    <CardContent className="p-5">
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/15 text-sm font-black text-blue-300">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-relaxed text-slate-300">{step}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="grid gap-5 md:grid-cols-2">
              <Card className="border-slate-700/40 bg-slate-800/35">
                <CardContent className="p-5">
                  <h2 className="mb-4 text-xl font-bold text-white">When this guide is useful</h2>
                  <ul className="space-y-3">
                    {guide.whenToUse.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-slate-700/40 bg-slate-800/35">
                <CardContent className="p-5">
                  <h2 className="mb-4 text-xl font-bold text-white">When to avoid this path</h2>
                  <ul className="space-y-3">
                    {guide.avoidWhen.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-black text-white">Common use cases</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {guide.useCases.map((useCase) => (
                  <Card key={useCase} className="border-slate-700/40 bg-slate-800/30">
                    <CardContent className="p-4 text-sm leading-relaxed text-slate-300">{useCase}</CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-black text-white">Frequently asked questions</h2>
              <div className="space-y-4">
                {guide.faq.map((item) => (
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
                  {guide.relatedLinks.map((link) => {
                    const toolSlug = getToolSlugFromHref(link.href)

                    return (
                      <TrackedLink
                        key={link.href}
                        href={link.href}
                        eventName="organic_guide_cta_click"
                        eventParams={{ slug: guide.slug, destination_group: 'related_link' }}
                        className="block rounded-2xl border border-slate-700/40 bg-slate-900/45 p-4 transition-colors hover:border-blue-500/35"
                      >
                        <div className="flex items-start gap-3">
                          {toolSlug ? (
                            <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-blue-500/15 bg-blue-500/10">
                              <ToolIcon slug={toolSlug} className="h-4 w-4 text-blue-300" />
                            </div>
                          ) : null}
                          <div>
                            <h3 className="text-sm font-semibold text-white">{link.label}</h3>
                            <p className="mt-1 text-xs leading-relaxed text-slate-400">{link.description}</p>
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
                  Primary intent: <span className="font-semibold text-white">{guide.primaryIntent}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Reviewed by {guide.reviewer} on {guide.lastReviewed}.
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
