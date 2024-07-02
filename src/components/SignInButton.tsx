import { useState } from 'react';
import { Button } from '@headlessui/react';
import { Show } from '~/components/flows';
import { ErrorAlert } from '~/components/ui/alert';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export function SignInButton(): JSX.Element {
  const supabase = useSupabaseClient();
  const [errors, setErrors] = useState<Error>();

  async function signInWithAzure() {
    const reposnse = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email offline_access',
        redirectTo:
          typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
    if (reposnse.error) {
      setErrors(reposnse.error);
    }
  }

  return (
    <>
      <Button
        onClick={() => void signInWithAzure()}
        className={`
          bg-green-500
          rounded
          text-white
          text-xs
          px-2.5
          py-2
        `}
      >
        Sign in
      </Button>
      <Show when={errors}>
        <ErrorAlert title="Failed to Sign In">{errors?.message}</ErrorAlert>
      </Show>
    </>
  );
}

export default SignInButton;
