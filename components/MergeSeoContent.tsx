import Link from 'next/link';
import { Scissors, EyeOff, Check, X, ShieldCheck, Lock, Cpu } from 'lucide-react';
import { mergeFaqs } from '@/lib/structured-data';

const comparisonRows: {
  criterion: string;
  docshield: string;
  cloud: string;
}[] = [
  {
    criterion: 'File upload required',
    docshield: 'No, files stay in your browser',
    cloud: 'Yes, files are uploaded to a server',
  },
  {
    criterion: 'Privacy',
    docshield: 'No data leaves your device',
    cloud: 'Files stored on third-party servers',
  },
  {
    criterion: 'Daily usage limits',
    docshield: 'Unlimited',
    cloud: 'Usually capped at 2 to 5 files on the free tier',
  },
  {
    criterion: 'Speed',
    docshield: 'Instant, no upload or download wait',
    cloud: 'Slower due to upload, processing queue, and download',
  },
  {
    criterion: 'Cost',
    docshield: 'Free, no sign-up',
    cloud: 'Free tier often adds watermarks or requires payment',
  },
];

const crossLinks = [
  {
    href: '/split-pdf',
    label: 'Split PDF',
    desc: 'Pull out specific pages or split into individual files',
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
      <section className="space-y-10">
        <article className="space-y-3">
          <h2 className="text-xl font-semibold leading-tight text-foreground sm:text-2xl">
            How to merge PDF files without uploading them
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            DocShield combines PDFs right inside your browser. Your files load into your device&apos;s
            memory, get merged using pdf-lib, and the result downloads straight to you. Nothing
            travels over the internet once the page is loaded.
          </p>
        </article>

        <article className="space-y-3">
          <h2 className="text-xl font-semibold leading-tight text-foreground sm:text-2xl">
            Why most online PDF mergers are a privacy risk
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Most free PDF mergers work by uploading your file to a server, processing it there, and
            sending the result back. That means a copy of your document sits on someone else&apos;s
            computer, sometimes for hours or days. If that document is a bank statement, a contract,
            or a tax form, you are trusting a third party with sensitive data. DocShield avoids this
            entirely by doing the work on your own device.
          </p>
        </article>

        <article className="space-y-3">
          <h2 className="text-xl font-semibold leading-tight text-foreground sm:text-2xl">
            File size limits when merging PDFs
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            We do not set a file size limit. The only thing that could get in the way is your
            device&apos;s available memory, since everything runs in your browser. Most modern
            computers and phones can handle PDFs in the hundreds of megabytes. If a large merge
            fails, closing other browser tabs usually helps.
          </p>
        </article>

        <article className="space-y-3">
          <h2 className="text-xl font-semibold leading-tight text-foreground sm:text-2xl">
            Do bookmarks and form fields survive the merge?
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            All pages, text, images, and vector graphics from your source files carry over to the
            merged output. Interactive form fields and bookmarks might not transfer. If you need
            those, check the result after downloading and add them back in a PDF editor if needed.
          </p>
        </article>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          DocShield PDF vs. cloud-based converters
        </h2>
        <p className="text-sm text-muted-foreground">
          Here is how DocShield compares to popular tools like iLovePDF and Smallpdf.
        </p>
        <div className="overflow-x-auto scrollbar-thin rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Criteria</th>
                <th className="px-4 py-3 text-left font-semibold text-primary">DocShield PDF</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Cloud converters (iLovePDF / Smallpdf)
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

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          Combine PDF files in 3 steps
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              num: 1,
              title: 'Add your PDFs',
              desc: 'Drag and drop your files into the area above, or click to browse and pick them.',
            },
            {
              num: 2,
              title: 'Arrange the order',
              desc: 'Use the arrows or drag files to put them in the order you want them combined.',
            },
            {
              num: 3,
              title: 'Download the result',
              desc: 'Click Merge & Download. Your combined PDF is built in your browser and saved right away.',
            },
          ].map((step) => (
            <div
              key={step.num}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                {step.num}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Lock, title: 'No server upload', text: 'Files never leave your device.' },
          { icon: Cpu, title: 'Runs on your machine', text: 'All processing is done locally.' },
          { icon: ShieldCheck, title: 'No file size cap', text: 'Limited only by your device\'s RAM.' },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-foreground">{f.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {mergeFaqs.map((item) => (
            <details
              key={item.question}
              className="group rounded-lg border border-border bg-card px-4 py-3 shadow-sm [&_summary]:cursor-pointer"
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

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          Other free PDF tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {crossLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-secondary/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
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
