'use client';

import { useSupabase } from '../app/supabase';

export default function LogoutButton(): JSX.Element {
  const supabase = useSupabase();

  function handleClick(): void {
    void supabase.auth.signOut();
  }

  return (
    <div>
      <button
        onClick={() => {
          handleClick();
        }}
        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        Logout
      </button>
    </div>
  );
}
