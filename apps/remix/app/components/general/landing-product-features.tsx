import { cn } from '@documenso/ui/lib/utils';
import { Trans } from '@lingui/react/macro';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  FileCheckIcon,
  FilesIcon,
  FileTextIcon,
  Link2Icon,
  ShieldCheckIcon,
  TerminalIcon,
  UsersRoundIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';

export const LandingProductFeatures = () => (
  <section id="features" aria-labelledby="landing-features-title" className="landing-content-section">
    <div className="landing-section-heading">
      <h2 id="landing-features-title">
        <Trans>From the first draft to the final signature</Trans>
      </h2>
    </div>

    <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
      <article className={cn(featureCard, compactFeature, 'lg:col-span-6 lg:col-start-1 lg:row-start-1')}>
        <FeatureCopy
          title={<Trans>Create, send, and sign documents</Trans>}
          description={
            <Trans>
              Upload a PDF, place signature fields, and send a signing link. Track each recipient’s progress and
              download the completed PDF.
            </Trans>
          }
        >
          <FeatureLink href="https://docs.documenso.com/docs/users/getting-started/send-first-document">
            <Trans>See how signing works</Trans>
          </FeatureLink>
        </FeatureCopy>
        <SigningPreview />
      </article>

      <article className={cn(featureCard, 'flex flex-col lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1')}>
        <FeatureCopy
          title={<Trans>Documenso API</Trans>}
          description={
            <Trans>
              Create and send documents, track signing progress, and retrieve signed PDFs from your application.
            </Trans>
          }
        >
          <FeatureLink href="https://openapi.documenso.com/">
            <Trans>Read the API reference</Trans>
          </FeatureLink>
        </FeatureCopy>
        <ApiPreview />
      </article>

      <article className={cn(featureCard, compactFeature, 'lg:col-span-6 lg:col-start-1 lg:row-start-2')}>
        <FeatureCopy
          title={<Trans>Create and manage teams</Trans>}
          description={
            <Trans>
              Collaborate in shared teams and control who can see sensitive documents with roles and visibility
              settings.
            </Trans>
          }
        >
          <FeatureLink href="https://docs.documenso.com/docs/users/organisations/members#team-member-roles">
            <Trans>Explore team permissions</Trans>
          </FeatureLink>
        </FeatureCopy>
        <TeamPreview />
      </article>

      <article className={cn(featureCard, 'flex flex-col lg:col-span-6')}>
        <FeatureCopy
          title={<Trans>Verify signed documents</Trans>}
          description={
            <Trans>
              Check a completed PDF’s digital signature in a compatible reader and review the signing audit trail.
            </Trans>
          }
        >
          <FeatureLink href="https://docs.documenso.com/docs/concepts/signing-certificates">
            <Trans>How PDF verification works</Trans>
          </FeatureLink>
          <a
            href="https://docs.documenso.com/docs/compliance/certifications#21-cfr-part-11"
            className="inline-flex min-h-7 items-center gap-1 rounded-sm font-medium text-[var(--landing-accent)] text-sm underline-offset-4 hover:underline"
          >
            <Trans>21 CFR Part 11</Trans>
            <ArrowUpRightIcon aria-hidden="true" className="size-3.5 shrink-0" />
          </a>
          <p className="basis-full text-[var(--landing-muted)] text-xs leading-relaxed">
            <Trans>21 CFR Part 11 controls require an Enterprise license and configuration.</Trans>
          </p>
        </FeatureCopy>
        <VerificationPreview />
      </article>

      <article className={cn(featureCard, 'flex flex-col lg:col-span-6')}>
        <FeatureCopy
          title={<Trans>Templates and Direct Links</Trans>}
          description={
            <Trans>
              Save signing roles and fields in a reusable template. Share a Direct Link to collect signatures without
              knowing recipient emails in advance.
            </Trans>
          }
        >
          <FeatureLink href="https://docs.documenso.com/docs/users/templates">
            <Trans>Explore templates</Trans>
          </FeatureLink>
          <FeatureLink href="https://docs.documenso.com/docs/users/documents/direct-links">
            <Trans>Direct Links guide</Trans>
          </FeatureLink>
        </FeatureCopy>
        <TemplatePreview />
      </article>
    </div>
  </section>
);

const FeatureCopy = ({
  title,
  description,
  children,
}: {
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
}) => (
  <div className="relative z-10 min-w-0 px-5 pt-6 pb-4 sm:px-7 sm:pt-7">
    <h3 className="text-balance font-medium text-[1.45rem] leading-[1.12] tracking-[-0.035em] sm:text-[1.65rem]">
      {title}
    </h3>
    <p className="mt-3 max-w-[47ch] text-[var(--landing-muted)] text-sm leading-relaxed sm:text-[0.95rem]">
      {description}
    </p>
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">{children}</div>
  </div>
);

const FeatureLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    className="inline-flex min-h-7 items-center gap-1.5 rounded-sm font-medium text-[var(--landing-accent)] text-sm leading-snug underline-offset-4 hover:underline"
  >
    {children}
    <ArrowRightIcon aria-hidden="true" className="size-3.5 shrink-0 rtl:rotate-180" />
  </a>
);

const SigningPreview = () => (
  <div aria-hidden="true" className={cn(compactPreview, 'min-h-[13rem]')}>
    <div
      className={cn(
        previewFrame,
        'mx-auto w-[min(92%,22rem)] p-1.5 lg:absolute lg:top-4 lg:left-1 lg:w-[calc(100%-1.25rem)]',
      )}
    >
      <div className={cn(previewWindow, 'p-3.5')}>
        <div className="flex items-center gap-2.5">
          <span className={previewIcon}>
            <FileTextIcon className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-sm">
              <Trans>Sign Document</Trans>
            </p>
            <p className="truncate text-[var(--landing-muted)] text-xs">
              <Trans>Partnership agreement</Trans>
            </p>
          </div>
        </div>
        <div className="mt-3 rounded-lg border border-[var(--landing-line)] px-2.5 py-1.5">
          <p className="text-[0.65rem] text-[var(--landing-muted)]">
            <Trans>Full name</Trans>
          </p>
          <p className="mt-0.5 font-medium text-xs">Jordan Lee</p>
        </div>
        <div className="mt-2 rounded-xl border border-documenso-200 border-dashed bg-documenso-50 px-2.5 py-1.5 dark:border-documenso-700 dark:bg-documenso-950/75">
          <p className="font-signature text-2xl text-documenso-800 leading-none dark:text-documenso-200">Jordan Lee</p>
          <p className="mt-0.5 text-[0.65rem] text-[var(--landing-muted)]">
            <Trans>Signature</Trans>
          </p>
        </div>
      </div>
    </div>
    <div className="absolute right-4 bottom-1.5 z-10 flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-canvas)] px-2.5 py-2 shadow-[0_8px_24px_-10px_#31387369] sm:right-7 lg:right-2.5 lg:bottom-3">
      <SignedIcon />
      <div className="min-w-0">
        <p className="font-semibold text-xs leading-tight">
          <Trans>Document Signed</Trans>
        </p>
        <p className="mt-0.5 text-[0.65rem] text-[var(--landing-muted)] leading-tight">
          <Trans>Everyone has signed</Trans>
        </p>
      </div>
    </div>
  </div>
);

const ApiPreview = () => (
  <div className="mt-auto bg-[radial-gradient(ellipse_at_56%_75%,hsl(231_91%_73%/0.34),transparent_70%)] px-3 pt-5 sm:pr-0 sm:pl-7 lg:pt-8">
    <div className={cn(previewFrame, 'rounded-b-none p-2 pb-0 sm:rounded-r-none sm:pr-0')}>
      <div className={cn(previewWindow, 'overflow-hidden rounded-b-none sm:rounded-r-none')}>
        <div className="flex items-center justify-between gap-2 border-[var(--landing-line)] border-b px-3 py-2.5 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className={previewIcon}>
              <TerminalIcon aria-hidden="true" className="size-4" />
            </span>
            <p className="font-semibold text-sm">
              <Trans>List templates</Trans>
            </p>
          </div>
          <span
            aria-hidden="true"
            className="shrink-0 rounded-md bg-documenso-50 px-2 py-1 font-mono font-semibold text-documenso-800 text-xs dark:bg-documenso-950 dark:text-documenso-200"
          >
            API v2
          </span>
        </div>
        <div className="grid bg-[#151833] px-3 py-2.5 text-[#e2e6ff] sm:px-4 lg:py-4">
          <p className="pb-2 font-medium text-[#aebdfc] text-[0.7rem]">
            <Trans>Request</Trans>
          </p>
          <pre
            dir="ltr"
            className="whitespace-pre-wrap font-mono text-[0.7rem] leading-normal [overflow-wrap:anywhere] sm:text-[0.8rem]"
          >
            <code>
              <span className="text-[#a8b7ff]">curl -G</span>
              {' "$BASE_URL/api/v2/envelope" \\\n  -d "type=TEMPLATE" \\\n  -H "Authorization: $API_TOKEN"'}
            </code>
          </pre>
        </div>
        <div className="grid bg-[var(--landing-canvas)] px-3 py-2.5 sm:px-4 lg:py-4">
          <div className="flex items-center justify-between gap-3 pb-2">
            <p className="font-medium text-[0.7rem] text-[var(--landing-muted)]">
              <Trans>Response</Trans>
            </p>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-medium font-mono text-[0.65rem] text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              200 OK
            </span>
          </div>
          <pre
            dir="ltr"
            className="whitespace-pre-wrap font-mono text-[0.7rem] text-[var(--landing-muted)] leading-normal [overflow-wrap:anywhere] sm:text-[0.8rem]"
          >
            <code>
              {'{\n  "data": [\n    { "id": "envelope_7f2a", "type": "TEMPLATE" }\n  ],\n  "totalPages": 1\n}'}
            </code>
          </pre>
        </div>
      </div>
    </div>
  </div>
);

const TeamPreview = () => (
  <div aria-hidden="true" className={cn(compactPreview, 'min-h-[12.5rem]')}>
    <div
      className={cn(
        previewFrame,
        'mx-auto w-[min(92%,22rem)] p-1.5 lg:absolute lg:top-4 lg:left-1 lg:w-[calc(100%-1.25rem)]',
      )}
    >
      <div className={cn(previewWindow, 'overflow-hidden')}>
        <div className="flex items-center gap-2 px-2.5 pt-2.5 pb-2 sm:px-3">
          <span className={previewIcon}>
            <UsersRoundIcon className="size-4" />
          </span>
          <p className="font-semibold text-sm">
            <Trans>Team Members</Trans>
          </p>
        </div>
        <ul className="divide-y divide-[var(--landing-line)] border-[var(--landing-line)] border-t">
          {teamRoles.map(({ name, initials, role, permission, tone }) => (
            <li key={name} className="flex items-center gap-1.5 px-2.5 py-2 sm:gap-2 sm:px-3">
              <span
                className={cn('grid size-6 shrink-0 place-items-center rounded-full font-semibold text-[0.6rem]', tone)}
              >
                {initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-[0.72rem] leading-tight">{name}</p>
                <p className="mt-0.5 truncate text-[0.61rem] text-[var(--landing-muted)] leading-tight">{permission}</p>
              </div>
              <span className="shrink-0 rounded-md bg-[var(--landing-nav-surface)] px-1.5 py-0.5 font-medium text-[0.64rem] text-[var(--landing-muted)]">
                {role}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const VerificationPreview = () => (
  <div aria-hidden="true" className={cn(widePreview, 'sm:pl-7')}>
    <div className={cn(previewFrame, 'relative mx-auto w-full max-w-[30rem] rounded-b-none p-2 pb-0')}>
      <div className={cn(previewWindow, 'rounded-b-none px-3 pt-3 pb-2 sm:px-4')}>
        <div className="flex items-center gap-2.5 border-[var(--landing-line)] border-b pb-3">
          <span className={previewIcon}>
            <ShieldCheckIcon className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-sm">
              <Trans>Signing Certificate</Trans>
            </p>
            <p className="mt-0.5 truncate text-[var(--landing-muted)] text-xs">
              <Trans>Partnership agreement</Trans>
              <span className="font-mono text-[0.65rem]"> · X.509</span>
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-100 px-2 py-1 font-medium text-[0.65rem] text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckIcon className="size-3" />
            <Trans>Completed</Trans>
          </span>
        </div>
        <div className="py-2.5">
          <p className="font-semibold text-xs">
            <Trans>Audit Log</Trans>
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-[var(--landing-nav-surface)] px-3 py-2">
          <FileCheckIcon className="size-4 shrink-0 text-documenso-600 dark:text-documenso-300" />
          <p className="min-w-0 flex-1 truncate font-medium text-xs">
            <Trans>Document Signed</Trans>
          </p>
          <span className="shrink-0 text-[var(--landing-muted)] text-xs">Jordan Lee</span>
        </div>
      </div>
    </div>
  </div>
);

const TemplatePreview = () => (
  <div aria-hidden="true" className={cn(widePreview, 'relative')}>
    <div className={cn(previewFrame, 'relative mx-auto w-full max-w-[30rem] rounded-b-none p-2 pb-0')}>
      <div className={cn(previewWindow, 'rounded-b-none px-3 pt-3 pb-5 sm:px-4')}>
        <div className="flex items-center gap-2.5">
          <span className={previewIcon}>
            <FilesIcon className="size-4" />
          </span>
          <p className="font-semibold text-sm">
            <Trans>Templates</Trans>
          </p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-documenso-200 bg-documenso-50 px-2 py-2.5 font-semibold text-documenso-800 text-xs dark:border-documenso-700 dark:bg-documenso-950 dark:text-documenso-100">
            <FileTextIcon className="size-3.5 shrink-0" />
            <span className="truncate">
              <Trans>Mutual NDA</Trans>
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-[var(--landing-line)] px-2 py-2.5 font-medium text-xs">
            <FileTextIcon className="size-3.5 shrink-0 text-[var(--landing-muted)]" />
            <span className="truncate">
              <Trans>Partnership agreement</Trans>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div className="relative z-10 mx-auto -mt-2.5 flex w-[min(86%,20rem)] min-w-0 items-center gap-2.5 rounded-t-xl border border-[var(--landing-line)] bg-[var(--landing-canvas)] px-2.5 py-2 shadow-[0_8px_24px_-10px_#31387369] sm:ms-auto sm:me-9 sm:px-3">
      <span className={previewIcon}>
        <Link2Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-xs">
          <Trans>Direct Link</Trans>
        </p>
        <code dir="ltr" className="block truncate text-[0.65rem] text-[var(--landing-muted)]">
          app.documenso.com/d/…
        </code>
      </div>
    </div>
  </div>
);

const SignedIcon = () => (
  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
    <CheckIcon className="size-4" />
  </span>
);

const featureCard =
  'min-w-0 overflow-hidden rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-nav-surface)] bg-[linear-gradient(180deg,hsl(240_95%_77%/0.13),transparent_93%)]';
const compactFeature = 'grid grid-rows-[auto_1fr] lg:grid-cols-[minmax(0,1.14fr)_minmax(0,1fr)] lg:grid-rows-1';
const compactPreview =
  'relative isolate min-w-0 overflow-hidden bg-[radial-gradient(ellipse_at_62%_63%,hsl(232_92%_72%/0.3),transparent_74%)] pt-2 pb-3 lg:pb-0';
const widePreview =
  'mt-auto bg-[radial-gradient(ellipse_at_54%_100%,hsl(232_92%_70%/0.27),transparent_76%)] px-3 pt-4 sm:px-7';
const previewFrame =
  'rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-glass)] shadow-[0_14px_42px_-18px_#3546a457]';
const previewWindow = 'rounded-xl border border-[var(--landing-line)] bg-[var(--landing-canvas)]';
const previewIcon =
  'grid size-8 shrink-0 place-items-center rounded-lg bg-documenso-50 text-documenso-700 dark:bg-documenso-950 dark:text-documenso-200';

const teamRoles = [
  {
    name: 'Avery Patel',
    initials: 'AP',
    role: <Trans>Admin</Trans>,
    permission: <Trans>Team settings</Trans>,
    tone: 'bg-documenso-100 text-documenso-800 dark:bg-documenso-950 dark:text-documenso-200',
  },
  {
    name: 'Morgan Ellis',
    initials: 'ME',
    role: <Trans>Manager</Trans>,
    permission: <Trans>Manage members</Trans>,
    tone: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200',
  },
  {
    name: 'Taylor Reed',
    initials: 'TR',
    role: <Trans>Member</Trans>,
    permission: <Trans>Shared documents</Trans>,
    tone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  },
];
