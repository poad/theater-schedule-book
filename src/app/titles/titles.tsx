'use client';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState, useCallback } from 'react';
import { Title } from '../../types';

export function useTitle(id: string) {
  const supabase = useSupabaseClient<Title>();
  const session = useSession();
  const [title, setTitle] = useState<Title>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    void supabase
      .from('titles')
      .select()
      .match({ id })
      .single<Title>()
      .then(({ data, error }) => {
        if (error) {
          setError(new Error(error.message));
        } else {
          setTitle(data);
        }
      });
  }, [supabase, session, id]);

  return {
    title,
    error,
  };
}

export function useTitles() {
  const supabase = useSupabaseClient<Title>();
  const session = useSession();
  const [titles, setTitles] = useState<Title[]>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    void supabase
      .from('titles')
      .select()
      .returns<Title[]>()
      .then(({ data, error }) => {
        if (error) {
          setError(new Error(error.message));
        } else {
          setTitles(data ?? []);
        }
      });
  }, [supabase, session]);

  const add = useCallback(
    async (name: string, year: number, url?: string) => {
      if (!titles) {
        setError(new Error('uninitialized'));
        return;
      }
      return await supabase
        .from('titles')
        .insert([{ name, year, url }])
        .select()
        .single<Title>()
        .then(({ data, error }) => {
          if (error) {
            setError(new Error(error.message));
            return;
          }

          if (data) {
            setTitles([...titles, data]);
          }
        });
    },
    [supabase, titles],
  );

  return {
    titles,
    error,
    add,
  };
}
