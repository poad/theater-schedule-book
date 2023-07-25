import { Auth } from 'aws-amplify';

export function SignOutButton() {
  const onClick = (): void => {
    Auth.signOut();
  };
  return (
    <button title="Sign Out" onClick={onClick}>
      Sign Out
    </button>
  );
}
