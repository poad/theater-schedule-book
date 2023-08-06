import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { AmplifyUser } from '@aws-amplify/ui';

function useAuth() {
  const [jwt, setJwt] = useState<string>();
  const [user, setUser] = useState<AmplifyUser>();
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user: AmplifyUser) => {
        setUser(user);
        setJwt((user.getSignInUserSession() ?? undefined)?.getAccessToken().getJwtToken());
        setAuthenticated(true);
      })
      .catch(() => {
        setAuthenticated(false)
      });
  }, []);

  return {
    user,
    jwt,
    authenticated,
  };
}

export default useAuth;
