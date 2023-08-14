'use client';

import { useSession } from '@supabase/auth-helpers-react';
import { Titles } from '~/components/titles';
import { Header } from '~/components/Header';

export default function Index(): JSX.Element {
  const session = useSession();

  return (
    <div className="w-full flex flex-col items-center">
      <Header />

      {session ? <Titles session={session} /> : <></>}
    </div>
  );
}
