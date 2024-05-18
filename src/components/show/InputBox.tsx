'use client';

import { useState } from 'react';
import { Label, Button, Field, Select } from '@headlessui/react';
import { Theater } from '@/types';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { For, If } from '@/components/flows';
import { ErrorAlert } from '@/components/ui/alert';

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
        className="mb-4"
      />
      <Select
        onChange={(event) => handleSelectChange(event.target.value)}
        className="mb-4 w-full"
      >
        <For items={theaters}>
          {({ item }) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          )}
        </For>
      </Select>
      <div className="flex mb-4">
        <Field>
          <Label className="mr-6">
            <input
              type="checkbox"
              onChange={(event) => setCanceled(event.target.checked)}
              className="mr-3"
            />
            Canceled
          </Label>
        </Field>
        <Field>
          <Label>
            <input
              type="checkbox"
              onChange={(event) => setViewed(event.target.checked)}
            />
            Viewed
          </Label>
        </Field>
      </div>
      <Button
        key="save"
        onClick={() => void handleClick()}
        className="bg-green-500 rounded text-white text-xs px-2.5 py-2"
      >
        Save
      </Button>
      <If when={error}>
        <ErrorAlert title="Date error">{error?.message}</ErrorAlert>
      </If>
    </>
  );
}
