import { FadeLoader } from '~/components/ui/FadeLoader';
import { fetchActors } from '~/features/actors';
import { ActorItem } from '~/components/actor';
import { NameInputBox as InputBox } from '~/components/ui/NameInputBox';
import { useMutation } from '~/mutation';
import { For, Show, createResource, createSignal, useContext } from 'solid-js';
import { ErrorAlert } from '~/components/ui/alert';
import { SupabaseSessionContext } from '~/supabase';

export default function Index() {
  const session = useContext(SupabaseSessionContext);
  const [actors, { refetch }] = createResource(fetchActors);
  const { addActor } = useMutation();
  const [errorMessage, setErrorMessage] = createSignal<string>();

  async function handleClick(name: string): Promise<Error | undefined> {
    if (name.length === 0) {
      return new Error('Input to actor name');
    }

    if (actors()?.data?.find((actor) => actor.name === name)) {
      return new Error('Always exists');
    }

    const result = await addActor({
      name,
      onSuccess: () => void refetch(),
    });
    setErrorMessage(result?.error?.message);
  }

  return (
    <Show when={session}>
      <Show
        when={!actors()?.error}
        fallback={
          <ErrorAlert title="fetch error">{actors()?.error?.message}</ErrorAlert>
        }
      >
        <Show
          when={!errorMessage()}
          fallback={
            <ErrorAlert title="fetch error">{errorMessage()}</ErrorAlert>
          }
        >
          <Show
            when={actors()}
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

              <div class="w-11/12 animate-in opacity-0 px-3 py-8 text-foreground">
                <div class="mb-4 h-17">
                  <InputBox
                    label="Actor name"
                    placeholder="name of actor to add"
                    onClick={async (name: string) => await handleClick(name)}
                  />
                </div>
                <div class="h-[calc(100vh-theme(space.60))] overflow-scroll">
                  <ul>
                    <For each={actors()?.data}>
                      {(actor) => <ActorItem actor={actor} />}
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
