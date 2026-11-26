import { Trans } from '@lingui/react/macro';
import { CheckIcon, Clock3Icon, FileTextIcon, PenLineIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { BrandingLogo } from './branding-logo';

type AuthPageProps = {
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
};

export const AuthPage = ({ title, description, children }: AuthPageProps) => (
  <div className="w-full max-w-lg lg:max-w-6xl">
    <BrandingLogo aria-label="Documenso" role="img" className="mb-5 h-5 w-auto sm:mb-7 sm:h-6" />

    <div className="isolate grid overflow-hidden rounded-3xl border bg-popover shadow-[0_28px_80px_-48px_rgb(32_51_135/0.35)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col justify-center px-5 py-8 sm:px-10 sm:py-10 lg:px-12">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-balance font-semibold text-[2rem] leading-[1.12] sm:text-[2.25rem]">{title}</h1>
          <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{description}</p>

          <div className="mt-7">{children}</div>
        </div>
      </div>

      <section className="order-first hidden min-w-0 flex-col justify-center border-e bg-muted/45 p-8 lg:flex xl:p-11">
        <h2 className="max-w-[12ch] text-balance font-semibold text-[2.5rem] leading-[1.03] tracking-[-0.055em] xl:text-[3.25rem]">
          <Trans>Send, sign, and track your documents</Trans>
        </h2>

        <p className="mt-4 max-w-[36ch] text-muted-foreground text-sm leading-relaxed xl:text-base">
          <Trans>Collect signatures and keep an audit trail in one workspace, open source under AGPL-3.0.</Trans>
        </p>

        <SigningPreview />
      </section>
    </div>
  </div>
);

const SigningPreview = () => (
  <figure className="relative isolate mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-documenso-100 via-documenso-300 to-documenso-500 p-4 xl:p-6 dark:from-documenso-900 dark:via-documenso-800 dark:to-documenso-600">
    <figcaption className="sr-only">
      <Trans>Example agreement with a completed signature and a pending signature request</Trans>
    </figcaption>

    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.18)_1px,transparent_1px)] bg-[size:2rem_2rem]"
    />

    <div
      aria-hidden="true"
      className="relative overflow-hidden rounded-xl border border-white/80 bg-popover shadow-[0_14px_32px_-16px_rgb(21_35_108/0.6)] ring-4 ring-white/20 dark:border-documenso-300/35 dark:ring-white/10"
    >
      <div className="flex items-center justify-between gap-2 border-b px-3 py-3 xl:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-documenso-100 text-documenso-700 dark:bg-documenso-900 dark:text-documenso-300">
            <FileTextIcon className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-xs">
              <Trans>Partnership agreement</Trans>
            </p>
            <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
              <Trans>Signing preview</Trans>
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-documenso-100 px-2.5 py-1 font-medium text-[0.6875rem] text-documenso-700 dark:bg-documenso-900 dark:text-documenso-300">
          <Trans>In progress</Trans>
        </span>
      </div>

      <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-2 bg-muted/60 p-2.5 xl:gap-3 xl:p-3">
        <div className="rounded-lg border bg-popover p-3 xl:p-4">
          <div className="mb-4 space-y-2">
            <div className="h-1.5 w-1/2 rounded-full bg-documenso-200 dark:bg-documenso-700" />
            <div className="h-1 w-full rounded-full bg-border" />
            <div className="h-1 w-4/5 rounded-full bg-border" />
          </div>

          <div className="flex items-center gap-1.5 rounded-md border border-documenso-300 border-dashed bg-documenso-50 p-2 text-documenso-700 dark:border-documenso-700 dark:bg-documenso-950 dark:text-documenso-300">
            <PenLineIcon className="size-3 shrink-0" />
            <span className="truncate font-signature text-lg leading-none">Avery Chen</span>
          </div>
        </div>

        <div className="rounded-lg border bg-popover p-3 xl:p-4">
          <p className="font-semibold text-[0.6875rem]">
            <Trans>Activity</Trans>
          </p>

          <ul className="mt-2.5 space-y-2 text-[0.6875rem] text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <CheckIcon className="size-3 shrink-0 text-documenso-700 dark:text-documenso-300" />
              <Trans>Signature collected</Trans>
            </li>
            <li className="flex items-center gap-1.5">
              <Clock3Icon className="size-3 shrink-0" />
              <Trans>Awaiting signature</Trans>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </figure>
);
