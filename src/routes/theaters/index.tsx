import { FadeLoader } from '~/components/ui/FadeLoader';
import { fetchTheaters } from '~/features/theaters';
import { TheaterItem } from '~/components/theater';
import { NameInputBox as InputBox } from '~/components/ui/NameInputBox';
import { useMutation } from '~/mutation';
import { For, Show, createResource, createSignal, useContext } from 'solid-js';
import { ErrorAlert } from '~/components/ui/alert';
import { SupabaseSessionContext } from '~/supabase';

export default function Index() {
  const session = useContext(SupabaseSessionContext);
  const { addTheater } = useMutation();
  const [errorMessage, setErrorMessage] = createSignal<string>();

  const [theaters, { refetch }] = createResource(fetchTheaters);

  async function handleClick(name: string): Promise<Error | undefined> {
    if (name.length === 0) {
      return new Error('Input to theater name');
    }

    if (theaters()?.data?.find((theater) => theater.name === name)) {
      return new Error('Always exists');
    }

    const result = await addTheater({
      name,
      onSuccess: () => void refetch(),
    });
    setErrorMessage(result?.error?.message);
  }

  return (
    <Show when={session}>
      <Show
        when={!theaters()?.error}
        fallback={<ErrorAlert title="fetch error">{theaters()?.error?.message}</ErrorAlert>}
      >
        <Show
          when={!errorMessage()}
          fallback={
            <ErrorAlert title="fetch error">{errorMessage()}</ErrorAlert>
          }
        >
          <Show
            when={theaters}
            fallback={
              <div class="h-screen w-screen flex justify-center items-center">
                <FadeLoader />
              </div>
            }
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
                    onClick={async (name: string) => await handleClick(name)}
                  />
                </div>
                <div class="h-[calc(100vh-theme(space.72))] lg:h-[calc(100vh-theme(space.80))] overflow-scroll">
                  <ul>
                    <For each={theaters()?.data}>
                      {(theater) => <TheaterItem theater={theater} />}
                    </For>
                  </ul>
                </div>
              </div>
            </div>
          </Show>
        </Show>
      </Show>
    </Show>
  );
}
