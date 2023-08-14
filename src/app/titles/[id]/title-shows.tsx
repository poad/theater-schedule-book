'use client';

import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useCallback, useEffect } from 'react';
import { Show, Theater } from '../../../types';

interface ShowsEnitity {
  id: string;
  show_date: number;
  theater_id: string;
}

export function useShows(id: string) {
  const supabase = useSupabaseClient<Show>();
  const session = useSession();
  const [shows, setShows] = useState<Show[]>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    void supabase
      .from('titles_shows')
      .select<'title_id, show_id', { title_id: string; show_id: string }>()
      .match({ title_id: id })
      .then(({ data, error }) => {
        if (error) {
          setError(new Error(error.message));
        } else {
          const showIdList = data.map((it) => it.show_id);
          if (showIdList.length > 0) {
            void supabase
              .from('shows')
              .select()
              .in('id', showIdList)
              .returns<ShowsEnitity[]>()
              .then(({ data: showList, error }) => {
                if (error) {
                  setError(new Error(error.message));
                } else {
                  showEntityToShow(showList).then(setShows);
                }
              });
          } else {
            setShows([]);
          }
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, session, id]);

  async function showEntityToShow(entities: ShowsEnitity[]): Promise<Show[]> {
    const theaterIdList = entities?.map((it) => it.theater_id);
    if (!theaterIdList) {
      return [];
    }
    return await supabase
      .from('theaters')
      .select<'id, name', Theater>()
      .in('id', theaterIdList)
      .then(({ data: theaters, error }) => {
        if (error) {
          setError(new Error(error.message));
          return [];
        } else {
          const theaterObjs =
            theaters?.map((theater) => ({
              [theater.id]: theater,
            })) ?? [];
          const theaterList =
            theaterObjs.length > 0
              ? theaterObjs.reduce((acc, cur) => ({ ...acc, ...cur }))
              : {};
          return (
            entities?.map((show) => ({
              id: show.id,
              show_date: new Date(show.show_date),
              theater: theaterList[show.theater_id]!,
              casts: [],
            })) ?? []
          );
        }
      });
  }

  const add = useCallback(
    async (showDate: Date, theaterId: string) => {
      if (!shows) {
        setError(new Error('uninitialized'));
        return;
      }
      return await supabase
        .from('shows')
        .insert([{ show_date: showDate.getTime(), theater_id: theaterId }])
        .select()
        .single<ShowsEnitity>()
        .then(async ({ data: newEntity, error }) => {
          if (error) {
            setError(new Error(error.message));
            return;
          }

          await supabase
            .from('titles_shows')
            .insert([{ title_id: id, show_id: newEntity.id }])
            .then(({ error }) => {
              if (error) {
                setError(new Error(error.message));
                return;
              }

              if (newEntity) {
                showEntityToShow([newEntity]).then((newShow) =>
                  setShows([...shows, ...newShow]),
                );
              }
            });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [supabase, shows, id],
  );

  const del = useCallback(
    async (id: string) => {
      if (!shows) {
        setError(new Error('uninitialized'));
        return;
      }

      if (!shows.find((show) => show.id === id)) {
        return;
      }

      void supabase
        .from('shows')
        .delete()
        .match({ id })
        .select()
        .maybeSingle<ShowsEnitity>()
        .then(({ error }) => {
          if (error) {
            setError(new Error(error.message));
            return;
          }
          void supabase
            .from('titles_shows')
            .delete()
            .match({ show_id: id })
            .select<'*', { title_id: string; show_id: string }>()
            .maybeSingle()
            .then(({ error }) => {
              if (error) {
                setError(new Error(error.message));
                return;
              }
            });
          setShows(shows.filter((show) => show.id !== id));
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [supabase, shows, id],
  );

  return {
    shows,
    error,
    add,
    del,
  };
}
