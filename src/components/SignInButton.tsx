'use client';

import { Button } from '@supabase/ui';
import { useSupabase } from '../app/supabase';

export function SignInButton(): JSX.Element {
  const supabase = useSupabase();

  async function signInWithAzure() {
    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email offline_access',
        redirectTo:
          typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
  }

  return <Button onClick={() => void signInWithAzure()}>Sign in</Button>;
}
