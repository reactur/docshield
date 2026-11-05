import { ShieldCheck, Lock, Cpu, Scissors, Combine, EyeOff } from 'lucide-react';
import { faqs } from '@/lib/site-content';

const trustFeatures = [
  { icon: Lock, title: 'No uploads', text: 'Selected files stay on your device.' },
  { icon: Cpu, title: 'Runs in your browser', text: 'Processing uses your own device, not a server.' },
  { icon: ShieldCheck, title: 'No sign-up', text: 'Open the page and start working right away.' },
];

export function SeoContent() {
  return (
    <div className="space-y-12">
      <section className="space-y-10">
        <GuideSection
          icon={Scissors}
          question="How do I split a PDF into pages without Adobe Acrobat?"
          answer="Open the Split and Extract tab, add your PDF, and select the pages you want by clicking their thumbnails or typing a range such as 1-3, 5, 8-12. Then choose Extract selected for one new PDF, or Split all into ZIP for a separate PDF per page."
        >
          <p>
            The Split and Extract tool does not need a paid desktop program. Pages you select
            are copied into new files, and your original PDF on your computer is not changed.
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
      </section>

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

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((item) => (
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
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-xl font-semibold leading-tight text-foreground sm:text-2xl">{question}</h2>
      </div>
      <p className="text-sm leading-relaxed text-foreground sm:text-base">{answer}</p>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{children}</div>
    </article>
  );
}
