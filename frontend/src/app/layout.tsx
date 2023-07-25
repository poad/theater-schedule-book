'use client';
import { Authenticator } from '@aws-amplify/ui-react';
import './globals.css';
import styles from './styles/Home.module.css';

import { Inter } from 'next/font/google';
import { ApolloClientProvider } from './apollo/client';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className={styles.main}>
          <Authenticator.Provider>
            <ApolloClientProvider>{children}</ApolloClientProvider>
          </Authenticator.Provider>
        </main>
      </body>
    </html>
  );
}
