'use client';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Theater } from '@/types';
import { useEffect, useState, useCallback } from 'react';

export function useTheaters() {
  const supabase = useSupabaseClient<Theater>();
  const session = useSession();
  const [theaters, setTheaters] = useState<Theater[]>();
  const [error, setError] = useState<Error>();

  const add = useCallback(
    async (name: string) => {
      if (!theaters) {
        setError(new Error('uninitialized'));
        return;
      }
      return await supabase
        .from('theaters')
        .insert([{ name }])
        .select<'id, name', Theater>()
        .single()
        .then(({ data, error }) => {
          if (error) {
            setError(new Error(error.message, { cause: error }));
            return;
          }

          if (data) {
            setTheaters([...theaters, data]);
          }
        });
    },
    [supabase, theaters],
  );

  useEffect(() => {
    void supabase
      .from('theaters')
      .select<'id, name', Theater>()
      .then(({ data, error }) => {
        if (error) {
          setError(new Error(error.message, { cause: error }));
        } else {
          setTheaters(data ?? []);
        }
      });
  }, [supabase, session]);

  return {
    theaters,
    error,
    add,
  };
}
