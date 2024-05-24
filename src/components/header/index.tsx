import { Auth } from '@supabase/auth-ui-react';
import {
  useSession,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import SignOutButton from '../SignOutButton';
import { Show } from '~/components/flows';
import Link from '~/components/ui/Link';

function Menu(): JSX.Element {
  const supabase = useSupabaseClient();
  const session = useSession();
  const user = useUser();

  return (
    <Show
      when={user}
      fallback={
        <Show when={!session}>
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
        </Show>
      }
    >
      <div className="flex items-center gap-4">
        Hey, {user?.email}!
        <Link target="_self" href="/schedules">
          All Schedules
        </Link>
        <Link target="_self" href="/titles">
          Titles
        </Link>
        <Link target="_self" href="/theaters">
          Theaters
        </Link>
        <Link target="_self" href="/title">
          Add title
        </Link>
        <Link target="_self" href="/actors">
          Actors
        </Link>
        <SignOutButton />
      </div>
    </Show>
  );
}

export function Header(): JSX.Element {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
        <div />
        <div>
          <Menu />
        </div>
      </div>
    </nav>
  );
}

export default Header;
