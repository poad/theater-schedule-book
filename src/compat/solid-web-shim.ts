// Compatibility shim for @solidjs/web v2 exports.
// Provides the v1 directive helper used by packages compiled with the v1 JSX runtime.
export * from '@solidjs/web';

import { untrack } from 'solid-js';

export function use<T, E, A>(fn: (element: E, arg?: A) => T, element: E, arg?: A): T {
  return untrack(() => fn(element, arg));
}
