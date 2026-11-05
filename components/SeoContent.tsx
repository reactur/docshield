'use client';

import { ShieldCheck, Lock, FileArchive, Combine, EyeOff, Cpu, WifiOff, Github } from 'lucide-react';

const trustFeatures = [
  { icon: Lock, title: 'No uploads', text: 'Files never leave your device.' },
  { icon: Cpu, title: 'In-browser processing', text: 'Powered by your CPU, not a server.' },
  { icon: WifiOff, title: 'Works offline', text: 'Keeps running after the page loads.' },
];

export function SeoContent() {
  return (
    <div className="space-y-10">
      {/* Why client-side redaction */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            Why Client-Side Redaction is Crucial for GDPR/HIPAA Compliance
          </h2>
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <p>
            Under GDPR, HIPAA, and similar privacy frameworks, the moment personal data or protected
            health information leaves a controlled environment, you bear the legal burden of that
            transfer. Uploading a contract containing patient names, account numbers, or signatures
            to a third-party web service means that data now lives on someone else&apos;s server —
            and you have no real guarantee about how long it is retained, who has access, or whether
            it is logged for training data.
          </p>
          <p>
            DocShield PDF eliminates that risk entirely. Because every operation — splitting,
            merging, and especially redaction — runs as JavaScript inside your own browser, the
            raw bytes of your document never touch a network request. There is no server storage to
            breach, no logs to subpoena, and no third party that could be added as a data
            processor. For compliance teams, that means a dramatically simpler DPIA (Data
            Protection Impact Assessment): the data never moves, so the transfer risk is zero by
            construction.
          </p>
          <p>
            The redaction flattening step is equally important. Many tools simply overlay a black
            rectangle on top of the text, leaving the original characters intact underneath —
            selectable, copyable, and extractable by anyone with a free PDF text-extraction tool.
            DocShield burns solid black vectors directly into the PDF content stream using
            <span className="text-foreground"> pdf-lib</span>, so the covered text is physically
            replaced and cannot be recovered by selection, copy-paste, or automated extraction.
          </p>
        </div>
      </section>

      {/* How to split large PDFs */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FileArchive className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            How to Split Large PDFs Without Paying for Adobe Acrobat
          </h2>
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <p>
            Adobe Acrobat Pro&apos;s &quot;Organize Pages&quot; tool can easily cost hundreds of
            dollars per year, yet the underlying operation — pulling individual pages out of a PDF
            — is straightforward and fast enough to run in any modern browser. Here is how to do it
            for free with DocShield PDF:
          </p>
          <ol className="ml-5 list-decimal space-y-2">
            <li>
              <span className="font-medium text-foreground">Open the Split &amp; Extract tab</span>{' '}
              and drag your PDF into the dropzone. Page thumbnails render in seconds.
            </li>
            <li>
              <span className="font-medium text-foreground">Pick your pages.</span> Either click
              thumbnails to toggle them, or type ranges like <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">1-3, 5, 8-12</code> into the range box.
            </li>
            <li>
              <span className="font-medium text-foreground">Choose your output.</span> Click{' '}
              <em>Extract selected</em> for a single trimmed PDF, or <em>Split all into ZIP</em> to
              get one PDF per page bundled into a single download.
            </li>
            <li>
              <span className="font-medium text-foreground">Optionally clean up first.</span> Use
              the per-page rotate and delete controls to remove blank pages or fix orientation
              before exporting.
            </li>
          </ol>
          <p>
            Because everything happens locally, there is no file-size cap imposed by a server
            timeout, no watermark, and no queue. The only limit is your computer&apos;s available
            memory.
          </p>
        </div>
      </section>

      {/* Trust feature grid */}
      <section className="grid gap-4 sm:grid-cols-3">
        {trustFeatures.map((f) => (
          <div key={f.title} className="rounded-xl border border-border/60 bg-secondary/20 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-foreground">{f.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <EyeOff className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-3">
          {faqItems.map((item) => (
            <details
              key={item.q}
              className="group rounded-lg border border-border/60 bg-secondary/20 px-4 py-3 [&_summary]:cursor-pointer"
            >
              <summary className="flex items-center justify-between text-sm font-medium text-foreground marker:content-none">
                {item.q}
                <span className="ml-2 text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-center gap-2 border-t border-border pt-6 text-xs text-muted-foreground">
        <Github className="h-4 w-4" />
        Built with pdf-lib, pdf.js, and jszip — 100% open source and client-side.
      </div>
    </div>
  );
}

const faqItems = [
  {
    q: 'Is DocShield PDF really 100% client-side and private?',
    a: 'Yes. DocShield runs entirely in your browser using JavaScript. Your PDF files are never uploaded to any server, never leave your device, and are discarded from memory the moment you close the tab.',
  },
  {
    q: 'Can I split a large PDF into individual pages for free?',
    a: 'Absolutely. Drop any PDF into the Split & Extract tool, choose "Split into Individual Pages," and DocShield generates a ZIP file containing each page as its own standalone PDF. No page limits, watermarks, or fees.',
  },
  {
    q: 'How does the redaction tool keep sensitive text un-extractable?',
    a: 'When you draw a blackout box and export, DocShield burns solid black rectangles directly into the PDF page content stream using pdf-lib. This flattens the redaction so text-selection, copy-paste, and automated extraction cannot recover the hidden characters beneath the box.',
  },
  {
    q: 'Does DocShield PDF work offline?',
    a: 'After the page loads once, all PDF processing happens locally in your browser, so the tools keep working even if your connection drops. The initial page load needs a connection to fetch the JavaScript bundle and fonts.',
  },
  {
    q: 'Do you store my files or documents?',
    a: 'No. DocShield PDF has no server-side storage whatsoever. Files live only in your browser memory and are released the moment you finish. Nothing is sent anywhere.',
  },
  {
    q: 'Can I merge more than two PDFs together?',
    a: 'Yes. The Merge tool accepts any number of PDF files. Drag them in, reorder with the Up/Down buttons or by dragging, then download a single combined PDF instantly.',
  },
];