import type { Metadata } from 'next';
import { PdfToJpgPage } from '@/components/PdfToJpgPage';

export const metadata: Metadata = {
  title: 'PDF to JPG Online Free | Convert PDF Pages to Images',
  description:
    'Convert PDF pages to JPG images for free. Choose the pages you need and download them as a ZIP — everything runs in your browser, nothing is uploaded.',
  keywords: ['pdf to jpg', 'pdf to image', 'convert pdf to jpg', 'pdf to jpeg', 'pdf page to picture'],
  alternates: { canonical: '/pdf-to-jpg' },
  openGraph: {
    title: 'PDF to JPG Online Free | DocShield PDF',
    description: 'Convert PDF pages to JPG images privately in your browser. No uploads, no sign-up.',
    url: '/pdf-to-jpg',
  },
};

export default function PdfToJpgRoute() {
  return <PdfToJpgPage />;
}
