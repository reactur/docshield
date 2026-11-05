import { MCP_ENDPOINT, MCP_SERVER_NAME, MCP_SERVER_VERSION, MCP_TOOLS } from '@/lib/mcp-tools';
import { SITE_NAME, SITE_URL } from '@/lib/site-content';

export const dynamic = 'force-static';

export function GET() {
  const card = {
    name: MCP_SERVER_NAME,
    title: `${SITE_NAME} tools`,
    version: MCP_SERVER_VERSION,
    description: `Read-only MCP server for ${SITE_NAME}: lists its PDF tools and answers frequently asked questions. Files are never sent to this server.`,
    website: SITE_URL,
    endpoint: MCP_ENDPOINT,
    transport: { type: 'streamable-http' },
    protocolVersion: '2025-06-18',
    capabilities: {
      tools: { listChanged: false },
    },
    tools: MCP_TOOLS.map((tool) => ({ name: tool.name, description: tool.description })),
  };

  return new Response(JSON.stringify(card, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
