import type { Config, Context } from 'https://edge.netlify.com';
import { MCP_SERVER_NAME, MCP_SERVER_VERSION, MCP_TOOLS, callMcpTool } from '../../lib/mcp-tools.ts';

const PROTOCOL_VERSION = '2025-06-18';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey, Mcp-Session-Id, MCP-Protocol-Version',
};

type JsonRpcId = string | number | null;

type JsonRpcRequest = {
  jsonrpc?: string;
  id?: JsonRpcId;
  method?: unknown;
  params?: Record<string, unknown>;
};

function rpcResult(id: JsonRpcId, result: unknown): Response {
  return Response.json({ jsonrpc: '2.0', id, result }, { headers: corsHeaders });
}

function rpcError(id: JsonRpcId, code: number, message: string, status = 200): Response {
  return Response.json({ jsonrpc: '2.0', id, error: { code, message } }, { status, headers: corsHeaders });
}

function accepted(): Response {
  return new Response(null, { status: 202, headers: corsHeaders });
}

export default async function handleMcp(req: Request, _context: Context): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });

  if (req.method !== 'POST') {
    return new Response('Method not allowed. Send JSON-RPC requests with POST.', {
      status: 405,
      headers: { ...corsHeaders, Allow: 'POST, OPTIONS' },
    });
  }

  let message: JsonRpcRequest;
  try {
    message = await req.json();
  } catch {
    return rpcError(null, -32700, 'Parse error', 400);
  }

  if (!message || typeof message !== 'object' || typeof message.method !== 'string') {
    return rpcError(null, -32600, 'Invalid Request', 400);
  }

  const id = message.id ?? null;
  const isNotification = message.id === undefined;

  switch (message.method) {
    case 'initialize':
      return rpcResult(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: MCP_SERVER_NAME, version: MCP_SERVER_VERSION },
      });
    case 'notifications/initialized':
      return accepted();
    case 'ping':
      return rpcResult(id, {});
    case 'tools/list':
      return rpcResult(id, { tools: MCP_TOOLS });
    case 'tools/call': {
      const name = message.params?.name;
      const args = (message.params?.arguments ?? {}) as Record<string, unknown>;
      const result = typeof name === 'string' ? callMcpTool(name, args) : null;
      if (!result) return rpcError(id, -32602, `Unknown tool: ${String(name)}`);
      return rpcResult(id, result);
    }
    default:
      if (isNotification) return accepted();
      return rpcError(id, -32601, `Method not found: ${message.method}`);
  }
}

export const config: Config = { path: '/mcp' };
