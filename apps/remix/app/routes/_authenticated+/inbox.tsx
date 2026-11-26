import { msg } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';

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
    <div className="mx-auto w-full max-w-screen-xl px-3 md:px-6">
      <div className="workspace-frame rounded-2xl border sm:rounded-3xl">
        <WorkspacePageHeader
          title={<Trans>Personal Inbox</Trans>}
          description={<Trans>Review and respond to documents people have sent you.</Trans>}
        />

        <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
          <OrganisationInvitations />

          <section aria-labelledby="inbox-list-heading">
            <h2 id="inbox-list-heading" className="mb-3 font-semibold text-lg tracking-tight">
              <Trans>Received documents</Trans>
            </h2>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="w-full sm:w-56">
                <DocumentSearch />
              </div>

              <DocumentsTableStatusFilter statuses={INBOX_SELECTABLE_STATUSES} />
            </div>

            <InboxTable />
          </section>
        </div>
      </div>
    </div>
  );
}
