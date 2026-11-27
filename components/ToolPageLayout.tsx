'use client';

import Link from 'next/link';
import { ChevronRight, Lock, Cpu, Zap, FileStack } from 'lucide-react';

const highlights = [
  { icon: Lock, title: 'No Uploads', desc: 'Your files stay on your device.' },
  { icon: Cpu, title: 'Runs Locally', desc: 'All processing happens on your machine.' },
  { icon: Zap, title: 'Instant Results', desc: 'No queue. Your file is ready now.' },
  { icon: FileStack, title: 'No Limits', desc: 'No file size caps or daily limits.' },
];

export function ToolPageLayout({
  title,
  subtitle,
  toolName,
  children,
}: {
  title: string;
  subtitle: string;
  toolName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-5xl px-4 py-3 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground sm:text-sm">
            <Lock className="h-4 w-4 text-primary" />
            Your files never leave your device. Everything runs in your browser.
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-muted-foreground/60">Tools</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">{toolName}</span>
        </nav>
      </div>

      <header className="mx-auto max-w-5xl px-4 py-8 text-center">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-balance text-base text-muted-foreground">
          {subtitle}
        </p>
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
        {children}
      </main>
    </div>
  );
}
