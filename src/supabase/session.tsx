import { Show, JSX, createContext, createEffect, createSignal } from 'solid-js';
import { AuthSession } from '@supabase/supabase-js';
import { supabase } from './client';

export const SupabaseSessionContext = createContext<AuthSession>();

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
    <Show
      when={session()}
      fallback={
        <SupabaseSessionContext.Provider value={session()}>
          {props.children}
        </SupabaseSessionContext.Provider>
      }
    >
      <SupabaseSessionContext.Provider value={session()}>
        {props.children}
      </SupabaseSessionContext.Provider>
    </Show>
  );
}

export default SupabaseSessionProvider;
