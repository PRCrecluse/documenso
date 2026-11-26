import { ExtendedDocumentStatus } from '@documenso/prisma/types/extended-document-status';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { CheckCircle2, FilesIcon, TimerOff, XCircle } from 'lucide-react';
import { match } from 'ts-pattern';

export type DocumentsTableEmptyStateProps = { status: ExtendedDocumentStatus };

export const DocumentsTableEmptyState = ({ status }: DocumentsTableEmptyStateProps) => {
  const { _ } = useLingui();

  const {
    title,
    message,
    icon: Icon,
  } = match(status)
    .with(ExtendedDocumentStatus.COMPLETED, () => ({
      title: msg`Nothing to do`,
      message: msg`There are no completed documents yet. Documents that you have created or received will appear here once completed.`,
      icon: CheckCircle2,
    }))
    .with(ExtendedDocumentStatus.DRAFT, () => ({
      title: msg`No active drafts`,
      message: msg`There are no active drafts at the current moment. You can upload a document to start drafting.`,
      icon: CheckCircle2,
    }))
    .with(ExtendedDocumentStatus.CANCELLED, () => ({
      title: msg`Nothing cancelled`,
      message: msg`There are no cancelled documents. Documents you cancel will remain here as a record that they were distributed.`,
      icon: XCircle,
    }))
    .with(ExtendedDocumentStatus.REJECTED, () => ({
      title: msg`No rejected documents`,
      message: msg`There are no rejected documents. Documents that a recipient declines to sign will appear here.`,
      icon: XCircle,
    }))
    .with(ExtendedDocumentStatus.EXPIRED, () => ({
      title: msg`No expired documents`,
      message: msg`There are no documents with expired signing links. You can redistribute a document to renew its expiration.`,
      icon: TimerOff,
    }))
    .with(ExtendedDocumentStatus.ALL, () => ({
      title: msg`We're all empty`,
      message: msg`You have not yet created or received any documents. To create a document please upload one.`,
      icon: FilesIcon,
    }))
    .otherwise(() => ({
      title: msg`Nothing to do`,
      message: msg`All documents have been processed. Any new documents that are sent or received will show here.`,
      icon: CheckCircle2,
    }));

  return (
    <div
      className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/30 px-5 py-8 text-muted-foreground"
      data-testid="empty-document-state"
    >
      <div className="rounded-xl bg-accent p-3 text-documenso dark:text-documenso-300">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </div>

      <div className="text-center">
        <h3 className="font-semibold text-foreground">{_(title)}</h3>

        <p className="mt-1 max-w-[60ch] text-sm">{_(message)}</p>
      </div>
    </div>
  );
};
