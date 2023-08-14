'use client';

import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SupabaseProvider } from '../supabase';
import { Session } from '@supabase/auth-helpers-react';

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  return (
    <SupabaseProvider initialSession={pageProps.initialSession}>
      <Component {...pageProps} />
    </SupabaseProvider>
  );
}
