'use client';

import { useEffect } from 'react';
import { PDF_TOOLS } from '@/lib/site-content';

type ToolResult = { content: { type: 'text'; text: string }[] };

type ModelContext = {
  registerTool: (tool: {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    execute: (input: Record<string, unknown>) => Promise<ToolResult> | ToolResult;
  }) => unknown;
};

const text = (value: string): ToolResult => ({ content: [{ type: 'text', text: value }] });

export function WebMcpTools() {
  useEffect(() => {
    const modelContext = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
    if (!modelContext) return;

    modelContext.registerTool({
      name: 'open_pdf_tool',
      description:
        'Open one of the DocShield PDF tools in the browser: split, merge, or redact. Files are processed on the user device.',
      inputSchema: {
        type: 'object',
        properties: {
          tool: {
            type: 'string',
            enum: PDF_TOOLS.map((tool) => tool.slug),
            description: 'Which tool to open.',
          },
        },
        required: ['tool'],
      },
      execute: (input) => {
        const tool = PDF_TOOLS.find((item) => item.slug === input.tool);
        if (!tool) return text('Unknown tool. Use split, merge, or redact.');
        window.location.assign(tool.path);
        return text(`Opening ${tool.name} at ${tool.path}.`);
      },
    });

    modelContext.registerTool({
      name: 'get_file_handling_policy',
      description: 'Explain how DocShield PDF handles the files a user selects.',
      inputSchema: { type: 'object', properties: {} },
      execute: () =>
        text(
          'Selected PDFs are processed entirely in the browser on the user device. DocShield PDF does not upload or store them on any server.',
        ),
    });
  }, []);

  return null;
}
