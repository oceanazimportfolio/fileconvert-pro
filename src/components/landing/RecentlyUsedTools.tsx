'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrackedLink } from '@/components/TrackedLink'
import { ToolIcon } from '@/components/ToolIcon'
import { Clock3 } from 'lucide-react'

interface ToolItem {
  slug: string
  title: string
  description: string
}

interface RecentlyUsedToolsProps {
  items?: ToolItem[]
  title?: string
  description?: string
}

export function RecentlyUsedTools({
  items = [],
  title = 'Recently used tools',
  description = 'Jump back into the tools you opened most recently on this device.',
}: RecentlyUsedToolsProps) {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const stored = window.localStorage.getItem('convertfiles_recent_tools')
      if (!stored) return

      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        setRecentSlugs(parsed.filter((value): value is string => typeof value === 'string'))
      }
    } catch {
      // ignore malformed local storage
    }
  }, [])

  const recentItems = useMemo(() => {
    const lookup = new Map(items.map((item) => [item.slug, item]))
    return recentSlugs.map((slug) => lookup.get(slug)).filter((item): item is ToolItem => Boolean(item)).slice(0, 4)
  }, [items, recentSlugs])

  if (recentItems.length === 0) return null

  return (
    <section className="mt-12 rounded-3xl border border-slate-700/40 bg-slate-800/30 p-6 md:p-8">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-600/50 bg-slate-900/60">
          <Clock3 className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">{description}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {recentItems.map((item) => (
          <TrackedLink
            key={item.slug}
            href={`/tools/${item.slug}/`}
            eventName="recent_tool_click"
            eventParams={{ tool_slug: item.slug, module: 'recent_tools' }}
            className="group"
          >
            <Card className="h-full border-slate-700/35 bg-slate-900/45 transition-colors hover:border-amber-400/35 hover:bg-slate-900/70">
              <CardContent className="p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                  <ToolIcon slug={item.slug} className="h-4 w-4 text-amber-300" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-white transition-colors group-hover:text-amber-300">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">{item.description}</p>
              </CardContent>
            </Card>
          </TrackedLink>
        ))}
      </div>
    </section>
  )
}
