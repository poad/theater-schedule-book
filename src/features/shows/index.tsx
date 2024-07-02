'use client';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ShowTitle } from '~/types';
import { useState } from 'react';

export function useShows(props: {
  futures?: {
    today: Date;
    currentMonthOnly: boolean;
  };
}) {
  const { futures } = props;
  const supabase = useSupabaseClient<ShowTitle>();
  const [shows, setShows] = useState<ShowTitle[]>();
  const [error, setError] = useState<Error>();
  const ac = new AbortController();

  function fetchData() {
    const select = supabase
      .from('shows')
      .select(
        'id, show_date, viewed, canceled, skipped, theaters ( name ), titles ( id, name, url )',
      )
      .abortSignal(ac.signal);
    const withFutures = futures
      ? select.gte('show_date', futures.today.getTime())
      : select;
    const withConditions = futures?.currentMonthOnly
      ? withFutures.lte(
        'show_date',
        new Date(
          new Date(
            new Date(futures.today).setMonth(futures.today.getMonth() + 1),
          ).setDate(0),
        ).setHours(23, 59, 59, 999),
      )
      : select;
    void withConditions
      .order('show_date')
      .returns<ShowTitle[]>()
      .then((value) => {
        const { data, error } = value;
        if (error) {
          setError(new Error(error.message));
        } else {
          setShows(data ?? []);
        }
      });
  }

  if (!shows) {
    fetchData();
  }

  return {
    shows,
    error,
    refetch: fetchData,
  };
}

export default useShows;
