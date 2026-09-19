import { Actor } from '../../../types';
import { supabase } from '../../supabase';

export async function fetchActors() {
  return supabase.from('actors').select('id, name').returns<Actor[]>();
}
