'use client';
import { useState } from 'react';
import { useSupabase } from '../supabase';
import { Input, Button } from '@supabase/ui';

export interface Theater {
  id: string;
  name: string;
}

export default function Index(): JSX.Element {
  const supabase = useSupabase();
  const [name, setName] = useState<string>();
  const [theaters, setTheaters] = useState<{ id: string; name: string }[]>();
  const [error, setError] = useState<string>();

  void supabase
    .from('theaters')
    .select<'*', { id: string; name: string }>()
    .then(({ data }) => setTheaters(data ?? []));

  function handleClick() {
    if (!name || name.length === 0) {
      setError('Input to theater name');
      return;
    }
    void supabase
      .from('theaters')
      .insert(name)
      .select<'*', { id: string; name: string }>()
      .then(({ data }) => setTheaters(data ?? []));
  }

  return (
    <>
      <div>
        <ul className="my-auto">
          {theaters?.map((theater) => <li key={theater.id}>{theater.name}</li>)}
        </ul>
      </div>
      <div>
        <Input
          label="Teater name"
          placeholder="name of theater to add"
          onChange={(event) => setName(event.target.value)}
          error={error}
        />
        <Button onClick={() => handleClick()}>Save</Button>
      </div>
    </>
  );
}
