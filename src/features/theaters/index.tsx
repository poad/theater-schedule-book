'use client';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Theater } from '~/types';
import { useState } from 'react';

export function useTheaters() {
  const supabase = useSupabaseClient<Theater>();
  const [theaters, setTheaters] = useState<Theater[]>();
  const [error, setError] = useState<Error>();

  function fetchData() {
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
      });
  }

  if (!theaters) {
    fetchData();
  }

  return {
    theaters,
    error,
    refetch: fetchData,
  };
}

export default useTheaters;
