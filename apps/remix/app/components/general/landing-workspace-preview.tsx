import { cn } from '@documenso/ui/lib/utils';
import { Trans } from '@lingui/react/macro';
import { FileTextIcon, FileUpIcon, InboxIcon, SearchIcon } from 'lucide-react';

import { BrandingLogo } from './branding-logo';

export const LandingWorkspacePreview = () => (
  <div className="overflow-hidden rounded-[inherit] bg-popover text-popover-foreground">
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-4">
      <BrandingLogo aria-label="Documenso" role="img" className="h-3.5 w-auto text-foreground sm:h-4" />

      <div className="flex min-w-0 items-center justify-center gap-1 font-medium text-[10px] sm:text-xs">
        <span className="rounded-full bg-foreground px-2.5 py-1 text-background sm:px-3.5 sm:py-1.5">
          <Trans>Documents</Trans>
        </span>
        <span className="hidden px-2.5 text-muted-foreground sm:inline">
          <Trans>Templates</Trans>
        </span>
        <span className="hidden px-2.5 text-muted-foreground sm:inline">
          <Trans>Inbox</Trans>
        </span>
      </div>

      <div aria-hidden="true" className="flex items-center justify-end gap-1">
        <span className="hidden size-7 place-items-center rounded-full bg-muted text-foreground sm:grid">
          <SearchIcon className="size-3.5" />
        </span>
        <span className="hidden size-7 place-items-center rounded-full bg-muted text-foreground sm:grid">
          <InboxIcon className="size-3.5" />
        </span>
        <span className="flex size-6 items-center justify-center rounded-full border border-documenso-200 bg-documenso-100 font-semibold text-[10px] text-documenso-700 sm:size-7 dark:border-documenso-800 dark:bg-documenso-900 dark:text-documenso-200">
          AP
        </span>
      </div>
    </div>

    <div className="border-b px-3 pt-2.5 pb-3 sm:px-7 sm:pt-5 sm:pb-5">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-semibold text-xl leading-none tracking-tight sm:text-3xl">
            <Trans>Documents</Trans>
          </h2>
          <p className="mt-1.5 max-w-[48ch] text-[10px] text-muted-foreground leading-relaxed sm:text-sm">
            <Trans>Manage drafts, track signatures, and find completed agreements.</Trans>
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-2 rounded-full border bg-muted/35 px-3 py-2 text-xs sm:flex">
          <FileUpIcon aria-hidden="true" className="size-3.5 text-documenso-600 dark:text-documenso-300" />
          <span className="font-medium">
            <Trans>Upload Document</Trans>
          </span>
        </div>
      </div>
    </div>

    <div className="bg-muted/40 px-3 py-3 sm:p-5 lg:px-7 lg:py-5">
      <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-2 sm:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] sm:gap-3">
        <div className="min-w-0 rounded-xl border bg-popover p-2 sm:rounded-2xl sm:p-4">
          <div aria-hidden="true" className="mb-4 hidden items-center gap-4 border-b pb-4 sm:flex">
            <div className="shrink-0">
              <p className="font-semibold text-xl leading-none tracking-tight">3</p>
              <p className="mt-1 text-muted-foreground text-xs">
                <Trans>All documents</Trans>
              </p>
            </div>
            <div className="grid flex-1 grid-cols-3 gap-1">
              <span className="h-3 rounded-full bg-documenso-500" />
              <span className="h-3 rounded-full bg-emerald-400" />
              <span className="h-3 rounded-full bg-muted-foreground/20" />
            </div>
          </div>

          <h3 className="mb-2 px-1 font-semibold text-xs sm:text-sm">
            <Trans>Recent documents</Trans>
          </h3>
          <ul className="space-y-1">
            {previewDocuments.map(({ id, title, status, statusClassName, isSelected }) => (
              <li
                key={id}
                className={cn(
                  'flex min-w-0 items-center gap-1 rounded-lg px-1 py-1.5 sm:gap-3 sm:px-2.5 sm:py-2',
                  isSelected && 'bg-documenso-50/90 dark:bg-documenso-900/60',
                )}
              >
                <span className="hidden size-7 shrink-0 place-items-center rounded-lg border bg-popover text-documenso-600 sm:grid dark:text-documenso-300">
                  <FileTextIcon aria-hidden="true" className="size-3.5" />
                </span>
                <span className="min-w-0 flex-1 truncate font-medium text-[11px] sm:text-xs">{title}</span>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-1.5 py-1 font-medium text-[9px] sm:px-2 sm:text-[10px]',
                    statusClassName,
                  )}
                >
                  {status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 rounded-xl border bg-popover p-2 sm:rounded-2xl sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-xs sm:text-sm">
              <Trans>Recipients</Trans>
            </h3>
            <span className="font-medium text-[11px] text-muted-foreground tabular-nums">1 / 2</span>
          </div>
          <div aria-hidden="true" className="mt-2.5 h-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/2 rounded-full bg-primary" />
          </div>
          <ul className="mt-2 divide-y">
            {previewRecipients.map(({ name, initials, status, statusClassName }) => (
              <li key={name} className="flex items-center gap-1.5 py-2 sm:gap-2">
                <span
                  aria-hidden="true"
                  className="hidden size-6 shrink-0 place-items-center rounded-full bg-muted font-semibold text-[9px] text-muted-foreground sm:grid"
                >
                  {initials}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium text-[11px] sm:text-xs">{name}</span>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-1.5 py-1 font-medium text-[9px] sm:px-2 sm:text-[10px]',
                    statusClassName,
                  )}
                >
                  {status}
                </span>
              </li>
            ))}
          </ul>
          <div
            aria-hidden="true"
            className="mt-2 hidden rounded-lg border border-documenso-200 border-dashed bg-documenso-50 px-3 py-2 sm:block dark:border-documenso-700 dark:bg-documenso-950"
          >
            <p className="font-signature text-documenso-800 text-lg leading-none dark:text-documenso-200">Jordan Lee</p>
            <p className="mt-1 text-muted-foreground text-xs">
              <Trans>Signature</Trans>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const activeStatus = 'bg-documenso-100 text-documenso-800 dark:bg-documenso-800/70 dark:text-documenso-200';
const signedStatus = 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';

const previewDocuments = [
  {
    id: 'partnership',
    title: <Trans>Partnership agreement</Trans>,
    status: <Trans>In progress</Trans>,
    statusClassName: activeStatus,
    isSelected: true,
  },
  {
    id: 'nda',
    title: <Trans>Mutual NDA</Trans>,
    status: <Trans>Completed</Trans>,
    statusClassName: signedStatus,
  },
  {
    id: 'scope',
    title: <Trans>Project scope</Trans>,
    status: <Trans>Draft</Trans>,
    statusClassName: 'bg-muted text-muted-foreground',
  },
];

const previewRecipients = [
  {
    name: 'Jordan Lee',
    initials: 'JL',
    status: <Trans>Signed</Trans>,
    statusClassName: signedStatus,
  },
  {
    name: 'Taylor Reed',
    initials: 'TR',
    status: <Trans>Pending</Trans>,
    statusClassName: activeStatus,
  },
];
