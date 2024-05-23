import { Button } from 'terracotta';
import { Theater } from '~/types';
import { PickerValue } from '@rnwonder/solid-date-picker';
import { clientOnly } from '@solidjs/start';
const DatePicker = clientOnly(() => import('@rnwonder/solid-date-picker'));
import '@rnwonder/solid-date-picker/themes/ark-ui';
import { ErrorAlert } from '~/components/ui/alert';
import { For, Show, createSignal } from 'solid-js';
import utils from '@rnwonder/solid-date-picker/utilities';

function InputBox(props: {
  theaters: Theater[];
  onClick: (data: {
    showDate?: Date;
    canceled: boolean;
    viewed: boolean;
    theater: Theater;
  }) => Promise<Error | undefined>;
}) {
  const [date, setDate] = createSignal<PickerValue>({
    value: {
      selectedDateObject: utils().getToday(),
    },
    label: 'Show date',
  });

  const [hour, setHour] = createSignal<number>(new Date().getHours());
  const [minute, setMinute] = createSignal<number>(new Date().getMinutes());

  const [theater, setTheater] = createSignal(props.theaters[0]);
  const [canceled, setCanceled] = createSignal<boolean>(false);
  const [viewed, setViewed] = createSignal<boolean>(false);
  const [error, setError] = createSignal<Error>();

  async function handleClick() {
    const selected = date().value.selectedDateObject;
    const year = selected?.year;
    const month = selected?.month;
    const day = selected?.day;
    const showDate =
      year && month && day
        ? new Date(
          `${('0000' + year).slice(-4)}-${('00' + month).slice(-2)}-${('00' + day).slice(-2)}T${('00' + hour()).slice(-2)}:${('00' + minute()).slice(-2)}:00+09:00`,
        )
        : undefined;

    const error = await props.onClick({
      showDate,
      canceled: canceled(),
      viewed: viewed(),
      theater: theater(),
    });
    setError(error);

    if (!error) {
      setDate(() => ({
        value: { selectedDateObject: utils().getToday() },
        label: 'Show date',
      }));
      const now = new Date();
      setHour(now.getHours());
      setMinute(now.getMinutes());
    }
  }

  function handleSelectChange(id: string) {
    setTheater(props.theaters.find((it) => it.id === id) ?? props.theaters[0]);
  }

  const minimumDate = {
    year: 2016,
    month: 4,
    day: 10,
  };

  const maximumDate = {
    year: 9999,
    month: 12,
    day: 31,
  };

  return (
    <>
      <div class="flex mb-4">
        <div class="grow-0">
          <DatePicker
            value={date}
            setValue={setDate}
            minDate={minimumDate}
            maxDate={maximumDate}
            inputWrapperWidth={'fit-content'}
          />
        </div>
        <div class="grow-0">
          <input
            type="number"
            min={0}
            max={23}
            placeholder="start hours"
            onChange={(event) => {
              const value = event.target.valueAsNumber;
              setHour(() => (value > 23 ? 23 : value));
            }}
            value={hour()}
          />
          <input
            type="number"
            min={0}
            max={59}
            placeholder="start minute"
            onChange={(event) => {
              const value = event.target.valueAsNumber;
              setMinute(() => (value > 59 ? 59 : value));
            }}
            value={minute()}
          />
        </div>
      </div>
      <select
        onChange={(event) => handleSelectChange(event.target.value)}
        class="mb-4 w-full"
      >
        <For each={props.theaters}>
          {(item) => <option value={item.id}>{item.name}</option>}
        </For>
      </select>
      <div class="flex mb-4">
        <label class="mr-6">
          <input
            type="checkbox"
            onChange={(event) => setCanceled(event.target.checked)}
            class="mr-3"
          />
          Canceled
        </label>
        <label>
          <input
            type="checkbox"
            onChange={(event) => setViewed(event.target.checked)}
          />
          Viewed
        </label>
      </div>
      <Button
        onClick={() => void handleClick()}
        class="bg-green-500 rounded text-white text-xs px-2.5 py-2"
      >
        Save
      </Button>
      <Show when={error()}>
        <ErrorAlert title="Date error">{error()?.message}</ErrorAlert>
      </Show>
    </>
  );
}

export default InputBox;
