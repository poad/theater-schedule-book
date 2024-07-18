import { JSX } from 'solid-js';
import { RiSystemCloseCircleLine } from 'solid-icons/ri';

export function ErrorAlert({
  title,
  children,
}: {
  title: string;
  children?: JSX.Element;
}) {
  return (
    <>
      <div class="mt-8 flex bg-red-600/10 text-red-500 p-4 rounded-md">
        <div class=".flex-shrink-0">
          <RiSystemCloseCircleLine
            style={{
              display: 'block',
              'vertical-align': 'middle',
              width: '24px',
              height: '24px',
              color: 'red',
            }}
          />
        </div>
        <div class="ml-3">
          <h3 class="font-medium text-sm">{title}</h3>
          <div class="pt-2 text-sm">{children}</div>
        </div>
      </div>
    </>
  );
}

export default ErrorAlert;
