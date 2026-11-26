import { useCurrentEnvelopeRender } from '@documenso/lib/client-only/providers/envelope-render-provider';
import { PDF_VIEWER_ERROR_MESSAGES } from '@documenso/lib/constants/pdf-viewer-i18n';
import { mapSecondaryIdToDocumentId } from '@documenso/lib/utils/envelope';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';
import { Separator } from '@documenso/ui/primitives/separator';
import { Plural, Trans, useLingui } from '@lingui/react/macro';
import { EnvelopeType, RecipientRole } from '@prisma/client';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeftIcon,
  BanIcon,
  DownloadCloudIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PaperclipIcon,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { match } from 'ts-pattern';

import { EnvelopeDownloadDialog } from '~/components/dialogs/envelope-download-dialog';
import { SignFieldCheckboxDialog } from '~/components/dialogs/sign-field-checkbox-dialog';
import { SignFieldDropdownDialog } from '~/components/dialogs/sign-field-dropdown-dialog';
import { SignFieldEmailDialog } from '~/components/dialogs/sign-field-email-dialog';
import { SignFieldInitialsDialog } from '~/components/dialogs/sign-field-initials-dialog';
import { SignFieldNameDialog } from '~/components/dialogs/sign-field-name-dialog';
import { SignFieldNumberDialog } from '~/components/dialogs/sign-field-number-dialog';
import { SignFieldSignatureDialog } from '~/components/dialogs/sign-field-signature-dialog';
import { SignFieldTextDialog } from '~/components/dialogs/sign-field-text-dialog';
import { useEmbedSigningContext } from '~/components/embed/embed-signing-context';
import { EnvelopeSignerPageRenderer } from '~/components/general/envelope-signing/envelope-signer-page-renderer';
import { EnvelopePdfViewer } from '~/components/general/pdf-viewer/envelope-pdf-viewer';
import { PublicLegalLinks } from '~/components/general/public-legal-links';

import { BrandingLogo } from '../branding-logo';
import { DocumentSigningAttachmentsPopover } from '../document-signing/document-signing-attachments-popover';
import { EnvelopeRendererFileSelector } from '../envelope-editor/envelope-file-selector';
import EnvelopeSignerForm from '../envelope-signing/envelope-signer-form';
import { EnvelopeSignerHeader } from '../envelope-signing/envelope-signer-header';
import { DocumentSigningMobileWidget } from './document-signing-mobile-widget';
import { DocumentSigningRejectDialog } from './document-signing-reject-dialog';
import { useRequiredEnvelopeSigningContext } from './envelope-signing-provider';

export const DocumentSigningPageViewV2 = () => {
  const { envelopeItems, currentEnvelopeItem } = useCurrentEnvelopeRender();

  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  const {
    isDirectTemplate,
    envelope,
    recipient,
    recipientFields,
    recipientFieldsRemaining,
    requiredRecipientFields,
    selectedAssistantRecipientFields,
  } = useRequiredEnvelopeSigningContext();

  const {
    isEmbed = false,
    allowDocumentRejection = true,
    allowDownloadPDF = true,
    hidePoweredBy = true,
    onDocumentRejected,
  } = useEmbedSigningContext() || {};

  const { t } = useLingui();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const fieldProgress =
    requiredRecipientFields.length === 0
      ? 100
      : 100 * (1 - recipientFieldsRemaining.length / requiredRecipientFields.length);

  /**
   * The total remaining fields remaining for the current recipient or selected assistant recipient.
   *
   * Includes both optional and required fields.
   */
  const remainingFields = useMemo(() => {
    if (recipient.role === RecipientRole.ASSISTANT) {
      return selectedAssistantRecipientFields.filter((field) => !field.inserted);
    }

    return recipientFields.filter((field) => !field.inserted);
  }, [recipientFieldsRemaining, selectedAssistantRecipientFields, currentEnvelopeItem]);

  return (
    <div
      className={cn(
        isEmbed
          ? 'min-h-screen w-screen bg-[hsl(226_50%_96%)] dark:bg-background'
          : 'flex h-dvh w-full flex-col overflow-hidden bg-background',
      )}
    >
      <SignFieldEmailDialog.Root />
      <SignFieldTextDialog.Root />
      <SignFieldNumberDialog.Root />
      <SignFieldNameDialog.Root />
      <SignFieldInitialsDialog.Root />
      <SignFieldDropdownDialog.Root />
      <SignFieldSignatureDialog.Root />
      <SignFieldCheckboxDialog.Root />

      <EnvelopeSignerHeader isSidebarCollapsed={isSidebarCollapsed} />

      {/* Main Content Area */}
      <div className={cn('flex', isEmbed ? 'h-[calc(100vh-4rem)] w-screen' : 'min-h-0 flex-1')}>
        {/* Left Section - Step Navigation */}
        <div
          className={cn(
            'embed--DocumentWidgetContainer hidden flex-shrink-0 flex-col border-border border-r transition-[width] duration-300 motion-reduce:transition-none lg:flex',
            isEmbed ? 'bg-background' : 'bg-popover text-popover-foreground',
            isSidebarCollapsed ? 'w-12' : 'w-80',
            !isEmbed && !isSidebarCollapsed && 'xl:w-[22rem]',
          )}
        >
          {isSidebarCollapsed && (
            <div className="flex justify-center pt-4">
              <Button
                variant="ghost"
                className="h-7 w-7 p-0"
                aria-label={t`Expand sidebar`}
                onClick={() => setIsSidebarCollapsed(false)}
              >
                <PanelLeftOpenIcon className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div
            className={cn(
              'flex flex-1 flex-col py-4',
              isEmbed ? 'overflow-hidden' : 'min-h-0 overflow-y-auto lg:py-6',
              isSidebarCollapsed && 'invisible w-0',
            )}
          >
            <div className={cn(isEmbed ? 'px-4' : 'px-5 lg:px-6')}>
              <div className="flex items-start justify-between gap-2">
                <h2 className={cn('font-semibold text-foreground', isEmbed ? 'text-sm' : 'text-xl tracking-tight')}>
                  {match(recipient.role)
                    .with(RecipientRole.VIEWER, () => <Trans>View Document</Trans>)
                    .with(RecipientRole.SIGNER, () => <Trans>Sign Document</Trans>)
                    .with(RecipientRole.APPROVER, () => <Trans>Approve Document</Trans>)
                    .with(RecipientRole.ASSISTANT, () => <Trans>Assist Document</Trans>)
                    .otherwise(() => null)}
                </h2>

                <div className="flex items-center gap-1">
                  {isEmbed && (
                    <span className="rounded border bg-muted/50 px-2 py-0.5 text-muted-foreground text-xs">
                      <Plural
                        value={recipientFieldsRemaining.length}
                        one="1 Field Remaining"
                        other="# Fields Remaining"
                      />
                    </span>
                  )}

                  <Button
                    variant="ghost"
                    className="h-7 w-7 shrink-0 p-0"
                    aria-label={t`Collapse sidebar`}
                    onClick={() => setIsSidebarCollapsed(true)}
                  >
                    <PanelLeftCloseIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className={cn(isEmbed ? 'my-4' : 'mt-4 rounded-xl border bg-muted/50 p-3.5')}>
                {!isEmbed && (
                  <p className="mb-2.5 font-medium text-muted-foreground text-xs" aria-live="polite">
                    <Plural
                      value={recipientFieldsRemaining.length}
                      one="1 Field Remaining"
                      other="# Fields Remaining"
                    />
                  </p>
                )}

                <div className={cn('relative h-1 overflow-hidden rounded-full', isEmbed ? 'bg-muted' : 'bg-border')}>
                  <motion.div
                    layout={shouldReduceMotion ? false : 'size'}
                    layoutId={shouldReduceMotion ? undefined : 'document-flow-container-step'}
                    className="absolute inset-y-0 left-0 rounded-full bg-primary"
                    style={{ width: `${fieldProgress}%` }}
                  />
                </div>
              </div>

              <div className="embed--DocumentWidgetContent mt-6 space-y-3">
                <EnvelopeSignerForm />
              </div>
            </div>

            <Separator className="my-6 shrink-0" />

            {/* Quick Actions. */}
            {!isDirectTemplate && (
              <div className={cn('embed--Actions', isEmbed ? 'space-y-3 px-4' : 'space-y-1 px-5 lg:px-6')}>
                <h3 className={cn('font-semibold text-foreground text-sm', !isEmbed && 'mb-2.5')}>
                  <Trans>Actions</Trans>
                </h3>

                <DocumentSigningAttachmentsPopover
                  envelopeId={envelope.id}
                  token={recipient.token}
                  trigger={
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <PaperclipIcon className="mr-2 h-4 w-4" />
                      <Trans>Attachments</Trans>
                    </Button>
                  }
                />

                {allowDownloadPDF && (
                  <EnvelopeDownloadDialog
                    envelopeId={envelope.id}
                    envelopeStatus={envelope.status}
                    envelopeItems={envelope.envelopeItems}
                    token={recipient.token}
                    trigger={
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <DownloadCloudIcon className="mr-2 h-4 w-4" />
                        <Trans>Download PDF</Trans>
                      </Button>
                    }
                  />
                )}

                {envelope.type === EnvelopeType.DOCUMENT && allowDocumentRejection && (
                  <DocumentSigningRejectDialog
                    documentId={mapSecondaryIdToDocumentId(envelope.secondaryId)}
                    token={recipient.token}
                    onRejected={
                      onDocumentRejected &&
                      ((reason) =>
                        onDocumentRejected({
                          token: recipient.token,
                          documentId: mapSecondaryIdToDocumentId(envelope.secondaryId),
                          envelopeId: envelope.id,
                          recipientId: recipient.id,
                          reason,
                        }))
                    }
                    trigger={
                      <Button variant="ghost" size="sm" className="w-full justify-start hover:text-destructive">
                        <BanIcon className="mr-2 h-4 w-4" />
                        <Trans>Reject Document</Trans>
                      </Button>
                    }
                  />
                )}
              </div>
            )}

            <div className={cn('embed--DocumentWidgetFooter mt-auto', !isEmbed && 'pt-6')}>
              {/* Footer of left sidebar. */}
              {!isEmbed && (
                <div className="px-5 lg:px-6">
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link to="/">
                      <ArrowLeftIcon className="mr-2 h-4 w-4" />
                      <Trans>Return</Trans>
                    </Link>
                  </Button>
                </div>
              )}

              {!isEmbed && <PublicLegalLinks className="mt-4 justify-start px-5 pt-4 lg:px-6" />}
            </div>
          </div>
        </div>

        <div
          className={cn(
            'embed--DocumentContainer min-w-0 flex-1 overflow-x-auto overflow-y-auto',
            !isEmbed &&
              'bg-muted [background-image:linear-gradient(to_bottom,hsl(var(--primary)/0.08),transparent_19rem)]',
          )}
          ref={scrollableContainerRef}
        >
          <div className="flex flex-col">
            {/* Horizontal envelope item selector */}
            {envelopeItems.length > 1 && (
              <EnvelopeRendererFileSelector fields={remainingFields} className="px-2 pt-4 pb-0 sm:px-4 sm:pb-1.5" />
            )}

            {/* Document View */}
            <div
              className={cn(
                'embed--DocumentViewer flex flex-col items-center justify-center',
                isEmbed ? 'p-2 sm:mt-4 sm:p-4' : 'p-2 sm:p-6 lg:p-8',
              )}
            >
              {currentEnvelopeItem ? (
                <EnvelopePdfViewer
                  key={currentEnvelopeItem.id}
                  customPageRenderer={EnvelopeSignerPageRenderer}
                  scrollParentRef={scrollableContainerRef}
                  errorMessage={PDF_VIEWER_ERROR_MESSAGES.signing}
                  toolbar={['zoom']}
                  // Todo: Content - Decide how to manage zooming on mobile.
                  toolbarClassName="hidden lg:flex"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-32">
                  <p className="text-foreground text-sm">
                    <Trans>No document selected</Trans>
                  </p>
                </div>
              )}

              {/* Mobile widget - Additional padding to allow users to scroll */}
              <div className="block pb-28 lg:hidden">
                <DocumentSigningMobileWidget />
              </div>

              {!hidePoweredBy && (
                <a
                  href="https://documenso.com"
                  target="_blank"
                  className="fixed right-0 bottom-0 z-40 hidden cursor-pointer rounded-tl bg-primary px-2 py-1 font-medium text-primary-foreground text-xs opacity-60 hover:opacity-100 lg:block"
                  rel="noopener"
                >
                  <span>
                    <Trans>Powered by</Trans>
                  </span>
                  <BrandingLogo className="ml-2 inline-block h-[14px]" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
