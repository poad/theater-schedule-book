import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ReactNode } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import awsconfig from '../aws-exports';
import { Amplify } from 'aws-amplify';
import useAuth from '../auth/useAuth';

Amplify.configure(awsconfig);

const entpoint = process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT_URL;

export function useApolloClient() {
  const { session } = useAuth();
  const token = session?.getAccessToken().getJwtToken();

  const httpLink = createHttpLink({
    uri: entpoint,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return client;
}

export function ApolloClientProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  function Wrapper({ children }: { children: ReactNode }): JSX.Element {
    const client = useApolloClient();
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
  }

  return (
    <Authenticator.Provider>
      <Wrapper>{children}</Wrapper>
    </Authenticator.Provider>
  );
}
