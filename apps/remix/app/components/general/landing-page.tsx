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
import { LandingBenefits, LandingClosingSection, LandingFaq } from './landing-about-sections';
import { LandingProductFeatures } from './landing-product-features';
import { LandingIntegrations, LandingTestimonials } from './landing-social-sections';
import { LandingWorkspacePreview } from './landing-workspace-preview';
import { PublicLegalLinks } from './public-legal-links';

const WORKSPACE_ANCHOR = '#workspace-preview';
const SOURCE_URL = 'https://github.com/documenso/documenso';
const DOCS_URL = 'https://docs.documenso.com';
const landingLinks = [
  { href: '#features', label: msg`Product` },
  { href: '#integrations', label: msg`Integrations` },
  { href: '#faq', label: msg`FAQ` },
  { href: DOCS_URL, label: msg`Documentation` },
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

        <LandingTestimonials />
        <LandingProductFeatures />
        <LandingIntegrations />
        <LandingFaq />
        <LandingBenefits />
        <LandingClosingSection isSignupEnabled={isSignupEnabled} />
      </main>

      <footer className="landing-footer">
        <div className="mx-auto flex max-w-[73rem] flex-col justify-between gap-6 px-5 py-8 sm:flex-row sm:items-center sm:px-6">
          <div>
            <Link to="/" aria-label="Documenso" className="inline-block rounded-sm text-[var(--landing-ink)]">
              <BrandingLogo aria-hidden="true" className="h-5 w-auto" />
            </Link>
            <p className="mt-2 text-sm">
              <Trans>Open-source document signing.</Trans>
            </p>
          </div>

          <nav aria-label={t`Footer navigation`} className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
            <a href={DOCS_URL} className="hover:text-[var(--landing-ink)] hover:underline">
              <Trans>Documentation</Trans>
            </a>
            <a
              href="https://docs.documenso.com/docs/policies/support"
              className="hover:text-[var(--landing-ink)] hover:underline"
            >
              <Trans>Support</Trans>
            </a>
            <a href={SOURCE_URL} className="hover:text-[var(--landing-ink)] hover:underline">
              <Trans>Source code</Trans>
            </a>
          </nav>
        </div>

        <PublicLegalLinks className="mx-auto max-w-7xl px-5 pb-8" />
      </footer>
    </div>
  );
};
