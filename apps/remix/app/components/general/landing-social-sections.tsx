import { cn } from '@documenso/ui/lib/utils';
import { Trans } from '@lingui/react/macro';
import { ArrowUpRightIcon, FileCheck2Icon, QuoteIcon, WorkflowIcon } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import { SiPrisma, SiReact, SiVuedotjs, SiZapier } from 'react-icons/si';

import { BrandingLogoIcon } from './branding-logo-icon';

const PRISMA_STORY_URL =
  'https://documenso.com/blog/customer-story-prisma-4-reasons-prisma-choose-documenso-for-signing';
const VIAL_STORY_URL = 'https://documenso.com/blog/announcing-vial-21-cfr-part-11';
const ZAPIER_URL = 'https://zapier.com/apps/documenso/integrations';
const EMBED_SDKS_URL = 'https://docs.documenso.com/docs/developers/embedding/sdks';

export const LandingTestimonials = () => (
  <section
    className="scroll-mt-6 bg-[var(--landing-nav-surface)]"
    id="customers"
    aria-labelledby="landing-customers-title"
  >
    <div className="landing-content-section">
      <header className="landing-section-heading">
        <h2 id="landing-customers-title">
          <Trans>What our customers say</Trans>
        </h2>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <TestimonialCard
          name="Nitin Gupta"
          role={<Trans>COO, Prisma Inc.</Trans>}
          href={PRISMA_STORY_URL}
          linkLabel={<Trans>Read the Prisma story</Trans>}
          artwork={<PrismaStoryArtwork />}
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
        <WorkflowIcon aria-hidden="true" className="size-3.5" />
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

    <div className="relative isolate overflow-hidden rounded-[1.5rem] border border-[var(--landing-line)] bg-[var(--landing-nav-surface)] px-3 pt-7 pb-5 [background-image:radial-gradient(ellipse_at_50%_22%,color-mix(in_srgb,var(--landing-accent-surface)_78%,#8294fc),transparent_67%)] sm:px-8 sm:pt-10 sm:pb-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,color-mix(in_srgb,var(--landing-accent)_13%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--landing-accent)_13%,transparent)_1px,transparent_1px)] [background-size:2rem_2rem] [mask-image:radial-gradient(ellipse_at_50%_22%,#000_0%,transparent_72%)]"
      />

      <div className="relative mx-auto max-w-3xl">
        <div className="mx-auto flex w-fit flex-col items-center gap-3">
          <div className="grid size-16 place-items-center rounded-[1.125rem] border border-[#5a71fa] bg-gradient-to-br from-[#627bff] to-[#293ece] text-white shadow-[0_13px_30px_-10px_#3446c9] ring-[#687cfc]/[0.15] ring-[6px] sm:size-20">
            <BrandingLogoIcon aria-hidden="true" className="size-9 sm:size-11" />
          </div>
          <span className="font-semibold text-sm">Documenso</span>
        </div>

        <div aria-hidden="true" className="relative h-10 sm:h-12">
          <div className="absolute inset-y-0 start-1/2 border-[color-mix(in_srgb,var(--landing-accent)_40%,var(--landing-line))] border-s" />
          <div className="absolute inset-x-[16.5%] top-1/2 bottom-0 rounded-t-2xl border border-[color-mix(in_srgb,var(--landing-accent)_40%,var(--landing-line))] border-b-0" />
        </div>

        <ul className="grid grid-cols-3 gap-2.5 sm:gap-4">
          <li className="min-w-0">
            <IntegrationLink href={ZAPIER_URL} label="Zapier" color="text-[#bc420f] dark:text-[#ffa383]">
              <SiZapier aria-hidden="true" className="size-5" />
            </IntegrationLink>
          </li>
          <li className="min-w-0">
            <IntegrationLink href={`${EMBED_SDKS_URL}/react`} label="React" color="text-[#087ea4] dark:text-[#61dafb]">
              <SiReact aria-hidden="true" className="size-5" />
            </IntegrationLink>
          </li>
          <li className="min-w-0">
            <IntegrationLink href={`${EMBED_SDKS_URL}/vue`} label="Vue" color="text-[#1d7957] dark:text-[#74d8ae]">
              <SiVuedotjs aria-hidden="true" className="size-5" />
            </IntegrationLink>
          </li>
        </ul>
      </div>

      <dl className="relative mx-auto mt-5 grid max-w-3xl gap-3 border-[var(--landing-line)] border-t pt-4 text-sm sm:mt-7 sm:grid-cols-2 sm:gap-6 sm:pt-5">
        <div>
          <dt className="font-semibold">Zapier</dt>
          <dd className="mt-1 text-[var(--landing-muted)] leading-relaxed">
            <Trans>Trigger automations when documents are sent, signed, or completed.</Trans>
          </dd>
        </div>
        <div>
          <dt className="font-semibold">
            <Trans>Embedded signing</Trans>
          </dt>
          <dd className="mt-1 text-[var(--landing-muted)] leading-relaxed">
            <Trans>Let users sign without leaving your application.</Trans>
          </dd>
        </div>
      </dl>
    </div>
  </section>
);

const TestimonialCard = ({ name, role, href, linkLabel, artwork, children }: TestimonialCardProps) => (
  <figure
    className={cn(
      'flex min-w-0 flex-col rounded-[1.25rem] border border-[var(--landing-line)] bg-[var(--landing-canvas)]',
      artwork
        ? 'p-3 sm:p-4 md:col-span-2 md:grid md:grid-cols-[1.45fr_1fr] md:grid-rows-[1fr_auto] md:gap-x-4'
        : 'p-5 sm:p-7',
    )}
  >
    <div className={cn('min-w-0 flex-1', artwork && 'px-3 pt-5 sm:px-7 sm:pt-7')}>
      <QuoteIcon aria-hidden="true" className="mb-4 size-5 text-[var(--landing-accent)]" />

      <blockquote
        cite={href}
        className={cn(
          'text-pretty font-medium leading-relaxed tracking-tight',
          artwork ? 'text-xl sm:text-2xl lg:text-[1.75rem]' : 'text-base sm:text-lg',
        )}
      >
        <p>{children}</p>
      </blockquote>
    </div>

    {artwork && (
      <div className="order-last mt-5 md:order-none md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0">{artwork}</div>
    )}

    <figcaption
      className={cn(
        'mt-6 flex flex-wrap items-end justify-between gap-x-5 gap-y-3 border-[var(--landing-line)] border-t pt-4',
        artwork && 'mx-3 pb-2 sm:mx-7 sm:pb-7 md:col-start-1 md:row-start-2',
      )}
    >
      {name && (
        <div>
          <p className="font-semibold text-sm">{name}</p>
          <p className="mt-0.5 text-[var(--landing-muted)] text-sm">{role}</p>
        </div>
      )}

      <a href={href} className="landing-text-link">
        {linkLabel}
        <ArrowUpRightIcon aria-hidden="true" className="size-3.5 shrink-0" />
      </a>
    </figcaption>
  </figure>
);

const PrismaStoryArtwork = () => (
  <div
    aria-hidden="true"
    className="relative isolate grid h-full min-h-44 place-items-center overflow-hidden rounded-[0.875rem] bg-[#13204b] p-7 [background-image:radial-gradient(ellipse_at_92%_7%,#5973ff,transparent_66%),linear-gradient(140deg,#111833_24%,#182c68)] sm:min-h-64"
  >
    <div className="absolute inset-0 [background-image:linear-gradient(to_right,#a3b3ff30_1px,transparent_1px),linear-gradient(to_bottom,#a3b3ff30_1px,transparent_1px)] [background-size:1.8rem_1.8rem] [mask-image:radial-gradient(ellipse_at_65%_35%,#000,transparent_80%)]" />

    <div className="relative w-full max-w-[13rem]">
      <div className="absolute inset-0 translate-x-2 translate-y-1 rotate-6 rounded-xl border border-[#9baaff]/50 bg-[#6074d6]/[0.55]" />

      <div className="relative -rotate-6 rounded-xl border border-white/80 bg-[#f3f5ff] p-4 text-[#18234b] shadow-[0_1.3rem_2.5rem_-1.3rem_#08112f] sm:p-5">
        <div className="flex items-center gap-2 font-semibold text-xl tracking-tight">
          <SiPrisma className="size-5 shrink-0" />
          Prisma
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-1.5 w-full rounded-full bg-[#d6dcfa]" />
          <div className="h-1.5 w-3/4 rounded-full bg-[#d6dcfa]" />
        </div>
        <div className="mt-3 flex items-center justify-between rounded-md border border-[#b2bdf3] px-2 py-1.5">
          <span className="h-1.5 w-2/5 rounded-full bg-[#8d9dec]" />
          <FileCheck2Icon className="size-4 text-[#435abe]" />
        </div>
      </div>
    </div>
  </div>
);

const IntegrationLink = ({ href, label, color, children }: IntegrationLinkProps) => (
  <a
    href={href}
    className="group flex min-h-20 min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-canvas)] px-1.5 py-2.5 font-semibold text-xs shadow-[0_10px_18px_-13px_#28398b66] transition-colors hover:border-[var(--landing-accent)] sm:min-h-16 sm:flex-row sm:justify-start sm:gap-3 sm:px-3 sm:text-sm lg:px-4"
  >
    <span
      className={cn(
        'grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--landing-nav-surface)] sm:size-9',
        color,
      )}
    >
      {children}
    </span>
    {label}
    <ArrowUpRightIcon
      aria-hidden="true"
      className="ms-auto hidden size-3.5 shrink-0 text-[var(--landing-muted)] group-hover:text-current sm:block"
    />
  </a>
);

type TestimonialCardProps = {
  name?: string;
  role?: ReactNode;
  href: string;
  linkLabel: ReactNode;
  artwork?: ReactElement;
  children: ReactNode;
};

type IntegrationLinkProps = {
  href: string;
  label: string;
  color: string;
  children: ReactNode;
};
