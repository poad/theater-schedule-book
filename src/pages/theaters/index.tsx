import { useMutation } from '../../feature/mutations';
import { SupabaseSessionContext } from '../../feature/supabase';
import { fetchTheaters, TheaterItem } from '../../feature/theater';
import { ErrorAlert, NameInputBox as InputBox, FadeLoader } from '../../feature/ui';
import { Theater } from '../../types';

import {
  For,
  Show,
  createMemo,
  createSignal,
  useContext,
  refresh,
  Loading,
  Errored,
} from 'solid-js';

export default function Index() {
  const session = useContext(SupabaseSessionContext);
  const { addTheater } = useMutation();
  const [errorMessage, setErrorMessage] = createSignal<string>();

  const theaters = createMemo(() => fetchTheaters());

  async function handleClick(name: string): Promise<Error | undefined> {
    if (name.length === 0) {
      return new Error('Input to theater name');
    }

    if (
      (theaters() as unknown as { data: Theater[] })?.data?.find(
        (theater: Theater) => theater.name === name,
      )
    ) {
      return new Error('Always exists');
    }

    const result = await addTheater({
      name,
      onSuccess: () => void refresh(theaters),
    });
    setErrorMessage(result?.error?.message);
  }

  return (
    <Show when={session()}>
      <Errored
        fallback={(err) => <ErrorAlert title="fetch error">{(err() as Error).message}</ErrorAlert>}
      >
        <Show
          when={!errorMessage()}
          fallback={<ErrorAlert title="fetch error">{errorMessage()}</ErrorAlert>}
        >
          <Loading
            fallback={
              <div class="h-screen w-screen flex justify-center items-center">
                <FadeLoader />
              </div>
            }
          >
            <Show
              when={!theaters()?.error}
              fallback={<ErrorAlert title="fetch error">{theaters()?.error?.message}</ErrorAlert>}
            >
              <div class="w-full flex flex-col items-center">
                <nav class="w-full flex justify-center border-b border-b-foreground/10 h-16">
                  <div class="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
                    <div />
                    <div>
                      <a href="/" target="_self">
                        Top
                      </a>
                    </div>
                  </div>
                </nav>

                <div class="w-11/12 animate-in opacity-0 px-3 pt-16 lg:pt-24 text-foreground">
                  <div class="mb-4">
                    <InputBox
                      label="Teater name"
                      placeholder="name of theater to add"
                      onClick={(name: string) => handleClick(name)}
                    />
                  </div>
                  <div class="h-[calc(100vh-theme(space.72))] lg:h-[calc(100vh-theme(space.80))] overflow-scroll">
                    <ul>
                      <For each={(theaters() as unknown as { data: Theater[] })?.data}>
                        {(theater: Theater) => <TheaterItem theater={theater} />}
                      </For>
                    </ul>
                  </div>
                </div>
              </div>
            </Show>
          </Loading>
        </Show>
      </Errored>
    </Show>
  );
}
