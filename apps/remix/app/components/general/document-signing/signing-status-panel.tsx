import { cn } from '@documenso/ui/lib/utils';
import { Badge } from '@documenso/ui/primitives/badge';
import { FileTextIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type SigningStatusPanelProps = {
  title: ReactNode;
  documentTitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export const SigningStatusPanel = ({ title, documentTitle, icon, children, className }: SigningStatusPanelProps) => (
  <section
    className={cn(
      'mx-auto flex w-full max-w-2xl flex-col items-center rounded-3xl border bg-popover px-4 py-8 text-center text-popover-foreground shadow-lg shadow-primary/5 [background-image:linear-gradient(to_bottom,hsl(var(--primary)/0.06),transparent_12rem)] sm:px-8 sm:py-10',
      className,
    )}
  >
    {icon && (
      <div
        aria-hidden="true"
        className="mb-4 flex size-12 items-center justify-center rounded-2xl border bg-popover shadow-sm"
      >
        {icon}
      </div>
    )}

    {documentTitle && (
      <Badge variant="neutral" className="mb-4 inline-flex min-w-0 max-w-full gap-2" title={documentTitle}>
        <FileTextIcon aria-hidden="true" className="size-3.5 shrink-0" />
        <span className="min-w-0 truncate">{documentTitle}</span>
      </Badge>
    )}

    <h1 className="max-w-full text-balance font-semibold text-2xl tracking-tight sm:text-4xl">{title}</h1>

    {children}
  </section>
);
