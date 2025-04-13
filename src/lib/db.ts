
import { Pool } from 'pg';

// Create a PostgreSQL connection pool with default values
// Note: In a production app, you would use environment variables securely
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cryptoview',
  password: 'postgres',
  port: 5432,
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to PostgreSQL database at:', res.rows[0].now);
  }
});

export default pool;
