'use client';
import {
  onSnapshot,
  Query,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [snapshot, setSnapshot] = useState<QuerySnapshot<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setSnapshot(null);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query,
      (snap) => {
        setSnapshot(snap);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching collection:', err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  const data = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() })) || [];

  return { data, isLoading, error, snapshot };
}
