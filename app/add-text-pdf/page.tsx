import type { Metadata } from 'next';
import { AddTextPage } from '@/components/AddTextPage';

export const metadata: Metadata = {
  title: 'Add Text to PDF Online Free | Write on PDF Pages',
  description:
    'Type text onto any page of your PDF. Choose font size and color, drag to position, copy across pages. Runs in your browser.',
  keywords: ['add text to pdf', 'write on pdf', 'type on pdf', 'pdf text editor'],
  alternates: { canonical: '/add-text-pdf' },
};

export default function AddTextPdfPage() {
  return <AddTextPage />;
}
