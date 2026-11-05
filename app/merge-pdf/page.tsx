import type { Metadata } from 'next';
import { PdfWorkspace } from '@/components/PdfWorkspace';

export const metadata: Metadata = {
  title: 'Merge PDF Files Online Free | Combine PDFs Privately',
  description:
    'Merge multiple PDF files into one for free, right in your browser. Reorder pages and download instantly. Your files are never uploaded.',
  keywords: ['merge pdf', 'merge pdf online free', 'combine pdf files', 'pdf merger', 'private pdf merge'],
  alternates: { canonical: '/merge-pdf' },
  openGraph: {
    title: 'Merge PDF Files Online Free | DocShield PDF',
    description: 'Combine PDF files privately in your browser. No uploads, no sign-up.',
    url: '/merge-pdf',
  },
};

export default function MergePdfPage() {
  return <PdfWorkspace defaultTab="merge" />;
}
