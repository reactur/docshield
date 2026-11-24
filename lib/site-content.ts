export const SITE_URL = 'https://linkverse.in';

export const SITE_NAME = 'DocShield PDF';

export const SITE_DESCRIPTION =
  'Free PDF tools to split, merge, and redact documents right in your browser. No uploads, no sign-up, no watermarks.';

export const PDF_TOOLS = [
  {
    slug: 'split',
    name: 'Split & Extract PDF',
    path: '/split-pdf',
    description: 'Split a PDF into single pages or pull out just the pages you need.',
  },
  {
    slug: 'merge',
    name: 'Merge PDFs',
    path: '/merge-pdf',
    description: 'Combine two or more PDFs into one file, in any order.',
  },
  {
    slug: 'redact',
    name: 'Redact PDF',
    path: '/redact-pdf',
    description: 'Draw black boxes over parts of a PDF before sharing it.',
  },
] as const;

export const PROFILE_URLS: string[] = [
  'https://github.com/linkverse-in',
  'https://www.linkedin.com/company/linkverse-in',
  'https://x.com/linkverse_in',
  'https://www.producthunt.com/@linkverse_in',
];

export const CONTACT_EMAIL = 'support@linkverse.in';
export const CONTACT_PHONE = '+91-80-4567-8901';

export const BUSINESS_ADDRESS = {
  street: 'Koramangala, 80 Feet Road, 5th Block',
  locality: 'Koramangala',
  region: 'Karnataka',
  postalCode: '560095',
  country: 'IN',
  countryName: 'India',
};

export const faqs = [
  {
    question: 'Is DocShield PDF really private?',
    answer:
      'Yes. Everything runs inside your browser. We never upload your PDFs to a server, and we do not store them anywhere.',
  },
  {
    question: 'Can I split a PDF into individual pages for free?',
    answer:
      'Yes. Click "Split all into ZIP" on the Split tab and you get one PDF per page in a single ZIP download. No watermark, no cost. The only limit is how much memory your device has.',
  },
  {
    question: 'Does the redaction tool permanently remove text?',
    answer:
      'Not reliably. The tool draws solid black boxes on top of the page, but the text underneath can still be in the file. Always open the exported PDF and try selecting the blacked-out area. If you can highlight or copy the text, it is still there.',
  },
  {
    question: 'Can I merge more than two PDFs together?',
    answer:
      'Yes. Add as many files as you want to the Merge tab. Reorder them by dragging or using the arrow buttons, then download one combined PDF.',
  },
  {
    question: 'Do you store my files?',
    answer:
      'No. We have no file storage. Your PDFs stay in your browser memory while you work and are gone when you close the tab.',
  },
  {
    question: 'What browsers does DocShield PDF work on?',
    answer:
      'Chrome, Firefox, Safari, and Edge on desktop. It also works on mobile browsers for iOS and Android. You just need a browser that supports WebAssembly, which all modern ones do.',
  },
  {
    question: 'Is there a file size limit?',
    answer:
      'No server-side limit. The only constraint is your device\'s RAM. Most computers handle PDFs in the hundreds of megabytes without trouble. If a large file fails, try closing other tabs first.',
  },
];
