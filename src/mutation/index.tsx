'use client';
import { Session, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useCallback } from 'react';
import { Actor, Show, Theater, Title } from '@/types';

export function useMutation(session: Session | null) {
  const supabase = useSupabaseClient<Title>();

  const addTitle = useCallback(
    async ({
      name,
      year,
      url,
      onSuccess,
    }: {
      name: string;
      year: number;
      url?: string;
      onSuccess?: (title: Title | null) => void;
    }): Promise<{ error?: Error }> => {
      if (!session) {
        return { error: new Error('uninitialized') };
      }
      return await supabase
        .from('titles')
        .insert([{ name, year, url }])
        .select()
        .single<Title>()
        .then(({ data, error }) => {
          if (error) {
            return { error: new Error(error.message) };
          }
          onSuccess?.(data);
          return { data };
        });
    },
    [supabase, session],
  );

  const addTheater = useCallback(
    async ({
      name,
      onSuccess,
    }: {
      name: string;
      onSuccess?: (theater: Theater | null) => void;
    }): Promise<{ error?: Error }> => {
      if (!session) {
        return { error: new Error('uninitialized') };
      }
      return await supabase
        .from('theaters')
        .insert([{ name }])
        .select()
        .single<Theater>()
        .then(({ data, error }) => {
          if (error) {
            return { error: new Error(error.message) };
          }

          onSuccess?.(data);
          return {};
        });
    },
    [supabase, session],
  );

  const addShow = useCallback(
    async ({
      titleId,
      showDate,
      viewed,
      canceled,
      theaterId,
      onSuccess,
    }: {
      titleId: string;
      showDate: Date;
      viewed: boolean;
      canceled: boolean;
      theaterId: string;
      onSuccess?: () => void;
    }): Promise<{ data?: Show; error?: Error }> => {
      if (!session) {
        return { error: new Error('uninitialized') };
      }

      return await supabase
        .from('shows')
        .insert([{ show_date: showDate.getTime(), viewed, canceled }])
        .select()
        .single()
        .then(async ({ data: newEntity, error }) => {
          if (error) {
            return { error: new Error(error.message) };
          }

          if (newEntity) {
            await supabase
              .from('shows_theater')
              .insert([{ show_id: newEntity.id, theater_id: theaterId }])
              .then(async ({ error }) => {
                if (error) {
                  return { error: new Error(error.message) };
                }

                await supabase
                  .from('titles_shows')
                  .insert([{ title_id: titleId, show_id: newEntity.id }])
                  .then(({ error }) => {
                    if (error) {
                      return { error: new Error(error.message) };
                    }

                    onSuccess?.();
                  });
              });
          }
          return {};
        });
    },
    [session, supabase],
  );

  const updateShowViewed = useCallback(
    async ({
      id,
      status,
      onSuccess,
    }: {
      id: string;
      status: boolean;
      onSuccess?: () => void;
    }): Promise<{ error?: Error }> => {
      if (!session) {
        return { error: new Error('uninitialized') };
      }

      void supabase
        .from('shows')
        .update({ viewed: status })
        .match({ id })
        .select()
        .maybeSingle()
        .then(async ({ error }) => {
          if (error) {
            return { error: new Error(error.message) };
          }
          onSuccess?.();
        });
      return {};
    },
    [session, supabase],
  );

  const updateShowCanceled = useCallback(
    async ({
      id,
      status,
      onSuccess,
    }: {
      id: string;
      status: boolean;
      onSuccess?: () => void;
    }): Promise<{ error?: Error }> => {
      if (!session) {
        return { error: new Error('uninitialized') };
      }

      void supabase
        .from('shows')
        .update({ viewed: status })
        .match({ id })
        .select()
        .maybeSingle()
        .then(async ({ error }) => {
          if (error) {
            return { error: new Error(error.message) };
          }
          onSuccess?.();
        });
      return {};
    },
    [session, supabase],
  );

  const updateShowSkipped = useCallback(
    async ({
      id,
      skipped,
      onSuccess,
    }: {
      id: string;
      skipped: boolean;
      onSuccess?: () => void;
    }): Promise<{ error?: Error }> => {
      if (!session) {
        return { error: new Error('uninitialized') };
      }

      void supabase
        .from('shows')
        .update({ skipped })
        .match({ id })
        .select()
        .maybeSingle()
        .then(async ({ error }) => {
          if (error) {
            return { error: new Error(error.message) };
          }
          onSuccess?.();
        });
      return {};
    },
    [session, supabase],
  );

  const addActor = useCallback(
    async ({
      name,
      onSuccess,
    }: {
      name: string;
      onSuccess?: (actor: Actor | null) => void;
    }): Promise<{ error?: Error }> => {
      if (!session) {
        return { error: new Error('uninitialized') };
      }
      return await supabase
        .from('actors')
        .insert([{ name }])
        .select()
        .single<Actor>()
        .then(({ data, error }) => {
          if (error) {
            return { error: new Error(error.message) };
          }

          onSuccess?.(data);
          return {};
        });
    },
    [supabase, session],
  );

  const delShow = useCallback(
    async ({
      id,
      onSuccess,
    }: {
      id: string;
      onSuccess?: () => void;
    }): Promise<{ error?: Error }> => {
      if (!session) {
        return { error: new Error('uninitialized') };
      }

      void supabase
        .from('titles_shows')
        .delete()
        .match({ show_id: id })
        .select()
        .maybeSingle()
        .then(async ({ error }) => {
          if (error) {
            return { error: new Error(error.message) };
          }

          void supabase
            .from('shows_theater')
            .delete()
            .match({ show_id: id })
            .select()
            .maybeSingle()
            .then(async ({ error }) => {
              if (error) {
                return { error: new Error(error.message) };
              }
              void supabase
                .from('shows')
                .delete()
                .match({ id })
                .select()
                .maybeSingle()
                .then(({ error }) => {
                  if (error) {
                    return { error: new Error(error.message) };
                  }

                  onSuccess?.();
                });
            });
        });
      return {};
    },
    [session, supabase],
  );

  return {
    addTitle,
    addShow,
    delShow,
    updateShowViewed,
    updateShowCanceled,
    updateShowSkipped,
    addActor,
    addTheater,
  };
}
