import { getOptionalSession } from '@documenso/auth/server/lib/utils/get-session';
import { useOptionalSession } from '@documenso/lib/client-only/providers/session';
import { isSignupEnabledForProvider } from '@documenso/lib/constants/auth';
import { loadRecipientBrandingByTeamId } from '@documenso/lib/server-only/branding/load-recipient-branding';
import { getDocumentAndSenderByToken } from '@documenso/lib/server-only/document/get-document-by-token';
import { isRecipientAuthorized } from '@documenso/lib/server-only/document/is-recipient-authorized';
import { getFieldsForToken } from '@documenso/lib/server-only/field/get-fields-for-token';
import { getRecipientByToken } from '@documenso/lib/server-only/recipient/get-recipient-by-token';
import { getRecipientSignatures } from '@documenso/lib/server-only/recipient/get-recipient-signatures';
import { getUserByEmail } from '@documenso/lib/server-only/user/get-user-by-email';
import { isDocumentCompleted } from '@documenso/lib/utils/document';
import { trpc } from '@documenso/trpc/react';
import { DocumentShareButton } from '@documenso/ui/components/document/document-share-button';
import { SigningCard3D } from '@documenso/ui/components/signing-card';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';
import { Trans } from '@lingui/react/macro';
import { DocumentStatus, FieldType, RecipientRole } from '@prisma/client';
import { CheckCircle2Icon, ClockIcon, DownloadIcon, LoaderCircleIcon } from 'lucide-react';
import { Link } from 'react-router';
import { match } from 'ts-pattern';

import { EnvelopeDownloadDialog } from '~/components/dialogs/envelope-download-dialog';
import { ClaimAccount } from '~/components/general/claim-account';
import { DocumentSigningAuthPageView } from '~/components/general/document-signing/document-signing-auth-page';
import { SigningStatusPanel } from '~/components/general/document-signing/signing-status-panel';
import { RecipientBranding } from '~/components/general/recipient-branding';
import { useCspNonce } from '~/utils/nonce';

import type { Route } from './+types/complete';

export async function loader({ params, request }: Route.LoaderArgs) {
  const { user } = await getOptionalSession(request);

  const { token } = params;

  if (!token) {
    throw new Response('Not Found', { status: 404 });
  }

  const document = await getDocumentAndSenderByToken({
    token,
    requireAccessAuth: false,
  }).catch(() => null);

  if (!document || !document.documentData) {
    throw new Response('Not Found', { status: 404 });
  }

  const branding = await loadRecipientBrandingByTeamId({ teamId: document.teamId });

  const [fields, recipient] = await Promise.all([
    getFieldsForToken({ token }),
    getRecipientByToken({ token }).catch(() => null),
  ]);

  if (!recipient) {
    throw new Response('Not Found', { status: 404 });
  }

  const isDocumentAccessValid = await isRecipientAuthorized({
    type: 'ACCESS',
    documentAuthOptions: document.authOptions,
    recipient,
    userId: user?.id,
  });

  if (!isDocumentAccessValid) {
    return {
      isDocumentAccessValid: false,
      recipientEmail: recipient.email,
      branding,
    } as const;
  }

  const signatures = await getRecipientSignatures({ recipientId: recipient.id });
  const isExistingUser = await getUserByEmail({ email: recipient.email })
    .then((u) => !!u)
    .catch(() => false);

  const recipientName =
    recipient.name || fields.find((field) => field.type === FieldType.NAME)?.customText || recipient.email;

  const canSignUp = !isExistingUser && isSignupEnabledForProvider('email');

  const canRedirectToFolder = user && document.userId === user.id && document.folderId && document.team?.url;

  const returnToHomePath = canRedirectToFolder ? `/t/${document.team.url}/documents/f/${document.folderId}` : '/';

  return {
    isDocumentAccessValid: true,
    canSignUp,
    recipientName,
    recipientEmail: recipient.email,
    signatures,
    document,
    recipient,
    returnToHomePath,
    branding,
  };
}

export default function CompletedSigningPage({ loaderData }: Route.ComponentProps) {
  const { sessionData } = useOptionalSession();
  const user = sessionData?.user;
  const cspNonce = useCspNonce();

  const {
    isDocumentAccessValid,
    canSignUp,
    recipientName,
    signatures,
    document,
    recipient,
    recipientEmail,
    returnToHomePath,
    branding,
  } = loaderData;

  // Poll signing status every few seconds
  const { data: signingStatusData } = trpc.envelope.signingStatus.useQuery(
    {
      token: recipient?.token || '',
    },
    {
      refetchInterval: 3000,
      initialData: match(document?.status)
        .with(DocumentStatus.COMPLETED, () => ({ status: 'COMPLETED' }) as const)
        .with(DocumentStatus.REJECTED, () => ({ status: 'REJECTED' }) as const)
        .with(DocumentStatus.PENDING, () => ({ status: 'PENDING' }) as const)
        .otherwise(() => ({ status: 'PENDING' }) as const),
    },
  );

  // Use signing status from query if available, otherwise fall back to document status
  const signingStatus = signingStatusData?.status ?? 'PENDING';

  if (!isDocumentAccessValid) {
    return (
      <>
        <RecipientBranding branding={branding} cspNonce={cspNonce} />
        <DocumentSigningAuthPageView email={recipientEmail} />
      </>
    );
  }

  const heading = match(recipient.role)
    .with(RecipientRole.SIGNER, () => <Trans>Document Signed</Trans>)
    .with(RecipientRole.VIEWER, () => <Trans>Document Viewed</Trans>)
    .with(RecipientRole.APPROVER, () => <Trans>Document Approved</Trans>)
    .otherwise(() => <Trans>Document Completed</Trans>);

  const status = match({ status: signingStatus, deletedAt: document.deletedAt })
    .with({ status: 'COMPLETED' }, () => ({
      icon: <CheckCircle2Icon className="size-4 shrink-0" />,
      className: 'bg-primary/10 text-foreground',
      label: <Trans>Everyone has signed</Trans>,
      description: <Trans>Everyone has signed! You will receive an email copy of the signed document.</Trans>,
    }))
    .with({ status: 'PROCESSING' }, () => ({
      icon: <LoaderCircleIcon className="size-4 shrink-0 motion-safe:animate-spin" />,
      className: 'bg-orange-500/10 text-orange-800 dark:text-orange-300',
      label: <Trans>Processing document</Trans>,
      description: (
        <Trans>
          All recipients have signed. The document is being processed and you will receive an email copy shortly.
        </Trans>
      ),
    }))
    .with({ deletedAt: null }, () => ({
      icon: <ClockIcon className="size-4 shrink-0" />,
      className: 'bg-primary/10 text-foreground',
      label: <Trans>Waiting for others to sign</Trans>,
      description: <Trans>You will receive an email copy of the signed document once everyone has signed.</Trans>,
    }))
    .otherwise(() => ({
      icon: <ClockIcon className="size-4 shrink-0" />,
      className: 'bg-destructive/10 text-destructive',
      label: <Trans>Document no longer available to sign</Trans>,
      description: (
        <Trans>This document has been cancelled by the owner and is no longer available for others to sign.</Trans>
      ),
    }));

  return (
    <>
      <RecipientBranding branding={branding} cspNonce={cspNonce} />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-4 py-4 sm:py-12 lg:flex-row lg:items-stretch">
        <SigningStatusPanel title={heading} documentTitle={document.title} className="lg:mx-0">
          <div role="status" className="mt-4 flex flex-col items-center">
            <span
              className={cn(
                'inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 text-sm',
                status.className,
              )}
            >
              <span aria-hidden="true">{status.icon}</span>
              {status.label}
            </span>
            <p className="mt-3 max-w-lg text-muted-foreground text-sm leading-relaxed">{status.description}</p>
          </div>

          <div className="mt-6 flex w-full max-w-sm justify-center rounded-2xl border bg-muted/65 p-2.5 sm:p-4">
            <SigningCard3D name={recipientName} signature={signatures.at(0)} />
          </div>

          <div className="mt-6 flex w-full max-w-lg flex-col items-stretch justify-center gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <DocumentShareButton
              documentId={document.id}
              token={recipient.token}
              className="w-full max-w-none sm:w-auto"
            />

            {isDocumentCompleted(document) && (
              <EnvelopeDownloadDialog
                envelopeId={document.envelopeId}
                envelopeStatus={document.status}
                envelopeItems={document.envelopeItems}
                token={recipient.token}
                trigger={
                  <Button type="button" variant="outline">
                    <DownloadIcon className="mr-2 size-4" />
                    <Trans>Download</Trans>
                  </Button>
                }
              />
            )}

            {user && (
              <Button asChild>
                <Link to={returnToHomePath}>
                  <Trans>Go Back Home</Trans>
                </Link>
              </Button>
            )}
          </div>
        </SigningStatusPanel>

        {canSignUp && (
          <section className="flex w-full max-w-2xl flex-col justify-center rounded-3xl border bg-popover px-4 py-8 text-popover-foreground sm:px-8 sm:py-10 lg:max-w-sm">
            <h2 className="text-center font-semibold text-xl tracking-tight">
              <Trans>Need to sign documents?</Trans>
            </h2>

            <p className="mt-3 text-center text-muted-foreground text-sm leading-relaxed">
              <Trans>Create your account and start using state-of-the-art document signing.</Trans>
            </p>

            <ClaimAccount defaultName={recipientName} defaultEmail={recipient.email} />
          </section>
        )}
      </div>
    </>
  );
}
