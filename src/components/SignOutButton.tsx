'use client';

import { useSupabase } from '../app/supabase';
import { Button } from '@supabase/ui';

export default function SignOutButton(): JSX.Element {
  const supabase = useSupabase();

  function handleClick(): void {
    void supabase.auth.signOut();
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
    </div>
  );
}
