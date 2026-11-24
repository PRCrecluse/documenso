import type { ReactNode } from 'react';

export type WorkspacePageHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
};

export const WorkspacePageHeader = ({ eyebrow, title, description, actions }: WorkspacePageHeaderProps) => {
  return (
    <div className="workspace-masthead px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow && <div className="mb-2 text-muted-foreground text-sm">{eyebrow}</div>}

          <h1 className="break-words font-semibold text-4xl leading-none tracking-[-0.05em] sm:text-5xl">{title}</h1>

          <p className="mt-3 max-w-xl text-muted-foreground text-sm leading-relaxed sm:text-base">{description}</p>
        </div>

        {actions}
      </div>
    </div>
  );
};
