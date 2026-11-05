import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import { SiteFooter } from '@/components/SiteFooter';
import { ADSENSE_CLIENT_ID } from '@/lib/adsense';
import { WebMcpTools } from '@/components/WebMcpTools';
import { siteJsonLd } from '@/lib/structured-data';
import { SITE_URL } from '@/lib/site-content';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
        {siteJsonLd.map((node, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
          />
        ))}
        <WebMcpTools />
      </body>
    </html>
  );
}
