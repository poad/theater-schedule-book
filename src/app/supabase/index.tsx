import { type SupabaseClient } from '@supabase/supabase-js';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useContext,
} from 'react';
import { useRouter } from 'next/navigation';

interface SupabaseContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, 'public', any>;
}

const Context = createContext<SupabaseContext | undefined>(undefined);

export function SupabaseProvider({
  initialSession,
  children,
}: {
  initialSession: Session;
  children: ReactNode;
}): JSX.Element {
  const [supabase] = useState(() =>
    createPagesBrowserClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    }),
  );
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <Context.Provider value={{ supabase }}>
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={initialSession}
      >
        <>{children}</>
      </SessionContextProvider>
    </Context.Provider>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useSupabase(): SupabaseClient<any, 'public', any> {
  const context = useContext(Context);

  if (context == null) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }

  return context.supabase;
}
