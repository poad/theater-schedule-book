'use client';

import { FadeLoader } from 'react-spinners';
import { Typography } from '@supabase/ui';
import { useTheaters } from './theaters';
import { TheaterItem } from '@/components/theater';
import { InputBox } from '@/components/theater/InputBox';

export default function Index(): JSX.Element {
  const { theaters, add } = useTheaters();

  async function handleClick(name: string): Promise<Error | undefined> {
    if (name.length === 0) {
      return new Error('Input to theater name');
    }

    if (theaters?.find((theater) => theater.name === name)) {
      return new Error('Always exists');
    }

    await add(name);
  }

  if (!theaters) {
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

      <div className="w-1/2 animate-in gap-14 opacity-0 px-3 py-16 lg:py-24 text-foreground">
        <div className="mb-8">
          <ul>
            {theaters?.map((theater) => (
              <TheaterItem key={theater.id} theater={theater} />
            ))}
          </ul>
        </div>
        <div>
          <InputBox
            label="Teater name"
            placeholder="name of theater to add"
            onClick={async (name: string) => await handleClick(name)}
          />
        </div>
      </div>
    </div>
  );
}
