
import { Pool } from 'pg';

// Create a mock pool for browser environments
const createMockPool = () => {
  const mockPool = {
    query: (text, params) => {
      console.log('Browser environment detected, database operations are mocked');
      console.log('Query that would be executed:', text, params);
      return Promise.resolve({ rows: [], rowCount: 0 });
    },
    connect: () => {
      console.log('Browser environment detected, connection is mocked');
      return Promise.resolve({
        query: () => Promise.resolve({ rows: [], rowCount: 0 }),
        release: () => {},
      });
    },
  };
  return mockPool;
};

// Determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create either a real pool or a mock pool based on environment
const pool = isBrowser 
  ? createMockPool()
  : new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'cryptoview',
      password: 'postgres',
      port: 5432,
    });

// Log connection status
if (!isBrowser) {
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Database connection error:', err);
    } else {
      console.log('Connected to PostgreSQL database at:', res.rows[0].now);
    }
  });
} else {
  console.log('Browser environment: PostgreSQL operations will be mocked');
}

export default pool;
