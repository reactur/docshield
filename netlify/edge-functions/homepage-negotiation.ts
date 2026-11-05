import type { Config, Context } from 'https://edge.netlify.com';
import { buildAgentSummary } from '../../lib/agent-content.ts';
import { SITE_URL } from '../../lib/site-content.ts';

const LINK_HEADER = [
  `<${SITE_URL}/llms.txt>; rel="alternate"; type="text/plain"; title="LLM-friendly site summary"`,
  `<${SITE_URL}/.well-known/mcp/server-card.json>; rel="describedby"; type="application/json"`,
].join(', ');

export default async function negotiateHomepage(req: Request, context: Context): Promise<Response> {
  const accept = req.headers.get('accept') ?? '';

  if (accept.includes('text/markdown')) {
    return new Response(buildAgentSummary(), {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        Link: LINK_HEADER,
        Vary: 'Accept',
      },
    });
  }

  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set('Link', LINK_HEADER);
  headers.append('Vary', 'Accept');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export const config: Config = { path: '/' };
