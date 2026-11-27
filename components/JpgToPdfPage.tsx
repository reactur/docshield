'use client';

import { useState } from 'react';
import { JpgToPdfTool } from '@/components/JpgToPdfTool';
import { BeforeAfterCard, type ProcessResult } from '@/components/BeforeAfterCard';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { AdSenseBanner } from '@/components/AdSenseBanner';
import { AD_SLOTS } from '@/lib/adsense';

export function JpgToPdfPage() {
  const [result, setResult] = useState<ProcessResult>(null);
  return (
    <ToolPageLayout
      title="JPG to PDF"
      subtitle="Combine JPG, PNG, or WebP images into a single PDF. Reorder, rotate, and pick page settings — all in your browser."
      toolName="JPG to PDF"
    >
      <JpgToPdfTool onResult={setResult} />
      <BeforeAfterCard result={result} />
      <div className="mt-10 flex justify-center">
        <AdSenseBanner slotId={AD_SLOTS.bannerDesktop} width={728} height={90} className="hidden md:flex" />
        <AdSenseBanner slotId={AD_SLOTS.bannerMobile} width={320} height={50} className="md:hidden" />
      </div>
    </ToolPageLayout>
  );
}
