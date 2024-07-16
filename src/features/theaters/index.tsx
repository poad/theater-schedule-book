import { supabase } from '../../supabase';
import { Theater } from '../../types';

export async function fetchTheaters() {
  return supabase.from('theaters').select().returns<Theater[]>();
}
