import type { Metadata } from 'next';
import { WatermarkPage } from '@/components/WatermarkPage';

export const metadata: Metadata = {
  title: 'Add Watermark to PDF Online Free | Stamp PDF Pages',
  description:
    'Add a text watermark to every page of your PDF with custom size, color, opacity, and rotation. Runs in your browser.',
  keywords: ['add watermark to pdf', 'watermark pdf', 'stamp pdf', 'pdf watermark tool'],
  alternates: { canonical: '/watermark-pdf' },
};

export default function WatermarkPdfPage() {
  return <WatermarkPage />;
}
