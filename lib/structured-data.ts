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
      'Because your files never leave your device, no personal data is shared with us. That aligns well with GDPR data minimization. For HIPAA, it helps reduce exposure, but full compliance also depends on your own policies and safeguards.',
  },
  {
    question: 'Is there a file size limit for merging PDFs?',
    answer:
      'No limit from us. The only constraint is your device\u2019s RAM, since everything runs in your browser. Most computers handle hundreds of megabytes without trouble. If a large merge fails, close other tabs and try again.',
  },
  {
    question: 'Are my merged PDFs secure in the browser?',
    answer:
      'Yes. All processing happens locally. Your PDFs are not sent over the network, stored on a server, or visible to anyone else. Close the tab and everything is cleared from memory.',
  },
  {
    question: 'Can I merge PDFs without an internet connection?',
    answer:
      'Once the page is loaded, yes. The tool runs fully in your browser, so you can turn off your internet and keep merging. No data goes to or from any server during the process.',
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
    'Combine multiple PDFs into one file right in your browser. Free, no file size limits, no uploads. Your documents stay on your device.',
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
    'Combine multiple PDF files into one document in your browser. No uploads.',
  totalTime: 'PT2M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Add PDF Files',
      text: 'Drag and drop your PDF files into the merge area, or click to browse and pick them. Add as many as you need.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Reorder Document Sequence',
      text: 'Use the arrows or drag each file to arrange them in the order you want. The top file becomes the first pages of the merged PDF.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Download Merged PDF',
      text: 'Click Merge & Download. Your combined PDF is built in your browser and saved to your device. No file is uploaded anywhere.',
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
