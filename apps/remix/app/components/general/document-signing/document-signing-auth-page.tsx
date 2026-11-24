import { authClient } from '@documenso/auth/client';
import { useIsFramed } from '@documenso/lib/client-only/hooks/use-is-framed';
import { useOptionalSession } from '@documenso/lib/client-only/providers/session';
import { formatPath } from '@documenso/lib/constants/app';
import { Button } from '@documenso/ui/primitives/button';
import { useToast } from '@documenso/ui/primitives/use-toast';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { LockKeyholeIcon } from 'lucide-react';
import { useState } from 'react';

import { EmbedPopupAuth } from '~/components/embed/embed-popup-auth';

export type DocumentSigningAuthPageViewProps = {
  email?: string;
  emailHasAccount?: boolean;
};

export const DocumentSigningAuthPageView = ({ email, emailHasAccount }: DocumentSigningAuthPageViewProps) => {
  const { _ } = useLingui();
  const { toast } = useToast();

  const isFramed = useIsFramed();

  const { sessionData } = useOptionalSession();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const mismatchedUserEmail =
    sessionData?.user && email && sessionData.user.email !== email ? sessionData.user.email : undefined;

  const handleChangeAccount = async (email?: string) => {
    try {
      setIsSigningOut(true);

      let redirectPath = formatPath('/signin');

      if (email) {
        redirectPath = emailHasAccount ? formatPath(`/signin#email=${email}`) : formatPath(`/signup#email=${email}`);
      }

      await authClient.signOut({
        redirectPath,
      });
    } catch {
      toast({
        title: _(msg`Something went wrong`),
        description: _(msg`We were unable to log you out at this time.`),
        duration: 10000,
        variant: 'destructive',
      });
    }

    setIsSigningOut(false);
  };

  return (
    <div className="mx-auto flex min-h-[60dvh] w-full max-w-lg flex-col items-center justify-center px-4 py-8">
      <section className="w-full rounded-3xl border bg-popover p-6 text-popover-foreground shadow-lg shadow-primary/5 sm:p-8">
        <div aria-hidden="true" className="mb-4 flex size-11 items-center justify-center rounded-xl border bg-muted">
          <LockKeyholeIcon className="size-5" />
        </div>

        <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          <Trans>Authentication required</Trans>
        </h1>

        <p className="mt-3 break-words text-muted-foreground text-sm leading-relaxed">
          {email ? (
            <Trans>
              You need to be logged in as <strong>{email}</strong> to view this page.
            </Trans>
          ) : (
            <Trans>You need to be logged in to view this page.</Trans>
          )}
        </p>

        {isFramed ? (
          <EmbedPopupAuth
            className="mt-4"
            email={email || undefined}
            signedInAs={mismatchedUserEmail}
            onSuccess={() => window.location.reload()}
          />
        ) : (
          <Button
            className="mt-4 w-full"
            type="submit"
            onClick={async () => handleChangeAccount(email)}
            loading={isSigningOut}
          >
            {emailHasAccount ? <Trans>Login</Trans> : <Trans>Sign up</Trans>}
          </Button>
        )}
      </section>
    </div>
  );
};
