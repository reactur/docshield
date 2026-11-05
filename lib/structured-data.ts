import { PDF_TOOLS, PROFILE_URLS, SITE_DESCRIPTION, SITE_NAME, SITE_URL, CONTACT_EMAIL, CONTACT_PHONE, BUSINESS_ADDRESS, faqs } from '@/lib/site-content';

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const CONTACTPOINT_ID = `${SITE_URL}/#contactpoint`;
const ADDRESS_ID = `${SITE_URL}/#address`;

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  email: CONTACT_EMAIL,
  telephone: CONTACT_PHONE,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      '@id': CONTACTPOINT_ID,
      contactType: 'customer support',
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      url: `${SITE_URL}/contact`,
      availableLanguage: ['English'],
    },
  ],
  address: {
    '@type': 'PostalAddress',
    '@id': ADDRESS_ID,
    streetAddress: BUSINESS_ADDRESS.street,
    addressLocality: BUSINESS_ADDRESS.locality,
    addressRegion: BUSINESS_ADDRESS.region,
    postalCode: BUSINESS_ADDRESS.postalCode,
    addressCountry: BUSINESS_ADDRESS.country,
  },
  sameAs: PROFILE_URLS,
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: 'en',
  publisher: { '@id': ORGANIZATION_ID },
};

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  description: SITE_DESCRIPTION,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '127',
  },
  publisher: { '@id': ORGANIZATION_ID },
};

const toolsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'DocShield PDF tools',
  itemListElement: PDF_TOOLS.map((tool, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      name: tool.name,
      description: tool.description,
      url: `${SITE_URL}${tool.path}`,
      provider: { '@id': ORGANIZATION_ID },
    },
  })),
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export const siteJsonLd = [organizationJsonLd, websiteJsonLd, softwareJsonLd, toolsJsonLd, faqJsonLd];

export function buildBreadcrumbJsonLd(path: string, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: `${SITE_URL}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name,
        item: `${SITE_URL}${path}`,
      },
    ],
  };
}

const MERGE_FAQS = [
  {
    question: 'Is merging PDFs with DocShield GDPR and HIPAA compliant?',
    answer:
      'Yes. DocShield processes all PDFs entirely in your browser using JavaScript and WebAssembly. No file is uploaded to a server, so no personal health information or personal data ever leaves your device. This supports GDPR data minimization and HIPAA-conscious workflows, though full HIPAA compliance also requires your organization\u2019s own safeguards and agreements.',
  },
  {
    question: 'Is there a file size limit for merging PDFs?',
    answer:
      'There is no server-imposed limit. The only constraint is your device\u2019s available RAM. Since merging happens in your browser memory, very large files are limited by your computer or phone, not by DocShield. Most modern devices handle hundreds of megabytes without issue.',
  },
  {
    question: 'Are my merged PDFs secure in the browser?',
    answer:
      'Yes. All processing runs locally in your browser using pdf-lib and WebAssembly. Your PDFs are never transmitted over the network, never stored on a server, and never accessible to third parties. Closing the tab immediately clears all data from memory.',
  },
  {
    question: 'Can I merge PDFs offline without an internet connection?',
    answer:
      'After the page loads, yes. The tool runs entirely client-side, so once the page is cached you can disconnect from the internet and continue merging. No data is sent to or received from any server during the merge process.',
  },
];

const mergeWebAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'DocShield Merge PDF',
  url: `${SITE_URL}/merge-pdf`,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'All (Browser-based)',
  description:
    'Combine multiple PDF documents into one seamless file instantly. 100% free, no file size limits, and zero server uploads. Your private documents never leave your browser.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Client-side processing',
    'Zero server upload',
    'Drag-and-drop page reordering',
    'Unlimited file size merging',
  ],
  publisher: { '@id': `${SITE_URL}/#organization` },
};

const mergeHowToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to merge PDF files without uploading',
  description:
    'Combine multiple PDF files into one document entirely in your browser, with zero server uploads.',
  totalTime: 'PT2M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Add PDF Files',
      text: 'Drag and drop your PDF files into the merge workbench, or click to browse and select them. You can add as many files as you need.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Reorder Document Sequence',
      text: 'Use the up and down arrows or drag each document card to arrange your files in the desired order. The top file becomes the first pages of the merged PDF.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Download Merged PDF',
      text: 'Click the Merge & Download button. Your combined PDF is generated instantly in your browser and downloads directly to your device. No file is uploaded to any server.',
    },
  ],
};

const mergeFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: MERGE_FAQS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export const mergePageJsonLd = [
  mergeWebAppJsonLd,
  mergeHowToJsonLd,
  mergeFaqJsonLd,
];

export const mergeFaqs = MERGE_FAQS;
