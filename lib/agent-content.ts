import { PDF_TOOLS, SITE_NAME, SITE_URL, faqs } from './site-content.ts';

export function buildAgentSummary(): string {
  const tools = PDF_TOOLS.map((tool) => `- [${tool.name}](${SITE_URL}${tool.path}): ${tool.description}`).join('\n');

  return `# ${SITE_NAME}

> Free, private PDF tools that split, merge, and redact PDF files entirely inside the user's web browser. Selected files are never uploaded or stored.

## Tools
${tools}

## Key facts
- Price: free, with no sign-up.
- Processing: runs in the browser on the user's device using JavaScript (pdf-lib, pdf.js, JSZip).
- File storage: none. Selected PDFs are not uploaded to or stored by ${SITE_NAME}.
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
}
