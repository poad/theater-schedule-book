import type { Preview } from '@storybook/react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';
import { SupabaseProvider } from '../src/supabase';

import '../src/styles/globals.css';

// Initialize MSW
initialize();

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <SupabaseProvider>
        <Story />
      </SupabaseProvider>
    ),
  ],
  // Provide the MSW addon loader globally
  loaders: [mswLoader],
};

export default preview;
