import type { Metadata } from 'next';
import { ToolDirectory } from '@/components/ToolDirectory';

export const metadata: Metadata = {
  title: 'Free Online PDF Tools - Merge, Split, Compress & Edit | DocShield PDF',
  description:
    '13 free PDF tools to merge, split, compress, edit, sign, protect, unlock and convert PDFs directly in your browser. No file uploads or registration required.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Free Online PDF Tools - Merge, Split, Compress & Edit | DocShield PDF',
    description:
      '13 free PDF tools to merge, split, compress, edit, sign, protect, unlock and convert PDFs directly in your browser. No file uploads or registration required.',
    url: '/',
    siteName: 'DocShield PDF',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Free Online PDF Tools | DocShield PDF',
    description:
      '13 free PDF tools that run entirely in your browser. No uploads, no sign-up.',
  },
};

export default function HomePage() {
  return <ToolDirectory defaultTab="split" />;
}
