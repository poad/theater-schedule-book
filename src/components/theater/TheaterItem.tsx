import { Theater } from '@/types';
import { RiEdit2Line, RiDeleteBin2Line } from 'react-icons/ri';
import { If } from '../flows';

export function TheaterItem({
  theater,
  onDelete,
  onUpdate,
}: {
  theater: Theater;
  onDelete?: (theater: Theater) => void;
  onUpdate?: (theater: Theater) => void;
}): JSX.Element {
  function handleDeleteClick(): void {
    onDelete?.(theater);
  }

  function handleEditClick(): void {
    onUpdate?.(theater);
  }

  return (
    <li key={theater.id} className="m-1 ml-3">
      <span>
        {theater.name}
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
