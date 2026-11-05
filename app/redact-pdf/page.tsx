import type { Metadata } from 'next';
import { PdfWorkspace } from '@/components/PdfWorkspace';

export const metadata: Metadata = {
  title: 'Redact PDF Online Free | Black Out Sensitive Info Privately',
  description:
    'Draw black redaction boxes over sensitive information in a PDF, free and in your browser. Check the exported file before sharing, because the text underneath may remain.',
  keywords: ['redact pdf', 'redact pdf online free', 'black out pdf', 'pdf redaction tool', 'private pdf redaction'],
  alternates: { canonical: '/redact-pdf' },
  openGraph: {
    title: 'Redact PDF Online Free | DocShield PDF',
    description: 'Black out sensitive areas of a PDF privately in your browser.',
    url: '/redact-pdf',
  },
};

export default function RedactPdfPage() {
  return <PdfWorkspace defaultTab="redact" />;
}
