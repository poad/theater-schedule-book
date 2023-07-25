import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';

function useAuth() {
  const [session, setSession] = useState<CognitoUserSession>();
  const [user, setUser] = useState<any>();
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user: CognitoUser) => {
        setUser(user);
        setSession(user.getSignInUserSession() || undefined);
        setAuthenticated(true);
      })
      .catch((error) => setAuthenticated(false));
  }, []);

  return {
    user,
    session,
    authenticated,
  };
}

export default useAuth;
