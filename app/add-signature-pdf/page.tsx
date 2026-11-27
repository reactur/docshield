import type { Metadata } from 'next';
import { AddSignaturePage } from '@/components/AddSignaturePage';

export const metadata: Metadata = {
  title: 'Add Signature to PDF Online Free | Sign PDF Documents',
  description:
    'Draw your signature or upload an image, place it on any page, resize, and copy across pages. Runs in your browser.',
  keywords: ['add signature to pdf', 'sign pdf online', 'draw signature on pdf', 'pdf signature'],
  alternates: { canonical: '/add-signature-pdf' },
};

export default function AddSignaturePdfPage() {
  return <AddSignaturePage />;
}
