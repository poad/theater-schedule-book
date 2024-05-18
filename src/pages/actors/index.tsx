'use client';

import { FadeLoader } from 'react-spinners';
import { useActors } from '@/actors';
import { ActorItem } from '@/components/actor';
import { NameInputBox as InputBox } from '@/components/ui/NameInputBox';
import { useSession } from '@supabase/auth-helpers-react';
import { useMutation } from '@/mutation';
import { useState } from 'react';
import { For, If } from '@/components/flows';
import { ErrorAlert } from '@/components/ui/alert';
import { Link } from '@/components/ui/Link';

export default function Index(): JSX.Element {
  const session = useSession();
  const { actors, error, refetch } = useActors();
  const { addActor } = useMutation(session);
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleClick(name: string): Promise<Error | undefined> {
    if (name.length === 0) {
      return new Error('Input to actor name');
    }

    if (actors?.find((actor) => actor.name === name)) {
      return new Error('Always exists');
    }

    const { error } = await addActor({
      name,
      onSuccess: () => void refetch(),
    });
    setErrorMessage(error?.message);
  }

  return (
    <If when={session}>
      <If
        when={!error}
        fallback={<ErrorAlert title="fetch error">{error?.message}</ErrorAlert>}
      >
        <If
          when={!errorMessage}
          fallback={<ErrorAlert title="fetch error">{errorMessage}</ErrorAlert>}
        >
          <If
            when={actors}
            fallback={
              <div className="h-screen w-screen flex justify-center items-center">
                <FadeLoader color="#aaaaaa" radius={4} />
              </div>
            }
          >
            <div className="w-full flex flex-col items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
                  <div />
                  <div>
                    <Link href="/" target="_self">
                      Top
                    </Link>
                  </div>
                </div>
              </nav>

              <div className="w-11/12 animate-in opacity-0 px-3 py-8 text-foreground">
                <div className="mb-4 h-17">
                  <InputBox
                    label="Actor name"
                    placeholder="name of actor to add"
                    onClick={async (name: string) => await handleClick(name)}
                  />
                </div>
                <div className="h-[calc(100vh-theme(space.60))] overflow-scroll">
                  <ul>
                    <For items={actors}>
                      {({ item: actor }) => (
                        <ActorItem key={actor.id} actor={actor} />
                      )}
                    </For>
                  </ul>
                </div>
              </div>
            </div>
          </If>
        </If>
      </If>
    </If>
  );
}
