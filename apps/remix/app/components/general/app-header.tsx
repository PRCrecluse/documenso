import { getRootHref } from '@documenso/lib/utils/params';
import { trpc } from '@documenso/trpc/react';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { ReadStatus } from '@prisma/client';
import { InboxIcon, MenuIcon, SearchIcon } from 'lucide-react';
import { type HTMLAttributes, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

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
          'mx-auto flex h-14 w-full items-center justify-between gap-x-3 rounded-full border border-border bg-background/90 px-3 shadow-[0_10px_30px_-18px_hsl(230_45%_20%/0.55)] backdrop-blur-md md:px-4',
          scrollY > 5 && 'shadow-[0_16px_40px_-20px_hsl(230_45%_20%/0.65)]',
          fullWidth ? '' : 'max-w-screen-xl',
        )}
        data-testid="app-header-container"
      >
        <Link
          to={getRootHref(params)}
          className="hidden shrink-0 rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:inline"
        >
          <BrandingLogo className="h-6 w-auto" />
        </Link>

        <AppNavDesktop setIsCommandMenuOpen={setIsCommandMenuOpen} />

        <Button asChild variant="outline" className="relative hidden h-10 w-10 shrink-0 md:flex">
          <Link to="/inbox" className="relative block h-10 w-10" aria-label={_(msg`Inbox`)}>
            <InboxIcon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />

            {unreadCountData && unreadCountData.count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-semibold text-primary-foreground text-xs tabular-nums leading-none">
                {unreadCountData.count > 99 ? '99+' : unreadCountData.count}
              </span>
            )}
          </Link>
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
