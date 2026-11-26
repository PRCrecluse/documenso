import { NEXT_PUBLIC_WEBAPP_URL } from '@documenso/lib/constants/app';
import { createApiToken } from '@documenso/lib/server-only/public-api/create-api-token';
import { DOCUMENT_AUDIT_LOG_TYPE } from '@documenso/lib/types/document-audit-logs';
import { DocumentAuth } from '@documenso/lib/types/document-auth';
import { nanoid } from '@documenso/lib/universal/id';
import { prisma } from '@documenso/prisma';
import { DocumentStatus, FieldType, RecipientRole, SendStatus } from '@documenso/prisma/client';
import { seedCompletedDocument, seedDraftDocument } from '@documenso/prisma/seed/documents';
import { seedUser } from '@documenso/prisma/seed/users';
import { expect, test } from '@playwright/test';

const baseUrl = `${NEXT_PUBLIC_WEBAPP_URL()}/api/agent`;

const seedAgentTeam = async () => {
  const { user, team } = await seedUser();
  const { token } = await createApiToken({
    userId: user.id,
    teamId: team.id,
    tokenName: 'Agent sharing test',
    expiresIn: null,
  });

  return { user, team, headers: { Authorization: `Bearer ${token}` } };
};

test('restricts document search and writes to the authenticated team', async ({ request }) => {
  const { user, team, headers } = await seedAgentTeam();
  const other = await seedUser();
  const title = `Agent authorization test ${nanoid()}`;
  const ownDocument = await seedDraftDocument(user, team.id, [], {
    createDocumentOptions: { title },
  });
  const otherDocument = await seedDraftDocument(user, other.team.id, [], {
    createDocumentOptions: { title },
  });

  const unauthenticated = await request.get(`${baseUrl}/documents`, { params: { title } });
  expect(unauthenticated.status()).toBe(401);

  const response = await request.get(`${baseUrl}/documents`, { headers, params: { title } });
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({
    documents: [{ id: ownDocument.id, title, status: DocumentStatus.DRAFT }],
    hasMore: false,
  });

  const wrongTeam = await request.post(`${baseUrl}/share`, {
    headers,
    data: { documentId: otherDocument.id, recipientEmail: 'viewer@example.invalid', mode: 'view' },
  });
  expect(wrongTeam.status()).toBe(404);
});

test('sends one signing invitation and refuses different recipients or roles', async ({ request }) => {
  const { user, team, headers } = await seedAgentTeam();
  const recipientEmail = `signer-${nanoid().toLowerCase()}@example.invalid`;
  const document = await seedDraftDocument(user, team.id, [recipientEmail]);

  await prisma.field.updateMany({
    where: {
      envelopeId: document.id,
    },
    data: {
      type: FieldType.SIGNATURE,
    },
  });

  const input = { documentId: document.id, recipientEmail, mode: 'sign' };
  const wrongRecipient = await request.post(`${baseUrl}/share`, {
    headers,
    data: { ...input, recipientEmail: 'other@example.invalid' },
  });
  expect(wrongRecipient.status()).toBe(400);

  const wrongRole = await request.post(`${baseUrl}/share`, {
    headers,
    data: { ...input, mode: 'view' },
  });
  expect(wrongRole.status()).toBe(400);

  const responses = await Promise.all([
    request.post(`${baseUrl}/share`, { headers, data: input }),
    request.post(`${baseUrl}/share`, { headers, data: input }),
  ]);
  const results = await Promise.all(responses.map((response) => response.json()));
  expect(results.filter((result) => result.status === 'queued')).toEqual([{ ...input, status: 'queued' }]);
  const duplicate = results.find((result) => result.status !== 'queued');
  expect(duplicate.status ?? duplicate.code).toMatch(/^(already_shared|INVALID_REQUEST)$/);

  await expect
    .poll(async () => {
      const recipient = await prisma.recipient.findFirstOrThrow({
        where: {
          envelopeId: document.id,
        },
      });
      return recipient.sendStatus;
    })
    .toBe(SendStatus.SENT);

  const retry = await request.post(`${baseUrl}/share`, { headers, data: input });
  expect(await retry.json()).toEqual({ ...input, status: 'already_shared' });
  expect(
    await prisma.documentAuditLog.count({
      where: {
        envelopeId: document.id,
        type: DOCUMENT_AUDIT_LOG_TYPE.DOCUMENT_SENT,
      },
    }),
  ).toBe(1);
});

test('discovers tools and sends a viewing invitation over MCP', async ({ request }) => {
  const { user, team, headers } = await seedAgentTeam();
  const recipientEmail = `viewer-${nanoid().toLowerCase()}@example.invalid`;
  const document = await seedDraftDocument(user, team.id, []);

  await prisma.recipient.create({
    data: {
      envelopeId: document.id,
      email: recipientEmail,
      role: RecipientRole.VIEWER,
      token: nanoid(),
    },
  });

  const protocolVersion = '2025-03-26';
  const mcpHeaders = {
    ...headers,
    Accept: 'application/json, text/event-stream',
    'MCP-Protocol-Version': protocolVersion,
  };
  const sendMcpRequest = async (method: string, params?: unknown) => {
    const response = await request.post(`${baseUrl}/mcp`, {
      headers: mcpHeaders,
      data: { jsonrpc: '2.0', id: 1, method, params },
    });

    expect(response.status()).toBe(200);

    if (response.headers()['content-type']?.startsWith('text/event-stream')) {
      const json = (await response.text()).match(/^data: (.+)$/m)?.[1];

      if (!json) {
        throw new Error('The MCP reply did not contain an SSE data event.');
      }

      return JSON.parse(json);
    }

    return await response.json();
  };

  const initialize = await sendMcpRequest('initialize', {
    protocolVersion,
    capabilities: {},
    clientInfo: { name: 'documenso-tests', version: '1' },
  });
  expect(initialize.result.protocolVersion).toBe(protocolVersion);

  const tools = await sendMcpRequest('tools/list');
  expect(tools.result.tools).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: 'find_documents', annotations: expect.objectContaining({ readOnlyHint: true }) }),
      expect.objectContaining({
        name: 'share_document',
        annotations: expect.objectContaining({ readOnlyHint: false }),
      }),
    ]),
  );

  const input = { documentId: document.id, recipientEmail, mode: 'view' };
  const share = await sendMcpRequest('tools/call', { name: 'share_document', arguments: input });
  expect(share.result.structuredContent).toEqual({ ...input, status: 'queued' });
});

test('emails a completed PDF copy once without adding the recipient to the original document', async ({ request }) => {
  const { user, team, headers } = await seedAgentTeam();
  const signerEmail = 'original-signer@example.invalid';
  const document = await seedCompletedDocument(user, team.id, [signerEmail], {
    createDocumentOptions: { completedAt: new Date() },
  });
  const recipientEmail = `copy-${nanoid().toLowerCase()}@example.invalid`;
  const input = { documentId: document.id, recipientEmail, mode: 'view' };

  const originalSigner = await prisma.recipient.findFirstOrThrow({
    where: {
      envelopeId: document.id,
    },
  });
  await prisma.recipient.update({
    where: {
      id: originalSigner.id,
    },
    data: {
      authOptions: { accessAuth: [DocumentAuth.ACCOUNT], actionAuth: [] },
    },
  });

  const blocked = await request.post(`${baseUrl}/share`, { headers, data: input });
  expect(blocked.status(), await blocked.text()).toBe(403);

  await prisma.recipient.update({
    where: {
      id: originalSigner.id,
    },
    data: {
      authOptions: { accessAuth: [], actionAuth: [] },
    },
  });

  const responses = await Promise.all([
    request.post(`${baseUrl}/share`, { headers, data: input }),
    request.post(`${baseUrl}/share`, { headers, data: input }),
  ]);
  const results = await Promise.all(responses.map((response) => response.json()));
  expect(results.filter((result) => result.status === 'queued')).toEqual([{ ...input, status: 'queued' }]);
  const duplicate = results.find((result) => result.status !== 'queued');
  expect(duplicate.status ?? duplicate.code).toMatch(/^(already_shared|ALREADY_EXISTS)$/);

  const retry = await request.post(`${baseUrl}/share`, { headers, data: input });
  expect(await retry.json()).toEqual({ ...input, status: 'already_shared' });

  const original = await prisma.envelope.findUniqueOrThrow({
    where: {
      id: document.id,
    },
    select: {
      status: true,
      recipients: {
        select: {
          email: true,
        },
      },
    },
  });
  expect(original).toEqual({ status: DocumentStatus.COMPLETED, recipients: [{ email: signerEmail }] });
});
