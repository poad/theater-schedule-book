'use client';

import { useRouter } from 'next/router';
import { FadeLoader } from 'react-spinners';
import { Alert, Typography } from '@supabase/ui';
import { InputBox } from '@/components/show';
import { useTheaters } from '@/theaters';
import { Theater } from '@/types';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { useTitle } from '@/titles';
import { useSession } from '@supabase/auth-helpers-react';
import { useMutation } from '@/mutation';
import { useState } from 'react';

export default function Shows(): JSX.Element {
  const {
    query: { id },
  } = useRouter();
  const session = useSession();
  const { theaters, error: errorTheater } = useTheaters(session);
  const { addShow, delShow } = useMutation(session);
  const { title, error, refetch } = useTitle({
    id: id as string,
    session,
  });
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleClick({
    showDate,
    theater,
  }: {
    showDate?: Date;
    theater: Theater;
  }): Promise<Error | undefined> {
    if (!showDate) {
      return new Error('Please select date');
    }

    if (title?.shows?.find((it) => it.show_date === showDate.getTime())) {
      return new Error('Already exists');
    }

    const { error } = await addShow({
      titleId: id as string,
      showDate,
      theaterId: theater.id,
      onSuccess: () => {
        void refetch();
      },
    });
    setErrorMessage(error?.message);
  }

  async function handleDelete(id: string) {
    void delShow({
      id,
      onSuccess: () => {
        void refetch();
      },
    });
  }

  if (error) {
    return (
      <Alert variant="danger" title="fetch error">
        {error.message}
      </Alert>
    );
  }

  if (errorTheater) {
    return (
      <Alert variant="danger" title="fetch error">
        {errorTheater.message}
      </Alert>
    );
  }

  if (errorMessage) {
    return (
      <Alert variant="danger" title="fetch error">
        {errorMessage}
      </Alert>
    );
  }

  if (!title?.shows || !theaters || !title) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <FadeLoader color="#aaaaaa" radius={4} />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <div>{title.name}</div>
          <div>
            <Typography.Link href="/" target="_self">
              Top
            </Typography.Link>
          </div>
        </div>
      </nav>

      <div className="w-1/2 animate-in gap-14 opacity-0 px-3 py-16 lg:py-24 text-foreground">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8 mb-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th>Date</th>
                    <th>Theater</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {title?.shows?.map((show) => (
                    <tr
                      key={`${show.id}`}
                      className="border-b dark:border-neutral-500"
                    >
                      <td
                        key={`${show.id}-datetime`}
                        className="whitespace-nowrap px-6 py-4"
                      >
                        {new Date(show.show_date).toLocaleString()}
                      </td>
                      <td
                        key={`${show.id}-theater`}
                        className="whitespace-nowrap px-6 py-4"
                      >
                        {show.theaters[0].name}
                      </td>
                      <td
                        key={`${show.id}-delete`}
                        className="whitespace-nowrap px-6 py-4"
                      >
                        <RiDeleteBin2Line
                          onClick={() => void handleDelete(show.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <InputBox
            theaters={theaters}
            onClick={async (data: { showDate?: Date; theater: Theater }) =>
              await handleClick(data)
            }
          />
        </div>
      </div>
    </div>
  );
}
