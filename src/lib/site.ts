export const SITE_NAME = 'ConvertFiles'
export const SITE_URL = 'https://convertfiles.qzz.io'
export const SITE_DESCRIPTION =
  'Free browser-based tools for image conversion, compression, JSON formatting, password generation, QR codes, Bangla text conversion, and more.'
export const LAST_REVIEWED_DATE = '2026-03-29'
export const CONTENT_REVIEWER = 'ConvertFiles Editorial Team'

export function absoluteUrl(path: string) {
  if (!path) return SITE_URL
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
