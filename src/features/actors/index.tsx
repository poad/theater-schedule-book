import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { Actor } from '~/types';

export function useActors() {
  const supabase = useSupabaseClient<Actor>();
  const [actors, setActors] = useState<Actor[]>();
  const [error, setError] = useState<Error>();

  function fetchData() {
    void supabase
      .from('actors')
      .select('id, name')
      .returns<Actor[]>()
      .then(({ data, error }) => {
        if (error) {
          setError(new Error(error.message));
        } else {
          setActors(data);
        }
      });
  }

  if (!actors) {
    fetchData();
  }

  return {
    actors,
    error,
    refetch: fetchData,
  };
}

export default useActors;
