import { prisma } from '@documenso/prisma';
import { DocumentStatus, EnvelopeType, RecipientRole, SendStatus, SigningStatus } from '@prisma/client';

import { TEAM_DOCUMENT_VISIBILITY_MAP } from '../../constants/teams';
import { AppError, AppErrorCode } from '../../errors/app-error';
import { extractDerivedDocumentEmailSettings } from '../../types/document-email';
import type { ApiRequestMetadata } from '../../universal/extract-request-metadata';
import { isRecipientEmailValidForSending, isRecipientExpired } from '../../utils/recipients';
import { sendDocument } from '../document/send-document';
import { getEmailContext } from '../email/get-email-context';
import { getEnvelopeWhereInput } from '../envelope/get-envelope-by-id';
import { getTeamById } from '../team/get-team';
import { assertSenderNotDisabled } from '../user/assert-user-not-disabled';
import { sendAgentDocumentCopy } from './send-agent-document-copy';

type AgentDocumentContext = {
  userId: number;
  teamId: number;
  requestMetadata: ApiRequestMetadata;
};

type FindAgentDocumentsOptions = AgentDocumentContext & {
  title: string;
};

type ShareAgentDocumentOptions = AgentDocumentContext & {
  documentId: string;
  recipientEmail: string;
  mode: 'sign' | 'view';
};

const MAX_DOCUMENT_RESULTS = 10;

export const findAgentDocuments = async ({ userId, teamId, title }: FindAgentDocumentsOptions) => {
  const team = await getTeamById({ userId, teamId });
  // Prisma's case-insensitive equality uses ILIKE on Postgres.
  const literalTitle = title.trim().replace(/[\\%_]/g, '\\$&');

  const documents = await prisma.envelope.findMany({
    where: {
      teamId: team.id,
      type: EnvelopeType.DOCUMENT,
      deletedAt: null,
      title: { equals: literalTitle, mode: 'insensitive' },
      OR: [
        {
          userId,
        },
        {
          visibility: {
            in: TEAM_DOCUMENT_VISIBILITY_MAP[team.currentTeamRole],
          },
        },
      ],
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: MAX_DOCUMENT_RESULTS + 1,
    select: {
      id: true,
      title: true,
      status: true,
    },
  });

  return {
    documents: documents.slice(0, MAX_DOCUMENT_RESULTS),
    hasMore: documents.length > MAX_DOCUMENT_RESULTS,
  };
};

export const shareAgentDocument = async ({
  userId,
  teamId,
  requestMetadata,
  documentId,
  recipientEmail,
  mode,
}: ShareAgentDocumentOptions) => {
  const email = recipientEmail.trim().toLowerCase();
  const role = mode === 'sign' ? RecipientRole.SIGNER : RecipientRole.VIEWER;
  const id = { type: 'envelopeId', id: documentId } as const;
  const { envelopeWhereInput } = await getEnvelopeWhereInput({
    id,
    type: EnvelopeType.DOCUMENT,
    userId,
    teamId,
  });

  const getDocument = () =>
    prisma.envelope.findFirst({
      where: {
        ...envelopeWhereInput,
        teamId,
        deletedAt: null,
      },
      include: {
        documentMeta: true,
        recipients: true,
      },
    });

  const result = { documentId, recipientEmail: email, mode };
  const document = await getDocument();

  if (!document) {
    throw new AppError(AppErrorCode.NOT_FOUND, { userMessage: 'Document not found.' });
  }

  if (mode === 'view' && document.status === DocumentStatus.COMPLETED) {
    return sendAgentDocumentCopy({ documentId, recipientEmail: email, userId, teamId, requestMetadata });
  }

  const recipient = document.recipients[0];

  if (document.recipients.length !== 1 || recipient.email.toLowerCase() !== email || recipient.role !== role) {
    throw new AppError(AppErrorCode.INVALID_REQUEST, {
      userMessage: 'The document must have exactly one prepared recipient matching the requested email and role.',
    });
  }

  if (document.status !== DocumentStatus.DRAFT) {
    assertPreviouslyShared(document.status, recipient);

    return { ...result, status: 'already_shared' } as const;
  }

  if (!isRecipientEmailValidForSending(recipient) || isRecipientExpired(recipient)) {
    throw new AppError(AppErrorCode.INVALID_REQUEST, {
      userMessage: 'The prepared recipient cannot receive an invitation.',
    });
  }

  await assertSenderNotDisabled({ userId: document.userId });

  if (!extractDerivedDocumentEmailSettings(document.documentMeta).recipientSigningRequest) {
    throw new AppError(AppErrorCode.INVALID_REQUEST, { userMessage: 'Document invitations are disabled.' });
  }

  const { emailsDisabled } = await getEmailContext({
    emailType: 'RECIPIENT',
    source: { type: 'team', teamId },
    meta: document.documentMeta,
  });

  if (emailsDisabled) {
    throw new AppError(AppErrorCode.INVALID_REQUEST, { userMessage: 'Team email delivery is disabled.' });
  }

  try {
    await sendDocument({
      id,
      userId,
      teamId,
      requestMetadata,
      requireDraftRecipient: {
        id: recipient.id,
        email,
        role,
        envelopeAuthOptions: document.authOptions,
        recipientAuthOptions: recipient.authOptions,
      },
    });
  } catch (error) {
    if (error instanceof AppError && error.code === AppErrorCode.MISSING_SIGNATURE_FIELD) {
      throw new AppError(error.code, {
        userMessage: 'Place a signature field for the prepared signer in Documenso before sharing.',
      });
    }

    if (!(error instanceof AppError) || error.code !== AppErrorCode.ALREADY_EXISTS) {
      throw error;
    }

    const currentDocument = await getDocument();
    const currentRecipient = currentDocument?.recipients[0];

    if (
      !currentDocument ||
      currentDocument.recipients.length !== 1 ||
      currentRecipient?.id !== recipient.id ||
      currentRecipient.email.toLowerCase() !== email ||
      currentRecipient.role !== role
    ) {
      throw error;
    }

    assertPreviouslyShared(currentDocument.status, currentRecipient);

    return { ...result, status: 'already_shared' } as const;
  }

  return { ...result, status: 'queued' } as const;
};

const assertPreviouslyShared = (
  status: DocumentStatus,
  recipient: { sendStatus: SendStatus; signingStatus: SigningStatus; expiresAt: Date | null },
) => {
  if (status !== DocumentStatus.PENDING && status !== DocumentStatus.COMPLETED) {
    throw new AppError(AppErrorCode.INVALID_REQUEST, {
      userMessage: 'This document cannot be shared in its current state.',
    });
  }

  if (recipient.signingStatus === SigningStatus.SIGNED) {
    return;
  }

  if (isRecipientExpired(recipient) || recipient.signingStatus === SigningStatus.REJECTED) {
    throw new AppError(AppErrorCode.INVALID_REQUEST, {
      userMessage: 'The prepared recipient cannot receive an invitation.',
    });
  }

  if (recipient.sendStatus !== SendStatus.SENT) {
    throw new AppError(AppErrorCode.INVALID_REQUEST, {
      userMessage: 'The document is pending and the invitation has not been confirmed. Check its status in Documenso.',
    });
  }
};
