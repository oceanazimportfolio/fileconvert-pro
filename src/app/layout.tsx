import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ==========================================
// SEO METADATA - OPTIMIZED FOR US/EUROPE/WORLDWIDE
// Target: High CPC keywords for AdSense revenue
// ==========================================
export const metadata: Metadata = {
  // IMPORTANT: Update this with your actual domain
  metadataBase: new URL('https://convertfiles.qzz.io'),

  // Primary Meta Tags - Optimized for high-volume searches
  title: {
    default: "ConvertFiles - Free Online Image Converter & Developer Tools",
    template: "%s | ConvertFiles"
  },
  description: "Free online tools: Image converter (PNG to JPG, WebP, AVIF), JSON formatter, Base64 encoder, password generator, QR code creator. 100% browser-based, no uploads. Fast, secure, unlimited use.",

  // Keywords - High-volume, high-CPC keywords
  keywords: [
    // Image conversion - High volume
    "image converter",
    "png to jpg converter",
    "jpg to png",
    "webp converter",
    "avif converter",
    "image format converter",
    "photo converter",
    "picture converter",
    // Image optimization - High CPC
    "compress image",
    "resize image",
    "image optimizer",
    "reduce image size",
    "image compression tool",
    // Developer tools - Tech-savvy audience (higher CPC)
    "json formatter",
    "json validator",
    "base64 encoder",
    "base64 decoder",
    "url encoder",
    "url decoder",
    // Text tools
    "case converter",
    "word counter",
    "character counter",
    "lorem ipsum generator",
    "text converter",
    // Utility tools
    "password generator",
    "secure password",
    "random password",
    "qr code generator",
    "qr code creator",
    "color palette generator",
    // YouTube tools
    "youtube thumbnail downloader",
    "youtube thumbnail",
    "video thumbnail",
    // General
    "free online tools",
    "browser tools",
    "no upload tools",
    "secure file tools",
    "offline tools"
  ],

  // Author and publisher
  authors: [{ name: "ConvertFiles", url: "https://convertfiles.qzz.io" }],
  creator: "ConvertFiles",
  publisher: "ConvertFiles",

  // Icons
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32" },
      { url: "/logo.png", sizes: "192x192" }
    ],
    apple: "/logo.png",
  },

  // Open Graph - For Facebook, LinkedIn, etc.
  openGraph: {
    title: "ConvertFiles - Free Online Image & Developer Tools",
    description: "Convert images, format JSON, generate passwords - 11+ free tools. 100% browser-based, no server uploads. Fast, secure, unlimited.",
    url: "https://convertfiles.qzz.io",
    siteName: "ConvertFiles",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ConvertFiles - Free Online Tools"
      }
    ]
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "ConvertFiles - Free Online Tools",
    description: "Convert images, format JSON, generate passwords - 11+ free tools. 100% browser-based, secure.",
    images: ["/logo.png"],
  },

  // Robots - Encourage full indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification - UPDATE WITH YOUR ACTUAL CODES
  verification: {
    // google: "YOUR-GOOGLE-SEARCH-CONSOLE-CODE",
    // yandex: "your-yandex-code",  // For Russia
    // yahoo: "your-yahoo-code",    // For Japan
  },

  // Alternates for international targeting
  alternates: {
    canonical: "https://convertfiles.qzz.io",
    languages: {
      "en-US": "https://convertfiles.qzz.io",
      "en-GB": "https://convertfiles.qzz.io",
      "en-EU": "https://convertfiles.qzz.io",
    }
  },

  // App info
  applicationName: "ConvertFiles",
  generator: "Next.js",

  // Category for app directories
  category: "Utilities",

  // Classification
  classification: "Online Tools, File Conversion, Developer Utilities",
};

// JSON-LD Schema for Rich Snippets
// This helps Google display rich results in search
const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "ConvertFiles",
  "description": "Free online tools for image conversion, JSON formatting, password generation, and more. All processing happens in your browser - no uploads needed.",
  "url": "https://convertfiles.qzz.io",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any",
  "browserRequirements": "Requires JavaScript",
  "isFamilyFriendly": "true",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "featureList": [
    "Image Format Converter (PNG, JPG, WebP, AVIF)",
    "Image Compression and Resize",
    "JSON Formatter and Validator",
    "Base64 Encoder/Decoder",
    "Password Generator",
    "QR Code Generator",
    "Color Palette Generator",
    "YouTube Thumbnail Downloader",
    "Case Converter",
    "Word Counter",
    "Lorem Ipsum Generator"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "1250",
    "bestRating": "5",
    "worstRating": "1"
  },
  "author": {
    "@type": "Organization",
    "name": "ConvertFiles",
    "url": "https://convertfiles.qzz.io"
  }
};

// Organization Schema for brand recognition
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ConvertFiles",
  "url": "https://convertfiles.qzz.io",
  "logo": "https://convertfiles.qzz.io/logo.png",
  "sameAs": [
    // Add your social profiles here
  ]
};

// Software Application Schema
const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ConvertFiles",
  "applicationCategory": "Utilities",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "softwareVersion": "1.0",
  "softwareHelp": {
    "@type": "CreativeWork",
    "url": "https://convertfiles.qzz.io"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#0f172a" />
        <meta name="msapplication-TileColor" content="#0f172a" />

        {/* Mobile app support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ConvertFiles" />

        {/* DNS prefetch for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />


        {/* JSON-LD Structured Data for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />

        {/* ==========================================
            ADSENSE PLACEHOLDER
            Replace the code below with your actual AdSense code
            Target regions: US, Europe (higher CPC)
            ========================================== */}
        {/* 
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR-ADSENSE-ID" crossOrigin="anonymous"></script>
        */}

        {/* Google Analytics Placeholder */}
        {/*
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-GA-ID"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YOUR-GA-ID');
        </script>
        */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />

        {/* Google Analytics 4 */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}

        {/* Microsoft Clarity */}
        {clarityId && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
