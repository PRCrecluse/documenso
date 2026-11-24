import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@documenso/ui/primitives/dropdown-menu';
import { msg } from '@lingui/core/macro';
import { Trans, useLingui } from '@lingui/react/macro';
import { ArrowDownIcon, ArrowUpRightIcon, MenuIcon } from 'lucide-react';
import { Link } from 'react-router';

import { BrandingLogo } from './branding-logo';
import { LandingWorkspacePreview } from './landing-workspace-preview';
import { PublicLegalLinks } from './public-legal-links';

const WORKSPACE_ANCHOR = '#workspace-preview';
const SOURCE_URL = 'https://github.com/documenso/documenso';
const landingLinks = [
  { href: WORKSPACE_ANCHOR, label: msg`Product` },
  { href: 'https://docs.documenso.com', label: msg`Documentation` },
  { href: SOURCE_URL, label: msg`Source code` },
];

export const LandingPage = ({ isSignupEnabled }: { isSignupEnabled: boolean }) => {
  const { t, i18n } = useLingui();

  return (
    <div className="landing-page min-h-dvh">
      <header className="landing-header">
        <Link to="/" aria-label="Documenso" className="shrink-0 rounded-sm">
          <BrandingLogo aria-hidden="true" className="h-6 w-auto" />
        </Link>

        <nav aria-label={t`Primary navigation`} className="landing-nav hidden items-center md:flex">
          {landingLinks.map(({ href, label }) => (
            <a href={href} key={href}>
              {i18n._(label)}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link to="/signin" className="landing-button landing-button-ink">
            <Trans>Sign in</Trans>
          </Link>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="landing-menu-button" aria-label={t`Open menu`}>
                  <MenuIcon aria-hidden="true" className="size-5" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" sideOffset={8}>
                {landingLinks.map(({ href, label }) => (
                  <DropdownMenuItem asChild key={href}>
                    <a href={href}>{i18n._(label)}</a>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link to="/signin">
                    <Trans>Sign in</Trans>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main>
        <section aria-labelledby="landing-title" className="landing-intro">
          <a className="landing-source-link" href={SOURCE_URL}>
            <Trans>Open-source e-signatures</Trans>
            <ArrowUpRightIcon aria-hidden="true" className="size-3.5 shrink-0" />
          </a>

          <h1 id="landing-title">
            <span>
              <Trans>Send documents for signing.</Trans>
            </span>
            <span>
              <Trans>Track every agreement.</Trans>
            </span>
          </h1>

          <p>
            <Trans>Prepare agreements, collect signatures, and track every document from one workspace.</Trans>
          </p>

          <div className="landing-actions">
            <Link to={isSignupEnabled ? '/signup' : '/signin'} className="landing-button landing-button-blue">
              {isSignupEnabled ? <Trans>Get started</Trans> : <Trans>Sign in</Trans>}
              <ArrowUpRightIcon aria-hidden="true" className="size-4 shrink-0" />
            </Link>

            <a href={WORKSPACE_ANCHOR} className="landing-button landing-button-outline">
              <Trans>See the workspace</Trans>
              <ArrowDownIcon aria-hidden="true" className="size-4 shrink-0" />
            </a>
          </div>
        </section>

        <div className="landing-stage">
          <div className="landing-frame" id="workspace-preview">
            <LandingWorkspacePreview />
          </div>
        </div>
      </main>

      <PublicLegalLinks className="mx-auto max-w-7xl px-5 pb-8" />
    </div>
  );
};
