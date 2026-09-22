import { DateView } from '../../../feature/date-view';
import { useMutation } from '../../mutations';
import { useShows } from '../../show';
import { SupabaseSessionContext } from '../../supabase';
import { CancelButton, SkippedButton, ViewedButton } from '../../ui/Buttons';

import { For, Show, createResource, useContext } from 'solid-js';

interface MainProps {
  currentMonthOnly: boolean;
  year?: number;
  month?: number;
}

function isToday(timestamp: number): boolean {
  const now = new Date();
  const target = new Date(timestamp);
  return (
    now.getFullYear() === target.getFullYear() &&
    now.getMonth() === target.getMonth() &&
    now.getDate() === target.getDate()
  );
}

function isBeforeToday(timestamp: number): boolean {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return timestamp < startOfToday.getTime();
}

function getBackground(timestamp: number): string {
  if (isToday(timestamp)) {
    return 'bg-yellow-200/50';
  }
  if (isBeforeToday(timestamp)) {
    return 'bg-gray-500/50';
  }
  return 'bg-gray-200/50';
}

function Main(props: MainProps) {
  const mutations = useMutation();
  const updateShowViewed = mutations.updateShowViewed;
  const updateShowCanceled = mutations.updateShowCanceled;
  const updateShowSkipped = mutations.updateShowSkipped;
  const currentTime = new Date().getTime();

  const [result, { refetch }] = createResource(
    () => ({
      monthMode: props.year !== undefined && props.month !== undefined,
      year: props.year ?? new Date().getFullYear(),
      month: props.month ?? new Date().getMonth(),
      currentMonthOnly: props.currentMonthOnly,
    }),
    (filter) =>
      useShows(
        filter.monthMode
          ? { month: { year: filter.year, month: filter.month } }
          : { futures: { today: new Date(), currentMonthOnly: filter.currentMonthOnly } },
      )(),
  );

  async function handleClickCanceled(id: string) {
    await updateShowCanceled({
      id,
      status: true,
      onSuccess: () => {
        void refetch();
      },
    });
  }

  async function handleClickViewed(id: string) {
    await updateShowViewed({
      id,
      status: true,
      'on:success': () => {
        void refetch();
      },
    });
  }

  async function handleClickSkipped(id: string) {
    await updateShowSkipped({
      id,
      skipped: true,
      onSuccess: () => {
        void refetch();
      },
    });
  }

  return (
    <div class="w-11/12 animate-in opacity-0 px-3 pt-16 lg:pt-24 text-foreground">
      <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8 h-[calc(100vh-theme(space.48))]">
          <Show
            when={result.loading || (result()?.data?.length ?? 0) > 0}
            fallback={<p class="px-6 py-4">この月の公演はありません</p>}
          >
            <ul>
              <For each={result()?.data}>
                {(show) => (
                  <li
                    class={`whitespace-nowrap sm:whitespace-normal sm:w-1/3 px-6 py-4 my-3 ${getBackground(show.show_date)} hover:bg-yellow-200/50`}
                  >
                    <a href={`/titles/${show.titles[0].id}`} class="text-current block">
                      {show.titles[0].name}
                    </a>

                    <div class="flex ml-3">
                      <div class="grow-2 pr-6">
                        <DateView date={show.show_date} />
                      </div>
                      <a target="_blank" class="block" href={show.titles[0].url.toString()}>
                        link
                      </a>
                    </div>
                    <details>
                      <summary />
                      <div class="flex gap-4 ml-3 py-2">
                        <Show when={!show.canceled && !show.viewed && !show.skipped}>
                          <CancelButton onClick={() => void handleClickCanceled(show.id)} />
                        </Show>
                        <Show
                          when={
                            !show.canceled &&
                            !show.viewed &&
                            !show.skipped &&
                            currentTime >= show.show_date
                          }
                        >
                          <ViewedButton onClick={() => void handleClickViewed(show.id)} />
                        </Show>
                        <Show
                          when={
                            !show.canceled &&
                            !show.viewed &&
                            !show.skipped &&
                            currentTime >= show.show_date
                          }
                        >
                          <SkippedButton onClick={() => void handleClickSkipped(show.id)} />
                        </Show>
                      </div>
                    </details>
                  </li>
                )}
              </For>
            </ul>
          </Show>
        </div>
      </div>
    </div>
  );
}

export function Schedules(props: { currentMonthOnly?: boolean; year?: number; month?: number }) {
  const session = useContext(SupabaseSessionContext);
  return (
    <Show when={session()}>
      <Main
        currentMonthOnly={props.currentMonthOnly ?? false}
        year={props.year}
        month={props.month}
      />
    </Show>
  );
}

export default Schedules;
