'use client';

import { useState } from 'react';
import { PdfToJpgTool } from '@/components/PdfToJpgTool';
import { BeforeAfterCard, type ProcessResult } from '@/components/BeforeAfterCard';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { AdSenseBanner } from '@/components/AdSenseBanner';
import { AD_SLOTS } from '@/lib/adsense';

export function PdfToJpgPage() {
  const [result, setResult] = useState<ProcessResult>(null);
  return (
    <ToolPageLayout
      title="PDF to JPG"
      subtitle="Turn PDF pages into JPG images right in your browser. Pick the pages you want and download them as a ZIP."
      toolName="PDF to JPG"
    >
      <PdfToJpgTool onResult={setResult} />
      <BeforeAfterCard result={result} />
      <div className="mt-10 flex justify-center">
        <AdSenseBanner slotId={AD_SLOTS.bannerDesktop} width={728} height={90} className="hidden md:flex" />
        <AdSenseBanner slotId={AD_SLOTS.bannerMobile} width={320} height={50} className="md:hidden" />
      </div>
    </ToolPageLayout>
  );
}
