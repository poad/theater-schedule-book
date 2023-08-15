'use client';
import { Session, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Theater } from '@/types';
import { useState, useEffect, useCallback } from 'react';

export function useTheaters(session: Session | null) {
  const supabase = useSupabaseClient<Theater>();
  const [theaters, setTheaters] = useState<Theater[]>();
  const [error, setError] = useState<Error>();

  const fetchData = useCallback(
    () =>
      void supabase
        .from('theaters')
        .select()
        .returns<Theater[]>()
        .then(({ data, error }) => {
          if (error) {
            setError(new Error(error.message));
          } else {
            setTheaters(data ?? []);
          }
        }),
    [supabase],
  );

  useEffect(() => {
    fetchData();
  }, [session, supabase, fetchData]);

  return {
    theaters,
    error,
    refetch: fetchData,
  };
}
