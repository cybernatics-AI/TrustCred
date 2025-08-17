// TrustCred Database Configuration
// This file contains database configuration for different environments

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  maxConnections: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  keyPrefix: string;
}

export interface IPFSConfig {
  host: string;
  port: number;
  protocol: 'http' | 'https';
  apiKey?: string;
}

// Environment-specific configurations
export const databaseConfigs: Record<string, DatabaseConfig> = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'trustcred_dev',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: false,
    maxConnections: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  },

  test: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '5433'),
    database: process.env.TEST_DB_NAME || 'trustcred_test',
    username: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || 'postgres',
    ssl: false,
    maxConnections: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 1000
  },

  staging: {
    host: process.env.STAGING_DB_HOST || 'staging-db.trustcred.com',
    port: parseInt(process.env.STAGING_DB_PORT || '5432'),
    database: process.env.STAGING_DB_NAME || 'trustcred_staging',
    username: process.env.STAGING_DB_USER || 'trustcred_app',
    password: process.env.STAGING_DB_PASSWORD || '',
    ssl: true,
    maxConnections: 20,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 5000
  },

  production: {
    host: process.env.PROD_DB_HOST || 'prod-db.trustcred.com',
    port: parseInt(process.env.PROD_DB_PORT || '5432'),
    database: process.env.PROD_DB_NAME || 'trustcred_prod',
    username: process.env.PROD_DB_USER || 'trustcred_app',
    password: process.env.PROD_DB_PASSWORD || '',
    ssl: true,
    maxConnections: 100,
    idleTimeoutMillis: 300000, // 5 minutes
    connectionTimeoutMillis: 10000
  }
};

// Redis configurations
export const redisConfigs: Record<string, RedisConfig> = {
  development: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    keyPrefix: 'trustcred:dev:'
  },

  test: {
    host: process.env.TEST_REDIS_HOST || 'localhost',
    port: parseInt(process.env.TEST_REDIS_PORT || '6380'),
    password: process.env.TEST_REDIS_PASSWORD,
    db: parseInt(process.env.TEST_REDIS_DB || '1'),
    keyPrefix: 'trustcred:test:'
  },

  staging: {
    host: process.env.STAGING_REDIS_HOST || 'staging-redis.trustcred.com',
    port: parseInt(process.env.STAGING_REDIS_PORT || '6379'),
    password: process.env.STAGING_REDIS_PASSWORD,
    db: parseInt(process.env.STAGING_REDIS_DB || '0'),
    keyPrefix: 'trustcred:staging:'
  },

  production: {
    host: process.env.PROD_REDIS_HOST || 'prod-redis.trustcred.com',
    port: parseInt(process.env.PROD_REDIS_PORT || '6379'),
    password: process.env.PROD_REDIS_PASSWORD,
    db: parseInt(process.env.PROD_REDIS_DB || '0'),
    keyPrefix: 'trustcred:prod:'
  }
};

// IPFS configurations
export const ipfsConfigs: Record<string, IPFSConfig> = {
  development: {
    host: process.env.IPFS_HOST || 'localhost',
    port: parseInt(process.env.IPFS_PORT || '5001'),
    protocol: 'http'
  },

  test: {
    host: process.env.TEST_IPFS_HOST || 'localhost',
    port: parseInt(process.env.TEST_IPFS_PORT || '5002'),
    protocol: 'http'
  },

  staging: {
    host: process.env.STAGING_IPFS_HOST || 'staging-ipfs.trustcred.com',
    port: parseInt(process.env.STAGING_IPFS_PORT || '443'),
    protocol: 'https',
    apiKey: process.env.STAGING_IPFS_API_KEY
  },

  production: {
    host: process.env.PROD_IPFS_HOST || 'prod-ipfs.trustcred.com',
    port: parseInt(process.env.PROD_IPFS_PORT || '443'),
    protocol: 'https',
    apiKey: process.env.PROD_IPFS_API_KEY
  }
};

// Get current environment
export const getCurrentEnvironment = (): string => {
  return process.env.NODE_ENV || 'development';
};

// Get current database config
export const getCurrentDatabaseConfig = (): DatabaseConfig => {
  const env = getCurrentEnvironment();
  return databaseConfigs[env] || databaseConfigs.development;
};

// Get current Redis config
export const getCurrentRedisConfig = (): RedisConfig => {
  const env = getCurrentEnvironment();
  return redisConfigs[env] || redisConfigs.development;
};

// Get current IPFS config
export const getCurrentIPFSConfig = (): IPFSConfig => {
  const env = getCurrentEnvironment();
  return ipfsConfigs[env] || ipfsConfigs.development;
};

// Database connection string generator
export const getDatabaseConnectionString = (config: DatabaseConfig): string => {
  const { host, port, database, username, password, ssl } = config;
  const sslParam = ssl ? '?sslmode=require' : '';
  return `postgresql://${username}:${password}@${host}:${port}/${database}${sslParam}`;
};

// Redis connection string generator
export const getRedisConnectionString = (config: RedisConfig): string => {
  const { host, port, password, db } = config;
  const auth = password ? `:${password}@` : '';
  return `redis://${auth}${host}:${port}/${db}`;
};

// Environment validation
export const validateEnvironment = (): void => {
  const env = getCurrentEnvironment();
  const requiredEnvs = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  
  if (env === 'production' || env === 'staging') {
    for (const requiredEnv of requiredEnvs) {
      if (!process.env[requiredEnv]) {
        throw new Error(`Missing required environment variable: ${requiredEnv}`);
      }
    }
  }
};

// Export default configurations
export default {
  database: getCurrentDatabaseConfig(),
  redis: getCurrentRedisConfig(),
  ipfs: getCurrentIPFSConfig(),
  environment: getCurrentEnvironment()
};
