import type { ReactNode } from 'react';

export type WorkspacePageHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
};

export const WorkspacePageHeader = ({ eyebrow, title, description, actions }: WorkspacePageHeaderProps) => {
  return (
    <header className="workspace-masthead px-5 py-5 sm:px-8 sm:py-6 lg:px-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow && <p className="mb-1.5 break-words font-medium text-muted-foreground text-xs">{eyebrow}</p>}

          <h1 className="break-words font-semibold text-3xl leading-tight tracking-[-0.04em] sm:text-[2.125rem]">
            {title}
          </h1>

          <p className="mt-1.5 max-w-xl text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>

        {actions && <div className="workspace-masthead-actions min-w-0 lg:max-w-[55%] lg:shrink-0">{actions}</div>}
      </div>
    </header>
  );
};
