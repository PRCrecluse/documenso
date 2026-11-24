import { getRootHref } from '@documenso/lib/utils/params';
import { trpc } from '@documenso/trpc/react';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';
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
  const [scrollY, setScrollY] = useState(0);

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
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-[60] bg-gradient-to-b from-background via-background/85 to-transparent px-3 pt-3 pb-2 md:px-6',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'mx-auto flex min-h-14 w-full items-center justify-between gap-2 rounded-2xl border bg-popover/95 px-3 backdrop-blur-md md:min-h-16 md:gap-3 md:px-4',
          scrollY > 5 && 'shadow-sm',
          !fullWidth && 'max-w-[77rem]',
        )}
        data-testid="app-header-container"
      >
        <Link
          to={getRootHref(params)}
          aria-label="Documenso"
          className="shrink-0 rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <BrandingLogo aria-hidden="true" className="h-4 w-auto sm:h-5 md:h-6" />
        </Link>

        <AppNavDesktop setIsCommandMenuOpen={setIsCommandMenuOpen} />

        <Button asChild variant="outline" className="relative hidden h-10 w-10 shrink-0 p-0 md:flex">
          <NavLink to="/inbox" className="aria-[current=page]:bg-accent" aria-label={_(msg`Inbox`)}>
            <InboxIcon aria-hidden="true" className="h-4 w-4 text-muted-foreground" />

            {unreadCountData && unreadCountData.count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-semibold text-primary-foreground text-xs tabular-nums leading-none">
                {unreadCountData.count > 99 ? '99+' : unreadCountData.count}
              </span>
            )}
          </NavLink>
        </Button>

        <div className="md:ml-1">
          <OrgMenuSwitcher />
        </div>

        <div className="flex flex-row items-center gap-1 md:hidden">
          <button
            type="button"
            className="rounded-full p-2 text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={_(msg`Search`)}
            onClick={() => setIsCommandMenuOpen(true)}
          >
            <SearchIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="rounded-full p-2 text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={_(msg`Open menu`)}
            onClick={() => setIsHamburgerMenuOpen(true)}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>

        <AppCommandMenu open={isCommandMenuOpen} onOpenChange={setIsCommandMenuOpen} />

        <AppNavMobile isMenuOpen={isHamburgerMenuOpen} onMenuOpenChange={setIsHamburgerMenuOpen} />
      </div>
    </header>
  );
};
