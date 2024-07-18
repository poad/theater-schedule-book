import { supabase } from '../../supabase';
import { Title } from '../../../types';

export function useTitle(props: { id: string }) {
  return async function fetchData() {
    return supabase
      .from('titles')
      .select(
        'id, name, shows ( id, show_date, viewed, canceled, skipped, theaters ( name ) )',
      )
      .match({ id: props.id })
      .single<Title>()
    ;
  };
}

export async function fetchTitles() {
  return supabase
    .from('titles')
    .select()
    .order('year', { ascending: true })
    .returns<Title[]>();
}
