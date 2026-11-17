import { supabase } from './client';

import type { JSX } from '@solidjs/web';
import { AuthSession } from '@supabase/supabase-js';
import { type Accessor, createContext, createSignal, onSettled } from 'solid-js';

export const SupabaseSessionContext = createContext<Accessor<AuthSession | undefined>>(
  () => undefined,
);

export function SupabaseSessionProvider(props: { children: JSX.Element }) {
  const [session, setSession] = createSignal<AuthSession>();

  onSettled(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? undefined);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? undefined);
    });

    return () => subscription.unsubscribe();
  });

  return (
    <SupabaseSessionContext value={session}>{props?.children ?? <></>}</SupabaseSessionContext>
  );
}

export default SupabaseSessionProvider;
