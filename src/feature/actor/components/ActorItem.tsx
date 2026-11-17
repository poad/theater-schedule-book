import { Actor } from '../../../types';

import { RiDesignEdit2Line, RiSystemDeleteBin2Line } from 'solid-icons/ri';
import { Show } from 'solid-js';

interface ActorItemProps {
  actor: Actor;
  onDelete?: (actor: Actor) => void;
  onUpdate?: (actor: Actor) => void;
}

export function ActorItem(props: ActorItemProps) {
  function handleDeleteClick(): void {
    props.onDelete?.(props.actor);
  }

  function handleEditClick(): void {
    props.onUpdate?.(props.actor);
  }

  return (
    <li class="m-1 ml-3">
      <span>
        {props.actor.name}
        <Show when={props.onDelete}>
          <span onClick={() => handleEditClick()} style={{ display: 'inline', cursor: 'pointer' }}>
            <RiDesignEdit2Line style={{ display: 'inline' }} />
          </span>
        </Show>
        <Show when={props.onDelete}>
          <span
            onClick={() => handleDeleteClick()}
            style={{ display: 'inline', cursor: 'pointer' }}
          >
            <RiSystemDeleteBin2Line style={{ display: 'inline' }} />
          </span>
        </Show>
      </span>
    </li>
  );
}

export default ActorItem;
