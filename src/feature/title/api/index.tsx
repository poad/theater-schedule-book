import { Title } from '../../../types';
import { supabase } from '../../supabase';

export function useTitle(props: { id: string }) {
  return async function fetchData() {
    return supabase
      .from('titles')
      .select('id, name, shows ( id, show_date, viewed, canceled, skipped, theaters ( name ) )')
      .match({ id: props.id })
      .single<Title>();
  };
}

export async function fetchTitles() {
  return supabase
    .from('titles')
    .select('*, shows ( show_date )')
    .order('year', { ascending: true })
    .order('show_date', { ascending: true, referencedTable: 'shows' })
    .overrideTypes<Title[], { merge: false }>();
}
