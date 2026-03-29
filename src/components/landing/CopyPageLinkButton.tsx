'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { trackShareClick } from '@/lib/analytics'
import { Check, Link2 } from 'lucide-react'

interface CopyPageLinkButtonProps {
  url: string
  pageType: 'tool' | 'guide' | 'compare' | 'category'
  slug: string
  label?: string
}

export function CopyPageLinkButton({
  url,
  pageType,
  slug,
  label = 'Copy page link',
}: CopyPageLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      variant="outline"
      className="border-slate-700 text-slate-200 hover:text-white"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url)
          trackShareClick(pageType, slug, 'copy_link')
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1800)
        } catch {
          // Clipboard can fail silently in unsupported contexts.
        }
      }}
    >
      {copied ? <Check className="mr-2 h-4 w-4" /> : <Link2 className="mr-2 h-4 w-4" />}
      {copied ? 'Link copied' : label}
    </Button>
  )
}
