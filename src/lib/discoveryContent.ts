import { englishConversionGuides } from '@/lib/guides-en-conversion'
import { englishWorkflowGuides } from '@/lib/guides-en-workflows'
import { banglaGuides } from '@/lib/guides-bangla'
import { comparisonPages } from '@/lib/comparisons'
import { categoryHubs } from '@/lib/categoryHubs'

export { comparisonPages, categoryHubs }

export const guidePages = {
  ...englishConversionGuides,
  ...englishWorkflowGuides,
  ...banglaGuides,
}

export const guideOrder = [
  'how-to-convert-webp-to-png',
  'how-to-convert-png-to-jpg',
  'how-to-convert-jpg-to-png',
  'how-to-make-a-transparent-png',
  'how-to-convert-jfif-to-png',
  'reduce-image-size-for-website',
  'reduce-image-size-for-email',
  'remove-background-from-product-photo',
  'best-format-for-website-images',
  'bijoy-to-unicode-online',
  'unicode-to-bijoy-online',
  'fix-broken-bangla-font-conversion',
]

export const comparisonOrder = [
  'png-vs-jpg',
  'webp-vs-png',
  'bijoy-vs-unicode',
  'json-formatter-vs-json-validator',
]
