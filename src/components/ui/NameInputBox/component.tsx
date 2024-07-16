import { Button } from 'terracotta';
import { Show, createSignal } from 'solid-js';
import { reset, createForm, SubmitHandler } from '@modular-forms/solid';
type Inputs = {
  name: string;
};

export function NameInputBox(props: {
  label: string;
  placeholder: string;
  onClick: (value: string) => Promise<Error | undefined>;
}) {
  const [error, setError] = createSignal<Error>();
  const [
    form, { Form, Field },
  ] = createForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const name = data.name ?? '';
    const error = await props.onClick(name);
    if (error) {
      setError(error);
      return;
    }
    reset(form);
  };

  return (
    <Form onSubmit={onSubmit} action="">
      <div>
        <label class="name" for="name">
          <div>{props.label}</div>
        </label>
        <div class="border border-gray-400 w-[calc(90vw)] rounded p-0.5 flex items-center justify-center">
          <Field name="name" type="string">
            {(field, inputProps) => (<>
              <input
                id={field.name}
                type="text"
                {...inputProps}
                placeholder={props.placeholder}
                pattern=".{2,}"
                class="p-1 inline w-full relative"
                value={field.value ?? ''}
                required
              />
              <Show when={field.error}><div class="text-red-500">{field.error}</div></Show></>
            )}
          </Field>
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
    </Form>
  );
}

export default NameInputBox;
