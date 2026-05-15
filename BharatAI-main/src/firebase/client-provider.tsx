// src/firebase/client-provider.tsx
'use client';
import { useMemo } from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase/provider';

// This is a client-side only component that will initialize Firebase
// and provide it to the rest of the application.
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Memoize the firebase instance to prevent re-initialization on every render
  const { app, auth, firestore } = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
