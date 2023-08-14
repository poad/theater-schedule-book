'use client';

import { useState } from 'react';
import { Alert, Button, Select } from '@supabase/ui';
import { Theater } from '@/types';
// import DatetimePicker from 'react-tailwind-datetime-picker';
// import { PublicDateRange } from 'react-tailwind-datetime-picker/dist/types';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

export function InputBox({
  theaters,
  onClick,
}: {
  theaters: Theater[];
  onClick: (data: {
    showDate?: Date;
    theater: Theater;
  }) => Promise<Error | undefined>;
}): JSX.Element {
  const [value, onChange] = useState<Date | null>();
  const [theater, setTheater] = useState(theaters[0]);
  const [error, setError] = useState<Error>();

  async function handleClick() {
    const error = await onClick({
      showDate: value ? new Date(value.toLocaleString()) : undefined,
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
        {theaters.map((it) => (
          <Select.Option key={it.id} value={it.id}>
            {it.name}
          </Select.Option>
        ))}
      </Select>
      <Button key="save" onClick={() => void handleClick()}>
        Save
      </Button>
      {error ? (
        <Alert title="Date error" variant="danger" withIcon className="mt-8">
          {error.message}
        </Alert>
      ) : (
        <></>
      )}
    </>
  );
}
