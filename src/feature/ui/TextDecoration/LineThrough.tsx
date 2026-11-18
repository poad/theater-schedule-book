import type { JSX } from '@solidjs/web';
import { Show } from 'solid-js';

export function ThroughableLine(props: { strikethrough: boolean; children: JSX.Element }) {
  return (
    <Show when={props.strikethrough} fallback={<span>{props.children}</span>}>
      <span class="line-through">{props.children}</span>
    </Show>
  );
}

export default ThroughableLine;
