
// Type definitions for database operations

// Query result type that matches both real pg Pool and our mock implementation
export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

// Database client type
export interface DatabaseClient {
  query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>>;
  connect(): Promise<{
    query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>>;
    release(): void;
  }>;
}

// Extend this interface as needed for specific repositories
