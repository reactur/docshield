import { PDF_TOOLS, PROFILE_URLS, SITE_DESCRIPTION, SITE_NAME, SITE_URL, faqs } from '@/lib/site-content';

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${SITE_URL}/contact`,
      availableLanguage: 'English',
    },
  ],
  ...(PROFILE_URLS.length > 0 ? { sameAs: PROFILE_URLS } : {}),
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
