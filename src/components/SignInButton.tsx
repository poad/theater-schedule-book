'use client';

import { useState } from 'react';
import { Button, Alert } from '@supabase/ui';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export function SignInButton(): JSX.Element {
  const supabase = useSupabaseClient();
  const [errors, setErrors] = useState<Error>();

  async function signInWithAzure() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email offline_access',
        redirectTo:
          typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
    if (error) {
      setErrors(error);
    }
  }

  function ErrorAlert({ error }: { error?: Error }) {
    if (error) {
      return (
        <Alert
          variant="danger"
          closable={true}
          title="Failed to Sign In"
          withIcon
        >
          {error.message}
        </Alert>
      );
    }
  }

  return (
    <>
      <Button onClick={() => void signInWithAzure()}>Sign in</Button>
      <ErrorAlert error={errors} />
    </>
  );
}
