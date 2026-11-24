import { useSession } from '@documenso/lib/client-only/providers/session';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FilesIcon, FileTextIcon, SearchIcon } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router';

import { useOptionalCurrentTeam } from '~/providers/team';

export type AppNavDesktopProps = HTMLAttributes<HTMLDivElement> & {
  setIsCommandMenuOpen: (value: boolean) => void;
};

export const AppNavDesktop = ({ className, setIsCommandMenuOpen, ...props }: AppNavDesktopProps) => {
  const { _ } = useLingui();
  const shouldReduceMotion = useReducedMotion();
  const { organisations } = useSession();

  const [modifierKey, setModifierKey] = useState(() => 'Ctrl');

  const currentTeam = useOptionalCurrentTeam();

  useEffect(() => {
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
    const isMacOS = /Macintosh|Mac\s+OS\s+X/i.test(userAgent);

    setModifierKey(isMacOS ? '⌘' : 'Ctrl');
  }, []);

  const menuNavigationLinks = useMemo(() => {
    let teamUrl = currentTeam?.url || null;

    if (!teamUrl && organisations.length === 1 && organisations[0].teams.length === 1) {
      teamUrl = organisations[0].teams[0].url;
    }

    if (!teamUrl) {
      return [];
    }

    return [
      {
        href: `/t/${teamUrl}/documents`,
        label: msg`Documents`,
        icon: FileTextIcon,
      },
      {
        href: `/t/${teamUrl}/templates`,
        label: msg`Templates`,
        icon: FilesIcon,
      },
    ];
  }, [currentTeam, organisations]);

  return (
    <div className={cn('ml-2 hidden min-w-0 flex-1 items-center gap-2 md:flex lg:ml-5 lg:gap-4', className)} {...props}>
      <div className="min-w-0">
        <AnimatePresence>
          {menuNavigationLinks.length > 0 && (
            <motion.nav
              aria-label={_(msg`Primary navigation`)}
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              className="flex items-center gap-1 rounded-xl border bg-muted/50 p-1"
            >
              {menuNavigationLinks.map(({ href, label, icon: Icon }) => (
                <NavLink
                  key={href}
                  to={href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium text-sm leading-5 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      isActive
                        ? 'bg-foreground text-background shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )
                  }
                >
                  <Icon aria-hidden="true" className="hidden h-4 w-4 shrink-0 lg:block" />
                  {_(label)}
                </NavLink>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <Button
        variant="outline"
        className="ml-auto gap-2 px-3 text-muted-foreground"
        onClick={() => setIsCommandMenuOpen(true)}
      >
        <SearchIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
        <Trans>Search</Trans>

        <kbd className="hidden whitespace-nowrap rounded-md bg-muted px-1.5 py-0.5 font-sans text-xs lg:inline">
          {modifierKey}+K
        </kbd>
      </Button>
    </div>
  );
};
