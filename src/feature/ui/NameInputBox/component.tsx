import { Show, createSignal } from 'solid-js';
import { Button } from 'terracotta';

export function NameInputBox(props: {
  label: string;
  placeholder: string;
  onClick: (value: string) => Promise<Error | undefined>;
}) {
  const [error, setError] = createSignal<Error>();
  const [name, setName] = createSignal('');

  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const result = await props.onClick(name());
    if (result) {
      setError(result);
      return;
    }
    setName('');
  }

  return (
    <form onSubmit={onSubmit} action="">
      <div>
        <label class="name" for="name">
          <div>{props.label}</div>
        </label>
        <div class="border border-gray-400 w-[calc(90vw)] rounded p-0.5 flex items-center justify-center">
          <input
            id="name"
            name="name"
            type="text"
            placeholder={props.placeholder}
            pattern=".{2,}"
            class="p-1 inline w-full relative"
            value={name()}
            onInput={(event) => setName(event.currentTarget.value)}
            required
          />
          <Button
            type="submit"
            class="mr-auto bg-green-500 rounded text-white text-xs px-2.5 py-2 inline-block"
          >
            Save
          </Button>
        </div>
        <Show when={error()}>
          <span class="text-red-500">{error()?.message}</span>
        </Show>
      </div>
    </form>
  );
}

export default NameInputBox;
