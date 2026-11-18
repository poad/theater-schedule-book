import { Theater } from '../../../types';

import { RiDesignEdit2Line, RiSystemDeleteBin2Line } from 'solid-icons/ri';
import { Show } from 'solid-js';

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

export default TheaterItem;
