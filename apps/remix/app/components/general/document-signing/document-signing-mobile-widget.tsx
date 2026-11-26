import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';

import { Plural, Trans, useLingui } from '@lingui/react/macro';
import { RecipientRole } from '@prisma/client';
import { motion, useReducedMotion } from 'framer-motion';
import { LucideChevronDown, LucideChevronUp } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { match } from 'ts-pattern';

import { useEmbedSigningContext } from '~/components/embed/embed-signing-context';

import { BrandingLogo } from '../branding-logo';
import EnvelopeSignerForm from '../envelope-signing/envelope-signer-form';
import { EnvelopeSignerCompleteDialog } from '../envelope-signing/envelope-signing-complete-dialog';
import { useRequiredEnvelopeSigningContext } from './envelope-signing-provider';

export const DocumentSigningMobileWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const widgetDetailsId = useId();
  const shouldReduceMotion = useReducedMotion();
  const { t } = useLingui();

  const { hidePoweredBy = true, isEmbed = false } = useEmbedSigningContext() || {};

  const { recipientFieldsRemaining, recipient, requiredRecipientFields } = useRequiredEnvelopeSigningContext();

  /**
   * Pre open the widget for assistants to let them know it's there.
   */
  useEffect(() => {
    if (recipient.role === RecipientRole.ASSISTANT) {
      setIsExpanded(true);
    }
  }, []);

  return (
    <div
      className={cn(
        'pointer-events-none fixed right-0 bottom-0 left-0 z-50 flex justify-center px-2 pb-2 sm:px-4 sm:pb-6',
        !isEmbed && 'pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]',
      )}
    >
      <div className="pointer-events-auto w-full max-w-[760px]">
        <div
          className={cn(
            'border border-border shadow-2xl',
            isEmbed
              ? 'overflow-hidden rounded-xl bg-card'
              : 'max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-popover text-popover-foreground',
          )}
        >
          {/* Main Header Bar */}
          <div className={cn('flex items-center justify-between p-4', isEmbed ? 'gap-4' : 'gap-2 sm:gap-4')}>
            <div className="min-w-0 flex-1">
              <div className={cn('flex items-center', isEmbed ? 'gap-3' : 'gap-2 sm:gap-3')}>
                {recipient.role !== RecipientRole.VIEWER && (
                  <Button
                    variant="outline"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center"
                    aria-label={isExpanded ? t`Hide signing details` : t`Show signing details`}
                    aria-expanded={isExpanded}
                    aria-controls={isExpanded ? widgetDetailsId : undefined}
                  >
                    {isExpanded ? (
                      <LucideChevronDown className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    ) : (
                      <LucideChevronUp className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    )}
                  </Button>
                )}

                <div>
                  <h2 className={cn('font-semibold text-foreground', isEmbed ? 'text-lg' : 'text-base')}>
                    {match(recipient.role)
                      .with(RecipientRole.VIEWER, () => <Trans>View Document</Trans>)
                      .with(RecipientRole.SIGNER, () => <Trans>Sign Document</Trans>)
                      .with(RecipientRole.APPROVER, () => <Trans>Approve Document</Trans>)
                      .with(RecipientRole.ASSISTANT, () => <Trans>Assist Document</Trans>)
                      .otherwise(() => null)}
                  </h2>

                  <p className={cn('text-muted-foreground', isEmbed ? '-mt-0.5 text-sm' : 'mt-0.5 text-xs')}>
                    {recipientFieldsRemaining.length === 0 ? (
                      match(recipient.role)
                        .with(RecipientRole.VIEWER, () => <Trans>Please mark as viewed to complete</Trans>)
                        .with(RecipientRole.SIGNER, () => <Trans>Please complete the document once reviewed</Trans>)
                        .with(RecipientRole.APPROVER, () => <Trans>Please complete the document once reviewed</Trans>)
                        .with(RecipientRole.ASSISTANT, () => <Trans>Please complete the document once reviewed</Trans>)
                        .otherwise(() => null)
                    ) : (
                      <Plural
                        value={recipientFieldsRemaining.length}
                        one="1 Field Remaining"
                        other="# Fields Remaining"
                      />
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <EnvelopeSignerCompleteDialog />
            </div>
          </div>

          {/* Progress Bar */}
          {recipient.role !== RecipientRole.VIEWER && recipient.role !== RecipientRole.ASSISTANT && (
            <div className="px-4 pb-3">
              <div className="relative h-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  layout={shouldReduceMotion ? false : 'size'}
                  layoutId={shouldReduceMotion ? undefined : 'document-signing-mobile-widget-progress-bar'}
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  style={{
                    width: `${requiredRecipientFields.length === 0 ? 100 : 100 - (100 / requiredRecipientFields.length) * (recipientFieldsRemaining.length ?? 0)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Expandable Content */}
          {isExpanded && (
            <div
              id={widgetDetailsId}
              className="slide-in-from-bottom-2 animate-in border-border border-t p-4 duration-200 motion-reduce:animate-none"
            >
              <EnvelopeSignerForm />

              {!hidePoweredBy && (
                <div className="mt-2 inline-block rounded bg-primary px-2 py-1 font-medium text-primary-foreground text-xs opacity-60 hover:opacity-100 lg:hidden">
                  <span>
                    <Trans>Powered by</Trans>
                  </span>
                  <BrandingLogo className="ml-2 inline-block h-[14px]" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
