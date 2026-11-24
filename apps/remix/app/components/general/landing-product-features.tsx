import { cn } from '@documenso/ui/lib/utils';
import { Trans } from '@lingui/react/macro';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
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

    <div className="grid gap-3.5 md:grid-cols-2 md:gap-4 lg:grid-cols-12">
      <article className={cn(featureCard, 'md:col-span-2 lg:col-span-7')}>
        <div>
          <h3 className={featureTitle}>
            <Trans>Create, send, and sign documents</Trans>
          </h3>
          <p className={featureDescription}>
            <Trans>
              Upload a PDF, place signature fields, and send a signing link. Track each recipient’s progress and
              download the completed PDF.
            </Trans>
          </p>
        </div>

        <div
          aria-hidden="true"
          className="mt-5 grid min-h-40 grid-cols-[minmax(0,1.18fr)_minmax(0,1fr)] items-center gap-2 rounded-xl border border-[var(--landing-line)] bg-[radial-gradient(ellipse_at_55%_120%,hsl(230_85%_68%/0.26),transparent_75%)] px-2.5 py-5 sm:gap-3 sm:px-5"
        >
          <div className={cn(previewCard, 'min-w-0 p-2.5 sm:p-3')}>
            <div className="mb-3 flex min-w-0 items-center gap-1.5 font-medium text-[0.65rem] sm:text-xs">
              <FileTextIcon className="size-3.5 shrink-0 text-documenso-600 dark:text-documenso-300" />
              <span className="truncate">
                <Trans>Sign Document</Trans>
              </span>
            </div>
            <dl className="space-y-2 text-[0.65rem] sm:text-xs">
              <div>
                <dt className="text-[var(--landing-muted)]">
                  <Trans>Full name</Trans>
                </dt>
                <dd className="mt-0.5 truncate rounded border border-[var(--landing-line)] px-1.5 py-1">Jordan Lee</dd>
              </div>
              <div>
                <dt className="text-[var(--landing-muted)]">
                  <Trans>Email</Trans>
                </dt>
                <dd className="mt-0.5 truncate rounded border border-[var(--landing-line)] px-1.5 py-1">
                  jordan@example.com
                </dd>
              </div>
            </dl>
            <div className="mt-3 min-w-0 rounded-md border border-documenso-200 border-dashed bg-documenso-50 px-2 py-1 dark:border-documenso-600 dark:bg-documenso-950/60">
              <span className="block font-signature text-base text-documenso-900 leading-tight sm:text-2xl dark:text-documenso-100">
                Jordan Lee
              </span>
              <span className="block text-[0.6rem] text-[var(--landing-muted)] sm:text-[0.65rem]">
                <Trans>Signature</Trans>
              </span>
            </div>
          </div>

          <div className={cn(previewCard, 'min-w-0 p-2.5 sm:p-3')}>
            <span className="mb-2 grid size-6 place-items-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckIcon className="size-3.5" />
            </span>
            <p className="font-semibold text-[0.7rem] leading-tight sm:text-sm">
              <Trans>Document Signed</Trans>
            </p>
            <p className="mt-1 text-[0.65rem] text-[var(--landing-muted)] leading-tight sm:text-xs">
              <Trans>Everyone has signed</Trans>
            </p>
          </div>
        </div>

        <div className="mt-4">
          <FeatureLink href="https://docs.documenso.com/docs/users/getting-started/send-first-document">
            <Trans>See how signing works</Trans>
          </FeatureLink>
        </div>
      </article>

      <article className="flex min-w-0 flex-col rounded-2xl border border-[#343b74] bg-[#151839] bg-[radial-gradient(ellipse_at_100%_0%,#3a4094,transparent_73%)] p-4 text-white sm:p-6 lg:col-span-5">
        <h3 className={featureTitle}>
          <Trans>Documenso API</Trans>
        </h3>
        <p className="mt-2 max-w-[44ch] text-[#d2d7fb] text-sm leading-relaxed sm:text-base">
          <Trans>
            Create and send documents, track signing progress, and retrieve signed PDFs from your application.
          </Trans>
        </p>

        <div className="mt-5 overflow-hidden rounded-xl border border-white/20 bg-[#10132c]">
          <p className="flex items-center gap-2 border-white/15 border-b px-3 py-2 font-medium text-white/75 text-xs">
            <TerminalIcon aria-hidden="true" className="size-3.5" />
            <Trans>List templates</Trans>
          </p>
          <pre dir="ltr" className="overflow-x-auto px-3 py-3 text-[#dbe2ff] text-xs leading-relaxed sm:text-sm">
            <code>
              <span className="text-[#9eafff]">curl -G</span>
              {' "$BASE_URL/api/v2/envelope" \\\n  -d "type=TEMPLATE" \\\n  -H "Authorization: $API_TOKEN"'}
            </code>
          </pre>
        </div>

        <div className="mt-auto pt-4">
          <FeatureLink href="https://openapi.documenso.com/" className="text-[#e0e5ff]">
            <Trans>Read the API reference</Trans>
          </FeatureLink>
        </div>
      </article>

      <article className={cn(featureCard, 'lg:col-span-4')}>
        <h3 className={featureTitle}>
          <Trans>Create and manage teams</Trans>
        </h3>
        <p className={featureDescription}>
          <Trans>
            Collaborate in shared teams and control who can see sensitive documents with roles and visibility settings.
          </Trans>
        </p>

        <ul aria-hidden="true" className={cn(previewCard, 'mt-5 divide-y divide-[var(--landing-line)]')}>
          {teamRoles.map(({ role, permission, id }) => (
            <li key={id} className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 px-3 py-2.5 text-xs">
              <span className="inline-flex items-center gap-2 font-medium">
                <UsersRoundIcon className="size-3.5 text-documenso-600 dark:text-documenso-300" />
                {role}
              </span>
              <span className="text-[var(--landing-muted)]">{permission}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-4">
          <FeatureLink href="https://docs.documenso.com/docs/users/organisations/members#team-member-roles">
            <Trans>Explore team permissions</Trans>
          </FeatureLink>
        </div>
      </article>

      <article className={cn(featureCard, 'lg:col-span-4')}>
        <h3 className={featureTitle}>
          <Trans>Verify signed documents</Trans>
        </h3>
        <p className={featureDescription}>
          <Trans>
            Check a completed PDF’s digital signature in a compatible reader and review the signing audit trail.
          </Trans>
        </p>

        <div className={cn(previewCard, 'mt-5 flex flex-col items-start gap-2.5 p-3')}>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-documenso-600 dark:text-documenso-300"
            />
            <a
              href="https://docs.documenso.com/docs/compliance/certifications#21-cfr-part-11"
              className="inline-flex min-h-6 items-center gap-1 rounded-sm font-semibold text-sm underline underline-offset-4"
            >
              <Trans>21 CFR Part 11</Trans>
              <ArrowUpRightIcon aria-hidden="true" className="size-3.5 shrink-0" />
            </a>
          </div>
          <p className="text-[var(--landing-muted)] text-xs leading-relaxed">
            <Trans>21 CFR Part 11 controls require an Enterprise license and configuration.</Trans>
          </p>
        </div>

        <div className="mt-auto pt-4">
          <FeatureLink href="https://docs.documenso.com/docs/concepts/signing-certificates">
            <Trans>How PDF verification works</Trans>
          </FeatureLink>
        </div>
      </article>

      <article className={cn(featureCard, 'md:col-span-2 lg:col-span-4')}>
        <h3 className={featureTitle}>
          <Trans>Templates and Direct Links</Trans>
        </h3>
        <p className={featureDescription}>
          <Trans>
            Save signing roles and fields in a reusable template. Share a Direct Link to collect signatures without
            knowing recipient emails in advance.
          </Trans>
        </p>

        <div aria-hidden="true" className={cn(previewCard, 'mt-5 p-3')}>
          <div className="flex min-w-0 items-center gap-2.5 font-medium text-xs">
            <FilesIcon className="size-4 shrink-0 text-documenso-600 dark:text-documenso-300" />
            <Trans>Mutual NDA</Trans>
          </div>
          <div className="mt-2.5 flex min-w-0 items-center gap-2 rounded-md bg-[var(--landing-nav-surface)] p-2 text-[0.6875rem] text-[var(--landing-muted)]">
            <Link2Icon className="size-3.5 shrink-0" />
            <code className="min-w-0 truncate">app.documenso.com/d/…</code>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4">
          <FeatureLink href="https://docs.documenso.com/docs/users/templates">
            <Trans>Explore templates</Trans>
          </FeatureLink>
          <FeatureLink href="https://docs.documenso.com/docs/users/documents/direct-links">
            <Trans>Direct Links guide</Trans>
          </FeatureLink>
        </div>
      </article>
    </div>
  </section>
);

const FeatureLink = ({ href, children, className }: { href: string; children: ReactNode; className?: string }) => (
  <a
    href={href}
    className={cn(
      'inline-flex min-h-7 items-center gap-1.5 rounded-sm font-medium text-sm leading-snug underline-offset-4 hover:underline',
      className,
    )}
  >
    {children}
    <ArrowRightIcon aria-hidden="true" className="size-3.5 shrink-0 rtl:rotate-180" />
  </a>
);

const featureCard =
  'flex min-w-0 flex-col rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-nav-surface)] p-4 sm:p-6';
const featureTitle = 'font-semibold text-xl leading-tight tracking-tight sm:text-2xl';
const featureDescription = 'mt-2 max-w-[54ch] text-[var(--landing-muted)] text-sm leading-relaxed sm:text-base';
const previewCard =
  'rounded-xl border border-[var(--landing-line)] bg-[var(--landing-canvas)] shadow-[0_4px_10px_-8px_#18205550]';

const teamRoles = [
  { id: 'admin', role: <Trans>Admin</Trans>, permission: <Trans>Team settings</Trans> },
  { id: 'manager', role: <Trans>Manager</Trans>, permission: <Trans>Manage members</Trans> },
  { id: 'member', role: <Trans>Member</Trans>, permission: <Trans>Shared documents</Trans> },
];
