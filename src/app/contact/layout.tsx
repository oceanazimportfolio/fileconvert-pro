import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | ConvertFiles',
  description: 'Get in touch with the ConvertFiles team. We welcome your feedback, bug reports, and suggestions for our free online tools.',
  openGraph: {
    title: 'Contact Us | ConvertFiles',
    description: 'Get in touch with the ConvertFiles team for support, feedback or feature requests.',
    url: 'https://convertfiles.qzz.io/contact/',
    siteName: 'ConvertFiles',
    type: 'website',
  },
  alternates: {
    canonical: 'https://convertfiles.qzz.io/contact/',
  }
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
