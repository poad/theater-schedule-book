import { Session } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useShows } from '@/shows';
import { Typography } from '@supabase/ui';

function Main({
  currentMonthOnly,
}: {
  currentMonthOnly: boolean;
}): JSX.Element {
  const { shows } = useShows({
    futures: { today: new Date(), currentMonthOnly },
  });

  return (
    <div className="w-11/12 animate-in opacity-0 px-3 pt-16 lg:pt-24 text-foreground">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8 h-[calc(100vh-theme(space.48))]">
          <table className="min-w-full text-left text-sm font-light relative">
            <thead className="border-b top-0 font-medium dark:border-neutral-500 sticky bg-white">
              <tr>
                <th>Name</th>
                <th>Year</th>
                <th>Official web site</th>
              </tr>
            </thead>
            <tbody className="overflow-y-auto">
              {shows?.map((show) => (
                <tr
                  key={`${show.id}`}
                  className="border-b dark:border-neutral-500"
                >
                  <td
                    key={`${show.id}-name`}
                    className="whitespace-nowrap px-6 py-4"
                  >
                    <Link href="/titles/[title_id]" as={`/titles/${show.id}`}>
                      {show.titles[0].name}
                    </Link>
                  </td>
                  <td
                    key={`${show.id}-date`}
                    className="whitespace-nowrap px-6 py-4"
                  >
                    {new Date(show.show_date).toLocaleString()}
                  </td>
                  <td
                    key={`${show.id}-link`}
                    className="whitespace-nowrap px-6 py-4"
                  >
                    <Typography.Link
                      target="_blank"
                      href={show.titles[0].url.toString()}
                    >
                      link
                    </Typography.Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Schedules({
  session,
  currentMonthOnly = true,
}: {
  session: Session | null;
  currentMonthOnly?: boolean;
}): JSX.Element {
  if (!session) {
    return <></>;
  }

  return <Main currentMonthOnly={currentMonthOnly} />;
}
