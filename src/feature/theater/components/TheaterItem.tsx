import { RiDesignEdit2Line, RiSystemDeleteBin2Line } from 'solid-icons/ri';
import { Show } from 'solid-js';
import { Theater } from '../../../types';

export function TheaterItem(props: {
  theater: Theater;
  onDelete?: (theater: Theater) => void;
  onUpdate?: (theater: Theater) => void;
}) {
  function handleDeleteClick(): void {
    props.onDelete?.(props.theater);
  }

  function handleEditClick(): void {
    props.onUpdate?.(props.theater);
  }

  return (
    <li class="m-1 ml-3">
      <span>
        {props.theater.name}
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

export default TheaterItem;
