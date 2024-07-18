import { RiDesignEdit2Line, RiSystemDeleteBin2Line } from 'solid-icons/ri';
import { Show } from 'solid-js';
import { Actor } from '../../../types';

export function ActorItem(props: {
  actor: Actor;
  onDelete?: (actor: Actor) => void;
  onUpdate?: (actor: Actor) => void;
}) {
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
        <Show when={props.onUpdate}>
          <RiDesignEdit2Line
            style={{ display: 'inline' }}
            onClick={() => handleEditClick()}
          />
        </Show>
        <Show when={props.onDelete}>
          <RiSystemDeleteBin2Line
            style={{ display: 'inline' }}
            onClick={() => handleDeleteClick()}
          />
        </Show>
      </span>
    </li>
  );
}

export default ActorItem;
