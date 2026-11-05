import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import { SiteFooter } from '@/components/SiteFooter';
import { ADSENSE_CLIENT_ID } from '@/lib/adsense';
import { SITE_URL, faqs } from '@/lib/site-content';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'DocShield PDF',
  url: SITE_URL,
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  description:
    'Free browser-based PDF tool to split, merge, and redact PDFs. Files are processed on your device and never uploaded.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'DocShield PDF | Free Private PDF Splitter, Merger & Redactor',
  description:
    'Split, merge, and redact PDFs for free. DocShield PDF processes every file inside your browser, so your documents are never uploaded to a server.',
  keywords: [
    'split pdf',
    'merge pdf',
    'redact pdf',
    'private pdf tool',
    'pdf splitter',
    'pdf merger',
    'client-side pdf',
  ],
  openGraph: {
    title: 'DocShield PDF | Free Private PDF Tools',
    description: 'Split, merge, and redact PDFs in your browser. No uploads, no sign-up.',
    url: SITE_URL,
    siteName: 'DocShield PDF',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DocShield PDF | Free Private PDF Tools',
    description: 'Split, merge, and redact PDFs in your browser. No uploads, no sign-up.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1829006952861754"
     crossOrigin="anonymous"></script>
      </head>
      <body className={inter.className}>
        {children}
        <SiteFooter />
        <Script
          async
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </body>
    </html>
  );
}
