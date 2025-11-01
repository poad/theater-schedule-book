import { RiDesignEdit2Line, RiSystemDeleteBin2Line } from 'solid-icons/ri';
import { Show } from 'solid-js';
import { Actor } from '../../../types';

interface ActorItemProps {
  actor: Actor;
  'on:delete'?: (actor: Actor) => void;
  'on:update'?: (actor: Actor) => void;
}

export function ActorItem(props: ActorItemProps) {
  function handleDeleteClick(): void {
    props['on:delete']?.(props.actor);
  }

  function handleEditClick(): void {
    props['on:delete']?.(props.actor);
  }

  return (
    <li class="m-1 ml-3">
      <span>
        {props.actor.name}
        <Show when={props['on:delete']}>
          <RiDesignEdit2Line
            style={{ display: 'inline' }}
            on:click={() => handleEditClick()}
          />
        </Show>
        <Show when={props['on:delete']}>
          <RiSystemDeleteBin2Line
            style={{ display: 'inline' }}
            on:click={() => handleDeleteClick()}
          />
        </Show>
      </span>
    </li>
  );
}

export default ActorItem;
