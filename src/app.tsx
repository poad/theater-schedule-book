import { MetaProvider, Title } from '@solidjs/meta';
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import { SupabaseSessionProvider } from './supabase/';

export default function App() {
  return (
    <Router
      root={(props) => (
        <SupabaseSessionProvider>
          <MetaProvider>
            <Title>SolidStart - with Vitest</Title>
            <Suspense>{props.children}</Suspense>
          </MetaProvider>
        </SupabaseSessionProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
