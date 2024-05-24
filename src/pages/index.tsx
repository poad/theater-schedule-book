'use client';

import { useSession } from '@supabase/auth-helpers-react';
import Schedules from '~/components/schedules';
import Header from '~/components/header';
import { Show } from '~/components/flows';

export default function Index(): JSX.Element {
  const session = useSession();

  return (
    <div className="w-full flex flex-col items-center">
      <Header />

      <Show when={session}>
        <Schedules session={session} currentMonthOnly />
      </Show>
    </div>
  );
}
