import { Theater } from '../../../types';
import { supabase } from '../../supabase';

export async function fetchTheaters() {
  return supabase.from('theaters').select().overrideTypes<Theater[], { merge: false }>();
}
