import { msg } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { InboxIcon } from 'lucide-react';

import { DocumentSearch } from '~/components/general/document/document-search';
import { OrganisationInvitations } from '~/components/general/organisations/organisation-invitations';
import { WorkspacePageHeader } from '~/components/general/workspace-page-header';
import { DocumentsTableStatusFilter } from '~/components/tables/documents-table-status-filter';
import { InboxTable } from '~/components/tables/inbox-table';
import { INBOX_SELECTABLE_STATUSES } from '~/utils/inbox-search-params';
import { appMetaTags } from '~/utils/meta';

export function meta() {
  return appMetaTags(msg`Personal Inbox`);
}

export default function InboxPage() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 md:px-8">
      <WorkspacePageHeader
        eyebrow={<Trans>Waiting on you</Trans>}
        title={
          <span className="flex items-center gap-3">
            <InboxIcon className="h-8 w-8 text-primary" />
            <Trans>Personal Inbox</Trans>
          </span>
        }
        description={<Trans>Any documents that you have been invited to will appear here</Trans>}
      />

      <OrganisationInvitations className="mt-6" />

      <div className="mt-8 rounded-3xl border border-border bg-background p-4 shadow-[0_18px_50px_-32px_hsl(230_45%_20%/0.55)] md:p-6">
        <div className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-4">
          <div className="w-full sm:w-56">
            <DocumentSearch />
          </div>

          <DocumentsTableStatusFilter statuses={INBOX_SELECTABLE_STATUSES} />
        </div>

        <InboxTable />
      </div>
    </div>
  );
}
