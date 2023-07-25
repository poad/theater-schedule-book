'use client';
import { Auth } from 'aws-amplify';
import appConfig from '../app-config';

export function SignInButton() {
  const idpName = appConfig.identityProviderName;

  const onClick = (): void => {
    Auth.federatedSignIn({ customProvider: idpName });
  };

  return <button onClick={onClick}>Sign in</button>;
}
