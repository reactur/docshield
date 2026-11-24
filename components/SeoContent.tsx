import { ShieldCheck, Lock, Cpu, Scissors, Combine, EyeOff, Globe, Zap, FileText, Layers } from 'lucide-react';
import { faqs } from '@/lib/site-content';

const trustFeatures = [
  { icon: Lock, title: 'No Uploads', text: 'Selected files stay on your device at all times.' },
  { icon: Cpu, title: 'In-Browser Processing', text: 'All work runs on your own device using WebAssembly, not a server.' },
  { icon: ShieldCheck, title: 'No Sign-Up', text: 'Open the page and start working right away — no account needed.' },
];

const useCases = [
  {
    icon: FileText,
    title: 'Splitting large reports',
    text: 'When a 200-page report needs to be shared in sections, the Split tool lets you extract the exact pages each recipient needs — no more, no less. Type a range like 1-10 or click thumbnails to pick individual pages.',
  },
  {
    icon: Layers,
    title: 'Merging scanned documents',
    text: 'Combine separate scans of a contract, appendix, and signature page into a single PDF in the right order. Drag and drop to rearrange, then download one clean file.',
  },
  {
    icon: EyeOff,
    title: 'Redacting before sharing',
    text: 'Before sending a bank statement or medical record, draw black boxes over account numbers, names, or addresses. Always verify the output file by trying to select the covered text before sharing.',
  },
];

export function SeoContent() {
  return (
    <div className="space-y-12">
      <section className="space-y-10">
        <GuideSection
          icon={Scissors}
          question="How do I split a PDF into pages without Adobe Acrobat?"
          answer="Open the Split and Extract tab, add your PDF, and select the pages you want by clicking their thumbnails or typing a range such as 1-3, 5, 8-12. You can also use the Select all, Odd pages, or Even pages buttons for quick selection. Then choose Extract selected for one new PDF, or Split all into ZIP for a separate PDF per page."
        >
          <p>
            The Split and Extract tool does not need a paid desktop program. Pages you select
            are copied into new files, and your original PDF on your computer is not changed.
          </p>
          <p>
            For documents with many pages, the range input saves time — type something like
            &quot;1-5, 10, 15-20&quot; to select non-contiguous sections in one step. The ZIP output
            names each file by its original page number, so you can find page 42 without scrolling.
          </p>
        </GuideSection>

        <GuideSection
          icon={Combine}
          question="How do I merge PDF files without uploading them?"
          answer="Drop two or more PDFs into the Merge PDFs tab, put them in order with the up and down buttons or by dragging, and click Merge and Download. The combined file is built in your browser and downloads straight to your device, with no upload step."
        >
          <p>
            Each file is read from your device and its pages are copied into one new document.
            The original files on your computer are not changed.
          </p>
          <p>
            The merge preserves page sizes, orientations, and embedded content from each source
            PDF. If one file has A4 pages and another has Letter pages, both sizes appear in the
            output as-is.
          </p>
        </GuideSection>

        <GuideSection
          icon={EyeOff}
          question="How does browser-side PDF redaction work?"
          answer="DocShield PDF draws solid black boxes over the areas you select, and the export is built in your browser. Nothing is sent to a server, but the boxes sit on top of the page, so the text underneath may still be present in the file."
        >
          <p>
            Before sharing a redacted file, open it in a PDF viewer and try to select the covered
            text. If you can select or copy it, the file still contains that text, and you should
            not rely on the file to hide it.
          </p>
          <p>
            For maximum safety with sensitive documents, consider printing the redacted file and
            scanning it back in — this ensures no hidden text layer survives in the file.
          </p>
        </GuideSection>

        <GuideSection
          icon={ShieldCheck}
          question="Does DocShield PDF upload my files to any server?"
          answer="No. DocShield PDF runs entirely in your web browser, so the PDF you select is read and processed on your own device. The files are not sent to a DocShield server, stored in a database, or shared with a third party."
        >
          <p>
            Your browser is the only place where the document is opened, so the file never has to
            travel across the internet to be split, merged, or redacted.
          </p>
        </GuideSection>

        <GuideSection
          icon={Globe}
          question="Which browsers and devices are supported?"
          answer="DocShield PDF works in any modern browser that supports WebAssembly — Chrome, Firefox, Safari, and Edge on desktop, plus mobile browsers on iOS and Android. No plugins or extensions are required."
        >
          <p>
            On mobile devices, large PDFs may be limited by available memory. If a file fails to
            process on a phone, try a desktop browser with more RAM, or split the file into
            smaller batches first.
          </p>
        </GuideSection>

        <GuideSection
          icon={Zap}
          question="Is there a file size or page limit?"
          answer="There is no server-imposed limit. The only constraint is your device&apos;s available RAM, since all processing happens in browser memory. Most modern computers handle hundreds of megabytes without issue."
        >
          <p>
            If a very large file fails, closing other browser tabs frees memory and usually
            resolves the problem. There are no daily usage caps, watermarks, or paywalls.
          </p>
        </GuideSection>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Common use cases</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {useCases.map((uc) => (
            <div key={uc.title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <uc.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">{uc.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{uc.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {trustFeatures.map((f) => (
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
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((item) => (
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
    </div>
  );
}

function GuideSection({
  icon: Icon,
  question,
  answer,
  children,
}: {
  icon: typeof Scissors;
  question: string;
  answer: string;
  children?: React.ReactNode;
}) {
  return (
    <article className="space-y-3">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-xl font-semibold leading-tight text-foreground sm:text-2xl">{question}</h2>
      </div>
      <p className="text-sm leading-relaxed text-foreground sm:text-base">{answer}</p>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{children}</div>
    </article>
  );
}
