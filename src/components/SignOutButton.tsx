'use client';

import { useState } from 'react';
import { useSupabase } from '@/app/supabase';
import { Button, Alert } from '@supabase/ui';

export default function SignOutButton(): JSX.Element {
  const supabase = useSupabase();
  const [errors, setErrors] = useState<Error>();

  async function handleClick() {
    const { error } = await supabase.auth.signOut();
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
    <div>
      <Button
        onClick={() => {
          handleClick();
        }}
        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        Sign out
      </Button>
      <ErrorAlert error={errors} />
    </div>
  );
}
