import { Actor } from '~/types';
import { RiEdit2Line, RiDeleteBin2Line } from 'react-icons/ri';
import { Show } from '~/components/flows';

export function ActorItem(props: {
  actor: Actor;
  onDelete?: (actor: Actor) => void;
  onUpdate?: (actor: Actor) => void;
}): JSX.Element {
  const {
    actor,
    onDelete,
    onUpdate,
  } = props;

  function handleDeleteClick(): void {
    onDelete?.(actor);
  }

  function handleEditClick(): void {
    onUpdate?.(actor);
  }

  return (
    <li key={actor.id} className="m-1 ml-3">
      <span>
        {actor.name}
        <Show when={onUpdate}>
          <RiEdit2Line
            style={{ display: 'inline' }}
            onClick={() => handleEditClick()}
          />
        </Show>
        <Show when={onDelete}>
          <RiDeleteBin2Line
            style={{ display: 'inline' }}
            onClick={() => handleDeleteClick()}
          />
        </Show>
      </span>
    </li>
  );
}

export default ActorItem;
