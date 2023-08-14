'use client';

import { useEffect, useState } from 'react';
import { type User } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Typography } from '@supabase/ui';
import { useSession } from '@supabase/auth-helpers-react';
import SignOutButton from '@/components/SignOutButton';
import { useSupabase } from './supabase';
import { useTitles } from './titles/titles';
import Link from 'next/link';

export default function Index(): JSX.Element {
  const [user, setUser] = useState<User>();
  const session = useSession();
  const supabase = useSupabase();
  const { titles } = useTitles();

  useEffect(() => {
    if (session) {
      supabase.auth.getUser().then((response) => {
        setUser(response.data.user ?? undefined);
      });
    }
  }, [supabase.auth, session]);

  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <div />
          <div>
            {session ? (
              <div className="flex items-center gap-4">
                {user && `Hey, ${user.email}!`}
                <Typography.Link target="_self" href="/theaters">
                  Theaters
                </Typography.Link>
                <Typography.Link target="_self" href="/titles">
                  Add title
                </Typography.Link>
                <SignOutButton />
              </div>
            ) : (
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                onlyThirdPartyProviders
                redirectTo={
                  typeof window !== 'undefined'
                    ? window.location.origin
                    : undefined
                }
                providers={['azure']}
              />
            )}
          </div>
        </div>
      </nav>

      <div className="w-1/2 animate-in gap-14 opacity-0 px-3 py-16 lg:py-24 text-foreground">
        {session ? (
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
                            target="_self"
                            href={`/titles/${title.id}/`}
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
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
