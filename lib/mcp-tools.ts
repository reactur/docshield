import { PDF_TOOLS, SITE_URL, faqs } from './site-content.ts';

export const MCP_SERVER_NAME = 'docshield-pdf';
export const MCP_SERVER_VERSION = '1.0.0';
export const MCP_ENDPOINT = `${SITE_URL}/mcp`;

export const MCP_TOOLS = [
  {
    name: 'list_pdf_tools',
    description: 'List the PDF tools offered by DocShield PDF with their web addresses.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'search_faq',
    description: 'Search DocShield PDF frequently asked questions by keyword and return matching answers.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Keywords to look for, such as "redact" or "storage".' },
      },
      required: ['query'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
  },
];

type ToolCallResult = { content: { type: 'text'; text: string }[]; isError?: boolean };

const textResult = (text: string, isError = false): ToolCallResult => ({
  content: [{ type: 'text', text }],
  ...(isError ? { isError: true } : {}),
});

export function callMcpTool(name: string, args: Record<string, unknown>): ToolCallResult | null {
  if (name === 'list_pdf_tools') {
    const tools = PDF_TOOLS.map((tool) => ({ name: tool.name, description: tool.description, url: `${SITE_URL}${tool.path}` }));
    return textResult(JSON.stringify(tools, null, 2));
  }

  if (name === 'search_faq') {
    const query = typeof args.query === 'string' ? args.query.trim().toLowerCase() : '';
    if (!query) return textResult('A non-empty "query" string is required.', true);

    const matches = faqs.filter((item) => `${item.question} ${item.answer}`.toLowerCase().includes(query));
    if (matches.length === 0) return textResult('No matching questions found.');
    return textResult(matches.map((item) => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n'));
  }

  return null;
}
