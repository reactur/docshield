import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-content';

export const dynamic = 'force-static';

const AI_AND_SEARCH_BOTS = ['Googlebot', 'GPTBot', 'PerplexityBot', 'Google-Extended'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...AI_AND_SEARCH_BOTS.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
