'use client';
import {
  onSnapshot,
  DocumentReference,
  DocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export function useDoc<T = DocumentData>(ref: DocumentReference<T> | null) {
  const [snapshot, setSnapshot] = useState<DocumentSnapshot<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setSnapshot(null);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        setSnapshot(snap);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching document:', err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref]);

  const data = snapshot?.exists() ? { id: snapshot.id, ...snapshot.data() } : null;

  return { data, isLoading, error, snapshot };
}
