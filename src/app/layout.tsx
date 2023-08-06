'use client';
import { SupabaseProvider } from './supabase';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-background flex flex-col items-center">
          <SupabaseProvider>{children}</SupabaseProvider>
        </main>
      </body>
    </html>
  );
}
