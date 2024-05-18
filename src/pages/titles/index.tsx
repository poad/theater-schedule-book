'use client';

import { useSession } from '@supabase/auth-helpers-react';
import { Titles } from '@/components/titles';
import { Header } from '@/components/header';
import Link from 'next/link';

function Main() {
  const session = useSession();
  if (!session) {
    return <></>;
  }
  return <Titles session={session} />;
}

export default function Index(): JSX.Element {
  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <div />
          <Header />
          <div>
            <Link href="/" target="_self">
              Top
            </Link>
          </div>
        </div>
      </nav>

      <Main />
    </div>
  );
}
