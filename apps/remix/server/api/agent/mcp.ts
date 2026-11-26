import { AppError, genericErrorCodeToTrpcErrorCodeMap } from '@documenso/lib/errors/app-error';
import { type CallToolResult, createMcpHandler, McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod-v4';

import { ZAgentFindDocumentsSchema, ZAgentShareDocumentSchema } from './schema';

export const handleAgentMcp = (request: Request, actions: AgentMcpActions) => {
  const handler = createMcpHandler(() => {
    const server = new McpServer({ name: 'documenso-document-agent', version: '1.0.0' });

    server.registerTool(
      'find_documents',
      {
        title: 'Find documents',
        description: 'Find documents by title in the connected team. If multiple results match, ask which one to use.',
        inputSchema: ZAgentFindDocumentsSchema,
        outputSchema: ZFindDocumentsOutputSchema,
        annotations: {
          readOnlyHint: true,
          openWorldHint: false,
        },
      },
      (input) => runTool(() => actions.findDocuments(input), ZFindDocumentsOutputSchema),
    );

    server.registerTool(
      'share_document',
      {
        title: 'Share a document',
        description:
          'Email a signing or viewing invitation for a prepared draft, or email a PDF copy of a completed document for viewing. Use only when the user asks to share the document and has identified the recipient. If the document, email address, or intended access is ambiguous, ask for clarification before sending.',
        inputSchema: ZAgentShareDocumentSchema,
        outputSchema: ZShareDocumentOutputSchema,
        annotations: {
          readOnlyHint: false,
          destructiveHint: false,
          openWorldHint: true,
        },
      },
      (input) => runTool(() => actions.shareDocument(input), ZShareDocumentOutputSchema),
    );

    return server;
  });

  return handler.fetch(request);
};

const runTool = async <T extends Record<string, unknown>>(
  action: () => Promise<T>,
  outputSchema: z.ZodType<T>,
): Promise<CallToolResult> => {
  try {
    const output = outputSchema.parse(await action());

    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    };
  } catch (error: unknown) {
    const status =
      error instanceof AppError
        ? (error.statusCode ?? genericErrorCodeToTrpcErrorCodeMap[error.code]?.status)
        : undefined;
    const message =
      error instanceof AppError && status && status < 500
        ? (error.userMessage ?? error.code)
        : 'The document tool could not complete the request.';

    return {
      content: [{ type: 'text', text: message }],
      isError: true,
    };
  }
};

const ZFindDocumentsOutputSchema = z.object({
  documents: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      status: z.string(),
    }),
  ),
  hasMore: z.boolean(),
});

const ZShareDocumentOutputSchema = z.object({
  documentId: z.string(),
  recipientEmail: z.email(),
  mode: z.enum(['sign', 'view']),
  status: z.enum(['queued', 'already_shared']),
});

type AgentMcpActions = {
  findDocuments: (input: unknown) => Promise<z.infer<typeof ZFindDocumentsOutputSchema>>;
  shareDocument: (input: unknown) => Promise<z.infer<typeof ZShareDocumentOutputSchema>>;
};
