'use client';

import { Session, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect, useCallback } from 'react';
import { Actor } from '@/types';

export function useActors(session: Session | null) {
  const supabase = useSupabaseClient<Actor>();
  const [actors, setActors] = useState<Actor[]>();
  const [error, setError] = useState<Error>();

  const fetchData = useCallback(() => {
    void supabase
      .from('actors')
      .select('id, name')
      .returns<Actor[]>()
      .then(({ data, error }) => {
        if (error) {
          setError(new Error(error.message));
        } else {
          setActors(data);
        }
      });
  }, [supabase]);

  useEffect(() => fetchData(), [session, supabase, fetchData]);

  return {
    actors,
    error,
    refetch: fetchData,
  };
}
