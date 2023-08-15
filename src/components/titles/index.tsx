import { Session } from '@supabase/auth-helpers-react';
import { Typography } from '@supabase/ui';
import Link from 'next/link';
import { useTitles } from '@/titles';

function Main({ session }: { session: Session }): JSX.Element {
  const { titles } = useTitles(session);

  return (
    <div className="w-1/2 animate-in gap-14 opacity-0 px-3 py-16 lg:py-24 text-foreground">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8 mb-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th>Name</th>
                  <th>Year</th>
                  <th>Official web site</th>
                </tr>
              </thead>
              <tbody>
                {titles?.map((title) => (
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
                      <Typography.Link
                        target="_blank"
                        href={title.url.toString()}
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
    </div>
  );
}

export function Titles({ session }: { session: Session }): JSX.Element {
  if (!session) {
    return <></>;
  }

  return <Main session={session} />;
}
