import { supabase } from '~/supabase';
import { Actor } from '~/types';

export async function fetchActors() {
  return supabase.from('actors').select('id, name').returns<Actor[]>();
}
