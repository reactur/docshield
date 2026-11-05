import type { Metadata } from 'next';
import { PdfWorkspace } from '@/components/PdfWorkspace';

export const metadata: Metadata = {
  title: 'Split PDF Online Free | Extract & Split Pages Privately',
  description:
    'Split a PDF into single pages or extract selected pages for free. Runs in your browser, so your PDF is never uploaded to a server.',
  keywords: ['split pdf', 'split pdf online free', 'extract pdf pages', 'pdf splitter', 'private pdf split'],
  alternates: { canonical: '/split-pdf' },
  openGraph: {
    title: 'Split PDF Online Free | DocShield PDF',
    description: 'Split or extract PDF pages privately in your browser. No uploads, no sign-up.',
    url: '/split-pdf',
  },
};

export default function SplitPdfPage() {
  return <PdfWorkspace defaultTab="split" />;
}
