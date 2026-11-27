export const SITE_URL = 'https://linkverse.in';

export const SITE_NAME = 'DocShield PDF';

export const SITE_DESCRIPTION =
  'Free PDF tools to split, merge, redact, add images, text, signatures, watermarks, and protect documents right in your browser. No uploads, no sign-up.';

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
    name: 'PDF Blackout',
    path: '/redact-pdf',
    description: 'Draw black boxes over parts of a PDF before sharing it. Text underneath stays in the file.',
  },
  {
    slug: 'compress',
    name: 'Compress PDF',
    path: '/compress-pdf',
    description: 'Shrink PDF file size without uploading your document.',
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    path: '/pdf-to-jpg',
    description: 'Convert PDF pages into JPG images and download them as a ZIP.',
  },
  {
    slug: 'organize',
    name: 'Organize PDF',
    path: '/organize-pdf',
    description: 'Reorder, rotate, and delete pages with a drag-and-drop view.',
  },
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    path: '/jpg-to-pdf',
    description: 'Combine JPG, PNG, or WebP images into one PDF, with page size and margin options.',
  },
  {
    slug: 'unlock',
    name: 'Unlock PDF',
    path: '/unlock-pdf',
    description: 'Remove a password from a PDF you own, right in your browser.',
  },
  {
    slug: 'add-image',
    name: 'Add Image to PDF',
    path: '/add-image-pdf',
    description: 'Place images on any page, drag, resize, and copy across pages.',
  },
  {
    slug: 'add-text',
    name: 'Add Text to PDF',
    path: '/add-text-pdf',
    description: 'Type text onto any page with custom size and color.',
  },
  {
    slug: 'add-signature',
    name: 'Add Signature to PDF',
    path: '/add-signature-pdf',
    description: 'Draw or upload a signature and place it on any page.',
  },
  {
    slug: 'watermark',
    name: 'Watermark PDF',
    path: '/watermark-pdf',
    description: 'Add a text watermark to every page with custom style.',
  },
  {
    slug: 'protect',
    name: 'Protect PDF',
    path: '/protect-pdf',
    description: 'Add a password to your PDF so only authorized people can open it.',
  },
] as const;

export const PROFILE_URLS: string[] = [
  'https://github.com/linkverse-in',
  'https://www.linkedin.com/company/linkverse-in',
  'https://x.com/linkverse_in',
  'https://www.producthunt.com/@linkverse_in',
];

export const CONTACT_EMAIL = 'support@linkverse.in';
export const CONTACT_PHONE = '+91-9550066495';
export const CONTACT_WHATSAPP = '919550066495';
export const DEVELOPER_NAME = 'Yeshwanth C';
export const DEVELOPER_WEBSITE = 'https://yeshwanthc.in';

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
    question: 'Does the blackout tool permanently remove text?',
    answer:
      'No. It draws solid black boxes on top of the page, but the text underneath stays in the file. For truly sensitive documents, print the blacked-out file and scan it back in — that is the only reliable way to remove the text layer here. Always open the exported PDF and try selecting the covered area first.',
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
