'use client';

import { useRouter } from 'next/router';
import { FadeLoader } from 'react-spinners';
import { Alert, Typography } from '@supabase/ui';
import { InputBox } from '@/components/show';
import { useTheaters } from '@/theaters';
import { Show, Theater } from '@/types';
import { RiDeleteBin2Line, RiCheckFill, RiCheckboxFill } from 'react-icons/ri';
import { TbCalendarCancel } from 'react-icons/tb';
import { HiUsers } from 'react-icons/hi';
import { ImEyeBlocked } from 'react-icons/im';
import { useTitle } from '@/titles';
import { Session, useSession } from '@supabase/auth-helpers-react';
import { useMutation } from '@/mutation';
import { useState } from 'react';
import { Tooltip } from '@/components/tooltip';
import { For, If } from '@/components/flows';

function Main({
  id,
  shows,
  session,
  refetch,
}: {
  id: string;
  shows?: Show[];
  session: Session | null;
  refetch: () => void;
}): JSX.Element {
  const { theaters, error } = useTheaters();
  const {
    addShow,
    updateShowViewed,
    updateShowCanceled,
    updateShowSkipped,
    delShow,
  } = useMutation(session);
  const [errorMessage, setErrorMessage] = useState<string>();

  if (!session) {
    return <></>;
  }

  async function handleClick({
    showDate,
    viewed,
    canceled,
    theater,
  }: {
    showDate?: Date;
    viewed: boolean;
    canceled: boolean;
    theater: Theater;
  }): Promise<Error | undefined> {
    if (!showDate) {
      return new Error('Please select date');
    }

    if (shows?.find((it) => it.show_date === showDate.getTime())) {
      return new Error('Already exists');
    }

    const { error } = await addShow({
      titleId: id,
      showDate,
      viewed,
      canceled,
      theaterId: theater.id,
      onSuccess: () => {
        void refetch();
      },
    });
    setErrorMessage(error?.message);
  }

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
      onSuccess: () => {
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

  async function handleDelete(id: string) {
    await delShow({
      id,
      onSuccess: () => {
        void refetch();
      },
    });
  }

  return (
    <If
      when={!error}
      fallback={
        <Alert variant="danger" title="fetch error">
          {error?.message}
        </Alert>
      }
    >
      <If
        when={!errorMessage}
        fallback={
          <Alert variant="danger" title="fetch error">
            {errorMessage}
          </Alert>
        }
      >
        <If
          when={theaters}
          fallback={
            <div className="h-screen w-screen flex justify-center items-center">
              <FadeLoader color="#aaaaaa" radius={4} />
            </div>
          }
        >
          <div className="w-11/12 animate-in gap-14 opacity-0 px-3 py-16 lg:py-24 text-foreground">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8 mb-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-left text-sm font-light border-collapse">
                    <thead className="border-b font-medium dark:border-neutral-500">
                      <tr>
                        <th>Viewed</th>
                        <th>Date</th>
                        <th>Theater</th>
                        <th colSpan={4}></th>
                      </tr>
                    </thead>
                    <tbody>
                      <For
                        items={shows?.sort((a, b) => a.show_date - b.show_date)}
                      >
                        {({ item: show }) => (
                          <tr
                            key={`${show.id}`}
                            className="border-b dark:border-neutral-500"
                          >
                            <td
                              key={`${show.id}-datetime`}
                              className="whitespace-nowrap px-6 py-4"
                            >
                              {show.viewed ? <RiCheckFill /> : <></>}
                            </td>
                            <td
                              key={`${show.id}-datetime`}
                              className="whitespace-nowrap px-3 py-4"
                            >
                              <Typography.Text strikethrough={show.canceled}>
                                {new Date(show.show_date).toLocaleString()}
                                <Tooltip text="Casts">
                                  <HiUsers className="inline ml-2" />
                                </Tooltip>
                              </Typography.Text>
                            </td>
                            <td
                              key={`${show.id}-theater`}
                              className="whitespace-nowrap px-3 py-4"
                            >
                              <Typography.Text strikethrough={show.canceled}>
                                {show.theaters[0].name}
                              </Typography.Text>
                            </td>
                            <td
                              key={`${show.id}-delete`}
                              className="whitespace-nowrap px-3 py-4"
                            >
                              <If
                                when={
                                  !show.canceled &&
                                  !show.viewed &&
                                  !show.skipped
                                }
                              >
                                <TbCalendarCancel
                                  onClick={() =>
                                    void handleClickCanceled(show.id)
                                  }
                                />
                              </If>
                            </td>
                            <td
                              key={`${show.id}-delete`}
                              className="whitespace-nowrap px-3 py-4"
                            >
                              <If
                                when={
                                  !show.canceled &&
                                  !show.viewed &&
                                  !show.skipped &&
                                  new Date().getTime() >= show.show_date
                                }
                              >
                                <RiCheckboxFill
                                  onClick={() =>
                                    void handleClickViewed(show.id)
                                  }
                                />
                              </If>
                            </td>
                            <td
                              key={`${show.id}-datetime`}
                              className="whitespace-nowrap px-3 py-4"
                            >
                              <If
                                when={
                                  !show.canceled &&
                                  !show.viewed &&
                                  !show.skipped &&
                                  new Date().getTime() >= show.show_date
                                }
                              >
                                <ImEyeBlocked
                                  onClick={() =>
                                    void handleClickSkipped(show.id)
                                  }
                                />
                              </If>
                            </td>
                            <td
                              key={`${show.id}-delete`}
                              className="whitespace-nowrap px-3 py-4"
                            >
                              <RiDeleteBin2Line
                                onClick={() => void handleDelete(show.id)}
                              />
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div>
              <InputBox
                theaters={theaters ?? []}
                onClick={async (data: {
                  showDate?: Date;
                  theater: Theater;
                  viewed: boolean;
                  canceled: boolean;
                }) => await handleClick(data)}
              />
            </div>
          </div>
        </If>
      </If>
    </If>
  );
}

export default function Shows(): JSX.Element {
  const {
    query: { title_id },
  } = useRouter();
  const session = useSession();
  const { title, error, refetch } = useTitle({
    id: title_id as string,
  });

  if (error) {
    return (
      <Alert variant="danger" title="fetch error">
        {error.message}
      </Alert>
    );
  }

  if (!title) {
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

      <Main
        id={title_id as string}
        shows={title?.shows}
        session={session}
        refetch={refetch}
      />
    </div>
  );
}
