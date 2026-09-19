import { SupabaseSessionProvider } from './feature/supabase/';

import { Router } from '@solidjs/router';
import { Suspense } from 'solid-js';
import { render } from 'solid-js/web';
// eslint-disable-next-line import-x/no-unresolved
import routes from '~solid-pages';
import './index.css';

const root = document.getElementById('root');

if ((import.meta.env.DEV && !(root instanceof HTMLElement)) || !root) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(
  () => (
    <SupabaseSessionProvider>
      <Suspense>
        <Router>{routes}</Router>
      </Suspense>
    </SupabaseSessionProvider>
  ),
  root,
);
