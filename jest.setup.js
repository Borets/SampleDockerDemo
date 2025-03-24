require('@testing-library/jest-dom');

// Mock window and document for client-side tests
if (typeof window === 'undefined') {
  global.window = {};
}

if (typeof document === 'undefined') {
  global.document = {};
} 