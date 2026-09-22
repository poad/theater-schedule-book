import { Tooltip } from '..';

import { RiSystemCheckboxFill } from 'solid-icons/ri';

export function ViewedButton(props: { onClick: () => void }) {
  return (
    <Tooltip text="観劇した">
      <RiSystemCheckboxFill onClick={() => props.onClick()} />
    </Tooltip>
  );
}
