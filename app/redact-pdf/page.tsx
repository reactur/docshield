import type { Metadata } from 'next';
import { PdfWorkspace } from '@/components/PdfWorkspace';

export const metadata: Metadata = {
  title: 'PDF Blackout Online Free | Cover Sensitive Info in a PDF',
  description:
    'Draw black boxes over sensitive information in a PDF, free and in your browser. This is a visual blackout, not permanent redaction: the text underneath stays in the file. Check the output before sharing.',
  keywords: ['pdf blackout', 'black out pdf', 'hide text in pdf', 'cover text in pdf'],
  alternates: { canonical: '/redact-pdf' },
  openGraph: {
    title: 'PDF Blackout Online Free | DocShield PDF',
    description: 'Draw black boxes over sensitive areas of a PDF privately in your browser.',
    url: '/redact-pdf',
  },
  twitter: {
    card: 'summary',
    title: 'PDF Blackout Online Free | DocShield PDF',
    description: 'Draw black boxes over sensitive areas of a PDF privately in your browser.',
  },
};

export default function RedactPdfPage() {
  return <PdfWorkspace defaultTab="redact" />;
}
