'use client';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { Title } from '~/types';

export function useTitle(props: { id: string }) {
  const { id } = props;
  const supabase = useSupabaseClient<Title>();
  const [title, setTitle] = useState<Title>();
  const [error, setError] = useState<Error>();

  function fetchData() {
    void supabase
      .from('titles')
      .select(
        'id, name, shows ( id, show_date, viewed, canceled, skipped, theaters ( name ) )',
      )
      .match({ id })
      .single<Title>()
      .then(({ data, error }) => {
        if (error) {
          setError(new Error(error.message));
        } else {
          setTitle(data);
        }
      });
  }

  if (!title) {
    fetchData();
  }

  return {
    title,
    error,
    refetch: fetchData,
  };
}

export function useTitles() {
  const supabase = useSupabaseClient<Title>();
  const [titles, setTitles] = useState<Title[]>();
  const [error, setError] = useState<Error>();

  function fetchData() {
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
  }
  if (!titles) {
    fetchData();
  }

  return {
    titles,
    error,
    refetch: fetchData,
  };
}
