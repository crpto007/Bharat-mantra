// src/firebase/provider.tsx
'use client';

import { createContext, useContext } from 'react';
import {
  initializeApp,
  getApps,
  FirebaseApp,
} from 'firebase/app';
import {
  getAuth,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
} from 'firebase/firestore';

import { firebaseConfig } from '@/firebase/config';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

// --- Types ---
interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

// --- Contexts ---
const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  auth: null,
  firestore: null,
});

// --- Main Provider Component ---
export function FirebaseProvider({
  app,
  auth,
  firestore,
  children,
}: {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  children: React.ReactNode;
}) {
  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {children}
      {/* This component will listen for errors and display them as toasts */}
      <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
}

// --- Hooks ---
export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = () => useContext(FirebaseContext).app;
export const useAuth = () => useContext(FirebaseContext).auth;
export const useFirestore = () => useContext(FirebaseContext).firestore;


// --- Initialization ---
// This function should be called once in a client-side component.
// `FirebaseClientProvider` handles this for you.
export function initializeFirebase() {
    const apps = getApps();
    const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);
  
    return { app, auth, firestore };
}
