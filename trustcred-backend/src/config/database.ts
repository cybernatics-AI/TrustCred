import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';

dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] || '5432', 10),
  database: process.env['DB_NAME'] || 'trustcred_dev',
  user: process.env['DB_USER'] || 'postgres',
  password: process.env['DB_PASSWORD'] || 'postgres',
  ssl: process.env['DB_SSL'] === 'true',
  max: parseInt(process.env['DB_MAX_CONNECTIONS'] || '20', 10),
  idleTimeoutMillis: parseInt(process.env['DB_IDLE_TIMEOUT'] || '30000', 10),
  connectionTimeoutMillis: parseInt(process.env['DB_CONNECTION_TIMEOUT'] || '2000', 10),
};

// Create connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};

// Connect to database
export const connectDatabase = async (): Promise<void> => {
  try {
    // Test connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }
    
    console.log('✅ Database connected successfully');
    
    // Run initial schema if in development
    if (process.env['NODE_ENV'] === 'development') {
      await runInitialSchema();
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Run initial schema
const runInitialSchema = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    
    // Check if tables exist
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'organizations'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('📋 Running initial database schema...');
      
      // Read and execute schema file
      const schemaPath = path.join(__dirname, '../../database/schemas/001_initial_schema.sql');
      
      try {
        const schema = await fs.readFile(schemaPath, 'utf8');
        await client.query(schema);
        console.log('✅ Initial schema applied successfully');
      } catch (fileError) {
        console.warn('⚠️ Schema file not found or unreadable, skipping initial setup');
        console.warn('Expected path:', schemaPath);
        console.warn('Error:', fileError instanceof Error ? fileError.message : 'Unknown error');
      }
    } else {
      console.log('✅ Database schema already exists');
    }
    
    client.release();
  } catch (error) {
    console.error('❌ Failed to run initial schema:', error);
    // Don't throw here, just log the error
    console.warn('⚠️ Continuing without initial schema setup');
  }
};

// Get database pool
export const getPool = (): Pool => pool;

// Execute query with connection management
export const executeQuery = async <T>(
  query: string,
  params?: any[]
): Promise<T[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
};

// Execute transaction
export const executeTransaction = async <T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Close database connections
export const closeDatabase = async (): Promise<void> => {
  await pool.end();
  console.log('✅ Database connections closed');
};
