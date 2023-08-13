'use client';
import { SupabaseProvider } from '@/app/supabase';
import '@/app/globals.css';
import { Session } from '@supabase/auth-helpers-react';

export default function RootLayout({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-background flex flex-col items-center">
          <SupabaseProvider initialSession={session}>
            {children}
          </SupabaseProvider>
        </main>
      </body>
    </html>
  );
}
