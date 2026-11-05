import Link from 'next/link';
import { Scissors, EyeOff, Check, X, ShieldCheck, Lock, Cpu } from 'lucide-react';
import { mergeFaqs } from '@/lib/structured-data';

const comparisonRows: {
  criterion: string;
  docshield: string;
  cloud: string;
}[] = [
  {
    criterion: 'Server File Upload',
    docshield: 'Never uploaded — stays in browser',
    cloud: 'Uploaded to remote servers',
  },
  {
    criterion: 'Privacy / GDPR Compliance',
    docshield: 'Full by design — no data leaves device',
    cloud: 'Partial — data stored on third-party servers',
  },
  {
    criterion: 'Daily Usage Limits',
    docshield: 'Unlimited',
    cloud: 'Limited (free tier caps at 2–5 files)',
  },
  {
    criterion: 'Processing Speed',
    docshield: 'Instant — local WebAssembly, no network wait',
    cloud: 'Slower — upload + queue + download',
  },
  {
    criterion: 'Pricing',
    docshield: 'Free forever, no sign-up',
    cloud: 'Free tier with watermarks or paywall',
  },
];

const crossLinks = [
  {
    href: '/split-pdf',
    label: 'Split PDF',
    desc: 'Extract or divide pages from any PDF',
    icon: Scissors,
  },
  {
    href: '/redact-pdf',
    label: 'Redact PDF',
    desc: 'Black out sensitive text before sharing',
    icon: EyeOff,
  },
];

export function MergeSeoContent() {
  return (
    <div className="space-y-12">
      {/* Direct-answer sections for AI/GEO citation */}
      <section className="space-y-10">
        <article className="space-y-3">
          <h2 className="text-xl font-semibold leading-tight text-foreground sm:text-2xl">
            How to merge PDF files offline without uploading?
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            DocShield merges PDFs entirely inside your browser using JavaScript and WebAssembly.
            Your files are loaded into local device memory, combined with pdf-lib, and saved as a
            new PDF downloaded directly to you. No file travels over the internet at any point,
            making the process fully offline after the page loads.
          </p>
        </article>

        <article className="space-y-3">
          <h2 className="text-xl font-semibold leading-tight text-foreground sm:text-2xl">
            Why do online PDF converters pose data privacy risks?
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Traditional online PDF mergers upload your files to cloud servers, process them remotely,
            and often store copies for hours or days. Each upload creates a new data exposure point
            where sensitive documents like bank statements, contracts, and tax filings could be
            intercepted, retained, or breached. DocShield eliminates this risk by processing
            everything locally in your browser, so your documents never touch a server.
          </p>
        </article>

        <article className="space-y-3">
          <h2 className="text-xl font-semibold leading-tight text-foreground sm:text-2xl">
            Is there a file size limit for merging PDFs with DocShield?
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            There is no server-imposed file size limit. The only constraint is your device&apos;s
            available RAM, since all processing happens in your browser memory. Most modern computers
            and phones can handle hundreds of megabytes of PDF data without issue. If a merge fails
            on very large files, closing other browser tabs frees memory and usually resolves it.
          </p>
        </article>
      </section>

      {/* Comparison table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          DocShield PDF vs. Traditional Cloud Converters
        </h2>
        <p className="text-sm text-muted-foreground">
          A side-by-side comparison of how DocShield PDF stacks up against popular cloud-based
          tools like iLovePDF and Smallpdf.
        </p>
        <div className="overflow-x-auto scrollbar-thin rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Criteria</th>
                <th className="px-4 py-3 text-left font-semibold text-primary">DocShield PDF</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Cloud Converters (iLovePDF / Smallpdf)
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr
                  key={row.criterion}
                  className={i % 2 === 1 ? 'border-b border-border/50 bg-secondary/10' : 'border-b border-border/50'}
                >
                  <td className="px-4 py-3 font-medium text-foreground">{row.criterion}</td>
                  <td className="px-4 py-3 text-foreground">
                    <span className="flex items-start gap-1.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{row.docshield}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="flex items-start gap-1.5">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive/60" />
                      <span>{row.cloud}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How-to steps */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          How to combine PDF files in 3 steps
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              num: 1,
              title: 'Add PDF Files',
              desc: 'Drag and drop your PDFs into the workbench above, or click to browse and select them.',
            },
            {
              num: 2,
              title: 'Reorder Document Sequence',
              desc: 'Use the arrows or drag cards to arrange files in the order you want them merged.',
            },
            {
              num: 3,
              title: 'Download Merged PDF',
              desc: 'Click Merge & Download. Your combined PDF is built in your browser and saved instantly.',
            },
          ].map((step) => (
            <div
              key={step.num}
              className="rounded-xl border border-border/60 bg-secondary/20 p-5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
                {step.num}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust features */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Lock, title: 'Zero Server Upload', text: 'Files never leave your device.' },
          { icon: Cpu, title: 'WebAssembly Speed', text: 'Local processing with pdf-lib.' },
          { icon: ShieldCheck, title: 'Unlimited File Size', text: 'Only limited by your RAM.' },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-border/60 bg-secondary/20 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-foreground">{f.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>

      {/* Merge-specific FAQ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {mergeFaqs.map((item) => (
            <details
              key={item.question}
              className="group rounded-lg border border-border/60 bg-secondary/20 px-4 py-3 [&_summary]:cursor-pointer"
            >
              <summary className="flex items-center justify-between text-sm font-medium text-foreground marker:content-none">
                {item.question}
                <span className="ml-2 text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Cross-tool links */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          Other free PDF tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {crossLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-4 rounded-xl border border-border/60 bg-secondary/20 p-5 transition-colors hover:border-primary/40 hover:bg-secondary/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary transition-transform group-hover:scale-110">
                <link.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{link.label}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
