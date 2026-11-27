'use client';

import { useState } from 'react';
import { Scissors, Combine, EyeOff, ShieldCheck, Check, Cpu, Zap, FileStack } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SplitTool } from '@/components/SplitTool';
import { MergeTool } from '@/components/MergeTool';
import { RedactTool } from '@/components/RedactTool';
import { BeforeAfterCard, type ProcessResult } from '@/components/BeforeAfterCard';
import { SeoContent } from '@/components/SeoContent';
import { AdSenseBanner } from '@/components/AdSenseBanner';
import { AD_SLOTS } from '@/lib/adsense';

export type ToolTab = 'split' | 'merge' | 'redact';

const highlights = [
  { icon: Lock, title: 'No Uploads', desc: 'Your files stay on your device. Nothing gets sent anywhere.' },
  { icon: Cpu, title: 'Runs Locally', desc: 'All processing happens on your machine, not a server.' },
  { icon: Zap, title: 'Instant Results', desc: 'No queue or waiting. Your file is ready right away.' },
  { icon: FileStack, title: 'No Limits', desc: 'No file size caps, no daily limits, no watermarks.' },
];

export function PdfWorkspace({ defaultTab }: { defaultTab: ToolTab }) {
  const [result, setResult] = useState<ProcessResult>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:py-16">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            DocShield PDF
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-balance text-base text-muted-foreground">
            Split, merge, and redact PDFs right in your browser. No uploads, no sign-up, no watermarks. Your files never leave your device.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> GDPR-friendly
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> No file uploads
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              <Check className="h-3.5 w-3.5" /> No sign-up required
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-xl border border-border bg-secondary/50 p-1">
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
              <span className="hidden sm:inline">Blackout</span>
              <span className="sm:hidden">Blackout</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="split" className="mt-6 animate-float-in">
            <SplitTool onResult={setResult} />
          </TabsContent>
          <TabsContent value="merge" className="mt-6 animate-float-in">
            <MergeTool onResult={setResult} />
          </TabsContent>
          <TabsContent value="redact" className="mt-6 animate-float-in">
            <RedactTool onResult={setResult} />
          </TabsContent>
        </Tabs>

        <BeforeAfterCard result={result} />

        <div className="mt-10">
          <SeoContent />
        </div>

        <div className="mt-10 flex justify-center">
          <AdSenseBanner slotId={AD_SLOTS.bannerDesktop} width={728} height={90} className="hidden md:flex" />
          <AdSenseBanner slotId={AD_SLOTS.bannerMobile} width={320} height={50} className="md:hidden" />
        </div>
      </main>
    </div>
  );
}
