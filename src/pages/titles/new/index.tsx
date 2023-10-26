'use client';

import { FadeLoader } from 'react-spinners';
import { Alert, Typography } from '@supabase/ui';
import { useTitles } from '@/titles';
import { InputBox } from '@/components/title';
import { useSession } from '@supabase/auth-helpers-react';
import { useMutation } from '@/mutation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function Main() {
  const session = useSession();
  const { titles, error } = useTitles(session);
  const { addTitle } = useMutation(session);
  const [errorMessage, setErrorMessage] = useState<string>();
  const router = useRouter();

  async function handleClick({
    name,
    year,
    url,
  }: {
    name: string;
    year: number;
    url?: string;
  }): Promise<{ name?: Error; url?: Error } | undefined> {
    if (name.length === 0) {
      return { name: new Error('Input to title name') };
    }

    if (titles?.find((title) => title.name === name && title.year === year)) {
      return { name: new Error('Always exists') };
    }

    const { error } = await addTitle({
      name,
      year,
      url,
      onSuccess: () => void router.push('/'),
    });
    if (error) {
      setErrorMessage(error.message);
    }
  }

  if (!titles) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <FadeLoader color="#aaaaaa" radius={4} />
      </div>
    );
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

  return (
    <div className="w-11/12 animate-in gap-14 opacity-0 px-3 py-16 lg:py-24 text-foreground">
      <div>
        <InputBox
          labelName="Title name"
          placeholderName="name of title to add"
          labelUrl="Title URL"
          placeholderUrl="URL of title to add"
          onClick={async (data: { name: string; year: number; url?: string }) =>
            await handleClick(data)
          }
        />
      </div>
    </div>
  );
}

export default function Index(): JSX.Element {
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

      <Main />
    </div>
  );
}
