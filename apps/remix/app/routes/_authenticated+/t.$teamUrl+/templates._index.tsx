import { useSessionStorage } from '@documenso/lib/client-only/hooks/use-session-storage';
import { useCurrentOrganisation } from '@documenso/lib/client-only/providers/organisation';
import { FolderType } from '@documenso/lib/types/folder-type';
import { formatAvatarUrl } from '@documenso/lib/utils/avatars';
import { formatDocumentsPath, formatTemplatesPath } from '@documenso/lib/utils/teams';
import { trpc } from '@documenso/trpc/react';
import { Avatar, AvatarFallback, AvatarImage } from '@documenso/ui/primitives/avatar';
import { Button } from '@documenso/ui/primitives/button';
import type { RowSelectionState } from '@documenso/ui/primitives/data-table';
import { msg } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { EnvelopeType, OrganisationType } from '@prisma/client';
import { Bird, XIcon } from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router';

import { EnvelopesBulkDeleteDialog } from '~/components/dialogs/envelopes-bulk-delete-dialog';
import { EnvelopesBulkMoveDialog } from '~/components/dialogs/envelopes-bulk-move-dialog';
import { EnvelopeDropZoneWrapper } from '~/components/general/envelope/envelope-drop-zone-wrapper';
import { FolderGrid } from '~/components/general/folder/folder-grid';
import { TemplateSearch } from '~/components/general/template/template-search';
import { WorkspacePageHeader } from '~/components/general/workspace-page-header';
import { EnvelopesTableBulkActionBar } from '~/components/tables/envelopes-table-bulk-action-bar';
import { TemplatesTable } from '~/components/tables/templates-table';
import { TemplatesTableOwnerFilter } from '~/components/tables/templates-table-owner-filter';
import { TemplatesTableViewFilter } from '~/components/tables/templates-table-view-filter';
import { useCurrentTeam } from '~/providers/team';
import { appMetaTags } from '~/utils/meta';
import { templatesSearchParams } from '~/utils/templates-search-params';

export function meta() {
  return appMetaTags(msg`Templates`);
}

// Stable initial value: `useSessionStorage` keeps its setter identity stable
// only while the initial value reference is stable.
const EMPTY_ROW_SELECTION: RowSelectionState = {};

export default function TemplatesPage() {
  const team = useCurrentTeam();
  const organisation = useCurrentOrganisation();

  const { folderId } = useParams();
  const [findTemplateSearchParams, setFindTemplateSearchParams] = useQueryStates(templatesSearchParams, {
    history: 'push',
  });
  const page = findTemplateSearchParams.page || undefined;
  const perPage = findTemplateSearchParams.perPage || undefined;
  const query = findTemplateSearchParams.query || undefined;
  const ownerIds = findTemplateSearchParams.ownerIds ?? undefined;

  const isOrgView = findTemplateSearchParams.view === 'organisation';
  const showOrgFilter = organisation.type !== OrganisationType.PERSONAL;

  const hasActiveFilters = Boolean(ownerIds?.length);
  const isSearchingOrFiltering = hasActiveFilters || Boolean(query);

  const onResetFilters = () => {
    void setFindTemplateSearchParams({
      ownerIds: null,
      page: null,
    });
  };

  // Scoped by team so selections made in one team never leak into another.
  const [rowSelection, setRowSelection] = useSessionStorage<RowSelectionState>(
    `templates-bulk-selection-${team.id}`,
    EMPTY_ROW_SELECTION,
  );
  const [isBulkMoveDialogOpen, setIsBulkMoveDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  const selectedEnvelopeIds = useMemo(() => {
    return Object.keys(rowSelection).filter((id) => rowSelection[id]);
  }, [rowSelection]);

  const documentRootPath = formatDocumentsPath(team.url);
  const templateRootPath = formatTemplatesPath(team.url);

  const teamTemplatesQuery = trpc.template.findTemplatesInternal.useQuery(
    {
      page,
      perPage,
      folderId,
      query,
      ownerIds,
    },
    {
      enabled: !isOrgView,
      placeholderData: (previousData) => previousData,
    },
  );

  const orgTemplatesQuery = trpc.template.findOrganisationTemplates.useQuery(
    {
      page,
      perPage,
      query,
    },
    {
      enabled: isOrgView,
      placeholderData: (previousData) => previousData,
    },
  );

  const activeQuery = isOrgView ? orgTemplatesQuery : teamTemplatesQuery;

  return (
    <EnvelopeDropZoneWrapper type={EnvelopeType.TEMPLATE}>
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        {!isOrgView && <FolderGrid type={FolderType.TEMPLATE} parentId={folderId ?? null} />}

        <div className="mt-8">
          <WorkspacePageHeader
            eyebrow={team.name}
            title={
              <span className="flex items-center gap-3">
                <Avatar className="h-11 w-11 border-2 border-background dark:border-border">
                  {team.avatarImageId && <AvatarImage src={formatAvatarUrl(team.avatarImageId)} />}
                  <AvatarFallback className="text-muted-foreground text-xs">{team.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <Trans>Templates</Trans>
              </span>
            }
            description={<Trans>Reusable documents your team can send without starting from a blank file.</Trans>}
          />

          <div className="mt-8 rounded-3xl border border-border bg-background p-4 shadow-[0_18px_50px_-32px_hsl(230_45%_20%/0.55)] md:p-6">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-4">
              <div className="w-full sm:w-56">
                <TemplateSearch />
              </div>

              {showOrgFilter && <TemplatesTableViewFilter />}

              {!isOrgView && <TemplatesTableOwnerFilter teamId={team.id} />}

              {hasActiveFilters && (
                <Button variant="ghost" className="px-2 text-muted-foreground lg:px-3" onClick={onResetFilters}>
                  <Trans>Reset</Trans>
                  <XIcon className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="mt-6">
              {activeQuery.data && activeQuery.data.count === 0 && !isSearchingOrFiltering ? (
                <div className="flex h-72 flex-col items-center justify-center gap-y-4 rounded-2xl border border-border border-dashed bg-muted/40 px-6 text-muted-foreground">
                  <Bird className="h-12 w-12" strokeWidth={1.5} />

                  <div className="text-center">
                    <h3 className="font-semibold text-foreground text-lg">
                      <Trans>We're all empty</Trans>
                    </h3>

                    <p className="mt-2 max-w-[50ch] text-muted-foreground [text-wrap:pretty]">
                      {isOrgView ? (
                        <Trans>No organisation templates are shared with your team yet.</Trans>
                      ) : (
                        <Trans>You have not yet created any templates. To create a template please upload one.</Trans>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <TemplatesTable
                  data={activeQuery.data}
                  isLoading={activeQuery.isLoading}
                  isLoadingError={activeQuery.isLoadingError}
                  documentRootPath={documentRootPath}
                  templateRootPath={templateRootPath}
                  enableSelection={!isOrgView}
                  rowSelection={isOrgView ? {} : rowSelection}
                  onRowSelectionChange={isOrgView ? undefined : setRowSelection}
                />
              )}
            </div>
          </div>
        </div>

        {!isOrgView && (
          <>
            <EnvelopesTableBulkActionBar
              selectedCount={selectedEnvelopeIds.length}
              onMoveClick={() => setIsBulkMoveDialogOpen(true)}
              onDeleteClick={() => setIsBulkDeleteDialogOpen(true)}
              onClearSelection={() => setRowSelection({})}
            />

            <EnvelopesBulkMoveDialog
              envelopeIds={selectedEnvelopeIds}
              envelopeType={EnvelopeType.TEMPLATE}
              open={isBulkMoveDialogOpen}
              currentFolderId={folderId}
              onOpenChange={setIsBulkMoveDialogOpen}
              onSuccess={() => setRowSelection({})}
            />

            <EnvelopesBulkDeleteDialog
              envelopeIds={selectedEnvelopeIds}
              envelopeType={EnvelopeType.TEMPLATE}
              open={isBulkDeleteDialogOpen}
              onOpenChange={setIsBulkDeleteDialogOpen}
              onSuccess={() => setRowSelection({})}
            />
          </>
        )}
      </div>
    </EnvelopeDropZoneWrapper>
  );
}
