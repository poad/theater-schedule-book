import { supabase } from '../../supabase';
import { ShowTitle } from '../../types';

export function useShows(props: {
  futures?: {
    today: Date;
    currentMonthOnly: boolean;
  };
}) {
  const ac = new AbortController();
  const futures = props.futures;

  return async function fetchData() {
    const select = supabase.from('shows')
      .select(
        'id, show_date, viewed, canceled, skipped, theaters ( name ), titles ( id, name, url )',
      )
      .abortSignal(ac.signal);
    const withFutures = futures
      ? select?.gte('show_date', futures.today.getTime())
      : select;
    const withConditions = futures?.currentMonthOnly
      ? withFutures?.lte(
        'show_date',
        new Date(
          new Date(
            new Date(futures.today).setMonth(futures.today.getMonth() + 1),
          ).setDate(0),
        ).setHours(23, 59, 59, 999),
      )
      : select;
    return withConditions?.order('show_date')
      .returns<ShowTitle[]>();
  };
}
