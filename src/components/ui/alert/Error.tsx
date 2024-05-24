import { ReactNode } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

export function ErrorAlert(props: { title: string; children?: ReactNode }) {
  const { title, children } = props;
  return (
    <>
      <div className="mt-8 flex bg-red-600/10 text-red-500 p-4 rounded-md">
        <div className=".flex-shrink-0">
          <RiCloseCircleLine
            style={{
              display: 'block',
              verticalAlign: 'middle',
              width: '24px',
              height: '24px',
              color: 'red',
            }}
          />
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-sm">{title}</h3>
          <div className="pt-2 text-sm">{children}</div>
        </div>
      </div>
    </>
  );
}

export default ErrorAlert;
