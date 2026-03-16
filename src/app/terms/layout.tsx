import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | ConvertFiles',
  description: 'Read the Terms of Service for using ConvertFiles online tools. Information regarding usage rights, responsibilities, and service guidelines.',
  openGraph: {
    title: 'Terms of Service | ConvertFiles',
    description: 'Terms of Service and usage guidelines for ConvertFiles.',
    url: 'https://convertfiles.qzz.io/terms/',
    siteName: 'ConvertFiles',
    type: 'website',
  },
  alternates: {
    canonical: 'https://convertfiles.qzz.io/terms/',
  }
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
