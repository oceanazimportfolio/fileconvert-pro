'use client'

import { useState } from 'react'
import { AlertCircle, ExternalLink } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  detectEmbeddedBrowser,
  type BrowserCompatibilityInfo,
} from '@/lib/browserCompatibility'
import { cn } from '@/lib/utils'

type EmbeddedBrowserNoticeContext = 'upload' | 'download' | 'processing'

interface EmbeddedBrowserNoticeProps {
  context: EmbeddedBrowserNoticeContext
  className?: string
}

const noticeCopy: Record<EmbeddedBrowserNoticeContext, (browser: BrowserCompatibilityInfo) => { title: string; body: string }> = {
  upload: (browser) => ({
    title: `Open in browser for more reliable uploads`,
    body: `Uploads and photo pickers may not work reliably in ${browser.label}'s in-app browser.`,
  }),
  download: (browser) => ({
    title: `Open in browser for easier downloads`,
    body: `Downloads may not start reliably in ${browser.label}'s in-app browser.`,
  }),
  processing: (browser) => ({
    title: `Open in browser for best tool support`,
    body: `Image processing can be less reliable in ${browser.label}'s in-app browser, especially for heavier tools.`,
  }),
}

export function EmbeddedBrowserNotice({
  context,
  className,
}: EmbeddedBrowserNoticeProps) {
  const [browserInfo] = useState<BrowserCompatibilityInfo>(() => (
    detectEmbeddedBrowser(typeof window === 'undefined' ? '' : window.navigator.userAgent)
  ))

  if (!browserInfo?.isEmbeddedBrowser) {
    return null
  }

  const copy = noticeCopy[context](browserInfo)

  const handleOpenInBrowser = () => {
    const currentUrl = window.location.href
    const openedWindow = window.open(currentUrl, '_blank', 'noopener,noreferrer')

    if (!openedWindow) {
      window.location.href = currentUrl
    }
  }

  return (
    <Alert className={cn('border-amber-500/30 bg-amber-500/8 text-amber-50', className)}>
      <AlertCircle className="text-amber-400" />
      <AlertTitle className="text-sm font-semibold text-amber-100">
        {copy.title}
      </AlertTitle>
      <AlertDescription className="gap-3 text-amber-50/85">
        <p>{copy.body} For best results, open this page in Chrome or your default browser.</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            size="sm"
            onClick={handleOpenInBrowser}
            className="w-full sm:w-auto"
          >
            Open in Chrome / browser
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
          <p className="text-xs text-amber-50/70">
            If it opens inside the app again, use the menu and choose Open in browser.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  )
}
