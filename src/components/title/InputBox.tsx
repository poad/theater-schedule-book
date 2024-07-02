import { useState } from 'react';
import { Input, Label, Button, Field } from '@headlessui/react';
import { Show } from '~/components/flows';

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
}): JSX.Element {
  const { labelName, placeholderName, labelUrl, placeholderUrl, onClick } =
    props;

  const [name, setName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [nameError, setNameError] = useState<string>();
  const [urlError, setUrlError] = useState<string>();
  const [yearError, setYearError] = useState<string>();

  async function handleClick() {
    const error = await onClick({ name, year, url });
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
      <Field className="mb-8">
        <Label className="name" htmlFor="name">
          <div>{labelName}</div>
        </Label>
        <div className={`
          border
          border-gray-400
          w-[calc(90vw)]
          rounded
          p-0.5
          flex
          items-center
          justify-center
        `}>
          <Input
            id="name"
            type="text"
            placeholder={placeholderName}
            key="name-input"
            pattern=".{2,}"
            className="p-1 inline w-full relative"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </div>
        <Show when={nameError}>
          <span className="text-red-500">{nameError}</span>
        </Show>
      </Field>
      <Field className="mb-8">
        <Label className="url" htmlFor="url">
          <div>{labelUrl}</div>
        </Label>
        <div className={`
          border
          border-gray-400
          w-[calc(90vw)]
          rounded
          p-0.5
          flex
          items-center
          justify-center
        `}>
          <Input
            id="url"
            type="text"
            placeholder={placeholderUrl}
            key="url-input"
            pattern=".{2,}"
            className="p-1 inline w-full relative"
            onChange={(event) => setUrl(event.target.value)}
            value={url}
          />
        </div>
        <Show when={urlError}>
          <span className="text-red-500">{urlError}</span>
        </Show>
      </Field>
      <Field className="mb-8">
        <Label className="year" htmlFor="year">
          <div>Year</div>
        </Label>
        <div className={`
          border
          border-gray-400
          w-[calc(90vw)]
          rounded
          p-0.5
          flex
          items-center
          justify-center
        `}>
          <Input
            id="year"
            type="number"
            placeholder="title begin year"
            key="url-input"
            pattern=".{4}"
            className="p-1 inline w-full relative"
            onChange={(event) => setYear(event.target.valueAsNumber)}
            min={2014}
            max={9999}
            value={year}
          />
        </div>
        <Show when={yearError}>
          <span className="text-red-500">{yearError}</span>
        </Show>
      </Field>
      <Button
        key="save"
        onClick={() => void handleClick()}
        type="submit"
        className={`
          mr-auto
          bg-green-500
          rounded
          text-white
          text-xs
          px-2.5
          py-2
          inline-block
        `}
      >
        Save
      </Button>
    </>
  );
}

export default InputBox;
