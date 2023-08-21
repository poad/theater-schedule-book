'use client';

import { FadeLoader } from 'react-spinners';
import { Alert, Typography } from '@supabase/ui';
import { useActors } from '@/actors';
import { ActorItem } from '@/components/actor';
import { InputBox } from '@/components/actor/InputBox';
import { useSession } from '@supabase/auth-helpers-react';
import { useMutation } from '@/mutation';
import { useState } from 'react';

export default function Index(): JSX.Element {
  const session = useSession();
  const { actors, error, refetch } = useActors(session);
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

  if (error) {
    return (
      <Alert variant="danger" title="fetch error">
        {error.message}
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

  if (!actors) {
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
          <div />
          <div>
            <Typography.Link href="/" target="_self">
              Top
            </Typography.Link>
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
            {actors?.map((actor) => <ActorItem key={actor.id} actor={actor} />)}
          </ul>
        </div>
      </div>
    </div>
  );
}
