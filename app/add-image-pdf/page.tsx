import type { Metadata } from 'next';
import { AddImagePage } from '@/components/AddImagePage';

export const metadata: Metadata = {
  title: 'Add Image to PDF Online Free | Place & Resize Images on PDF',
  description:
    'Add images to any page of your PDF. Drag, resize, and copy images across pages. Runs in your browser, no uploads.',
  keywords: ['add image to pdf', 'insert image in pdf', 'add picture to pdf', 'pdf image editor'],
  alternates: { canonical: '/add-image-pdf' },
};

export default function AddImagePdfPage() {
  return <AddImagePage />;
}
