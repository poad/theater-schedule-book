import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useContext,
} from 'react';
import { useRouter } from 'next/navigation';

interface SupabaseContext {
  supabase: SupabaseClient<any, 'public', any>;
}

const Context = createContext<SupabaseContext | undefined>(undefined);

export function SupabaseProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [supabase] = useState(() =>
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    ),
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
      <>{children}</>
    </Context.Provider>
  );
}

export function useSupabase(): SupabaseClient<any, 'public', any> {
  const context = useContext(Context);

  if (context == null) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }

  return context.supabase;
}
