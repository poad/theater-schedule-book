'use client';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ShowTitle } from '@/types';
import { useState, useCallback } from 'react';

export function useShows({
  futures,
}: {
  futures?: {
    today: Date;
    currentMonthOnly: boolean;
  };
}) {
  const supabase = useSupabaseClient<ShowTitle>();
  const [shows, setShows] = useState<ShowTitle[]>();
  const [error, setError] = useState<Error>();

  const fetchData = useCallback(() => {
    const select = supabase
      .from('shows')
      .select(
        'id, show_date, viewed, canceled, skipped, theaters ( name ), titles ( id, name, url )',
      );
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
      .then(({ data, error }) => {
        if (error) {
          setError(new Error(error.message));
        } else {
          setShows(data ?? []);
        }
      });
  }, [supabase, futures]);

  fetchData();

  return {
    shows,
    error,
    refetch: fetchData,
  };
}
