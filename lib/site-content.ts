export const SITE_URL = 'https://docshield.example.com';

export const faqs = [
  {
    question: 'Is DocShield PDF really private?',
    answer:
      'Yes. Splitting, merging, and redacting all happen inside your web browser. DocShield PDF does not upload the PDFs you select and does not store them on any server.',
  },
  {
    question: 'Can I split a PDF into individual pages for free?',
    answer:
      'Yes. Choose "Split all into ZIP" on the Split and Extract tab to receive one PDF per page in a single download. There is no watermark, and the practical size limit is your device\'s memory.',
  },
  {
    question: 'Does the redaction tool permanently remove text?',
    answer:
      'Not reliably. The redaction tool draws solid black boxes over the areas you select. The original text beneath a box can still exist in the file, so check the exported PDF before sharing it.',
  },
  {
    question: 'Can I merge more than two PDFs together?',
    answer:
      'Yes. The Merge PDFs tab accepts as many files as you add. Reorder them with the up and down buttons or by dragging, then download one combined PDF.',
  },
  {
    question: 'Do you store my files?',
    answer:
      'No. DocShield PDF has no file storage. Selected files stay in your browser memory while you work and are not sent anywhere.',
  },
];
