import { mapSecondaryIdToDocumentId } from '@documenso/lib/utils/envelope';
import { cn } from '@documenso/ui/lib/utils';
import { Badge } from '@documenso/ui/primitives/badge';
import { Button } from '@documenso/ui/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@documenso/ui/primitives/dropdown-menu';
import { Separator } from '@documenso/ui/primitives/separator';
import { Plural, Trans } from '@lingui/react/macro';
import { EnvelopeType, RecipientRole } from '@prisma/client';
import { BanIcon, DownloadCloudIcon } from 'lucide-react';
import { Link } from 'react-router';
import { match } from 'ts-pattern';

import { EnvelopeDownloadDialog } from '~/components/dialogs/envelope-download-dialog';
import { useEmbedSigningContext } from '~/components/embed/embed-signing-context';
import { BrandingLogo } from '~/components/general/branding-logo';
import { PublicLegalLinksDropdownMenuItems } from '~/components/general/public-legal-links';

import { BrandingLogoIcon } from '../branding-logo-icon';
import { DocumentSigningRejectDialog } from '../document-signing/document-signing-reject-dialog';
import { useRequiredEnvelopeSigningContext } from '../document-signing/envelope-signing-provider';
import { EnvelopeSignerCompleteDialog } from './envelope-signing-complete-dialog';

export const EnvelopeSignerHeader = ({ isSidebarCollapsed }: { isSidebarCollapsed: boolean }) => {
  const { envelopeData, envelope, recipientFieldsRemaining, recipient } = useRequiredEnvelopeSigningContext();

  const isEmbedSigning = useEmbedSigningContext() !== null;
  const hasCustomBrandingLogo = envelopeData.settings.brandingEnabled && Boolean(envelopeData.settings.brandingLogo);

  return (
    <nav
      className={cn(
        'embed--DocumentWidgetHeader flex max-w-screen justify-between border-border border-b px-4 py-3 md:px-6',
        isEmbedSigning
          ? 'bg-background/90 shadow-[0_10px_30px_-24px_hsl(230_45%_20%/0.8)] backdrop-blur-md'
          : 'min-h-16 shrink-0 items-center gap-3 bg-popover text-popover-foreground md:gap-6',
      )}
    >
      {/* Left side - Logo and title */}
      <div
        className={cn(
          'flex min-w-0 flex-1 items-center',
          isEmbedSigning ? 'space-x-2 md:w-auto md:flex-none' : 'gap-2 sm:gap-4',
        )}
      >
        {!isEmbedSigning &&
          (hasCustomBrandingLogo ? (
            <img
              src={`/api/branding/logo/team/${envelope.teamId}`}
              alt={`${envelope.team.name}'s Logo`}
              className="h-6 w-auto max-w-24 shrink-0 object-contain sm:max-w-40"
            />
          ) : (
            <Link to="/" className="shrink-0 rounded text-foreground" aria-label="Documenso">
              <BrandingLogo className="hidden h-5 w-auto sm:block" aria-hidden="true" />
              <BrandingLogoIcon className="h-6 w-auto sm:hidden" aria-hidden="true" />
            </Link>
          ))}

        {!isEmbedSigning && <Separator orientation="vertical" className="h-6" />}

        {isEmbedSigning && (
          <h1 title={envelope.title} className="min-w-0 truncate font-semibold text-base text-foreground md:hidden">
            {envelope.title}
          </h1>
        )}

        <div
          className={cn(isEmbedSigning ? 'hidden items-center space-x-2 md:flex' : 'flex min-w-0 items-center gap-3')}
        >
          <h1
            title={envelope.title}
            className={cn(
              'text-foreground text-sm',
              isEmbedSigning ? 'whitespace-nowrap font-medium' : 'truncate font-semibold sm:text-base',
            )}
          >
            {envelope.title}
          </h1>

          <Badge className="hidden shrink-0 md:inline-flex" variant={isEmbedSigning ? 'default' : 'neutral'}>
            {match(recipient.role)
              .with(RecipientRole.VIEWER, () => <Trans>Viewer</Trans>)
              .with(RecipientRole.SIGNER, () => <Trans>Signer</Trans>)
              .with(RecipientRole.APPROVER, () => <Trans>Approver</Trans>)
              .with(RecipientRole.ASSISTANT, () => <Trans>Assistant</Trans>)
              .otherwise(() => null)}
          </Badge>
        </div>
      </div>

      {/* Right side - Desktop content */}
      <div className={cn('hidden items-center lg:flex', isEmbedSigning ? 'space-x-2' : 'shrink-0 gap-3')}>
        {(isEmbedSigning || isSidebarCollapsed) && (
          <p className={cn('text-muted-foreground text-sm', isEmbedSigning && 'mr-2 flex-shrink-0')} aria-live="polite">
            <Plural one="1 Field Remaining" other="# Fields Remaining" value={recipientFieldsRemaining.length} />
          </p>
        )}

        <EnvelopeSignerCompleteDialog />
      </div>

      {/* Mobile Actions button */}
      <div className="flex-shrink-0 lg:hidden">
        <MobileDropdownMenu />
      </div>
    </nav>
  );
};

const MobileDropdownMenu = () => {
  const { envelope, recipient } = useRequiredEnvelopeSigningContext();

  const embedSigningContext = useEmbedSigningContext();

  const isEmbedSigning = embedSigningContext !== null;
  const { allowDocumentRejection, allowDownloadPDF } = embedSigningContext || {};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Trans>Actions</Trans>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {allowDownloadPDF !== false && (
          <EnvelopeDownloadDialog
            envelopeId={envelope.id}
            envelopeStatus={envelope.status}
            envelopeItems={envelope.envelopeItems}
            token={recipient.token}
            trigger={
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <div>
                  <DownloadCloudIcon className="mr-2 h-4 w-4" />
                  <Trans>Download PDF</Trans>
                </div>
              </DropdownMenuItem>
            }
          />
        )}

        {envelope.type === EnvelopeType.DOCUMENT && allowDocumentRejection !== false && (
          <DocumentSigningRejectDialog
            documentId={mapSecondaryIdToDocumentId(envelope.secondaryId)}
            token={recipient.token}
            trigger={
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <div>
                  <BanIcon className="mr-2 h-4 w-4" />
                  <Trans>Reject</Trans>
                </div>
              </DropdownMenuItem>
            }
          />
        )}

        {!isEmbedSigning && <PublicLegalLinksDropdownMenuItems />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
