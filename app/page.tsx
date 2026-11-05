'use client';

import { useState } from 'react';
import { Scissors, Combine, EyeOff, ShieldCheck, Lock, Github } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SplitTool } from '@/components/SplitTool';
import { MergeTool } from '@/components/MergeTool';
import { RedactTool } from '@/components/RedactTool';
import { BeforeAfterCard, type ProcessResult } from '@/components/BeforeAfterCard';
import { SeoContent } from '@/components/SeoContent';
import { SidebarAdRail, AnchorBannerAd } from '@/components/AdSlots';
import { cn } from '@/lib/utils';

export default function Home() {
  const [result, setResult] = useState<ProcessResult>(null);

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Sticky trust badge */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center">
          <Lock className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-foreground sm:text-sm">
            100% Client-Side. Your files never touch a server or leave your device.
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="mx-auto max-w-7xl px-4 pt-10 pb-6 text-center">
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
            <Github className="h-3.5 w-3.5" /> Open-source tech
          </span>
        </div>
      </header>

      {/* Main app shell: sidebars + content */}
      <main className="mx-auto flex max-w-7xl gap-4 px-4 pb-32">
        <SidebarAdRail />

        <div className="min-w-0 flex-1 space-y-6">
          <Tabs defaultValue="split" className="w-full">
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

          {/* Before / After processing card */}
          <BeforeAfterCard result={result} />

          {/* In-content ad slot (medium rectangle) */}
          <div className="flex justify-center py-2">
            <div
              className="flex min-h-[250px] min-w-[300px] items-center justify-center rounded-lg border border-dashed border-border/60 bg-secondary/20 px-4 text-center"
              aria-hidden="true"
            >
              <div className="space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">Ad</p>
                <p className="text-[11px] text-muted-foreground/60">Sponsored Advertisement</p>
                <p className="text-[10px] text-muted-foreground/40">300×250</p>
              </div>
            </div>
          </div>

          {/* SEO content below the fold */}
          <SeoContent />
        </div>

        <SidebarAdRail />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/80 pb-24">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-xs text-muted-foreground">
          <p>
            DocShield PDF — Free, 100% private PDF tools. No files uploaded, no tracking, no sign-up.
          </p>
          <p className="mt-1">
            Built with pdf-lib, pdf.js, and jszip. Runs entirely in your browser.
          </p>
        </div>
      </footer>

      {/* Sticky anchor banner ad */}
      <AnchorBannerAd />
    </div>
  );
}