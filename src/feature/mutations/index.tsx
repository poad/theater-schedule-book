import { PostgrestError } from '@supabase/supabase-js';
import { useContext } from 'solid-js';
import { Actor, Show, Theater, Title } from '../../types';
import { SupabaseSessionContext, supabase } from '../supabase';

interface AddTitleProps {
  name: string;
  year: number;
  url?: string;
  'on:success'?: (title: Title | null) => void;
};

interface AddShowProps {
  titleId: string;
  showDate: Date;
  viewed: boolean;
  canceled: boolean;
  theaterId: string;
  'on:success'?: () => void;
};

type Result = { error?: Error } | undefined;

export function useMutation() {
  const session = useContext(SupabaseSessionContext);

  const addTitle = async (props: AddTitleProps): Promise<Result> => {
    const name = props.name;
    const year = props.year;
    const url = props.url;
    if (!session) {
      return { error: new Error('uninitialized') };
    }
    return await supabase
      .from('titles')
      .insert([{ name, year, url }])
      .select()
      .single<Title>()
      .then(
        ({
          data,
          error,
        }: {
          data: Title | null;
          error: PostgrestError | null;
        }) => {
          if (error) {
            return { error: new Error(error.message) };
          }
          props['on:success']?.(data);
          return { data };
        },
      );
  };

  const addTheater = async (props: {
    name: string;
    'on:success'?: (theater: Theater | null) => void;
  }): Promise<Result> => {
    const { name, 'on:success': onSuccess } = props;
    if (!session) {
      return { error: new Error('uninitialized') };
    }
    return await supabase
      ?.from('theaters')
      .insert([{ name }])
      .select()
      .single<Theater>()
      .then(
        ({
          data,
          error,
        }: {
          data: Theater | null;
          error: PostgrestError | null;
        }) => {
          if (error) {
            return { error: new Error(error.message) };
          }

          onSuccess?.(data);
          return {};
        },
      );
  };

  const addShow = async (props: AddShowProps): Promise<{ data?: Show; error?: Error } | undefined> => {
    if (!session) {
      return { error: new Error('uninitialized') };
    }

    return await supabase
      ?.from('shows')
      .insert([
        {
          show_date: props.showDate.getTime(),
          viewed: props.viewed,
          canceled: props.canceled,
        },
      ])
      .select()
      .single<Show>()
      .then(
        async ({
          data: newEntity,
          error,
        }: {
          data: Show | null;
          error: PostgrestError | null;
        }) => {
          if (error) {
            return { error: new Error(error.message) };
          }

          if (newEntity) {
            await supabase
              .from('shows_theater')
              .insert([{ show_id: newEntity.id, theater_id: props.theaterId }])
              .then(async ({ error }: { error: PostgrestError | null }) => {
                if (error) {
                  return { error: new Error(error.message) };
                }

                await supabase
                  .from('titles_shows')
                  .insert([{ title_id: props.titleId, show_id: newEntity.id }])
                  .then(({ error }: { error: PostgrestError | null }) => {
                    if (error) {
                      return { error: new Error(error.message) };
                    }

                    props['on:success']?.();
                  });
              });
          }
          return {};
        },
      );
  };

  const updateShowViewed = async (props: {
    id: string;
    status: boolean;
    'on:success'?: () => void;
  }): Promise<Result> => {
    const {
      id,
      status,
      'on:success': onSuccess,
    } = props;
    if (!session) {
      return { error: new Error('uninitialized') };
    }

    await supabase
      ?.from('shows')
      .update({ viewed: status })
      .match({ id })
      .select()
      .maybeSingle()
      .then(({ error }: { error: PostgrestError | null }) => {
        if (error) {
          return { error: new Error(error.message) };
        }
        onSuccess?.();
      });
    return {};
  };

  const updateShowCanceled = async ({
    id,
    status,
    onSuccess,
  }: {
    id: string;
    status: boolean;
    onSuccess?: () => void;
  }): Promise<Result> => {
    if (!session) {
      return { error: new Error('uninitialized') };
    }

    await supabase
      ?.from('shows')
      .update({ viewed: status })
      .match({ id })
      .select()
      .maybeSingle()
      .then(({ error }: { error: PostgrestError | null }) => {
        if (error) {
          return { error: new Error(error.message) };
        }
        onSuccess?.();
      });
    return {};
  };

  const updateShowSkipped = async ({
    id,
    skipped,
    onSuccess,
  }: {
    id: string;
    skipped: boolean;
    onSuccess?: () => void;
  }): Promise<Result> => {
    if (!session) {
      return { error: new Error('uninitialized') };
    }

    await supabase
      ?.from('shows')
      .update({ skipped })
      .match({ id })
      .select()
      .maybeSingle()
      .then(({ error }: { error: PostgrestError | null }) => {
        if (error) {
          return { error: new Error(error.message) };
        }
        onSuccess?.();
      });
    return {};
  };

  const addActor = async ({
    name,
    onSuccess,
  }: {
    name: string;
    onSuccess?: (actor: Actor | null) => void;
  }): Promise<Result> => {
    if (!session) {
      return { error: new Error('uninitialized') };
    }
    return supabase
      ?.from('actors')
      .insert([{ name }])
      .select()
      .single<Actor>()
      .then(
        ({
          data,
          error,
        }: {
          data: Actor | null;
          error: PostgrestError | null;
        }) => {
          if (error) {
            return { error: new Error(error.message) };
          }

          onSuccess?.(data);
          return {};
        },
      );
  };

  const delShow = async ({
    id,
    onSuccess,
  }: {
    id: string;
    onSuccess?: () => void;
  }): Promise<Result> => {
    if (!session) {
      return { error: new Error('uninitialized') };
    }

    await supabase
      ?.from('titles_shows')
      .delete()
      .match({ show_id: id })
      .select()
      .maybeSingle()
      .then(async ({ error }: { error: PostgrestError | null }) => {
        if (error) {
          return { error: new Error(error.message) };
        }

        await supabase
          .from('shows_theater')
          .delete()
          .match({ show_id: id })
          .select()
          .maybeSingle()
          .then(async ({ error }: { error: PostgrestError | null }) => {
            if (error) {
              return { error: new Error(error.message) };
            }
            await supabase
              .from('shows')
              .delete()
              .match({ id })
              .select()
              .maybeSingle()
              .then(({ error }: { error: PostgrestError | null }) => {
                if (error) {
                  return { error: new Error(error.message) };
                }

                onSuccess?.();
              });
          });
      });
    return {};
  };

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
