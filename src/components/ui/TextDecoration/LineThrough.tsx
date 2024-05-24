import { Show } from '~/components/flows';
import { ReactNode } from 'react';

export function ThroughableLine(props: {
  strikethrough: boolean;
  children: ReactNode;
}): JSX.Element {
  const { strikethrough, children } = props;
  return (
    <Show when={strikethrough} fallback={<span>{children}</span>}>
      <span className="line-through">{children}</span>
    </Show>
  );
}

export default ThroughableLine;
