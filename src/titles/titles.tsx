'use client';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Title } from '@/types';
import { useEffect, useState, useCallback } from 'react';

export function useTitles() {
  const supabase = useSupabaseClient<Title>();
  const session = useSession();
  const [titles, setTitles] = useState<Title[]>();
  const [error, setError] = useState<Error>();

  const add = useCallback(
    async (name: string) => {
      if (!titles) {
        setError(new Error('uninitialized'));
        return;
      }
      return await supabase
        .from('titles')
        .insert([{ name }])
        .select<'id, name, url, shows (showDate, casts (name, role), theater (name) )', Title>()
        .single()
        .then(({ data, error }) => {
          if (error) {
            setError(new Error(error.message, { cause: error }));
            return;
          }

          if (data) {
            setTitles([...titles, data]);
          }
        });
    },
    [supabase, titles],
  );

  useEffect(() => {
    void supabase
      .from('titles')
      .select<'id, name, url, shows (showDate, casts (name, role), theater (name) )', Title>()
      .then(({ data, error }) => {
        if (error) {
          setError(new Error(error.message, { cause: error }));
        } else {
          setTitles(data ?? []);
        }
      });
  }, [supabase, session]);

  return {
    titles,
    error,
    add,
  };
}
