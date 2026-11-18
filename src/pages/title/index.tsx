import { useMutation } from '../../feature/mutations';
import { SupabaseSessionContext } from '../../feature/supabase';
import { fetchTitles, InputBox } from '../../feature/title';
import { FadeLoader, ErrorAlert } from '../../feature/ui';
import { Title } from '../../types';

import { useNavigate } from '@solidjs/router';
import { Show, createMemo, createSignal, useContext, Loading, Errored } from 'solid-js';

function Main() {
  const session = useContext(SupabaseSessionContext);

  const titles = createMemo(() => fetchTitles());
  const { addTitle } = useMutation();
  const [errorMessage, setErrorMessage] = createSignal<string>();
  const navigate = useNavigate();

  async function handleClick({
    name,
    year,
    url,
  }: {
    name: string;
    year?: number;
    url?: string;
  }): Promise<{ name?: Error; url?: Error; year?: Error } | undefined> {
    if (name.length === 0) {
      return { name: new Error('Input to title name') };
    }

    if (!year) {
      return { year: new Error('Input to title year') };
    }

    if (
      (titles() as unknown as { data: Title[] })?.data?.find(
        (title: Title) => title.name === name && title.year === year,
      )
    ) {
      return { name: new Error('Always exists') };
    }

    const result = await addTitle({
      name,
      year,
      url,
      onSuccess: () => void navigate('/', { replace: true }),
    });
    if (result?.error) {
      setErrorMessage(result?.error.message);
    }
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
              when={!titles()?.error}
              fallback={<ErrorAlert title="fetch error">{titles()?.error?.message}</ErrorAlert>}
            >
              <div class="w-11/12 animate-in gap-14 opacity-0 px-3 py-16 lg:py-24 text-foreground">
                <div>
                  <InputBox
                    labelName="Title name"
                    placeholderName="name of title to add"
                    labelUrl="Title URL"
                    placeholderUrl="URL of title to add"
                    onClick={(data: { name: string; year?: number; url?: string }) =>
                      handleClick(data)
                    }
                  />
                </div>
              </div>
            </Show>
          </Loading>
        </Show>
      </Errored>
    </Show>
  );
}

export default function Index() {
  return (
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

      <Main />
    </div>
  );
}
