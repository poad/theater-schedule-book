import { type JSX , Show } from 'solid-js';

export function ThroughableLine({
  strikethrough,
  children,
}: {
  strikethrough: boolean;
  children: JSX.Element;
}) {
  return (
    <Show when={strikethrough} fallback={<span>{children}</span>}>
      <span class="line-through">{children}</span>
    </Show>
  );
}
