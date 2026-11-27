import type { Metadata } from 'next';
import { JpgToPdfPage } from '@/components/JpgToPdfPage';

export const metadata: Metadata = {
  title: 'JPG to PDF Online Free | Convert Images to PDF',
  description:
    'Convert JPG, PNG, and WebP images to a single PDF for free. Reorder, rotate, and set page size, orientation, margins, and fit. Runs entirely in your browser.',
  keywords: ['jpg to pdf', 'png to pdf', 'image to pdf', 'convert jpg to pdf', 'photo to pdf'],
  alternates: { canonical: '/jpg-to-pdf' },
  openGraph: {
    title: 'JPG to PDF Online Free | DocShield PDF',
    description: 'Turn images into a single PDF privately in your browser. No uploads, no sign-up.',
    url: '/jpg-to-pdf',
  },
  twitter: {
    card: 'summary',
    title: 'JPG to PDF Online Free | DocShield PDF',
    description: 'Turn images into a single PDF privately in your browser. No uploads, no sign-up.',
  },
};

export default function JpgToPdfRoute() {
  return <JpgToPdfPage />;
}
