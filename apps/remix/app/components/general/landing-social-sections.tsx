import { cn } from '@documenso/ui/lib/utils';
import { Trans } from '@lingui/react/macro';
import { ArrowUpRightIcon, QuoteIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { SiReact, SiVuedotjs, SiZapier } from 'react-icons/si';

const PRISMA_STORY_URL =
  'https://documenso.com/blog/customer-story-prisma-4-reasons-prisma-choose-documenso-for-signing';
const VIAL_STORY_URL = 'https://documenso.com/blog/announcing-vial-21-cfr-part-11';
const ZAPIER_URL = 'https://zapier.com/apps/documenso/integrations';
const EMBED_SDKS_URL = 'https://docs.documenso.com/docs/developers/embedding/sdks';

export const LandingTestimonials = () => (
  <section className="landing-content-section scroll-mt-6" id="customers" aria-labelledby="landing-customers-title">
    <header className="landing-section-heading">
      <h2 id="landing-customers-title">
        <Trans>What our customers say</Trans>
      </h2>
    </header>

    <div className="grid gap-4 lg:grid-cols-3">
      <TestimonialCard
        name="Nitin Gupta"
        role={<Trans>COO, Prisma Inc.</Trans>}
        href={PRISMA_STORY_URL}
        linkLabel={<Trans>Read the Prisma story</Trans>}
        className="[background-image:radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--landing-canvas)_72%,#8294fc),transparent_72%)]"
      >
        <Trans>
          “Documenso has streamlined our digital signing process, making it faster, secure, and incredibly
          user-friendly. It's been a game-changer for our team, partners, and customers!”
        </Trans>
      </TestimonialCard>

      <TestimonialCard
        name="Simon Burns"
        role={<Trans>Co-Founder & CEO, Vial Inc.</Trans>}
        href={VIAL_STORY_URL}
        linkLabel={<Trans>Read the Vial story</Trans>}
      >
        <Trans>
          “It has been great working with Documenso! The team built an amazing product fitting our needs. They really
          get what it means to build for enterprise and keep shipping amazing stuff that makes our life easier.”
        </Trans>
      </TestimonialCard>

      <TestimonialCard href="https://documenso.com/" linkLabel={<Trans>See the original testimonial</Trans>}>
        <Trans>
          “Documenso is awesome - easy to use & understand. The source code is open!! If I'm confused by any
          documentation, I can directly read the code to understand what is happening underneath. The team ships fast
          and feature improvements are always coming!”
        </Trans>
      </TestimonialCard>
    </div>
  </section>
);

export const LandingIntegrations = () => (
  <section
    className="landing-content-section scroll-mt-6"
    id="integrations"
    aria-labelledby="landing-integrations-title"
  >
    <header className="landing-section-heading">
      <p className="landing-section-kicker">
        <Trans>Integrations</Trans>
      </p>
      <h2 id="landing-integrations-title">
        <Trans>Your favorite tools work with Documenso</Trans>
      </h2>
      <p>
        <Trans>
          Connect your existing workflows through Zapier, or embed signing in the framework you already use.
        </Trans>
      </p>
    </header>

    <div className="grid gap-4 md:grid-cols-[0.93fr_1.07fr]">
      <a
        href={ZAPIER_URL}
        className="group flex min-w-0 flex-col justify-between rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-nav-surface)] p-5 transition-colors hover:border-documenso-400 sm:p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-[var(--landing-line)] bg-[var(--landing-canvas)] text-[#bc420f] dark:text-[#ffa383]">
            <SiZapier aria-hidden="true" className="size-5" />
          </span>

          <ArrowUpRightIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-[var(--landing-muted)] group-hover:text-current"
          />
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-xl tracking-tight">Zapier</h3>
          <p className="mt-1.5 text-[var(--landing-muted)] text-sm leading-relaxed">
            <Trans>Trigger automations when documents are sent, signed, or completed.</Trans>
          </p>
        </div>
      </a>

      <div className="min-w-0 rounded-2xl border border-[var(--landing-line)] p-5 [background:color-mix(in_srgb,var(--landing-canvas)_91%,#778cf4)] sm:p-7">
        <h3 className="font-semibold text-xl tracking-tight">
          <Trans>Embedded signing</Trans>
        </h3>
        <p className="mt-1.5 text-[var(--landing-muted)] text-sm leading-relaxed">
          <Trans>Let users sign without leaving your application.</Trans>
        </p>

        <ul className="mt-5 grid grid-cols-2 gap-2.5">
          <li className="min-w-0">
            <EmbedSdkLink href={`${EMBED_SDKS_URL}/react`} label="React">
              <SiReact aria-hidden="true" className="size-5 shrink-0 text-[#087ea4] dark:text-[#61dafb]" />
            </EmbedSdkLink>
          </li>
          <li className="min-w-0">
            <EmbedSdkLink href={`${EMBED_SDKS_URL}/vue`} label="Vue">
              <SiVuedotjs aria-hidden="true" className="size-5 shrink-0 text-[#1d7957] dark:text-[#74d8ae]" />
            </EmbedSdkLink>
          </li>
        </ul>
      </div>
    </div>
  </section>
);

const TestimonialCard = ({ name, role, href, linkLabel, className, children }: TestimonialCardProps) => (
  <figure
    className={cn(
      'flex min-w-0 flex-col rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-nav-surface)] p-5 sm:p-7 lg:p-8',
      className,
    )}
  >
    <span className="grid size-10 place-items-center rounded-xl border border-[var(--landing-line)] bg-[var(--landing-canvas)] text-documenso-700 dark:text-documenso-300">
      <QuoteIcon aria-hidden="true" className="size-4" />
    </span>

    <blockquote
      cite={href}
      className="mt-5 flex-1 text-pretty font-medium text-lg leading-relaxed tracking-tight sm:text-xl"
    >
      <p>{children}</p>
    </blockquote>

    <figcaption className="mt-6 flex flex-wrap items-end justify-between gap-x-5 gap-y-3 border-[var(--landing-line)] border-t pt-4">
      {name && (
        <div>
          <p className="font-semibold text-sm">{name}</p>
          <p className="mt-0.5 text-[var(--landing-muted)] text-sm">{role}</p>
        </div>
      )}

      <a
        href={href}
        className="inline-flex items-center gap-1.5 font-medium text-sm underline-offset-4 hover:underline"
      >
        {linkLabel}
        <ArrowUpRightIcon aria-hidden="true" className="size-3.5 shrink-0" />
      </a>
    </figcaption>
  </figure>
);

const EmbedSdkLink = ({ href, label, children }: EmbedSdkLinkProps) => (
  <a
    href={href}
    className="group flex min-h-12 min-w-0 items-center gap-2 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-canvas)] px-2.5 font-medium text-sm transition-colors hover:border-documenso-400 sm:px-3"
  >
    {children}
    {label}
    <ArrowUpRightIcon
      aria-hidden="true"
      className="ms-auto size-3.5 shrink-0 text-[var(--landing-muted)] group-hover:text-current"
    />
  </a>
);

type TestimonialCardProps = {
  name?: string;
  role?: ReactNode;
  href: string;
  linkLabel: ReactNode;
  className?: string;
  children: ReactNode;
};

type EmbedSdkLinkProps = {
  href: string;
  label: string;
  children: ReactNode;
};
