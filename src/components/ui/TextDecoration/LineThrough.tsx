import { If } from '@/components/flows';
import { ReactNode } from 'react';

export function ThroughableLine({
  strikethrough,
  children,
}: {
  strikethrough: boolean;
  children: ReactNode;
}): JSX.Element {
  return (
    <If when={strikethrough} fallback={<span>{children}</span>}>
      <span className="line-through">{children}</span>
    </If>
  );
}
