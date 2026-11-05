import type { Metadata } from 'next';
import { PdfWorkspace } from '@/components/PdfWorkspace';

export const metadata: Metadata = {
  title: 'Free Private PDF Splitter, Merger & Redactor | DocShield PDF',
  description:
    'Split, merge, and redact PDFs for free in your browser. DocShield PDF never uploads your files, so your documents stay on your device.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return <PdfWorkspace defaultTab="split" />;
}
