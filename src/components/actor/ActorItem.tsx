import { Actor } from '@/types';
import { RiEdit2Line, RiDeleteBin2Line } from 'react-icons/ri';

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
        {onUpdate ? (
          <RiEdit2Line
            style={{ display: 'inline' }}
            onClick={() => handleEditClick()}
          />
        ) : (
          <></>
        )}
        {onDelete ? (
          <RiDeleteBin2Line
            style={{ display: 'inline' }}
            onClick={() => handleDeleteClick()}
          />
        ) : (
          <></>
        )}
      </span>
    </li>
  );
}
