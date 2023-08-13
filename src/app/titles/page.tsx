'use client';

import { FadeLoader } from 'react-spinners';
import { Typography } from '@supabase/ui';
import { useTitles } from './titles';
import { InputBox } from '@/components/title';

export default function Index(): JSX.Element {
  const { titles, add } = useTitles();

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

    if (titles?.find((title) => title.name === name)) {
      return { name: new Error('Always exists') };
    }

    await add(name, year, url);
  }

  if (!titles) {
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
        <div>
          <InputBox
            labelName="Title name"
            placeholderName="name of title to add"
            labelUrl="Title URL"
            placeholderUrl="URL of title to add"
            onClick={async (data: {
              name: string;
              year: number;
              url?: string;
            }) => await handleClick(data)}
          />
        </div>
      </div>
    </div>
  );
}
