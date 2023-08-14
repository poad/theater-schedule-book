'use client';
import { Session, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect, useCallback } from 'react';
import { Title } from '@/types';

export function useTitle({
  id,
  session,
}: {
  id: string;
  session: Session | null;
}) {
  const supabase = useSupabaseClient<Title>();
  const [title, setTitle] = useState<Title>();
  const [error, setError] = useState<Error>();

  const fetchData = useCallback(() => {
    void supabase
      .from('titles')
      .select('id, name, shows ( id, show_date, theaters ( name ) )')
      .match({ id })
      .single<Title>()
      .then(({ data, error }) => {
        if (error) {
          setError(new Error(error.message));
        } else {
          setTitle(data);
        }
      });
  }, [supabase, id]);

  useEffect(() => fetchData(), [session, id, supabase, fetchData]);

  return {
    title,
    error,
    refetch: fetchData,
  };
}

export function useTitles(session: Session | null) {
  const supabase = useSupabaseClient<Title>();
  const [titles, setTitles] = useState<Title[]>();
  const [error, setError] = useState<Error>();

  const fetchData = useCallback(() => {
    void supabase
      .from('titles')
      .select()
      .order('year', { ascending: true })
      .returns<Title[]>()
      .then(({ data, error }) => {
        if (error) {
          setError(new Error(error.message));
        } else {
          setTitles(data ?? []);
        }
      });
  }, [supabase]);

  useEffect(() => fetchData(), [session, supabase, fetchData]);

  return {
    titles,
    error,
    refetch: fetchData,
  };
}
