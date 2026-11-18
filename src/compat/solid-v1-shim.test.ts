import { createEffect, createSignal as createLegacySignal, on, splitProps } from './solid-v1-shim';
import { use } from './solid-web-shim';

import {
  createEffect as createSolidEffect,
  createMemo,
  createRoot,
  createSignal,
  flush,
  getOwner,
  runWithOwner,
} from 'solid-js';
import { describe, expect, it } from 'vitest';

describe('Solid v1 effect compatibility', () => {
  it('runs on() callbacks in the tracked effect and preserves previous values', () => {
    const values: [number, number | undefined][] = [];

    const [setCount, dispose] = createRoot((dispose) => {
      const [count, setCount] = createSignal(0);

      createEffect(
        on(count, (value, previous) => {
          values.push([value, previous]);
          return value;
        }),
      );
      flush();
      return [setCount, dispose] as const;
    });

    setCount(1);
    flush();
    dispose();

    expect(values).toEqual([
      [0, undefined],
      [1, 0],
    ]);
  });

  it('honors on() defer on its first run', () => {
    const values: number[] = [];

    const [setCount, dispose] = createRoot((dispose) => {
      const [count, setCount] = createSignal(0);

      createEffect(
        on(
          count,
          (value) => {
            values.push(value);
          },
          { defer: true },
        ),
      );
      flush();
      return [setCount, dispose] as const;
    });

    setCount(1);
    flush();
    dispose();

    expect(values).toEqual([1]);
  });

  it('does not treat a v1 effect return value as a cleanup', () => {
    const dispose = createRoot((dispose) => {
      createEffect(() => 'legacy previous value');
      return dispose;
    });

    dispose();
  });
});

describe('Solid v1 splitProps compatibility', () => {
  it('returns each requested group followed by the remaining props', () => {
    const props = {
      of: 'form',
      keepResponse: true,
      shouldActive: false,
      name: 'theater',
    };

    const [local, options, other] = splitProps(props, ['of'], ['keepResponse', 'shouldActive']);

    expect(local?.of).toBe('form');
    expect(options?.keepResponse).toBe(true);
    expect(options?.shouldActive).toBe(false);
    expect(other?.name).toBe('theater');
  });
});

describe('Solid v1 signal compatibility', () => {
  it('allows legacy signal writes while registering state in a computation', () => {
    const [value, dispose] = createRoot((dispose) => {
      const [read, write] = createLegacySignal(0);

      const computed = createMemo(() => {
        if (read() === 0) write(1);
        return read();
      });
      const observed: number[] = [];
      createEffect(() => observed.push(computed()));
      flush();

      return [observed, dispose] as const;
    });

    expect(value).toEqual([1]);
    dispose();
  });

  it('creates a legacy ref effect under an owner distinct from its render effect', () => {
    const [values, dispose] = createRoot((dispose) => {
      const refOwner = createRoot(() => getOwner());
      if (!refOwner) throw new Error('Test ref root has no owner');
      const observed: string[] = [];
      createSolidEffect(
        () => undefined,
        () => {
          runWithOwner(refOwner, () => createEffect(() => observed.push('input')));
        },
      );
      flush();
      return [observed, dispose] as const;
    });

    expect(values).toEqual(['input']);
    dispose();
  });
});

describe('Solid v1 web compatibility', () => {
  it('invokes the v1 use helper with the element and optional argument', () => {
    const element = {};
    const argument = 'form';
    const result = use(
      (receivedElement, receivedArgument) => [receivedElement, receivedArgument],
      element,
      argument,
    );

    expect(result).toEqual([element, argument]);
  });
});
