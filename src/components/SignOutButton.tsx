'use client';

import { useState } from 'react';
import { Button } from '@headlessui/react';
import { If } from '@/components/flows';
import { ErrorAlert } from '@/components/ui/alert';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function SignOutButton(): JSX.Element {
  const supabase = useSupabaseClient();
  const [errors, setErrors] = useState<Error>();

  async function handleClick() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setErrors(error);
    }
  }

  return (
    <div>
      <Button
        onClick={() => {
          void handleClick();
        }}
        className="py-2 px-4 rounded-md no-underline bg-green-500 text-white text-xs  hover:bg-btn-background-hover"
      >
        Sign out
      </Button>
      <If when={errors}>
        <ErrorAlert title="Failed to Sign In">{errors?.message}</ErrorAlert>
      </If>
    </div>
  );
}
