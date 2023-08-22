import type { Preview } from '@storybook/react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { SupabaseProvider } from '../src/supabase';
import React from 'react';

import { withThemeByClassName } from '@storybook/addon-styling';

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
    ), // Adds theme switching support.
    // NOTE: requires setting "darkMode" to "class" in your tailwind config
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
  // Provide the MSW addon loader globally
  loaders: [mswLoader],
};

export default preview;
