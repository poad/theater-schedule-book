import { Actor } from '@/types';
import { RiEdit2Line, RiDeleteBin2Line } from 'react-icons/ri';
import { If } from '@/components/flows';

export function ActorItem({
  actor,
  onDelete,
  onUpdate,
}: {
  actor: Actor;
  onDelete?: (actor: Actor) => void;
  onUpdate?: (actor: Actor) => void;
}): JSX.Element {
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
        <If when={onUpdate}>
          <RiEdit2Line
            style={{ display: 'inline' }}
            onClick={() => handleEditClick()}
          />
        </If>
        <If when={onDelete}>
          <RiDeleteBin2Line
            style={{ display: 'inline' }}
            onClick={() => handleDeleteClick()}
          />
        </If>
      </span>
    </li>
  );
}
