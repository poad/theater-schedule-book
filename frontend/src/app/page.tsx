'use client';
import { gql, useQuery } from '@apollo/client';
import { ListTitlesQuery } from './gql/graphql';
import { SignInButton } from './auth/signInButton';
import { SignOutButton } from './auth/signOutButton';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import useAuth from './auth/useAuth';

const query = gql`
  query ListTitles {
    titles {
      id
    }
  }
`;

Amplify.configure(awsconfig);

function Home(): JSX.Element {
  const { user, authenticated } = useAuth();
  const { data } = useQuery<ListTitlesQuery>(query);

  if (!authenticated || !user) {
    return (
      <div style={{ width: '20rem', marginTop: '3rem' }}>
        <SignInButton />
      </div>
    );
  }

  return (
    <div>
      <div>
        <div style={{ width: '20rem', marginTop: '3rem' }}>
          <SignOutButton />
        </div>
      </div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Home;
