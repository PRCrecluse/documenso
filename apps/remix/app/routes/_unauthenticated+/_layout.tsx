import { Outlet } from 'react-router';

import { PublicLegalLinks } from '~/components/general/public-legal-links';

export default function Layout() {
  return (
    <main className="surface-wash relative flex min-h-screen flex-col items-center justify-between px-4 py-10 md:px-8 md:py-14">
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <div className="relative flex w-full items-center justify-center">
          <Outlet />
        </div>
      </div>

      <footer className="z-10 mt-8 w-full">
        <PublicLegalLinks />
      </footer>
    </main>
  );
}
