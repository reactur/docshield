import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-content';

export const dynamic = 'force-static';

const PATHS = ['/', '/split-pdf', '/merge-pdf', '/redact-pdf', '/about', '/privacy', '/terms', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));
}
