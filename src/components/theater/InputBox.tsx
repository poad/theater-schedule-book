'use client';
import { useState } from 'react';
import { Input, Button } from '@supabase/ui';

export function InputBox({
  onClick,
}: {
  onClick: (value: string) => Promise<Error | undefined>;
}): JSX.Element {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>();

  async function handleClick() {
    const error = await onClick(name);
    if (error) {
      setError(error.name);
      return;
    }

    setName('');
  }

  return (
    <Input
      label="Teater name"
      placeholder="name of theater to add"
      key="name-input"
      onChange={(event) => setName(event.target.value)}
      value={name}
      error={error}
      actions={[
        <Button key="save" onClick={() => void handleClick()}>
          Save
        </Button>,
      ]}
    />
  );
}
