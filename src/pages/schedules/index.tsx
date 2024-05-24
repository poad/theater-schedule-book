'use client';

import Schedules from '~/components/schedules';
import Link from '~/components/ui/Link';
import { useSession } from '@supabase/auth-helpers-react';

export default function Index(): JSX.Element {
  const session = useSession();
  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <div />
          <div>
            <Link href="/" target="_self">
              Top
            </Link>
          </div>
        </div>
      </nav>

      <Schedules session={session} currentMonthOnly={false} />
    </div>
  );
}
