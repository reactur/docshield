import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is DocShield PDF really 100% client-side and private?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. DocShield PDF runs entirely in your browser using JavaScript. Your PDF files are never uploaded to any server, never leave your device, and are discarded from memory the moment you close the tab. There are no API endpoints, no storage, and no tracking of document contents.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I split a large PDF into individual pages for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. Drop any PDF into the Split & Extract tool, choose "Split into Individual Pages," and DocShield generates a ZIP file containing each page as its own standalone PDF. There are no page limits, watermarks, or hidden fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the redaction tool keep sensitive text un-extractable?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'When you draw a blackout box and export, DocShield burns solid black rectangles directly into the PDF page content stream using pdf-lib. This flattens the redaction so that text-selection, copy-paste, and automated text-extraction tools cannot recover the hidden characters beneath the box.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does DocShield PDF work offline?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'After the page loads once, all PDF processing happens locally in your browser, so the tools keep working even if your connection drops. The initial page load needs a connection to fetch the JavaScript bundle and fonts.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you store my files or documents?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. DocShield PDF has no server-side storage whatsoever. Files live only in your browser memory and are released the moment you finish. Nothing is sent anywhere.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I merge more than two PDFs together?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Merge tool accepts any number of PDF files. Drag them into the dropzone, reorder the list with the Up/Down buttons or by dragging, then download a single combined PDF instantly.',
      },
    },
  ],
};

const webAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'DocShield PDF',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'Free, 100% private PDF splitter, merger, and redactor that runs entirely in your browser. No uploads, no servers, no sign-up.',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://docshield.example.com'),
  title: 'DocShield PDF — Free Offline PDF Splitter, Merger & Redactor',
  description:
    'Free, 100% private PDF splitter, merger & redactor. Split PDFs into pages, combine multiple PDFs, and black out sensitive text — all in your browser. No uploads, no servers, works offline.',
  keywords: [
    'free offline pdf splitter',
    'secure pdf redactor online',
    'merge pdf without upload',
    'private pdf tools',
    'client-side pdf editor',
    'redact pdf free',
    'split pdf into individual pages',
  ],
  authors: [{ name: 'DocShield PDF' }],
  openGraph: {
    type: 'website',
    title: 'DocShield PDF — Free, 100% Private PDF Splitter, Merger & Redactor',
    description:
      'Split, merge, and redact PDFs entirely in your browser. Your files never touch a server or leave your device.',
    siteName: 'DocShield PDF',
    url: 'https://docshield.example.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DocShield PDF — Free, 100% Private PDF Splitter, Merger & Redactor',
    description:
      'Split, merge, and redact PDFs entirely in your browser. Your files never touch a server or leave your device.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1829006952861754"
     crossorigin="anonymous"></script>
      </head>
      <body className={inter.className}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </body>
    </html>
  );
}
