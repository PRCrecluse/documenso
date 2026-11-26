import { getOptionalSession } from '@documenso/auth/server/lib/utils/get-session';
import { useOptionalSession } from '@documenso/lib/client-only/providers/session';
import { loadRecipientBrandingByTeamId } from '@documenso/lib/server-only/branding/load-recipient-branding';
import { getDocumentAndSenderByToken } from '@documenso/lib/server-only/document/get-document-by-token';
import { isRecipientAuthorized } from '@documenso/lib/server-only/document/is-recipient-authorized';
import { getRecipientByToken } from '@documenso/lib/server-only/recipient/get-recipient-by-token';
import { Button } from '@documenso/ui/primitives/button';
import { Trans } from '@lingui/react/macro';
import { TimerOffIcon } from 'lucide-react';
import { Link } from 'react-router';

import { DocumentSigningAuthPageView } from '~/components/general/document-signing/document-signing-auth-page';
import { SigningStatusPanel } from '~/components/general/document-signing/signing-status-panel';
import { RecipientBranding } from '~/components/general/recipient-branding';
import { useCspNonce } from '~/utils/nonce';

import type { Route } from './+types/expired';

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

  if (!document) {
    throw new Response('Not Found', { status: 404 });
  }

  const branding = await loadRecipientBrandingByTeamId({ teamId: document.teamId });

  const title = document.title;

  const recipient = await getRecipientByToken({ token }).catch(() => null);

  if (!recipient) {
    throw new Response('Not Found', { status: 404 });
  }

  const isDocumentAccessValid = await isRecipientAuthorized({
    type: 'ACCESS',
    documentAuthOptions: document.authOptions,
    recipient,
    userId: user?.id,
  });

  const recipientEmail = recipient.email;

  if (isDocumentAccessValid) {
    return {
      isDocumentAccessValid: true,
      recipientEmail,
      title,
      branding,
    };
  }

  return {
    isDocumentAccessValid: false,
    recipientEmail,
    branding,
  };
}

export default function ExpiredSigningPage({ loaderData }: Route.ComponentProps) {
  const { sessionData } = useOptionalSession();
  const user = sessionData?.user;
  const cspNonce = useCspNonce();

  const { isDocumentAccessValid, recipientEmail, title, branding } = loaderData;

  if (!isDocumentAccessValid) {
    return (
      <>
        <RecipientBranding branding={branding} cspNonce={cspNonce} />
        <DocumentSigningAuthPageView email={recipientEmail} />
      </>
    );
  }

  return (
    <>
      <RecipientBranding branding={branding} cspNonce={cspNonce} />
      <SigningStatusPanel
        title={<Trans>Signing Deadline Expired</Trans>}
        documentTitle={title}
        icon={<TimerOffIcon className="size-6 text-orange-700 dark:text-orange-300" />}
        className="my-8 sm:my-16"
      >
        <p className="mt-4 max-w-lg text-muted-foreground text-sm leading-relaxed">
          <Trans>
            The signing deadline for this document has passed. Please contact the document owner if you need a new copy
            to sign.
          </Trans>
        </p>

        {user && (
          <Button className="mt-6" asChild>
            <Link to="/">
              <Trans>Return Home</Trans>
            </Link>
          </Button>
        )}
      </SigningStatusPanel>
    </>
  );
}
