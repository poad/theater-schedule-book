'use client';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Theater } from '@/types';
import { useState, useCallback } from 'react';

export function useTheaters() {
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

  fetchData();

  return {
    theaters,
    error,
    refetch: fetchData,
  };
}
