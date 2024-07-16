import { Show, createSignal } from 'solid-js';
import { Button } from 'terracotta';

export function InputBox(props: {
  labelName: string;
  placeholderName: string;
  labelUrl: string;
  placeholderUrl: string;
  onClick: (data: {
    name: string;
    year?: number;
    url?: string;
  }) => Promise<{ name?: Error; url?: Error; year?: Error } | undefined>;
}) {
  const [name, setName] = createSignal<string>('');
  const [url, setUrl] = createSignal<string>('');
  const [year, setYear] = createSignal<number>(new Date().getFullYear());
  const [nameError, setNameError] = createSignal<string>();
  const [urlError, setUrlError] = createSignal<string>();
  const [yearError, setYearError] = createSignal<string>();

  async function handleClick() {
    const error = await props.onClick({ name: name(), year: year(), url: url() });
    if (error?.name || error?.url || error?.year) {
      setNameError(error?.name?.message);
      setUrlError(error?.url?.message);
      setYearError(error?.year?.message);
      return;
    }

    setName('');
    setUrl('');
  }

  return (
    <>
      <div class="mb-8">
        <label class="name" for="name">
          <div>{props.labelName}</div>
        </label>
        <div class="border border-gray-400 w-[calc(90vw)] rounded p-0.5 flex items-center justify-center">
          <input
            id="name"
            type="text"
            placeholder={props.placeholderName}
            pattern=".{2,}"
            class="p-1 inline w-full relative"
            onChange={(event) => setName(event.target.value)}
            value={name()}
          />
        </div>
        <Show when={nameError()}>
          <span class="text-red-500">{nameError()}</span>
        </Show>
      </div>
      <div class="mb-8">
        <label class="url" for="url">
          <div>{props.labelUrl}</div>
        </label>
        <div class="border border-gray-400 w-[calc(90vw)] rounded p-0.5 flex items-center justify-center">
          <input
            id="url"
            type="text"
            placeholder={props.placeholderUrl}
            pattern=".{2,}"
            class="p-1 inline w-full relative"
            onChange={(event) => setUrl(event.target.value)}
            value={url()}
          />
        </div>
        <Show when={urlError}>
          <span class="text-red-500">{urlError()}</span>
        </Show>
      </div>
      <div class="mb-8">
        <label class="year" for="year">
          <div>Year</div>
        </label>
        <div class="border border-gray-400 w-[calc(90vw)] rounded p-0.5 flex items-center justify-center">
          <input
            id="year"
            type="number"
            placeholder="title begin year"
            pattern=".{4}"
            class="p-1 inline w-full relative"
            onChange={(event) => setYear(event.target.valueAsNumber)}
            min={2014}
            max={9999}
            value={year()}
          />
        </div>
        <Show when={yearError}>
          <span class="text-red-500">{yearError()}</span>
        </Show>
      </div>
      <Button
        onClick={() => void handleClick()}
        type="submit"
        class="mr-auto bg-green-500 rounded text-white text-xs px-2.5 py-2 inline-block"
      >
        Save
      </Button>
    </>
  );
}

export default InputBox;
