'use client';

import { useState } from 'react';
import { AddImageTool } from '@/components/AddImageTool';
import { BeforeAfterCard, type ProcessResult } from '@/components/BeforeAfterCard';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { AdSenseBanner } from '@/components/AdSenseBanner';
import { AD_SLOTS } from '@/lib/adsense';

export function AddImagePage() {
  const [result, setResult] = useState<ProcessResult>(null);
  return (
    <ToolPageLayout
      title="Add image to PDF"
      subtitle="Place images on any page, drag to move, resize, and copy them across all pages. Everything happens in your browser."
      toolName="Add Image to PDF"
    >
      <AddImageTool onResult={setResult} />
      <BeforeAfterCard result={result} />
      <div className="mt-10 flex justify-center">
        <AdSenseBanner slotId={AD_SLOTS.bannerDesktop} width={728} height={90} className="hidden md:flex" />
        <AdSenseBanner slotId={AD_SLOTS.bannerMobile} width={320} height={50} className="md:hidden" />
      </div>
    </ToolPageLayout>
  );
}
