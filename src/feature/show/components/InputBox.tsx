import { Button } from 'terracotta';
import { For, Show, createSignal } from 'solid-js';
import { ErrorAlert } from '../../ui';
import { Theater } from '../../../types';

function InputBox(props: {
  theaters: Theater[];
  'on:click': (data: {
    showDate?: Date;
    canceled: boolean;
    viewed: boolean;
    theater: Theater;
  }) => Promise<Error | undefined>;
}) {
  const [date, setDate] = createSignal<Date | null>(new Date());

  const [hour, setHour] = createSignal<number>(new Date().getHours());
  const [minute, setMinute] = createSignal<number>(new Date().getMinutes());

  const [theater, setTheater] = createSignal(props.theaters[0]);
  const [canceled, setCanceled] = createSignal<boolean>(false);
  const [viewed, setViewed] = createSignal<boolean>(false);
  const [error, setError] = createSignal<Error>();

  async function handleClick() {
    const selected = date();

    const year = selected?.getFullYear();
    const month = selected?.getMonth() || 0;
    const day = selected?.getDate();

    const showDate =
      selected
        ? new Date(
          `${year}-${('00' + (month +1)).slice(-2)}-${('00' + day).slice(-2)}T${('00' + hour()).slice(-2)}:${('00' + minute()).slice(-2)}:00+09:00`,
        )
        : undefined;

    const error = await props['on:click']({
      showDate,
      canceled: canceled(),
      viewed: viewed(),
      theater: theater(),
    });
    setError(error);

    if (!error) {
      setDate(() => new Date());
      const now = new Date();
      setHour(now.getHours());
      setMinute(now.getMinutes());
    }
  }

  function handleSelectChange(id: string) {
    setTheater(props.theaters.find((it) => it.id === id) ?? props.theaters[0]);
  }

  return (
    <>
      <div class="flex mb-4">
        <div class="grow-0 pr-2">
          <input type='date'
            on:change={(event) => {
              setDate(() => event.target.valueAsDate);
            }} />
        </div>
        <div class="grow-0">
          <input
            type="number"
            min={0}
            max={23}
            placeholder="start hours"
            on:change={(event) => {
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
            on:change={(event) => {
              const value = event.target.valueAsNumber;
              setMinute(() => (value > 59 ? 59 : value));
            }}
            value={minute()}
          />
        </div>
      </div>
      <select
        on:change={(event) => handleSelectChange(event.target.value)}
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
            on:change={(event) => setCanceled(event.target.checked)}
            class="mr-3"
          />
          Canceled
        </label>
        <label>
          <input
            type="checkbox"
            on:change={(event) => setViewed(event.target.checked)}
          />
          Viewed
        </label>
      </div>
      <Button
        on:click={() => void handleClick()}
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
