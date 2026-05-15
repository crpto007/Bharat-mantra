"use client";

import { useState, useEffect, Dispatch, SetStateAction, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  // Pass a function to useState to run the logic only on the client-side during initialization.
  // This avoids hydration mismatches.
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (value) => {
      // Use the functional update form of setState to avoid stale state in the closure.
      setStoredValue((current) => {
        const toStore = value instanceof Function ? value(current) : value;
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(toStore));
          }
        } catch (error) {
          console.error(`Error setting localStorage key “${key}”:`, error);
        }
        return toStore;
      });
    },
    [key]
  );
  
  // Add an effect to listen for storage changes from other tabs/windows.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing new value for localStorage key “${key}”:`, error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
