import { useShows } from '../../features/shows';
import { SupabaseSessionContext } from '../../supabase';
import { For, Show, createResource, useContext } from 'solid-js';

function Main(props: { currentMonthOnly: boolean }) {
  const [result] = createResource(useShows({futures: { today: new Date(), currentMonthOnly: props.currentMonthOnly }}));

  return (
    <div class="w-11/12 animate-in opacity-0 px-3 pt-16 lg:pt-24 text-foreground">
      <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8 h-[calc(100vh-theme(space.48))]">
          <table class="min-w-full text-left text-sm font-light relative border-collapse">
            <thead class="border-b top-0 font-medium dark:border-neutral-500 sticky bg-white">
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Official web site</th>
              </tr>
            </thead>
            <tbody class="overflow-y-auto">
              <For each={result()?.data}>
                {(show) => (
                  <tr class="border-b dark:border-neutral-500">
                    <td class="whitespace-nowrap sm:whitespace-normal sm:w-1/3 px-6 py-4">
                      <a
                        href={`/titles/${show.titles[0].id}`}
                        class="text-current"
                      >
                        {show.titles[0].name}
                      </a>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {new Date(show.show_date).toLocaleString()}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <a target="_blank" href={show.titles[0].url.toString()}>
                        link
                      </a>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Schedules(props: { currentMonthOnly?: boolean }) {
  const session = useContext(SupabaseSessionContext);
  return (
    <Show when={session}>
      <Main currentMonthOnly={props.currentMonthOnly ?? false} />
    </Show>
  );
}

export default Schedules;
