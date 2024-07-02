import { useState } from 'react';
import { Button } from '@headlessui/react';
import { Show } from '~/components/flows';
import { ErrorAlert } from '~/components/ui/alert';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export function SignOutButton(): JSX.Element {
  const supabase = useSupabaseClient();
  const [errors, setErrors] = useState<Error>();

  async function handleClick() {
    const response = await supabase.auth.signOut();
    if (response.error) {
      setErrors(response.error);
    }
  }

  return (
    <div>
      <Button
        onClick={() => {
          void handleClick();
        }}
        className={`
          py-2
          px-4
          rounded-md
          no-underline
          bg-green-500
          text-white
          text-xs
          hover:bg-btn-background-hover
        `}
      >
        Sign out
      </Button>
      <Show when={errors}>
        <ErrorAlert title="Failed to Sign In">{errors?.message}</ErrorAlert>
      </Show>
    </div>
  );
}

export default SignOutButton;
