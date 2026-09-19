import { DateView } from '../../../feature/date-view';
import { useShows } from '../../show';
import { SupabaseSessionContext } from '../../supabase';

import { For, Show, createResource, useContext } from 'solid-js';

interface MainProps {
  currentMonthOnly: boolean;
}

function Main(props: MainProps) {
  const [result] = createResource(
    () => props.currentMonthOnly,
    (currentMonthOnly) => useShows({ futures: { today: new Date(), currentMonthOnly } })(),
  );

  return (
    <div class="w-11/12 animate-in opacity-0 px-3 pt-16 lg:pt-24 text-foreground">
      <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8 h-[calc(100vh-theme(space.48))]">
          <ul>
            <For each={result()?.data}>
              {(show) => (
                <li class="whitespace-nowrap sm:whitespace-normal sm:w-1/3 px-6 py-4 my-6 bg-gray-100/50 hover:bg-yellow-200">
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
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function Schedules(props: { currentMonthOnly?: boolean }) {
  const session = useContext(SupabaseSessionContext);
  return (
    <Show when={session()}>
      <Main currentMonthOnly={props.currentMonthOnly ?? false} />
    </Show>
  );
}

export default Schedules;
