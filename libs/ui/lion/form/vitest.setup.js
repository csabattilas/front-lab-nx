// Add any global setup needed for your tests
// This file is loaded before each test file

// Setup for web components testing
import { 
  elementUpdated,
  waitUntil,
  aTimeout
} from '@open-wc/testing-helpers';

// Make these helpers available globally
Object.assign(globalThis, {
  elementUpdated,
  waitUntil,
  aTimeout
});

// Add any custom matchers or global setup here
