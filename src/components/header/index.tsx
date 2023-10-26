'use client';

import { Auth } from '@supabase/auth-ui-react';
import {
  useSession,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Typography } from '@supabase/ui';
import SignOutButton from '../SignOutButton';

function Menu(): JSX.Element {
  const supabase = useSupabaseClient();
  const session = useSession();
  const user = useUser();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        Hey, {user.email}!
        <Typography.Link target="_self" href="/schedules">
          All Schedules
        </Typography.Link>
        <Typography.Link target="_self" href="/titles">
          Titles
        </Typography.Link>
        <Typography.Link target="_self" href="/theaters">
          Theaters
        </Typography.Link>
        <Typography.Link target="_self" href="/titles/new">
          Add title
        </Typography.Link>
        <Typography.Link target="_self" href="/actors">
          Actors
        </Typography.Link>
        <SignOutButton />
      </div>
    );
  }
  if (!session) {
    return (
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
    );
  }
  return <></>;
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
