
import { DatabaseClient, QueryResult } from "@/types/database";

// Mock database implementation for browser environments
class MockPool implements DatabaseClient {
  query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    console.log('MOCK DB: Query executed:', text, params);
    return Promise.resolve({ rows: [], rowCount: 0 });
  }

  connect() {
    console.log('MOCK DB: Connection requested');
    return Promise.resolve({
      query: <T = any>(text: string, params?: any[]): Promise<QueryResult<T>> => {
        console.log('MOCK DB: Client query executed:', text, params);
        return Promise.resolve({ rows: [], rowCount: 0 });
      },
      release: () => {
        console.log('MOCK DB: Client released');
      }
    });
  }
}

// In browser environments we use a mock implementation
// In Node.js environments we would use the real pg Pool
const pool = new MockPool();

console.log('Using mock database implementation for browser environment');

export default pool;
