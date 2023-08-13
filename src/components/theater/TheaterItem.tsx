import { Theater } from '@/types';
import { RiEdit2Line, RiDeleteBin2Line } from 'react-icons/ri';

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
    <li key={theater.id}>
      <span>
        {theater.name}
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
