import {
  IS_GOOGLE_SSO_ENABLED,
  IS_MICROSOFT_SSO_ENABLED,
  IS_OIDC_SSO_ENABLED,
  isSignupEnabledForProvider,
} from '@documenso/lib/constants/auth';
import { isValidReturnTo, normalizeReturnTo } from '@documenso/lib/utils/is-valid-return-to';
import { msg } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { Link, redirect } from 'react-router';

import { SignUpForm } from '~/components/forms/signup';
import { AuthPage } from '~/components/general/auth-page';
import { appMetaTags } from '~/utils/meta';

import type { Route } from './+types/signup';

export function meta() {
  return appMetaTags(msg`Sign Up`);
}

export function loader({ request }: Route.LoaderArgs) {
  const isEmailPasswordSignupEnabled = isSignupEnabledForProvider('email');
  const isGoogleSignupEnabled = IS_GOOGLE_SSO_ENABLED && isSignupEnabledForProvider('google');
  const isMicrosoftSignupEnabled = IS_MICROSOFT_SSO_ENABLED && isSignupEnabledForProvider('microsoft');
  const isOidcSignupEnabled = IS_OIDC_SSO_ENABLED && isSignupEnabledForProvider('oidc');

  const isAnySignupEnabled =
    isEmailPasswordSignupEnabled || isGoogleSignupEnabled || isMicrosoftSignupEnabled || isOidcSignupEnabled;

  if (!isAnySignupEnabled) {
    throw redirect('/signin');
  }

  let returnTo = new URL(request.url).searchParams.get('returnTo') ?? undefined;

  returnTo = isValidReturnTo(returnTo) ? normalizeReturnTo(returnTo) : undefined;

  return {
    isEmailPasswordSignupEnabled,
    isGoogleSignupEnabled,
    isMicrosoftSignupEnabled,
    isOidcSignupEnabled,
    returnTo,
  };
}

export default function SignUp({ loaderData }: Route.ComponentProps) {
  const {
    isEmailPasswordSignupEnabled,
    isGoogleSignupEnabled,
    isMicrosoftSignupEnabled,
    isOidcSignupEnabled,
    returnTo,
  } = loaderData;

  return (
    <AuthPage
      title={<Trans>Create a new account</Trans>}
      description={<Trans>Set up your account to send and sign documents.</Trans>}
    >
      <SignUpForm
        isEmailPasswordSignupEnabled={isEmailPasswordSignupEnabled}
        isGoogleSignupEnabled={isGoogleSignupEnabled}
        isMicrosoftSignupEnabled={isMicrosoftSignupEnabled}
        isOidcSignupEnabled={isOidcSignupEnabled}
        returnTo={returnTo}
      />

      <p className="mt-6 border-t pt-5 text-center text-muted-foreground text-sm">
        <Trans>
          Already have an account?{' '}
          <Link
            to={returnTo ? `/signin?returnTo=${encodeURIComponent(returnTo)}` : '/signin'}
            className="rounded-sm font-medium text-documenso-700 underline-offset-4 hover:underline dark:text-documenso-300"
          >
            Sign in instead
          </Link>
        </Trans>
      </p>
    </AuthPage>
  );
}
