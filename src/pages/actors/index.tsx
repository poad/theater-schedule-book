import { fetchActors, ActorItem } from '../../feature/actor';
import { useMutation } from '../../feature/mutations';
import { SupabaseSessionContext } from '../../feature/supabase';
import { FadeLoader, NameInputBox as InputBox, ErrorAlert } from '../../feature/ui';
import { Actor } from '../../types';

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
  const actors = createMemo(() => fetchActors());
  const { addActor } = useMutation();
  const [errorMessage, setErrorMessage] = createSignal<string>();

  async function handleClick(name: string): Promise<Error | undefined> {
    if (name.length === 0) {
      return new Error('Input to actor name');
    }

    if (
      (actors() as unknown as { data: Actor[] })?.data?.find((actor: Actor) => actor.name === name)
    ) {
      return new Error('Always exists');
    }

    const result = await addActor({
      name,
      onSuccess: () => void refresh(actors),
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
              when={!actors()?.error}
              fallback={<ErrorAlert title="fetch error">{actors()?.error?.message}</ErrorAlert>}
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
                      onClick={(name: string) => handleClick(name)}
                    />
                  </div>
                  <div class="h-[calc(100vh-theme(space.60))] overflow-scroll">
                    <ul>
                      <For each={(actors() as unknown as { data: Actor[] })?.data}>
                        {(actor: Actor) => <ActorItem actor={actor} />}
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
