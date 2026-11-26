import { AdminRuleEngine } from '@documenso/ee/server-only/admin-rules/admin-rule-engine';
import { prisma } from '@documenso/prisma';
import { msg } from '@lingui/core/macro';
import { DocumentDataType, DocumentStatus, EnvelopeType, Prisma } from '@prisma/client';
import { z } from 'zod';

import { getI18nInstance } from '../../client-only/providers/i18n-server';
import { AppError, AppErrorCode } from '../../errors/app-error';
import { extractDerivedDocumentEmailSettings } from '../../types/document-email';
import type { ApiRequestMetadata } from '../../universal/extract-request-metadata';
import { getFileServerSide } from '../../universal/upload/get-file.server';
import { getPresignGetUrl } from '../../universal/upload/server-actions';
import { extractDocumentAuthMethods } from '../../utils/document-auth';
import { logger } from '../../utils/logger';
import { isRecipientEmailValidForSending } from '../../utils/recipients';
import { getEmailContext } from '../email/get-email-context';
import { getEnvelopeWhereInput } from '../envelope/get-envelope-by-id';
import { assertOrganisationRatesAndLimits } from '../rate-limit/assert-organisation-rates-and-limits';
import { assertSenderNotDisabled, assertUserNotDisabled } from '../user/assert-user-not-disabled';

type SendAgentDocumentCopyOptions = {
  documentId: string;
  recipientEmail: string;
  userId: number;
  teamId: number;
  requestMetadata: ApiRequestMetadata;
};

const ZMailAcceptance = z.object({
  accepted: z.string().array().optional(),
  messageId: z.string().optional(),
});

const MAX_COPY_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const MAX_COPY_ATTACHMENTS = 10;

export const sendAgentDocumentCopy = async ({
  documentId,
  recipientEmail,
  userId,
  teamId,
  requestMetadata,
}: SendAgentDocumentCopyOptions) => {
  const email = recipientEmail.trim().toLowerCase();

  if (!isRecipientEmailValidForSending({ email })) {
    throw copyError(AppErrorCode.INVALID_REQUEST, 'The recipient cannot receive an email.');
  }

  const { envelopeWhereInput } = await getEnvelopeWhereInput({
    id: { type: 'envelopeId', id: documentId },
    type: EnvelopeType.DOCUMENT,
    userId,
    teamId,
  });
  const envelopeWhere = { ...envelopeWhereInput, teamId, deletedAt: null };

  const [document, sender] = await Promise.all([
    prisma.envelope.findFirst({
      where: envelopeWhere,
      include: {
        documentMeta: true,
        recipients: { select: { id: true, email: true, authOptions: true } },
        envelopeItems: {
          orderBy: { order: 'asc' },
          take: MAX_COPY_ATTACHMENTS + 1,
          select: { title: true, documentDataId: true },
        },
        team: { select: { id: true, url: true, name: true } },
      },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true, twoFactorEnabled: true, disabled: true },
    }),
  ]);

  if (!document || !sender) {
    throw copyError(AppErrorCode.NOT_FOUND, 'Document not found.');
  }

  assertUserNotDisabled(sender);
  await assertSenderNotDisabled({ userId: document.userId });

  if (document.status !== DocumentStatus.COMPLETED || !document.completedAt || document.envelopeItems.length === 0) {
    throw copyError(AppErrorCode.INVALID_REQUEST, 'A sealed completed document is required.');
  }

  const { recipientAccessAuthRequired: requiresGlobalAccessAuth } = extractDocumentAuthMethods({
    documentAuth: document.authOptions,
  });
  const requiresRecipientAccessAuth = document.recipients.some(
    ({ authOptions }) =>
      extractDocumentAuthMethods({ documentAuth: document.authOptions, recipientAuth: authOptions })
        .recipientAccessAuthRequired,
  );

  if (requiresGlobalAccessAuth || requiresRecipientAccessAuth) {
    throw copyError(
      AppErrorCode.FORBIDDEN,
      'Documents that require recipient authentication cannot be shared as email attachments.',
    );
  }

  const copyKey = { envelopeId: document.id, recipientEmail: email };
  const copyWhere = { envelopeId_recipientEmail: copyKey };
  const result = { documentId: document.id, recipientEmail: email, mode: 'view' } as const;
  const existingCopy = await prisma.agentDocumentCopyShare.findUnique({ where: copyWhere });

  if (existingCopy) {
    assertCopyAccepted(existingCopy);
    return { ...result, status: 'already_shared' } as const;
  }

  const emailContext = await getEmailContext({
    emailType: 'RECIPIENT',
    source: { type: 'team', teamId },
    meta: document.documentMeta,
  });

  if (emailContext.emailsDisabled || !extractDerivedDocumentEmailSettings(document.documentMeta).documentCompleted) {
    throw copyError(AppErrorCode.FORBIDDEN, 'Completed document emails are disabled.');
  }

  const rule = await new AdminRuleEngine({
    requestMetadata: requestMetadata.requestMetadata,
    requestSource: requestMetadata.source,
  }).run({
    trigger: 'EMAIL_SENT',
    envelope: {
      ...document,
      team: {
        ...document.team,
        organisation: {
          id: emailContext.organisationId,
          type: emailContext.organisationType,
          name: emailContext.organisationName,
          organisationClaim: emailContext.claims,
        },
      },
    },
    sender,
    emailType: 'completed',
    recipients: [{ email }],
  });

  if (rule.isBlocked || rule.hasDisabledEmails) {
    throw copyError(AppErrorCode.FORBIDDEN, 'An admin rule blocked the document copy email.');
  }

  const attachments = await loadCopyAttachments(document);

  const i18n = await getI18nInstance(emailContext.emailLanguage);
  const documentTitle = document.title;
  const subject = i18n._(msg`Completed document copy`);
  const body = i18n._(msg`A completed copy of "${documentTitle}" is attached.`);

  try {
    await prisma.agentDocumentCopyShare.create({
      data: {
        envelope: {
          connect: {
            ...envelopeWhere,
            id: document.id,
            status: DocumentStatus.COMPLETED,
            completedAt: document.completedAt,
            authOptions: authSnapshotFilter(document.authOptions),
            recipients: {
              every: {
                OR: document.recipients.map((recipient) => ({
                  id: recipient.id,
                  authOptions: authSnapshotFilter(recipient.authOptions),
                })),
              },
            },
          },
        },
        recipientEmail: email,
        teamId,
        requestedByUserId: userId,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw copyError(AppErrorCode.NOT_FOUND, 'The document or its access settings changed before sharing.');
    }

    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
      throw error;
    }

    const copy = await prisma.agentDocumentCopyShare.findUniqueOrThrow({ where: copyWhere });
    assertCopyAccepted(copy);
    return { ...result, status: 'already_shared' } as const;
  }

  const pendingCopyWhere = { ...copyWhere, acceptedAt: null };

  try {
    await assertOrganisationRatesAndLimits({
      organisationId: emailContext.organisationId,
      organisationClaim: emailContext.claims,
      type: 'email',
      count: 1,
    });
  } catch (error) {
    await prisma.agentDocumentCopyShare.delete({ where: pendingCopyWhere });
    throw error;
  }

  try {
    const response: unknown = await emailContext.emailTransport.sendMail({
      to: email,
      from: emailContext.senderEmail,
      replyTo: emailContext.replyToEmail,
      subject,
      text: body,
      attachments,
    });

    const acceptance = ZMailAcceptance.parse(response);
    const accepted = acceptance.accepted
      ? acceptance.accepted.some((address) => address.toLowerCase() === email)
      : !!acceptance.messageId;

    if (!accepted) {
      throw new Error('The email transport did not confirm acceptance.');
    }

    await prisma.agentDocumentCopyShare.update({
      where: pendingCopyWhere,
      data: { acceptedAt: new Date() },
    });
  } catch {
    // A timeout can follow transport acceptance. Leaving the claim blocks a duplicate dispatch.
    logger.warn({ envelopeId: document.id, teamId }, 'Agent document copy delivery unconfirmed');
    throw createUnconfirmedCopyError();
  }

  return { ...result, status: 'queued' } as const;
};

const assertCopyAccepted = (copy: { acceptedAt: Date | null }) => {
  if (!copy.acceptedAt) {
    throw createUnconfirmedCopyError();
  }
};

const loadCopyAttachments = async ({
  title,
  internalVersion,
  envelopeItems,
}: {
  title: string;
  internalVersion: number;
  envelopeItems: { title: string; documentDataId: string }[];
}) => {
  if (envelopeItems.length > MAX_COPY_ATTACHMENTS) {
    throw copyAttachmentLimitError();
  }

  const attachments: { filename: string; content: Buffer; contentType: string }[] = [];
  const signal = AbortSignal.timeout(20_000);
  let totalBytes = 0;

  for (const item of envelopeItems) {
    const content = await readCopyAttachment(item.documentDataId, MAX_COPY_ATTACHMENT_BYTES - totalBytes, signal);
    totalBytes += content.length;

    const name = internalVersion === 1 ? title : item.title;
    attachments.push({
      filename: /\.pdf$/i.test(name) ? name : `${name}.pdf`,
      content,
      contentType: 'application/pdf',
    });
  }

  return attachments;
};

const readCopyAttachment = async (documentDataId: string, remainingBytes: number, signal: AbortSignal) => {
  // Filter inline data in PostgreSQL before transferring a potentially oversized PDF to Node.
  const [source] = await prisma.$queryRaw<{ type: DocumentDataType; data: string }[]>`
    SELECT "type", "data" FROM "DocumentData"
    WHERE "id" = ${documentDataId} AND (
      "type" = 'S3_PATH'
      OR ("type" = 'BYTES' AND octet_length("data") <= ${remainingBytes})
      OR ("type" = 'BYTES_64' AND octet_length("data") <= ${Math.ceil(remainingBytes / 3) * 4})
    )
  `;

  if (!source) {
    throw copyAttachmentLimitError();
  }

  if (source.type === DocumentDataType.S3_PATH) {
    return await readStoredCopyAttachment(source.data, remainingBytes, signal);
  }

  const data = await getFileServerSide(source);

  if (data.length > remainingBytes) {
    throw copyAttachmentLimitError();
  }

  return Buffer.from(data);
};

const readStoredCopyAttachment = async (key: string, remainingBytes: number, signal: AbortSignal) => {
  const { url } = await getPresignGetUrl(key);
  const response = await fetch(url, { signal });

  if (!response.ok || !response.body) {
    throw copyError(AppErrorCode.UNKNOWN_ERROR, 'A completed PDF could not be loaded.', 502);
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytesRead = 0;

  try {
    if (Number(response.headers.get('content-length')) > remainingBytes) {
      throw copyAttachmentLimitError();
    }

    while (true) {
      const chunk = await reader.read();

      if (chunk.done) {
        return Buffer.concat(chunks, bytesRead);
      }

      bytesRead += chunk.value.length;

      if (bytesRead > remainingBytes) {
        throw copyAttachmentLimitError();
      }

      chunks.push(chunk.value);
    }
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
};

const authSnapshotFilter = (authOptions: Prisma.JsonValue) => ({ equals: authOptions ?? Prisma.AnyNull });

const copyError = (code: AppErrorCode, userMessage: string, statusCode?: number) =>
  new AppError(code, { message: userMessage, userMessage, statusCode });

const copyAttachmentLimitError = () =>
  copyError(AppErrorCode.INVALID_REQUEST, 'A document copy can contain up to 10 PDFs totaling up to 10 MiB.');

const createUnconfirmedCopyError = () =>
  copyError(
    AppErrorCode.ALREADY_EXISTS,
    'A document copy delivery was attempted and its status is unconfirmed. Check your email transport for the result.',
    409,
  );
