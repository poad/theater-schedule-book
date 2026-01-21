import {
  RiSystemDeleteBin2Line,
  RiSystemCheckFill,
  RiSystemCheckboxFill,
} from 'solid-icons/ri';
import { TbOutlineCalendarCancel } from 'solid-icons/tb';
import { HiSolidUsers } from 'solid-icons/hi';
import { ImEyeBlocked } from 'solid-icons/im';
import { useParams } from '@solidjs/router';
import { For, Show, createResource, createSignal, useContext } from 'solid-js';
import { Show as ShowData, Theater } from '../../../types';
import InputBox from '../../../feature/show';
import { fetchTheaters } from '../../../feature/theater';
import { useTitle } from '../../../feature/title';
import { useMutation } from '../../../feature/mutations';
import { Tooltip, ErrorAlert, FadeLoader, ThroughableLine } from '../../../feature/ui';
import { SupabaseSessionContext } from '../../../feature/supabase';

function Main(props: { id: string; shows?: ShowData[]; refetch: () => void }) {
  const session = useContext(SupabaseSessionContext);

  const [theaters] = createResource(fetchTheaters);
  const mutations = useMutation();
  const addShow = mutations.addShow;
  const updateShowViewed = mutations.updateShowViewed;
  const updateShowCanceled = mutations.updateShowCanceled;
  const updateShowSkipped = mutations.updateShowSkipped;
  const delShow = mutations.delShow;
  const [errorMessage, setErrorMessage] = createSignal<string>();

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

    if (props.shows?.find((it) => it.show_date === showDate.getTime())) {
      return new Error('Already exists');
    }

    const result = await addShow({
      titleId: props.id,
      showDate,
      viewed,
      canceled,
      theaterId: theater.id,
      'on:success': () => {
        void props.refetch();
      },
    });
    setErrorMessage(result?.error?.message);
  }

  async function handleClickCanceled(id: string) {
    await updateShowCanceled({
      id,
      status: true,
      onSuccess: () => {
        void props.refetch();
      },
    });
  }

  async function handleClickViewed(id: string) {
    await updateShowViewed({
      id,
      status: true,
      'on:success': () => {
        void props.refetch();
      },
    });
  }

  async function handleClickSkipped(id: string) {
    await updateShowSkipped({
      id,
      skipped: true,
      onSuccess: () => {
        void props.refetch();
      },
    });
  }

  async function handleDelete(id: string) {
    await delShow({
      id,
      onSuccess: () => {
        void props.refetch();
      },
    });
  }

  return (
    <Show
      when={!theaters()?.error}
      fallback={
        <ErrorAlert title="fetch error">
          {theaters()?.error?.message}
        </ErrorAlert>
      }
    >
      <Show
        when={!errorMessage()}
        fallback={<ErrorAlert title="fetch error">{errorMessage()}</ErrorAlert>}
      >
        <Show
          when={theaters()}
          fallback={
            <div class="h-screen w-screen flex justify-center items-center">
              <FadeLoader />
            </div>
          }
        >
          <div class="w-11/12 animate-in gap-14 opacity-0 px-3 py-16 lg:py-24 text-foreground">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8 mb-8">
                <div class="overflow-hidden">
                  <table class="min-w-full text-left text-sm font-light border-collapse">
                    <thead class="border-b font-medium dark:border-neutral-500">
                      <tr>
                        <th>Viewed</th>
                        <th>Date</th>
                        <th>Theater</th>
                        <th colSpan={4}></th>
                      </tr>
                    </thead>
                    <tbody>
                      <For
                        each={props.shows?.sort(
                          (a, b) => a.show_date - b.show_date,
                        )}
                      >
                        {(show) => (
                          <tr class="border-b dark:border-neutral-500">
                            <td class="whitespace-nowrap px-6 py-4">
                              {show.viewed ? <RiSystemCheckFill /> : <></>}
                            </td>
                            <td class="whitespace-nowrap px-3 py-4">
                              <ThroughableLine strikethrough={show.canceled}>
                                {new Date(show.show_date).toLocaleString()}
                                <Tooltip text="Casts">
                                  <HiSolidUsers class="inline ml-2" />
                                </Tooltip>
                              </ThroughableLine>
                            </td>
                            <td class="whitespace-nowrap px-3 py-4">
                              <ThroughableLine strikethrough={show.canceled}>
                                {show.theaters[0].name}
                              </ThroughableLine>
                            </td>
                            <td class="whitespace-nowrap px-3 py-4">
                              <Show
                                when={
                                  !show.canceled &&
                                  !show.viewed &&
                                  !show.skipped
                                }
                              >
                                <TbOutlineCalendarCancel
                                  onClick={() =>
                                    void handleClickCanceled(show.id)
                                  }
                                />
                              </Show>
                            </td>
                            <td class="whitespace-nowrap px-3 py-4">
                              <Show
                                when={
                                  !show.canceled &&
                                  !show.viewed &&
                                  !show.skipped &&
                                  new Date().getTime() >= show.show_date
                                }
                              >
                                <RiSystemCheckboxFill
                                  onClick={() =>
                                    void handleClickViewed(show.id)
                                  }
                                />
                              </Show>
                            </td>
                            <td class="whitespace-nowrap px-3 py-4">
                              <Show
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
                              </Show>
                            </td>
                            <td class="whitespace-nowrap px-3 py-4">
                              <RiSystemDeleteBin2Line
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
                theaters={theaters()?.data ?? []}
                on:click={async (data: {
                  showDate?: Date;
                  theater: Theater;
                  viewed: boolean;
                  canceled: boolean;
                }) => await handleClick(data)}
              />
            </div>
          </div>
        </Show>
      </Show>
    </Show>
  );
}

export default function Shows() {
  const params = useParams();
  const [title, { refetch }] = createResource(
    useTitle({
      id: params.title_id,
    }),
  );

  if (title()?.error) {
    return (
      <ErrorAlert title="fetch error">{title()?.error?.message}</ErrorAlert>
    );
  }

  return (
    <Show
      when={!title.loading}
      fallback={
        <div class="h-screen w-screen flex justify-center items-center">
          <FadeLoader />
        </div>
      }
    >
      <div class="w-full flex flex-col items-center">
        <nav class="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div class="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
            <div>{title()?.data?.name}</div>
            <div>
              <a href="/" target="_self">
                Top
              </a>
            </div>
          </div>
        </nav>

        <Main
          id={params.title_id as string}
          shows={title()?.data?.shows}
          refetch={refetch}
        />
      </div>
    </Show>
  );
}
