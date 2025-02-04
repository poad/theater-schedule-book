import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Show, useContext } from 'solid-js';
import { SignOutButton } from '../../auth';
import { supabase, SupabaseSessionContext } from '../../supabase';

function Menu() {
  const session = useContext(SupabaseSessionContext);

  return (
    <Show
      when={session}
      fallback={
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          onlyThirdPartyProviders
          redirectTo={
            typeof window !== 'undefined' ? window.location.origin : undefined
          }
          providers={['azure']}
          providerScopes={{ azure: 'email offline_access' }}
        />
      }
    >
      <>
        <div class="flex items-center gap-4">
          <a target="_self" href="/schedules">
            All Schedules
          </a>
          <a target="_self" href="/titles">
            Titles
          </a>
          <a target="_self" href="/theaters">
            Theaters
          </a>
          <a target="_self" href="/title">
            Add title
          </a>
          <a target="_self" href="/actors">
            Actors
          </a>
          <SignOutButton />
        </div>
      </>
    </Show>
  );
}

export function Header() {
  return (
    <nav class="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div class="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
        <div />
        <div>
          <Menu />
        </div>
      </div>
    </nav>
  );
}

export default Header;
