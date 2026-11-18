// Compatibility shim for solid-js v1.x exports removed in v2.
// Adapts v1 signal writes and exports for third-party dependencies that still use v1 semantics.
export * from 'solid-js';

import {
  createEffect as createEffectSolid,
  createSignal as createSignalSolid,
  createTrackedEffect as createTrackedEffectSolid,
  untrack,
} from 'solid-js';
import type { SignalOptions } from 'solid-js';

export { merge as mergeProps } from 'solid-js';
export { onSettled as onMount } from 'solid-js';

export function createSignal<T>(value: T, options?: SignalOptions<T>) {
  // Solid 2's overload excludes function values; this shim preserves the v1 value signature.
  return createSignalSolid<T>(value as never, { ...options, ownedWrite: true });
}

export function splitProps<T extends object>(props: T, ...groups: (keyof T)[][]): Partial<T>[] {
  const claimed = new Set<keyof T>();
  const picked = groups.map((group) => {
    const result: Partial<T> = {};
    for (const key of group) {
      claimed.add(key);
      Object.defineProperty(result, key, {
        configurable: true,
        enumerable: true,
        get: () => props[key],
      });
    }
    return result;
  });

  const rest: Partial<T> = {};
  for (const key of Reflect.ownKeys(props) as (keyof T)[]) {
    if (!claimed.has(key)) {
      Object.defineProperty(rest, key, {
        configurable: true,
        enumerable: true,
        get: () => props[key],
      });
    }
  }

  return [...picked, rest];
}

// v1's `batch()` wrapped multiple writes to avoid intermediate renders.
// In v2 all writes are batched by default, so this is a no-op passthrough.
export function batch(fn: () => void) {
  fn();
}

// v1's `on()` isolates callback reads from dependency tracking.
export function on<T>(
  fn: () => T,
  callback: (value: T, prev: T | undefined) => unknown,
  options?: { defer?: boolean },
) {
  let firstRun = true;
  let previous: T | undefined;

  return () => {
    const value = fn();
    if (firstRun && options?.defer) {
      firstRun = false;
      previous = value;
      return;
    }

    firstRun = false;
    untrack(() => callback(value, previous));
    previous = value;
  };
}

// v1's single-argument effect is retained in v2 as createTrackedEffect.
export function createEffect(compute: () => unknown, effect?: (value: unknown) => void) {
  if (effect === undefined) {
    return createTrackedEffectSolid(() => {
      compute();
    }) as never;
  }
  return createEffectSolid(compute, effect as never) as never;
}
