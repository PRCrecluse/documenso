import { useSessionStorage } from '@documenso/lib/client-only/hooks/use-session-storage';
import { STATS_COUNT_CAP } from '@documenso/lib/constants/document';
import { SKIP_QUERY_BATCH_META } from '@documenso/lib/constants/trpc';
import { formatDocumentsPath } from '@documenso/lib/utils/teams';
import { ExtendedDocumentStatus } from '@documenso/prisma/types/extended-document-status';
import { trpc } from '@documenso/trpc/react';
import type { TFindDocumentsInternalResponse } from '@documenso/trpc/server/document-router/find-documents-internal.types';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';
import type { RowSelectionState } from '@documenso/ui/primitives/data-table';
import { Skeleton } from '@documenso/ui/primitives/skeleton';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { EnvelopeType, FolderType, type DocumentStatus as PrismaDocumentStatus } from '@prisma/client';
import { CircleCheckIcon, Clock3Icon, FilePenLineIcon, FilesIcon, XIcon } from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { EnvelopesBulkCancelDialog } from '~/components/dialogs/envelopes-bulk-cancel-dialog';
import { EnvelopesBulkDeleteDialog } from '~/components/dialogs/envelopes-bulk-delete-dialog';
import {
  type EnvelopeBulkDownloadItem,
  EnvelopesBulkDownloadDialog,
} from '~/components/dialogs/envelopes-bulk-download-dialog';
import { EnvelopesBulkMoveDialog } from '~/components/dialogs/envelopes-bulk-move-dialog';
import { DocumentSearch } from '~/components/general/document/document-search';
import { EnvelopeDropZoneWrapper } from '~/components/general/envelope/envelope-drop-zone-wrapper';
import { FolderGrid, FolderGridActions } from '~/components/general/folder/folder-grid';
import { WorkspacePageHeader } from '~/components/general/workspace-page-header';
import { DocumentsTable } from '~/components/tables/documents-table';
import { DocumentsTableEmptyState } from '~/components/tables/documents-table-empty-state';
import { DocumentsTablePeriodFilter } from '~/components/tables/documents-table-period-filter';
import { DocumentsTableSenderFilter } from '~/components/tables/documents-table-sender-filter';
import { DocumentsTableStatusFilter } from '~/components/tables/documents-table-status-filter';
import { EnvelopesTableBulkActionBar } from '~/components/tables/envelopes-table-bulk-action-bar';
import { useCurrentTeam } from '~/providers/team';
import { documentsSearchParams } from '~/utils/documents-search-params';
import { appMetaTags } from '~/utils/meta';

export function meta() {
  return appMetaTags(msg`Documents`);
}

type EnvelopeMetaCache = Record<string, { title: string; status: PrismaDocumentStatus; isLegacy: boolean }>;

// Stable initial values: `useSessionStorage` keeps its setter identity stable
// only while the initial value reference is stable, and the metadata cache
// effect below depends on that setter.
const EMPTY_ROW_SELECTION: RowSelectionState = {};
const EMPTY_ENVELOPE_META_CACHE: EnvelopeMetaCache = {};

export default function DocumentsPage() {
  const team = useCurrentTeam();

  const { folderId } = useParams();
  const navigate = useNavigate();

  const documentsPath = formatDocumentsPath(team.url);

  const [isMovingDocument, setIsMovingDocument] = useState(false);
  const [documentToMove, setDocumentToMove] = useState<string | null>(null);

  // Scoped by team so selections made in one team never leak into another.
  const [rowSelection, setRowSelection] = useSessionStorage<RowSelectionState>(
    `documents-bulk-selection-${team.id}`,
    EMPTY_ROW_SELECTION,
  );
  const [envelopeMetaCache, setEnvelopeMetaCache] = useSessionStorage<EnvelopeMetaCache>(
    `documents-bulk-selection-meta-${team.id}`,
    EMPTY_ENVELOPE_META_CACHE,
  );
  const [isBulkMoveDialogOpen, setIsBulkMoveDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isBulkDownloadDialogOpen, setIsBulkDownloadDialogOpen] = useState(false);
  const [isBulkCancelDialogOpen, setIsBulkCancelDialogOpen] = useState(false);

  const selectedEnvelopeIds = useMemo(() => {
    return Object.keys(rowSelection).filter((id) => rowSelection[id]);
  }, [rowSelection]);

  const [findDocumentSearchParams, setFindDocumentSearchParams] = useQueryStates(documentsSearchParams, {
    history: 'push',
  });

  const { data, isLoading, isLoadingError } = trpc.document.findDocumentsInternal.useQuery(
    {
      status: findDocumentSearchParams.status ?? undefined,
      period: findDocumentSearchParams.period ?? undefined,
      senderIds: findDocumentSearchParams.senderIds ?? undefined,
      page: findDocumentSearchParams.page ?? undefined,
      perPage: findDocumentSearchParams.perPage ?? undefined,
      query: findDocumentSearchParams.query ?? undefined,
      folderId,
    },
    {
      placeholderData: (previousData) => previousData,
      ...SKIP_QUERY_BATCH_META,
    },
  );

  useEffect(() => {
    setEnvelopeMetaCache((prev) => {
      const next: EnvelopeMetaCache = {};

      for (const id of Object.keys(prev)) {
        if (rowSelection[id]) {
          next[id] = prev[id];
        }
      }

      for (const document of data?.data ?? []) {
        if (rowSelection[document.envelopeId]) {
          next[document.envelopeId] = {
            title: document.title,
            status: document.status,
            isLegacy: document.internalVersion === 1,
          };
        }
      }

      return next;
    });
  }, [data?.data, rowSelection, setEnvelopeMetaCache]);

  const selectedEnvelopesForDownload = useMemo(() => {
    return selectedEnvelopeIds
      .map((id): EnvelopeBulkDownloadItem | null => {
        const meta = envelopeMetaCache[id];

        if (!meta) {
          return null;
        }

        return {
          id,
          title: meta.title,
          status: meta.status,
          // Stale cache entries predating this field are treated as legacy so
          // the Partial option is never offered without certainty.
          isLegacy: meta.isLegacy ?? true,
        };
      })
      .filter((item): item is EnvelopeBulkDownloadItem => item !== null);
  }, [selectedEnvelopeIds, envelopeMetaCache]);

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      (findDocumentSearchParams.status && findDocumentSearchParams.status !== ExtendedDocumentStatus.ALL) ||
        findDocumentSearchParams.senderIds?.length ||
        findDocumentSearchParams.period,
    );
  }, [findDocumentSearchParams]);

  const onResetFilters = () => {
    void setFindDocumentSearchParams({
      status: null,
      senderIds: null,
      period: null,
      page: null,
    });
  };

  const selectedStatus = findDocumentSearchParams.status ?? ExtendedDocumentStatus.ALL;

  return (
    <EnvelopeDropZoneWrapper type={EnvelopeType.DOCUMENT}>
      <div className="mx-auto w-full max-w-screen-xl px-3 md:px-6">
        <div className="workspace-frame rounded-2xl border sm:rounded-3xl">
          <WorkspacePageHeader
            eyebrow={team.name}
            title={<Trans>Documents</Trans>}
            description={<Trans>Manage drafts, track signatures, and find completed agreements.</Trans>}
            actions={<FolderGridActions type={FolderType.DOCUMENT} parentId={folderId ?? null} />}
          />

          <div className="space-y-7 px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
            <DocumentCountSummary
              stats={data?.stats}
              selectedStatus={selectedStatus}
              onSelect={(status) => {
                void setFindDocumentSearchParams({
                  status: status === ExtendedDocumentStatus.ALL ? null : status,
                  page: null,
                });
              }}
            />

            <FolderGrid type={FolderType.DOCUMENT} parentId={folderId ?? null} />

            <section aria-labelledby="documents-list-heading">
              <h2 id="documents-list-heading" className="mb-3 font-semibold text-lg tracking-tight">
                <Trans>Document list</Trans>
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                <div className="w-full sm:w-56">
                  <DocumentSearch />
                </div>

                <DocumentsTableStatusFilter stats={data?.stats} />

                {team && <DocumentsTableSenderFilter teamId={team.id} />}

                <DocumentsTablePeriodFilter />

                {hasActiveFilters && (
                  <Button variant="ghost" className="px-2 text-muted-foreground lg:px-3" onClick={onResetFilters}>
                    <Trans>Reset</Trans>
                    <XIcon className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="mt-4">
                {data && data.count === 0 ? (
                  <DocumentsTableEmptyState status={selectedStatus} />
                ) : (
                  <DocumentsTable
                    data={data}
                    isLoading={isLoading}
                    isLoadingError={isLoadingError}
                    onMoveDocument={(envelopeId) => {
                      setDocumentToMove(envelopeId);
                      setIsMovingDocument(true);
                    }}
                    enableSelection
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                  />
                )}
              </div>
            </section>
          </div>
        </div>

        {documentToMove && (
          <EnvelopesBulkMoveDialog
            envelopeIds={[documentToMove]}
            envelopeType={EnvelopeType.DOCUMENT}
            open={isMovingDocument}
            currentFolderId={folderId}
            onOpenChange={(open) => {
              setIsMovingDocument(open);

              if (!open) {
                setDocumentToMove(null);
              }
            }}
            onSuccess={(destinationFolderId) =>
              navigate(destinationFolderId ? `${documentsPath}/f/${destinationFolderId}` : documentsPath)
            }
          />
        )}

        <EnvelopesTableBulkActionBar
          selectedCount={selectedEnvelopeIds.length}
          onDownloadClick={() => setIsBulkDownloadDialogOpen(true)}
          onMoveClick={() => setIsBulkMoveDialogOpen(true)}
          onDeleteClick={() => setIsBulkDeleteDialogOpen(true)}
          onCancelClick={() => setIsBulkCancelDialogOpen(true)}
          onClearSelection={() => setRowSelection({})}
        />

        <EnvelopesBulkDownloadDialog
          envelopes={selectedEnvelopesForDownload}
          open={isBulkDownloadDialogOpen}
          onOpenChange={setIsBulkDownloadDialogOpen}
          onSuccess={(successfulEnvelopeIds) => {
            setRowSelection((prev) => {
              const next = { ...prev };
              for (const id of successfulEnvelopeIds) {
                delete next[id];
              }
              return next;
            });
          }}
        />

        <EnvelopesBulkMoveDialog
          envelopeIds={selectedEnvelopeIds}
          envelopeType={EnvelopeType.DOCUMENT}
          open={isBulkMoveDialogOpen}
          currentFolderId={folderId}
          onOpenChange={setIsBulkMoveDialogOpen}
          onSuccess={() => setRowSelection({})}
        />

        <EnvelopesBulkDeleteDialog
          envelopeIds={selectedEnvelopeIds}
          envelopeType={EnvelopeType.DOCUMENT}
          open={isBulkDeleteDialogOpen}
          onOpenChange={setIsBulkDeleteDialogOpen}
          onSuccess={() => setRowSelection({})}
        />

        <EnvelopesBulkCancelDialog
          envelopeIds={selectedEnvelopeIds}
          open={isBulkCancelDialogOpen}
          onOpenChange={setIsBulkCancelDialogOpen}
          onSuccess={() => setRowSelection({})}
        />
      </div>
    </EnvelopeDropZoneWrapper>
  );
}

type DocumentCountSummaryProps = {
  stats?: TFindDocumentsInternalResponse['stats'];
  selectedStatus: ExtendedDocumentStatus;
  onSelect: (status: ExtendedDocumentStatus) => void;
};

const DocumentCountSummary = ({ stats, selectedStatus, onSelect }: DocumentCountSummaryProps) => {
  const { _, i18n } = useLingui();

  const numberFormat = new Intl.NumberFormat(i18n.locale);

  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{_(msg`Filter by document status`)}</legend>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {DOCUMENT_STATUS_CARDS.map(({ status, label, icon: Icon }) => {
          const count = stats?.[status];
          const isSelected = selectedStatus === status;

          return (
            <button
              key={status}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(status)}
              className={cn(
                'flex min-w-0 flex-col gap-3 rounded-xl border bg-popover p-3 text-start transition-colors hover:border-primary/40 hover:bg-accent sm:p-4',
                isSelected && 'border-primary/30 bg-accent',
              )}
            >
              <span className="flex min-w-0 items-start gap-2 font-medium text-muted-foreground text-sm">
                <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-documenso dark:text-documenso-300" />
                <span className="min-w-0 break-words">{_(label)}</span>
              </span>
              {count === undefined ? (
                <Skeleton aria-hidden="true" className="h-7 w-8" />
              ) : (
                <span className="font-semibold text-2xl tabular-nums leading-7 tracking-tight sm:text-3xl">
                  {numberFormat.format(count)}
                  {count >= STATS_COUNT_CAP ? '+' : ''}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};

const DOCUMENT_STATUS_CARDS = [
  { status: ExtendedDocumentStatus.ALL, label: msg`All documents`, icon: FilesIcon },
  { status: ExtendedDocumentStatus.DRAFT, label: msg`Drafts`, icon: FilePenLineIcon },
  { status: ExtendedDocumentStatus.PENDING, label: msg`Pending`, icon: Clock3Icon },
  { status: ExtendedDocumentStatus.COMPLETED, label: msg`Completed`, icon: CircleCheckIcon },
];
