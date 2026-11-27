'use client';

import Link from 'next/link';
import {
  Scissors, Combine, EyeOff, ShieldCheck, Check, Cpu, Zap, FileStack,
  Image as ImageIcon, Type, PenTool, Stamp, Lock, FileDown, FileImage,
  ArrowLeftRight, LockOpen, Wrench, Gauge, Repeat, PenLine, ShieldAlert,
} from 'lucide-react';

const CATEGORIES = [
  {
    title: 'Organize PDF',
    icon: Wrench,
    tools: [
      { href: '/merge-pdf', label: 'Merge PDF', icon: Combine, desc: 'Combine multiple PDFs into one file, in any order.' },
      { href: '/split-pdf', label: 'Split PDF', icon: Scissors, desc: 'Split a PDF into single pages or extract just the pages you need.' },
      { href: '/organize-pdf', label: 'Organize PDF', icon: ArrowLeftRight, desc: 'Reorder, rotate, and delete pages with a drag-and-drop view.' },
    ],
  },
  {
    title: 'Optimise PDF',
    icon: Gauge,
    tools: [
      { href: '/compress-pdf', label: 'Compress PDF', icon: FileDown, desc: 'Shrink PDF file size without uploading your document.' },
    ],
  },
  {
    title: 'Convert PDF',
    icon: Repeat,
    tools: [
      { href: '/pdf-to-jpg', label: 'PDF to JPG', icon: FileImage, desc: 'Convert PDF pages into JPG images and download them as a ZIP.' },
      { href: '/jpg-to-pdf', label: 'JPG to PDF', icon: ImageIcon, desc: 'Combine JPG, PNG, or WebP images into one PDF, with page size and margin options.' },
    ],
  },
  {
    title: 'Edit PDF',
    icon: PenLine,
    tools: [
      { href: '/add-image-pdf', label: 'Add Image to PDF', icon: ImageIcon, desc: 'Place images on any page, drag, resize, and copy across pages.' },
      { href: '/add-text-pdf', label: 'Add Text to PDF', icon: Type, desc: 'Type text onto any page with custom size and color.' },
      { href: '/add-signature-pdf', label: 'Add Signature to PDF', icon: PenTool, desc: 'Draw or upload a signature and place it on any page.' },
      { href: '/watermark-pdf', label: 'Watermark PDF', icon: Stamp, desc: 'Add a text watermark to every page with custom style.' },
    ],
  },
  {
    title: 'PDF Security',
    icon: ShieldAlert,
    tools: [
      { href: '/protect-pdf', label: 'Protect PDF', icon: Lock, desc: 'Add a password to your PDF so only authorized people can open it.' },
      { href: '/unlock-pdf', label: 'Unlock PDF', icon: LockOpen, desc: 'Remove a password from a PDF you own, right in your browser.' },
      { href: '/redact-pdf', label: 'PDF Blackout', icon: EyeOff, desc: 'Draw black boxes over parts of a PDF before sharing it. Text underneath stays in the file.' },
    ],
  },
] as const;

const highlights = [
  { icon: Lock, title: 'No Uploads', desc: 'Your files stay on your device. Nothing gets sent anywhere.' },
  { icon: Cpu, title: 'Runs Locally', desc: 'All processing happens on your machine, not a server.' },
  { icon: Zap, title: 'Instant Results', desc: 'No queue or waiting. Your file is ready right away.' },
  { icon: FileStack, title: 'No Limits', desc: 'No file size caps, no daily limits, no watermarks.' },
];

export function ToolDirectory() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-5xl px-4 py-8 text-center sm:py-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Free Online PDF Tools
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-balance text-base text-muted-foreground">
            13 tools to merge, split, compress, convert, edit, and protect PDFs — all in your browser. No uploads, no sign-up, no watermarks.
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

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="space-y-10">
          {CATEGORIES.map((cat) => (
            <section key={cat.title} aria-labelledby={`cat-${cat.title.replace(/\s+/g, '-').toLowerCase()}`}>
              <h2
                id={`cat-${cat.title.replace(/\s+/g, '-').toLowerCase()}`}
                className="flex items-center gap-2 text-lg font-semibold text-foreground"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <cat.icon className="h-4 w-4" />
                </span>
                {cat.title}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cat.tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-3 text-sm font-semibold text-foreground">{tool.label}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{tool.desc}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      </main>
    </div>
  );
}
