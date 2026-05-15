// src/components/FirebaseErrorListener.tsx
'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';

// This is a client component that will listen for Firebase permission errors
// and display them as toasts in development. It will not be included in production.
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const handleError = (error: any) => {
      console.error('Firebase Permission Error:', error);
      toast({
        variant: 'destructive',
        title: 'Firestore Permission Error',
        description: error.message || 'Missing or insufficient permissions.',
        duration: 10000,
      });
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  // This component doesn't render anything itself
  return null;
}
