import { authClient } from '@documenso/auth/client';
import { getOptionalSession } from '@documenso/auth/server/lib/utils/get-session';
import {
  IS_GOOGLE_SSO_ENABLED,
  IS_MICROSOFT_SSO_ENABLED,
  IS_OIDC_AUTO_REDIRECT_DISABLED,
  IS_OIDC_SSO_ENABLED,
  isSigninEnabledForProvider,
  isSignupEnabledForProvider,
  OIDC_PROVIDER_LABEL,
} from '@documenso/lib/constants/auth';
import { isValidReturnTo, normalizeReturnTo } from '@documenso/lib/utils/is-valid-return-to';
import { Alert, AlertDescription } from '@documenso/ui/primitives/alert';
import { Button } from '@documenso/ui/primitives/button';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { Loader2Icon } from 'lucide-react';
import { useEffect } from 'react';
import { Link, redirect, useSearchParams } from 'react-router';

import { SignInForm } from '~/components/forms/signin';
import { SIGNUP_ERROR_MESSAGES } from '~/components/forms/signup';
import { appMetaTags } from '~/utils/meta';

import type { Route } from './+types/signin';

export function meta() {
  return appMetaTags(msg`Sign In`);
}

export async function loader({ request }: Route.LoaderArgs) {
  const { session } = await getOptionalSession(request);

  // Embed sessions are rejected by the authenticated tree, so treat them as signed out here.
  const isAuthenticated = session !== null && !session.isEmbed;

  // SSR env variables.
  const isEmailPasswordSigninEnabled = isSigninEnabledForProvider('email');
  const isGoogleSSOEnabled = IS_GOOGLE_SSO_ENABLED && isSigninEnabledForProvider('google');
  const isMicrosoftSSOEnabled = IS_MICROSOFT_SSO_ENABLED && isSigninEnabledForProvider('microsoft');
  const isOIDCSSOEnabled = IS_OIDC_SSO_ENABLED && isSigninEnabledForProvider('oidc');

  // Automatically redirect to OIDC when it is the only enabled signin transport,
  // unless the redirect has been explicitly disabled via env.
  const isOIDCOnlyTransport =
    isOIDCSSOEnabled && !isEmailPasswordSigninEnabled && !isGoogleSSOEnabled && !isMicrosoftSSOEnabled;

  const shouldAutoRedirectToOIDC = isOIDCOnlyTransport && !IS_OIDC_AUTO_REDIRECT_DISABLED;

  const oidcProviderLabel = OIDC_PROVIDER_LABEL;

  const isSignupEnabled =
    isSignupEnabledForProvider('email') ||
    (IS_GOOGLE_SSO_ENABLED && isSignupEnabledForProvider('google')) ||
    (IS_MICROSOFT_SSO_ENABLED && isSignupEnabledForProvider('microsoft')) ||
    (IS_OIDC_SSO_ENABLED && isSignupEnabledForProvider('oidc'));

  let returnTo = new URL(request.url).searchParams.get('returnTo') ?? undefined;

  returnTo = isValidReturnTo(returnTo) ? normalizeReturnTo(returnTo) : undefined;

  if (isAuthenticated) {
    throw redirect(returnTo || '/');
  }

  return {
    isEmailPasswordSigninEnabled,
    isGoogleSSOEnabled,
    isMicrosoftSSOEnabled,
    isOIDCSSOEnabled,
    isSignupEnabled,
    oidcProviderLabel,
    returnTo,
    shouldAutoRedirectToOIDC,
  };
}

export default function SignIn({ loaderData }: Route.ComponentProps) {
  const {
    isEmailPasswordSigninEnabled,
    isGoogleSSOEnabled,
    isMicrosoftSSOEnabled,
    isOIDCSSOEnabled,
    isSignupEnabled,
    oidcProviderLabel,
    returnTo,
    shouldAutoRedirectToOIDC,
  } = loaderData;

  const { _ } = useLingui();

  const [searchParams] = useSearchParams();

  const errorParam = searchParams.get('error');
  const signupError = errorParam ? SIGNUP_ERROR_MESSAGES[errorParam] : undefined;

  useEffect(() => {
    if (!shouldAutoRedirectToOIDC) {
      return;
    }

    void authClient.oidc.signIn({ redirectPath: returnTo ?? '/' });
  }, [shouldAutoRedirectToOIDC, returnTo]);

  if (shouldAutoRedirectToOIDC) {
    return (
      <div className="w-screen max-w-lg px-4">
        <div className="flex flex-col items-center justify-center gap-y-4 py-12">
          <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            <Trans>Redirecting to {oidcProviderLabel || 'OIDC'}...</Trans>
          </p>
        </div>
      </div>
    );
  }

  const signupHref = returnTo ? `/signup?returnTo=${encodeURIComponent(returnTo)}` : '/signup';

  return (
    <div className="grid w-full max-w-6xl items-center gap-8 px-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,28rem)] lg:gap-12">
      <section className="mx-auto w-full max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
        <p className="font-medium text-primary text-sm">
          <Trans>The open source DocuSign alternative</Trans>
        </p>

        <h2 className="mt-3 font-semibold text-4xl text-foreground tracking-tight md:text-5xl">
          <Trans>Signing, with room to see what matters</Trans>
        </h2>

        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          <Trans>
            Send documents, place fields, and keep a record of every signature. Documenso stays open so you can review
            how trust is handled.
          </Trans>
        </p>

        <ul className="mt-6 hidden gap-3 text-left sm:grid">
          <li className="rounded-2xl border border-border bg-card px-4 py-3 text-foreground text-sm">
            <Trans>Documents, templates, and your inbox in one workspace</Trans>
          </li>
          <li className="rounded-2xl border border-border bg-card px-4 py-3 text-foreground text-sm">
            <Trans>Recipients, fields, and the audit history stay with the agreement</Trans>
          </li>
          <li className="rounded-2xl border border-border bg-card px-4 py-3 text-foreground text-sm">
            <Trans>AGPL-3.0 licensed, so the signing flow can be read and self-hosted</Trans>
          </li>
        </ul>

        {isSignupEnabled && (
          <div className="mt-6 hidden sm:block">
            <Button asChild variant="navy">
              <Link to={signupHref}>
                <Trans>Create an account</Trans>
              </Link>
            </Button>
          </div>
        )}
      </section>

      <div className="z-10 rounded-[1.75rem] border border-border bg-background p-6 shadow-[0_24px_60px_-36px_hsl(230_45%_20%/0.65)]">
        {signupError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{_(signupError)}</AlertDescription>
          </Alert>
        )}

        <h1 className="font-semibold text-3xl tracking-tight">
          <Trans>Sign in to your account</Trans>
        </h1>

        <p className="mt-2 text-muted-foreground text-sm">
          <Trans>Welcome back, we are lucky to have you.</Trans>
        </p>
        <hr className="-mx-6 my-4 border-border" />

        <SignInForm
          isEmailPasswordSigninEnabled={isEmailPasswordSigninEnabled}
          isGoogleSSOEnabled={isGoogleSSOEnabled}
          isMicrosoftSSOEnabled={isMicrosoftSSOEnabled}
          isOIDCSSOEnabled={isOIDCSSOEnabled}
          oidcProviderLabel={oidcProviderLabel}
          returnTo={returnTo}
        />

        {isSignupEnabled && (
          <p className="mt-6 text-center text-muted-foreground text-sm">
            <Trans>
              Don't have an account?{' '}
              <Link
                to={signupHref}
                className="rounded-sm font-medium text-documenso-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-documenso-300"
              >
                Sign up
              </Link>
            </Trans>
          </p>
        )}
      </div>
    </div>
  );
}
