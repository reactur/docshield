'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Zap, Layers, ChevronRight, ShieldCheck, Cpu, FileStack } from 'lucide-react';
import { MergeTool } from '@/components/MergeTool';
import { BeforeAfterCard, type ProcessResult } from '@/components/BeforeAfterCard';
import { MergeSeoContent } from '@/components/MergeSeoContent';
import { AdSenseBanner } from '@/components/AdSenseBanner';
import { AD_SLOTS } from '@/lib/adsense';

const highlights = [
  { icon: Lock, title: 'Zero Server Upload', desc: 'Files never leave your device.' },
  { icon: Cpu, title: 'WebAssembly Speed', desc: 'Local processing with pdf-lib.' },
  { icon: FileStack, title: 'Unlimited File Size', desc: 'Only limited by your device RAM.' },
  { icon: Zap, title: 'Instant Download', desc: 'No queue — your file is ready now.' },
];

export function MergePage() {
  const [result, setResult] = useState<ProcessResult>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-5xl px-4 py-3 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground sm:text-sm">
            <Lock className="h-4 w-4 text-primary" />
            100% Client-Side. Your files never touch a server or leave your device.
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-muted-foreground/60">Tools</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">Merge PDF</span>
        </nav>
      </div>

      <header className="mx-auto max-w-5xl px-4 py-8 text-center">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Merge PDF Files Privately &amp; Instantly
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-balance text-base text-muted-foreground">
          Combine multiple PDFs directly on your device. Fast, unlimited, and completely offline —
          no uploads, no watermarks, no sign-up.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Lock className="h-3.5 w-3.5" /> Zero Server Upload
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <Zap className="h-3.5 w-3.5" /> WebAssembly Speed
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <Layers className="h-3.5 w-3.5" /> Unlimited File Size
          </span>
        </div>
      </header>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-5xl gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <h.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">{h.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <MergeTool onResult={setResult} />

        <BeforeAfterCard result={result} />

        <div className="mt-10">
          <MergeSeoContent />
        </div>

        <div className="mt-10 flex justify-center">
          <AdSenseBanner slotId={AD_SLOTS.bannerDesktop} width={728} height={90} className="hidden md:flex" />
          <AdSenseBanner slotId={AD_SLOTS.bannerMobile} width={320} height={50} className="md:hidden" />
        </div>
      </main>
    </div>
  );
}
