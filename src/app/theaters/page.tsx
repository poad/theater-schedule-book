'use client';
import { createClient } from '@supabase/supabase-js';

export default async function Index(): Promise<JSX.Element> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  );

  const { data: theaters } = await supabase.from('theaters').select();

  return (
    <ul className="my-auto">
      {theaters?.map((theater) => <li key={theater.id}>{theater.name}</li>)}
    </ul>
  );
}
