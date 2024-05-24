import { Theater } from '~/types';
import { RiEdit2Line, RiDeleteBin2Line } from 'react-icons/ri';
import { Show } from '~/components/flows';

export function TheaterItem(props: {
  theater: Theater;
  onDelete?: (theater: Theater) => void;
  onUpdate?: (theater: Theater) => void;
}): JSX.Element {
  const {
    theater,
    onDelete,
    onUpdate,
  } = props;

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

export default TheaterItem;
