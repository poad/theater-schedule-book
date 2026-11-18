import { SupabaseSessionProvider } from './feature/supabase/';

import { createRouter } from '@solidjs/router';
import { render } from '@solidjs/web';
import { Loading } from 'solid-js';
// eslint-disable-next-line import-x/no-unresolved
import routes from '~solid-pages';
import './index.css';

const Router = createRouter({ routes });

const root = document.getElementById('root');

if ((import.meta.env.DEV && !(root instanceof HTMLElement)) || !root) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(
  () => (
    <SupabaseSessionProvider>
      <Loading fallback={<div>読み込み中...</div>}>
        <Router />
      </Loading>
    </SupabaseSessionProvider>
  ),
  root,
);
