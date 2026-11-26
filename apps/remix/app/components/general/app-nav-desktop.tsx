import { useSession } from '@documenso/lib/client-only/providers/session';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { NavLink } from 'react-router';

import { useOptionalCurrentTeam } from '~/providers/team';

export const AppNavDesktop = () => {
  const { _ } = useLingui();
  const { organisations } = useSession();
  const currentTeam = useOptionalCurrentTeam();

  let teamUrl = currentTeam?.url;

  if (!teamUrl && organisations.length === 1 && organisations[0].teams.length === 1) {
    teamUrl = organisations[0].teams[0].url;
  }

  if (!teamUrl) {
    return null;
  }

  return (
    <nav aria-label={_(msg`Primary navigation`)} className="col-start-2 hidden items-center gap-1.5 md:flex lg:gap-2">
      {navigationLinks.map(({ segment, label }) => (
        <NavLink
          key={segment}
          to={`/t/${teamUrl}/${segment}`}
          className="flex min-h-9 items-center rounded-full px-4 py-1.5 text-center font-medium text-foreground text-sm leading-5 transition-colors hover:bg-muted aria-[current=page]:bg-foreground aria-[current=page]:text-background lg:px-5"
        >
          {_(label)}
        </NavLink>
      ))}
    </nav>
  );
};

const navigationLinks = [
  { segment: 'documents', label: msg`Documents` },
  { segment: 'templates', label: msg`Templates` },
];
