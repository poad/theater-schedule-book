'use client';
import LogoutButton from '../components/LogoutButton';
import { type User } from '@supabase/supabase-js';
import { useState } from 'react';
import { useSupabase } from './supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function Index(): JSX.Element {
  const [user, setUser] = useState<User>();
  const supabase = useSupabase();

  void supabase.auth.getUser().then((response) => {
    setUser(response.data.user ?? undefined);
  });

  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <div />
          <div>
            {user != null ? (
              <div className="flex items-center gap-4">
                Hey, {user.email}!
                <LogoutButton />
              </div>
            ) : (
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                onlyThirdPartyProviders
                redirectTo={
                  typeof window !== 'undefined'
                    ? window.location.origin
                    : undefined
                }
                providers={['azure']}
              />
            )}
          </div>
        </div>
      </nav>

      <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
        <div className="flex justify-center text-center text-xs"></div>
      </div>
    </div>
  );
}
