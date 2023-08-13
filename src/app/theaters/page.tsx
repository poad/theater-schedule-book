'use client';

import { TheaterItem } from '@/components/theater/TheaterItem';
import { useTheaters } from './theaters';
import { InputBox } from '@/components/theater/InputBox';
import { FadeLoader } from 'react-spinners';
import { Typography } from '@supabase/ui';

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
    <div className="w-screen items-center p-4">
      <div className="mb-2">
        <ul>
          {theaters?.map((theater) => (
            <TheaterItem key={theater.id} theater={theater} />
          ))}
        </ul>
      </div>
      <div className="mb-2">
        <InputBox onClick={async (name: string) => await handleClick(name)} />
      </div>
      <Typography.Link href="/" target="_self">
        Top
      </Typography.Link>
    </div>
  );
}
