import { ReactNode } from 'react';
import * as NextLink from 'next/link';
import { UrlObject } from 'url';

export function Link(props: {
  children: ReactNode;
  target?: string;
  href: string | UrlObject;
  as?: string | UrlObject;
  className?: string;
}): JSX.Element {
  const {
    children,
    target,
    href,
    as,
    className,
  } = props;
  return (
    <NextLink.default
      target={target}
      href={href}
      as={as}
      className={`${className ?? 'text-emerald-400'}`}
    >
      {children}
    </NextLink.default>
  );
}

export default Link;
