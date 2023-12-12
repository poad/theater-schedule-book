'use client';

import { useState } from 'react';
import { Alert, Button, Select, Checkbox } from '@supabase/ui';
import { Theater } from '@/types';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { For, If } from '../flows';

export function InputBox({
  theaters,
  onClick,
}: {
  theaters: Theater[];
  onClick: (data: {
    showDate?: Date;
    canceled: boolean;
    viewed: boolean;
    theater: Theater;
  }) => Promise<Error | undefined>;
}): JSX.Element {
  const [value, onChange] = useState<Date | null>();
  const [theater, setTheater] = useState(theaters[0]);
  const [canceled, setCanceled] = useState<boolean>(false);
  const [viewed, setViewed] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  async function handleClick() {
    const error = await onClick({
      showDate: value ? new Date(value.toLocaleString()) : undefined,
      canceled,
      viewed,
      theater,
    });
    setError(error);

    if (!error) {
      onChange(null);
    }
  }

  function handleValueChange(value: Date | null) {
    onChange(value);
  }

  function handleSelectChange(id: string) {
    setTheater(theaters.find((it) => it.id === id) ?? theaters[0]);
  }

  return (
    <>
      <DateTimePicker
        onChange={handleValueChange}
        value={value}
        minDate={new Date('2016/01/01 00:00:00.000+09:00')}
        maxDate={new Date('9999/12/23 00:00:00.000+09:00')}
        locale="ja-JP"
        calendarType="hebrew"
        className="mb-4"
      />
      <Select
        label=""
        onChange={(event) => handleSelectChange(event.target.value)}
        className="mb-4"
      >
        <For items={theaters}>
          {({ item }) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          )}
        </For>
      </Select>
      <div className="flex mb-4">
        <Checkbox
          label="Canceled"
          onChange={(event) => setCanceled(event.target.checked)}
          className="mr-8"
        />
        <Checkbox
          label="Viewed"
          onChange={(event) => setViewed(event.target.checked)}
        />
      </div>
      <Button key="save" onClick={() => void handleClick()} placeholder={''}>
        Save
      </Button>
      <If when={error}>
        <Alert title="Date error" variant="danger" withIcon className="mt-8">
          {error?.message}
        </Alert>
      </If>
    </>
  );
}
