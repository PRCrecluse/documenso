import { getRootHref } from '@documenso/lib/utils/params';
import { trpc } from '@documenso/trpc/react';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@documenso/ui/primitives/tooltip';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { ReadStatus } from '@prisma/client';
import { InboxIcon, MenuIcon, SearchIcon } from 'lucide-react';
import { type HTMLAttributes, useEffect, useState } from 'react';
import { Link, NavLink, useParams } from 'react-router';

import { BrandingLogo } from '~/components/general/branding-logo';

import { AppCommandMenu } from './app-command-menu';
import { AppNavDesktop } from './app-nav-desktop';
import { AppNavMobile } from './app-nav-mobile';
import { OrgMenuSwitcher } from './org-menu-switcher';

export type HeaderProps = HTMLAttributes<HTMLDivElement> & {
  /** Span the full viewport width instead of the centered max-w-screen-xl container. */
  fullWidth?: boolean;
};

export const Header = ({ className, fullWidth = false, ...props }: HeaderProps) => {
  const { _ } = useLingui();
  const params = useParams();

  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { data: unreadCountData } = trpc.document.inbox.getCount.useQuery(
    {
      readStatus: ReadStatus.NOT_OPENED,
    },
    {
      // refetchInterval: 30000, // Refetch every 30 seconds
    },
  );

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 5);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cn('sticky top-0 z-[60] px-3 pt-3 md:px-6', className)} {...props}>
      <div
        className={cn(
          'mx-auto flex min-h-14 w-full items-center justify-between gap-2 rounded-2xl border border-border/70 bg-popover px-3 md:grid md:min-h-16 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-4 md:px-8 lg:px-10',
          isScrolled && 'shadow-sm',
          !fullWidth && 'max-w-[77rem]',
        )}
        data-testid="app-header-container"
      >
        <Link to={getRootHref(params)} aria-label="Documenso" className="shrink-0 justify-self-start rounded-md">
          <BrandingLogo aria-hidden="true" className="h-4 w-auto sm:h-5" />
        </Link>

        <AppNavDesktop />

        <div className="col-start-3 flex min-w-0 items-center justify-end gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className={utilityButtonClassName}
                aria-label={_(msg`Search`)}
                aria-keyshortcuts="Control+K Meta+K"
                aria-haspopup="dialog"
                onClick={() => setIsCommandMenuOpen(true)}
              >
                <SearchIcon aria-hidden="true" className="size-[1.125rem] shrink-0" />
              </Button>
            </TooltipTrigger>

            <TooltipContent side="bottom" className="flex items-center gap-2">
              {_(msg`Search`)}
              <kbd className="rounded bg-muted px-1 py-0.5 font-sans text-xs">Ctrl / ⌘ + K</kbd>
            </TooltipContent>
          </Tooltip>

          <NavLink
            to="/inbox"
            className={cn(
              utilityButtonClassName,
              'relative hidden items-center justify-center transition-colors hover:bg-accent aria-[current=page]:bg-accent md:flex',
            )}
            aria-label={_(msg`Inbox`)}
          >
            <InboxIcon aria-hidden="true" className="size-[1.125rem]" />

            {unreadCountData && unreadCountData.count > 0 && (
              <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-semibold text-[0.625rem] text-primary-foreground tabular-nums leading-none">
                {unreadCountData.count > 99 ? '99+' : unreadCountData.count}
              </span>
            )}
          </NavLink>

          <div className="min-w-0 rounded-xl [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-ring [&>button]:max-w-full">
            <OrgMenuSwitcher />
          </div>

          <Button
            type="button"
            variant="ghost"
            className={cn(utilityButtonClassName, 'md:hidden')}
            aria-label={_(msg`Open menu`)}
            aria-expanded={isHamburgerMenuOpen}
            aria-haspopup="dialog"
            onClick={() => setIsHamburgerMenuOpen(true)}
          >
            <MenuIcon aria-hidden="true" className="size-5 shrink-0" />
          </Button>
        </div>

        <AppCommandMenu open={isCommandMenuOpen} onOpenChange={setIsCommandMenuOpen} />

        <AppNavMobile isMenuOpen={isHamburgerMenuOpen} onMenuOpenChange={setIsHamburgerMenuOpen} />
      </div>
    </header>
  );
};

const utilityButtonClassName = 'h-9 w-9 shrink-0 rounded-full bg-muted/80 p-0 text-foreground';
