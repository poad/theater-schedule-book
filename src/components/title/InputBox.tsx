'use client';

import { useState } from 'react';
import { Input, InputNumber, Button } from '@supabase/ui';

export function InputBox({
  labelName,
  placeholderName,
  labelUrl,
  placeholderUrl,
  onClick,
}: {
  labelName: string;
  placeholderName: string;
  labelUrl: string;
  placeholderUrl: string;
  onClick: (data: {
    name: string;
    year: number;
    url?: string;
  }) => Promise<{ name?: Error; url?: Error } | undefined>;
}): JSX.Element {
  const [name, setName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [nameError, setNameError] = useState<string>();
  const [urlError, setUrlError] = useState<string>();

  async function handleClick() {
    const error = await onClick({ name, year, url });
    if (error?.name || error?.url) {
      setNameError(error?.name?.message);
      setUrlError(error?.url?.message);
      return;
    }

    setName('');
    setUrl('');
  }

  return (
    <>
      <Input
        label={labelName}
        placeholder={placeholderName}
        key="name-input"
        onChange={(event) => setName(event.target.value)}
        value={name}
        error={nameError}
        className="mb-8"
      />
      <Input
        label={labelUrl}
        placeholder={placeholderUrl}
        key="url-input"
        onChange={(event) => setUrl(event.target.value)}
        value={url}
        error={urlError}
        className="mb-8"
      />
      <InputNumber
        label="Year"
        placeholder="title begin year"
        key="year-input"
        onChange={(event) => setYear(event.target.valueAsNumber)}
        value={year}
        min={2016}
        max={9999}
        className="mb-8"
      />
      <Button key="save" onClick={() => void handleClick()} placeholder={''}>
        Save
      </Button>
    </>
  );
}
