import { Title } from '../../../types';
import { SupabaseSessionContext } from '../../supabase';
import { fetchTitles } from '../api';

import { For, Show, createMemo, useContext, Loading, Errored } from 'solid-js';

function Main() {
  const result = createMemo(() => fetchTitles());

  return (
    <Errored fallback={(err) => <p class="px-6 py-4 text-red-500">{(err() as Error).message}</p>}>
      <Loading fallback={<p class="px-6 py-4">読み込み中...</p>}>
        <div class="w-11/12 animate-in opacity-0 px-3 pt-16 lg:pt-24 text-foreground">
          <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8 h-[calc(100vh-theme(space.48))]">
              <table class="min-w-full text-left text-sm font-light relative border-collapse">
                <thead class="border-b top-0 font-medium dark:border-neutral-500 sticky bg-white">
                  <tr>
                    <th>Name</th>
                    <th>Year</th>
                    <th>Official web site</th>
                  </tr>
                </thead>
                <tbody class="overflow-y-auto">
                  <For each={(result() as unknown as { data: Title[] })?.data}>
                    {(title) => (
                      <tr class="border-b dark:border-neutral-500">
                        <td class="whitespace-nowrap px-6 py-4">
                          <a href={`/titles/${title.id}`}>{title.name}</a>
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">{title.year}</td>
                        <td class="whitespace-nowrap px-6 py-4">
                          <a target="_blank" href={title.url.toString()}>
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
      </Loading>
    </Errored>
  );
}

export function Titles() {
  const session = useContext(SupabaseSessionContext);

  return (
    <Show when={session()}>
      <Main />
    </Show>
  );
}

export default Titles;
