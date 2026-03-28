export type EmbeddedBrowserKind = 'messenger' | 'facebook' | 'instagram' | 'unknown' | null

export interface BrowserCompatibilityInfo {
  isEmbeddedBrowser: boolean
  kind: EmbeddedBrowserKind
  label: string
  likelyUploadIssues: boolean
  likelyDownloadIssues: boolean
  likelyClipboardIssues: boolean
  likelyCanvasIssues: boolean
}

const defaultCompatibilityInfo: BrowserCompatibilityInfo = {
  isEmbeddedBrowser: false,
  kind: null,
  label: 'browser',
  likelyUploadIssues: false,
  likelyDownloadIssues: false,
  likelyClipboardIssues: false,
  likelyCanvasIssues: false,
}

export function detectEmbeddedBrowser(userAgent: string = ''): BrowserCompatibilityInfo {
  if (!userAgent) {
    return defaultCompatibilityInfo
  }

  const normalizedUserAgent = userAgent.toLowerCase()
  const isMessenger = /messenger|fban\/messenger|fb_iab\/messenger/.test(normalizedUserAgent)
  const isInstagram = /instagram/.test(normalizedUserAgent)
  const isFacebook = /fban|fbav|fb_iab|fb4a/.test(normalizedUserAgent)

  if (!isMessenger && !isInstagram && !isFacebook) {
    return defaultCompatibilityInfo
  }

  if (isMessenger) {
    return {
      isEmbeddedBrowser: true,
      kind: 'messenger',
      label: 'Messenger',
      likelyUploadIssues: true,
      likelyDownloadIssues: true,
      likelyClipboardIssues: true,
      likelyCanvasIssues: true,
    }
  }

  if (isInstagram) {
    return {
      isEmbeddedBrowser: true,
      kind: 'instagram',
      label: 'Instagram',
      likelyUploadIssues: true,
      likelyDownloadIssues: true,
      likelyClipboardIssues: true,
      likelyCanvasIssues: true,
    }
  }

  if (isFacebook) {
    return {
      isEmbeddedBrowser: true,
      kind: 'facebook',
      label: 'Facebook',
      likelyUploadIssues: true,
      likelyDownloadIssues: true,
      likelyClipboardIssues: true,
      likelyCanvasIssues: true,
    }
  }

  return {
    isEmbeddedBrowser: true,
    kind: 'unknown',
    label: 'in-app',
    likelyUploadIssues: true,
    likelyDownloadIssues: true,
    likelyClipboardIssues: true,
    likelyCanvasIssues: true,
  }
}
