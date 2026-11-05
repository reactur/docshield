'use client';

import { useState } from 'react';
import { Scissors, Combine, EyeOff, ShieldCheck, Lock, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SplitTool } from '@/components/SplitTool';
import { MergeTool } from '@/components/MergeTool';
import { RedactTool } from '@/components/RedactTool';
import { BeforeAfterCard, type ProcessResult } from '@/components/BeforeAfterCard';
import { SeoContent } from '@/components/SeoContent';
import { AdSenseBanner } from '@/components/AdSenseBanner';
import { AD_SLOTS } from '@/lib/adsense';

export type ToolTab = 'split' | 'merge' | 'redact';

export function PdfWorkspace({ defaultTab }: { defaultTab: ToolTab }) {
  const [result, setResult] = useState<ProcessResult>(null);

  return (
    <div className="min-h-screen bg-background bg-grid">
      <div className="border-b border-border bg-primary/5">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center">
          <Lock className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-foreground sm:text-sm">
            100% Client-Side. Your files never touch a server or leave your device.
          </span>
        </div>
      </div>

      <header className="mx-auto max-w-7xl px-4 pb-6 pt-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
          <ShieldCheck className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          DocShield PDF
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-balance text-sm text-muted-foreground sm:text-base">
          Free, 100% Private PDF Splitter, Merger &amp; Redactor — runs entirely in your browser.
          No uploads, no servers, no sign-up.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> GDPR-ready
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <Lock className="h-3.5 w-3.5" /> No file uploads
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Check className="h-3.5 w-3.5" /> No sign-up required
          </span>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl gap-6 px-4 pb-16">
        <div className="min-w-0 flex-1 space-y-6">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-xl border border-border bg-secondary/30 p-1">
              <TabsTrigger value="split" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Scissors className="h-4 w-4" />
                <span className="hidden sm:inline">Split &amp; Extract</span>
                <span className="sm:hidden">Split</span>
              </TabsTrigger>
              <TabsTrigger value="merge" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Combine className="h-4 w-4" />
                <span className="hidden sm:inline">Merge PDFs</span>
                <span className="sm:hidden">Merge</span>
              </TabsTrigger>
              <TabsTrigger value="redact" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <EyeOff className="h-4 w-4" />
                <span className="hidden sm:inline">Redact &amp; Blackout</span>
                <span className="sm:hidden">Redact</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="split" className="mt-5 animate-float-in">
              <SplitTool onResult={setResult} />
            </TabsContent>
            <TabsContent value="merge" className="mt-5 animate-float-in">
              <MergeTool onResult={setResult} />
            </TabsContent>
            <TabsContent value="redact" className="mt-5 animate-float-in">
              <RedactTool onResult={setResult} />
            </TabsContent>
          </Tabs>

          <div className="hidden justify-center md:flex">
            <AdSenseBanner slotId={AD_SLOTS.bannerDesktop} width={728} height={90} />
          </div>
          <div className="flex justify-center md:hidden">
            <AdSenseBanner slotId={AD_SLOTS.bannerMobile} width={320} height={50} />
          </div>

          <BeforeAfterCard result={result} />

          <SeoContent />
        </div>

        <aside className="hidden w-[300px] shrink-0 xl:block">
          <div className="sticky top-20">
            <AdSenseBanner slotId={AD_SLOTS.sidebar} width={300} height={600} />
          </div>
        </aside>
      </main>
    </div>
  );
}
