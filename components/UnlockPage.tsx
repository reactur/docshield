'use client';

import { useState } from 'react';
import { UnlockTool } from '@/components/UnlockTool';
import { BeforeAfterCard, type ProcessResult } from '@/components/BeforeAfterCard';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { AdSenseBanner } from '@/components/AdSenseBanner';
import { AD_SLOTS } from '@/lib/adsense';

export function UnlockPage() {
  const [result, setResult] = useState<ProcessResult>(null);
  return (
    <ToolPageLayout
      title="Unlock PDF"
      subtitle="Remove a password from a PDF you own. Enter the password once, download the unlocked file — everything stays on your device."
      toolName="Unlock PDF"
    >
      <UnlockTool onResult={setResult} />
      <BeforeAfterCard result={result} />
      <div className="mt-10 flex justify-center">
        <AdSenseBanner slotId={AD_SLOTS.bannerDesktop} width={728} height={90} className="hidden md:flex" />
        <AdSenseBanner slotId={AD_SLOTS.bannerMobile} width={320} height={50} className="md:hidden" />
      </div>
    </ToolPageLayout>
  );
}
