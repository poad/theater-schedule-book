import { supabase } from './client';
import { type Accessor, JSX, createContext, createEffect, createSignal } from 'solid-js';
import { AuthSession } from '@supabase/supabase-js';

export const SupabaseSessionContext = createContext<Accessor<AuthSession | undefined>>(() => undefined);

export function SupabaseSessionProvider(props: { children: JSX.Element }) {
  const [session, setSession] = createSignal<AuthSession>();

  createEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? undefined);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? undefined);
    });
  });

  return (
    <SupabaseSessionContext.Provider value={session}>
      {props.children}
    </SupabaseSessionContext.Provider>
  );
}

export default SupabaseSessionProvider;
