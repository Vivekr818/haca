import { Pool } from 'pg';

// Validate DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  throw new Error(
    'Missing environment variable: DATABASE_URL. ' +
    'Please configure your Neon PostgreSQL connection string in .env.local'
  );
}

// Create PostgreSQL connection pool
let pool: Pool;

try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} catch (error) {
  throw new Error(
    `Failed to initialize database connection pool: ${error instanceof Error ? error.message : 'Unknown error'}`
  );
}

export { pool };
