import { useMemo } from 'react';

export function Show<T>(props: {
  when: T | undefined | null | false;
  fallback?: JSX.Element;
  children: JSX.Element;
}): JSX.Element {
  const { when, fallback, children } = props;
  return useMemo(() => {
    if (when) {
      return children;
    }
    return fallback ?? <></>;
  }, [when, children, fallback]);
}
