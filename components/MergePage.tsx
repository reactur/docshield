'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Zap, Layers, ChevronRight, ShieldCheck } from 'lucide-react';
import { MergeTool } from '@/components/MergeTool';
import { BeforeAfterCard, type ProcessResult } from '@/components/BeforeAfterCard';
import { MergeSeoContent } from '@/components/MergeSeoContent';
import { MergeSuccessModal } from '@/components/MergeSuccessModal';
import { AdSenseBanner } from '@/components/AdSenseBanner';
import { AD_SLOTS } from '@/lib/adsense';

export function MergePage() {
  const [result, setResult] = useState<ProcessResult>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Privacy banner */}
      <div className="border-b border-border bg-primary/5">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center">
          <Lock className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-foreground sm:text-sm">
            100% Client-Side. Your files never touch a server or leave your device.
          </span>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-muted-foreground/60">Tools</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">Merge PDF</span>
        </nav>
      </div>

      {/* Hero */}
      <header className="mx-auto max-w-7xl px-4 pb-6 pt-6 text-center">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          Merge PDF Files Privately &amp; Instantly
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-balance text-sm text-muted-foreground sm:text-base">
          Combine multiple PDFs directly on your device. Fast, unlimited, and completely offline.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Lock className="h-3.5 w-3.5" /> Zero Server Upload
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <Zap className="h-3.5 w-3.5" /> WebAssembly Speed
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Layers className="h-3.5 w-3.5" /> Unlimited File Size
          </span>
        </div>
      </header>

      {/* Main content with sidebar ads */}
      <main className="mx-auto flex max-w-7xl gap-6 px-4 pb-16">
        {/* Left sidebar ad — hidden below xl */}
        <aside className="hidden w-[300px] shrink-0 xl:block">
          <div className="sticky top-20">
            <AdSenseBanner slotId={AD_SLOTS.sidebarLeft} width={300} height={600} />
          </div>
        </aside>

        {/* Center column */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* The interactive merge tool */}
          <MergeTool
            onResult={setResult}
            onMergeComplete={() => setModalOpen(true)}
          />

          {/* Leaderboard ad below the workbench */}
          <div className="flex justify-center">
            <AdSenseBanner
              slotId={AD_SLOTS.bannerDesktop}
              width={728}
              height={90}
              className="hidden md:flex"
            />
          </div>
          <div className="flex justify-center">
            <AdSenseBanner
              slotId={AD_SLOTS.bannerMobile}
              width={320}
              height={50}
              className="md:hidden"
            />
          </div>

          {/* Process result summary */}
          <BeforeAfterCard result={result} />

          {/* SEO / GEO content */}
          <MergeSeoContent />
        </div>

        {/* Right sidebar ad — hidden below xl */}
        <aside className="hidden w-[300px] shrink-0 xl:block">
          <div className="sticky top-20">
            <AdSenseBanner slotId={AD_SLOTS.sidebarRight} width={300} height={600} />
          </div>
        </aside>
      </main>

      {/* Success modal with embedded ad */}
      <MergeSuccessModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        result={result}
      />
    </div>
  );
}
