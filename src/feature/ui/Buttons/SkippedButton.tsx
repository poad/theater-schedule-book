import { Tooltip } from '..';

import { ImEyeBlocked } from 'solid-icons/im';

export function SkippedButton(props: { onClick: () => void }) {
  return (
    <Tooltip text="上演したが行けなかった">
      <span onClick={() => props.onClick()} style={{ cursor: 'pointer' }}>
        <ImEyeBlocked />
      </span>
    </Tooltip>
  );
}
