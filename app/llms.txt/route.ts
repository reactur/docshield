import { SITE_URL, faqs } from '@/lib/site-content';

export const dynamic = 'force-static';

export function GET() {
  const body = `# DocShield PDF

> Free, private PDF tools that split, merge, and redact PDF files entirely inside the user's web browser. Selected files are never uploaded or stored.

## Tools
- [Split & Extract PDF](${SITE_URL}/split-pdf): Split a PDF into single pages or extract selected pages.
- [Merge PDFs](${SITE_URL}/merge-pdf): Combine two or more PDFs into one file, in any order.
- [Redact PDF](${SITE_URL}/redact-pdf): Draw black boxes over selected areas of a PDF.

## Key facts
- Price: free, with no sign-up.
- Processing: runs in the browser on the user's device using JavaScript (pdf-lib, pdf.js, JSZip).
- File storage: none. Selected PDFs are not uploaded to or stored by DocShield PDF.
- Redaction: boxes are drawn over the page. The original text may remain in the file, so exported files should be checked before sharing.
- Operating system: all platforms with a modern web browser.

## Policies
- [Privacy Policy](${SITE_URL}/privacy)
- [Terms of Service](${SITE_URL}/terms)
- [About & Security](${SITE_URL}/about)
- [Contact](${SITE_URL}/contact)

## Frequently asked questions
${faqs.map((item) => `\n### ${item.question}\n${item.answer}`).join('\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
