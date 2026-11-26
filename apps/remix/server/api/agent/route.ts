import { AppError, AppErrorCode, genericErrorCodeToTrpcErrorCodeMap } from '@documenso/lib/errors/app-error';
import { findAgentDocuments, shareAgentDocument } from '@documenso/lib/server-only/agent/documents';
import { getApiTokenByToken } from '@documenso/lib/server-only/public-api/get-api-token-by-token';
import type { ApiRequestMetadata } from '@documenso/lib/universal/extract-request-metadata';
import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { ZodError } from 'zod-v4';

import type { HonoEnv } from '../../router';
import { isWebappOrigin } from '../../utils/is-webapp-origin';
import { handleAgentMcp } from './mcp';
import { ZAgentFindDocumentsSchema, ZAgentShareDocumentSchema } from './schema';

type AgentEnv = {
  Variables: HonoEnv['Variables'] & {
    agentContext: {
      userId: number;
      teamId: number;
      requestMetadata: ApiRequestMetadata;
    };
  };
};

export const agentRoute = new Hono<AgentEnv>()
  .onError((error, c) => {
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return c.json({ code: AppErrorCode.INVALID_REQUEST, message: 'Invalid request parameters.' }, 400);
    }

    const status =
      error instanceof AppError
        ? (error.statusCode ?? genericErrorCodeToTrpcErrorCodeMap[error.code]?.status ?? 400)
        : 500;

    if (!(error instanceof AppError) || status >= 500) {
      c.var.logger.error({ err: error }, 'Agent request failed');
      return c.json({ code: AppErrorCode.UNKNOWN_ERROR, message: 'Agent request failed.' }, 500);
    }

    if (status === 401) {
      c.header('WWW-Authenticate', 'Bearer');
    }

    if (error.headers?.['Retry-After']) {
      c.header('Retry-After', error.headers['Retry-After']);
    }

    return c.json({ code: error.code, message: error.userMessage ?? error.message }, status as ContentfulStatusCode);
  })
  .use('*', async (c, next) => {
    c.header('Cache-Control', 'no-store');

    const origin = c.req.header('Origin');

    if (origin !== undefined && !isWebappOrigin(origin)) {
      return c.json({ code: AppErrorCode.FORBIDDEN, message: 'Origin is not allowed.' }, 403);
    }

    const token = /^Bearer (api_[a-zA-Z0-9]+)$/i.exec(c.req.header('Authorization') ?? '')?.[1];

    if (!token) {
      throw new AppError(AppErrorCode.UNAUTHORIZED, {
        message: 'A Documenso API token is required.',
      });
    }

    const apiToken = await getApiTokenByToken({ token });

    c.set('agentContext', {
      userId: apiToken.user.id,
      teamId: apiToken.teamId,
      requestMetadata: {
        auth: 'api',
        source: 'apiV2',
        requestMetadata: c.var.context.requestMetadata,
        auditUser: {
          id: null,
          email: null,
          name: apiToken.team.name,
        },
      },
    });

    await next();
  })
  .use('/share', bodyLimit({ maxSize: 8 * 1024 }))
  .use('/mcp', bodyLimit({ maxSize: 64 * 1024 }))
  .get('/documents', async (c) => {
    const input = ZAgentFindDocumentsSchema.parse(c.req.query());
    return c.json(await findAgentDocuments({ ...c.var.agentContext, ...input }));
  })
  .post('/share', async (c) => {
    if (c.req.header('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
      return c.json({ code: AppErrorCode.INVALID_BODY, message: 'Expected an application/json request.' }, 415);
    }

    const input = ZAgentShareDocumentSchema.parse(await c.req.json());
    return c.json(await shareAgentDocument({ ...c.var.agentContext, ...input }));
  })
  .all('/mcp', (c) =>
    handleAgentMcp(c.req.raw, {
      findDocuments: (args) => findAgentDocuments({ ...c.var.agentContext, ...ZAgentFindDocumentsSchema.parse(args) }),
      shareDocument: (args) => shareAgentDocument({ ...c.var.agentContext, ...ZAgentShareDocumentSchema.parse(args) }),
    }),
  );
