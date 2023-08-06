'use client';

import { useSupabase } from "../app/supabase";

export default function LogoutButton(): JSX.Element {
  const supabase = useSupabase();

  return (
    <div>
      <button onClick={() => void supabase.auth.signOut()} className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
        Logout
      </button>
    </div>
  );
}
