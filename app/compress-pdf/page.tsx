import type { Metadata } from 'next';
import { CompressPage } from '@/components/CompressPage';

export const metadata: Metadata = {
  title: 'Compress PDF Online Free | Reduce PDF File Size',
  description:
    'Compress PDF files for free to reduce their file size. Choose your compression level and download instantly — your PDF is never uploaded to a server.',
  keywords: ['compress pdf', 'reduce pdf size', 'pdf compressor', 'shrink pdf', 'make pdf smaller'],
  alternates: { canonical: '/compress-pdf' },
  openGraph: {
    title: 'Compress PDF Online Free | DocShield PDF',
    description: 'Reduce PDF file size privately in your browser. No uploads, no sign-up.',
    url: '/compress-pdf',
  },
};

export default function CompressPdfPage() {
  return <CompressPage />;
}
