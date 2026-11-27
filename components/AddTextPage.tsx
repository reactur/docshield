'use client';

import { useState } from 'react';
import { AddTextTool } from '@/components/AddTextTool';
import { BeforeAfterCard, type ProcessResult } from '@/components/BeforeAfterCard';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { AdSenseBanner } from '@/components/AdSenseBanner';
import { AD_SLOTS } from '@/lib/adsense';

export function AddTextPage() {
  const [result, setResult] = useState<ProcessResult>(null);
  return (
    <ToolPageLayout
      title="Add text to PDF"
      subtitle="Type text onto any page, choose size and color, drag to position, and copy across pages. Runs in your browser."
      toolName="Add Text to PDF"
    >
      <AddTextTool onResult={setResult} />
      <BeforeAfterCard result={result} />
      <div className="mt-10 flex justify-center">
        <AdSenseBanner slotId={AD_SLOTS.bannerDesktop} width={728} height={90} className="hidden md:flex" />
        <AdSenseBanner slotId={AD_SLOTS.bannerMobile} width={320} height={50} className="md:hidden" />
      </div>
    </ToolPageLayout>
  );
}
