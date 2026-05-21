// src/firebase/errors.ts

// A custom error class for Firestore permission errors.
// This allows us to throw and catch specific errors related to security rules.
export class FirestorePermissionError extends Error {
    constructor(
        public context: {
            path: string;
            operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
            requestResourceData?: any;
        }
    ) {
        const message = `Firestore Permission Denied: You do not have permission to ${context.operation} the document or collection at '${context.path}'.`;
        super(message);
        this.name = 'FirestorePermissionError';
    }
}
