import type { Metadata } from 'next';
import { MergePage } from '@/components/MergePage';
import { mergePageJsonLd, buildBreadcrumbJsonLd } from '@/lib/structured-data';
import { SITE_URL } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Merge PDF Files Online Free – 100% Private & In-Browser | DocShield',
  description:
    'Combine multiple PDF documents into one seamless file instantly. 100% free, no file size limits, and zero server uploads. Your private documents never leave your browser.',
  keywords: [
    'merge pdf',
    'combine pdf files',
    'merge pdf without upload',
    'free private pdf merger',
    'combine pdf offline',
    'merge large pdf files',
  ],
  alternates: { canonical: 'https://linkverse.in/merge-pdf' },
  openGraph: {
    title: 'Merge PDF Files Online Free – 100% Private & In-Browser | DocShield',
    description:
      'Combine multiple PDF documents into one seamless file instantly. 100% free, no file size limits, and zero server uploads.',
    url: '/merge-pdf',
    siteName: 'DocShield PDF',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Merge PDF Files Online Free – 100% Private | DocShield',
    description:
      'Combine multiple PDFs in your browser. No uploads, no sign-up, no file size limits.',
  },
};

const breadcrumbLd = buildBreadcrumbJsonLd('/merge-pdf', 'Merge PDF');

export default function MergePdfPage() {
  return (
    <>
      {mergePageJsonLd.map((node, index) => (
        <script
          key={`merge-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <MergePage />
    </>
  );
}
