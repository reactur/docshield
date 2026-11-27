import type { Metadata } from 'next';
import { AddImageTool } from '@/components/AddImageTool';
import { BeforeAfterCard } from '@/components/BeforeAfterCard';
import { AdSenseBanner } from '@/components/AdSenseBanner';
import { AD_SLOTS } from '@/lib/adsense';
import { ToolPageLayout } from '@/components/ToolPageLayout';

export const metadata: Metadata = {
  title: 'Add Image to PDF Online Free | Place & Resize Images on PDF',
  description:
    'Add images to any page of your PDF. Drag, resize, and copy images across pages. Runs in your browser, no uploads.',
  keywords: ['add image to pdf', 'insert image in pdf', 'add picture to pdf', 'pdf image editor', 'private pdf'],
  alternates: { canonical: '/add-image-pdf' },
};

export default function AddImagePdfPage() {
  return (
    <ToolPageLayout
      title="Add image to PDF"
      subtitle="Place images on any page, drag to move, resize, and copy them across all pages. Everything happens in your browser."
      toolName="Add Image to PDF"
    >
      <AddImageToolWrapper />
    </ToolPageLayout>
  );
}

function AddImageToolWrapper() {
  'use client';
  const { useState } = require('react');
  const [result, setResult] = useState(null);
  return (
    <>
      <AddImageTool onResult={setResult} />
      <BeforeAfterCard result={result} />
      <div className="mt-10 flex justify-center">
        <AdSenseBanner slotId={AD_SLOTS.bannerDesktop} width={728} height={90} className="hidden md:flex" />
        <AdSenseBanner slotId={AD_SLOTS.bannerMobile} width={320} height={50} className="md:hidden" />
      </div>
    </>
  );
}
