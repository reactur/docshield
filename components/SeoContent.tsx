import { ShieldCheck, Lock, Cpu, Scissors, Combine, EyeOff, Globe, Zap, FileText, Layers } from 'lucide-react';
import { faqs } from '@/lib/site-content';

const trustFeatures = [
  { icon: Lock, title: 'No Uploads', text: 'Your files stay on your device the whole time.' },
  { icon: Cpu, title: 'Runs Locally', text: 'All processing happens on your machine, not a server.' },
  { icon: ShieldCheck, title: 'No Account Needed', text: 'Just open the page and start working.' },
];

const useCases = [
  {
    icon: FileText,
    title: 'Splitting large reports',
    text: 'Got a 200-page report but only need to send pages 12 through 30? Click those thumbnails or type "12-30" in the range box, then download just those pages as a new PDF.',
  },
  {
    icon: Layers,
    title: 'Merging scanned documents',
    text: 'Scanned a contract, an appendix, and a signature page separately? Drop all three into the Merge tab, drag them into the right order, and download one clean PDF.',
  },
  {
    icon: EyeOff,
    title: 'Redacting before sharing',
    text: 'Sending a bank statement or medical record? Draw black boxes over account numbers, names, and addresses. Always check the output file by trying to select the covered text before you share it.',
  },
];

export function SeoContent() {
  return (
    <div className="space-y-12">
      <section className="space-y-10">
        <GuideSection
          icon={Scissors}
          question="How to split a PDF without Adobe Acrobat"
          answer="Go to the Split tab, add your PDF, and pick the pages you want. You can click thumbnails one by one, type a range like 1-3, 5, 8-12, or use the Select all / Odd / Even buttons. Then click Extract to save those pages as one PDF, or Split all to get every page as a separate file in a ZIP."
        >
          <p>
            You do not need any paid software for this. The tool copies the pages you pick into a
            new file. Your original PDF stays untouched on your computer.
          </p>
          <p>
            For long documents, typing a range is much faster than clicking. Something like
            &quot;1-5, 10, 15-20&quot; grabs those exact pages in one go. Each file in the ZIP is
            named by its page number, so page 42 is easy to find.
          </p>
        </GuideSection>

        <GuideSection
          icon={Combine}
          question="How to merge PDF files without uploading them"
          answer="Drop two or more PDFs into the Merge tab. Arrange them by dragging or using the up and down arrows. Click Merge and Download, and the combined file saves right to your device. Nothing gets uploaded."
        >
          <p>
            The tool reads each file from your device and copies its pages into one new document.
            Your original files are not modified.
          </p>
          <p>
            Page sizes and orientations carry over from each source file. So if one PDF has A4
            pages and another has Letter-size pages, the merged output keeps both sizes as they
            were.
          </p>
        </GuideSection>

        <GuideSection
          icon={EyeOff}
          question="How PDF redaction works in the browser"
          answer="You draw black boxes over the parts you want to hide. When you export, those boxes get baked into the page. Nothing is sent to a server. But the boxes are layered on top of the page, so the text underneath might still be in the file."
        >
          <p>
            Always check the result before sharing. Open the exported PDF in any viewer and try
            to select or copy the blacked-out text. If you can, the text is still there.
          </p>
          <p>
            For sensitive documents, the safest approach is to print the redacted file and scan
            it back in. That way there is no hidden text layer left in the file at all.
          </p>
        </GuideSection>

        <GuideSection
          icon={ShieldCheck}
          question="Does DocShield PDF upload my files to a server?"
          answer="No. Everything runs in your browser. The PDF you open is read and processed on your own device. We do not send it to a server, store it in a database, or share it with anyone."
        >
          <p>
            Since the file never leaves your computer, it never travels across the internet to
            be split, merged, or redacted. Close the tab and the file is gone from memory.
          </p>
        </GuideSection>

        <GuideSection
          icon={Globe}
          question="Which browsers and devices work with DocShield PDF?"
          answer="It works on Chrome, Firefox, Safari, and Edge on desktop, plus mobile browsers on iOS and Android. No plugins or extensions needed."
        >
          <p>
            On phones, very large PDFs might struggle if your device does not have enough memory.
            If a file fails on mobile, try it on a desktop browser, or split it into smaller
            chunks first.
          </p>
        </GuideSection>

        <GuideSection
          icon={Zap}
          question="Is there a file size or page limit?"
          answer="No limit from our side. The only thing that could hold you back is your device's available memory, since all the work happens in your browser. Most computers can handle PDFs in the hundreds of megabytes."
        >
          <p>
            If a big file fails, closing other browser tabs usually frees up enough memory. There
            are no daily caps, watermarks, or paywalls.
          </p>
        </GuideSection>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">When you might need these tools</h2>
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
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Frequently asked questions</h2>
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
