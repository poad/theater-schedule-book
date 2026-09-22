import { Tooltip } from '../../../feature/ui';

import { TbOutlineCalendarCancel } from 'solid-icons/tb';

export function CancelButton(props: { onClick: () => void }) {
  return (
    <Tooltip text="中止">
      <TbOutlineCalendarCancel onClick={() => props.onClick()} />
    </Tooltip>
  );
}
