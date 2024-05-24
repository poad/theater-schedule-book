import { Session } from '@supabase/auth-helpers-react';
import { Link } from '~/components/ui/Link';
import { useTitles } from '~/features/titles';
import { For, Show } from '~/components/flows';

function Main(): JSX.Element {
  const { titles } = useTitles();

  return (
    <div className="w-11/12 animate-in opacity-0 px-3 pt-16 lg:pt-24 text-foreground">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8 h-[calc(100vh-theme(space.48))]">
          <table className="min-w-full text-left text-sm font-light relative border-collapse">
            <thead className="border-b top-0 font-medium dark:border-neutral-500 sticky bg-white">
              <tr>
                <th>Name</th>
                <th>Year</th>
                <th>Official web site</th>
              </tr>
            </thead>
            <tbody className="overflow-y-auto">
              <For items={titles}>
                {({ item: title }) => (
                  <tr
                    key={`${title.id}`}
                    className="border-b dark:border-neutral-500"
                  >
                    <td
                      key={`${title.id}-name`}
                      className="whitespace-nowrap px-6 py-4"
                    >
                      <Link
                        href="/titles/[title_id]"
                        as={`/titles/${title.id}`}
                      >
                        {title.name}
                      </Link>
                    </td>
                    <td
                      key={`${title.id}-year`}
                      className="whitespace-nowrap px-6 py-4"
                    >
                      {title.year}
                    </td>
                    <td
                      key={`${title.id}-link`}
                      className="whitespace-nowrap px-6 py-4"
                    >
                      <Link target="_blank" href={title.url.toString()}>
                        link
                      </Link>
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

export function Titles(props: { session: Session }): JSX.Element {
  return (
    <Show when={props.session}>
      <Main />
    </Show>
  );
}

export default Titles;
