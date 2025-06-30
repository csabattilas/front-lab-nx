/**
 * API implementation types
 */
export type ApiImplementationType = 'mock' | 'api';

/**
 * API configuration interface
 */
export interface ApiConfig {
  /**
   * Type of API implementation to use
   */
  implementation: ApiImplementationType;

  /**
   * Base URL for the API (used by fake implementation)
   */
  baseUrl?: string;

  /**
   * API version (used by fake implementation)
   */
  version?: string;

  /**
   * Delay in milliseconds for mock responses (used by mock implementation)
   */
  mockDelay?: number;
}
