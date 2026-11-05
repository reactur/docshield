import { SITE_URL } from '@/lib/site-content';

export const dynamic = 'force-static';

const CONTENT_SIGNAL = 'search=yes, ai-train=no';
const NAMED_BOTS = ['Googlebot', 'GPTBot', 'PerplexityBot', 'Google-Extended'];

export function GET() {
  const groups = ['*', ...NAMED_BOTS].map(
    (userAgent) => `User-Agent: ${userAgent}\nContent-Signal: ${CONTENT_SIGNAL}\nAllow: /\n`,
  );
  const body = `${groups.join('\n')}\nSitemap: ${SITE_URL}/sitemap.xml\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
