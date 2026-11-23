import { useSession } from '@documenso/lib/client-only/providers/session';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Search } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';

import { useOptionalCurrentTeam } from '~/providers/team';

export type AppNavDesktopProps = HTMLAttributes<HTMLDivElement> & {
  setIsCommandMenuOpen: (value: boolean) => void;
};

export const AppNavDesktop = ({ className, setIsCommandMenuOpen, ...props }: AppNavDesktopProps) => {
  const { _ } = useLingui();
  const shouldReduceMotion = useReducedMotion();
  const { organisations } = useSession();

  const { pathname } = useLocation();

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
      },
      {
        href: `/t/${teamUrl}/templates`,
        label: msg`Templates`,
      },
    ];
  }, [currentTeam, organisations]);

  return (
    <div
      className={cn('ml-4 hidden min-w-0 flex-1 items-center gap-x-4 md:flex md:justify-between', className)}
      {...props}
    >
      <div className="min-w-0">
        <AnimatePresence>
          {menuNavigationLinks.length > 0 && (
            <motion.nav
              aria-label={_(msg`Primary`)}
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              className="flex items-center gap-1 rounded-full bg-muted p-1"
            >
              {menuNavigationLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  to={href}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 font-medium text-muted-foreground text-sm leading-5 ring-offset-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    {
                      'bg-foreground text-background shadow-sm hover:text-background': pathname?.startsWith(href),
                    },
                  )}
                >
                  {_(label)}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <Button
        variant="outline"
        className="flex w-full max-w-80 items-center justify-between text-muted-foreground"
        onClick={() => setIsCommandMenuOpen(true)}
      >
        <div className="flex items-center">
          <Search className="mr-2 h-5 w-5" />
          <Trans>Search</Trans>
        </div>

        <div>
          <div className="flex items-center rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground text-xs tracking-wider">
            {modifierKey}+K
          </div>
        </div>
      </Button>
    </div>
  );
};
