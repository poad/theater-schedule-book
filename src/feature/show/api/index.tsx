import { ShowTitle } from '../../../types';
import { supabase } from '../../supabase';

interface UseShowProps {
  futures?: {
    today: Date;
    currentMonthOnly: boolean;
  };
  month?: {
    year: number;
    month: number;
  };
}

export function useShows({ futures, month }: UseShowProps) {
  const ac = new AbortController();

  return async function fetchData() {
    const select = supabase
      .from('shows')
      .select(
        'id, show_date, viewed, canceled, skipped, theaters ( name ), titles ( id, name, url )',
      )
      .abortSignal(ac.signal);
    const withFutures = futures ? select?.gte('show_date', futures.today.getTime()) : select;
    const withConditions = futures?.currentMonthOnly
      ? withFutures?.lte(
          'show_date',
          new Date(
            new Date(new Date(futures.today).setMonth(futures.today.getMonth() + 1)).setDate(0),
          ).setHours(23, 59, 59, 999),
        )
      : select;
    const withMonth = month
      ? withConditions
          ?.gte('show_date', new Date(month.year, month.month, 1).getTime())
          .lt('show_date', new Date(month.year, month.month + 1, 1).getTime())
      : withConditions;
    return withMonth?.order('show_date').overrideTypes<ShowTitle[], { merge: false }>();
  };
}
