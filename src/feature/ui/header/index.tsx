import { SignOutButton } from '../../auth';
import { supabase, SupabaseSessionContext } from '../../supabase';

import { Show, createSignal, useContext } from 'solid-js';

function Menu() {
  const session = useContext(SupabaseSessionContext);
  const [signInError, setSignInError] = createSignal<string>();
  const [signingIn, setSigningIn] = createSignal(false);

  async function signInWithAzure() {
    setSignInError(undefined);
    setSigningIn(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: window.location.origin,
          scopes: 'email offline_access',
        },
      });
      if (error) setSignInError(error.message);
    } catch (error) {
      setSignInError(error instanceof Error ? error.message : String(error));
    } finally {
      setSigningIn(false);
    }
  }

  return (
    <Show
      when={session()}
      fallback={
        <div>
          <button
            type="button"
            class="py-2 px-4 rounded-md no-underline bg-green-500 text-white text-xs hover:bg-btn-background-hover disabled:opacity-50"
            disabled={signingIn()}
            onClick={() => void signInWithAzure()}
          >
            {signingIn() ? 'Signing in…' : 'Sign in with Microsoft'}
          </button>
          <Show when={signInError()}>
            <p role="alert" class="mt-2 text-sm text-red-500">
              {signInError()}
            </p>
          </Show>
        </div>
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
