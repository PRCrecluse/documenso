import type { ReactElement } from 'react';

type HeaderSlot = ReactElement | string;

export type WorkspacePageHeaderProps = {
  eyebrow?: HeaderSlot;
  title: HeaderSlot;
  description?: HeaderSlot;
  aside?: HeaderSlot;
};

export const WorkspacePageHeader = ({ eyebrow, title, description, aside }: WorkspacePageHeaderProps) => {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {eyebrow !== undefined && <p className="font-medium text-primary text-sm">{eyebrow}</p>}

        <h1 className="mt-2 font-semibold text-3xl text-foreground leading-tight tracking-tight md:text-4xl">
          {title}
        </h1>

        {description !== undefined && (
          <p className="mt-3 max-w-2xl text-muted-foreground text-sm md:text-base">{description}</p>
        )}
      </div>

      {aside !== undefined && <div className="w-full shrink-0 lg:max-w-md">{aside}</div>}
    </div>
  );
};
