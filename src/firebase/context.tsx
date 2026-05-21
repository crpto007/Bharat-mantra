
'use client';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  Firestore,
  getFirestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';

import { firebaseConfig } from '@/firebase/config';

const FirebaseAppContext = createContext<FirebaseApp | null>(null);
const FirebaseFirestoreContext = createContext<Firestore | null>(null);

export function AppProvider({
  app,
  children,
}: {
  app: FirebaseApp;
  children: React.ReactNode;
}) {
  return (
    <FirebaseAppContext.Provider value={app}>
      {children}
    </FirebaseAppContext.Provider>
  );
}

export function FirestoreProvider({
  firestore,
  children,
}: {
  firestore: Firestore;
  children: React.ReactNode;
}) {
  return (
    <FirebaseFirestoreContext.Provider value={firestore}>
      {children}
    </FirebaseFirestoreContext.Provider>
  );
}

export const useFirebaseApp = () => useContext(FirebaseAppContext);
export const useFirestore = () => useContext(FirebaseFirestoreContext);
