'use client';

import { useState } from 'react';
import { Input, Label, Button, Field } from '@headlessui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { If } from '@/components/flows';

type Inputs = {
  name: string;
};

export function NameInputBox({
  label,
  placeholder,
  onClick,
}: {
  label: string;
  placeholder: string;
  onClick: (value: string) => Promise<Error | undefined>;
}): JSX.Element {
  const [error, setError] = useState<Error>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const name = data.name ?? '';
    const error = await onClick(name);
    if (error) {
      setError(error);
      return;
    }
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} action="">
      <Field>
        <Label className="name" htmlFor="name">
          <div>{label}</div>
        </Label>
        <div className="border border-gray-400 w-[calc(90vw)] rounded p-0.5 flex items-center justify-center">
          <Input
            id="name"
            type="text"
            placeholder={placeholder}
            key="name-input"
            pattern=".{2,}"
            className="p-1 inline w-full relative"
            {...register('name', { required: true })}
          />
          <Button
            type="submit"
            className="mr-auto bg-green-500 rounded text-white text-xs px-2.5 py-2 inline-block"
          >
            Save
          </Button>
        </div>
        <If when={errors.name}>
          <span className="text-red-500">
            {errors.name?.message ?? '名前を入力してください。'}
          </span>
        </If>
        <If when={error}>
          <span className="text-red-500">{error?.message}</span>
        </If>
      </Field>
    </form>
  );
}
