import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Redis configuration
const redisConfig = {
  socket: {
    host: process.env['REDIS_HOST'] || 'localhost',
    port: parseInt(process.env['REDIS_PORT'] || '6379', 10),
  },
  password: process.env['REDIS_PASSWORD'] || undefined,
  database: parseInt(process.env['REDIS_DB'] || '0', 10),
  prefix: process.env['REDIS_KEY_PREFIX'] || 'trustcred:',
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: 3,
};

// Create Redis client
let redisClient: RedisClientType | null = null;

// Connect to Redis
export const connectRedis = async (): Promise<void> => {
  try {
    redisClient = createClient(redisConfig);
    
    // Handle Redis events
    redisClient.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });
    
    redisClient.on('connect', () => {
      console.log('🔗 Redis Client Connected');
    });
    
    redisClient.on('ready', () => {
      console.log('✅ Redis Client Ready');
    });
    
    redisClient.on('end', () => {
      console.log('🔌 Redis Client Disconnected');
    });
    
    // Connect to Redis
    await redisClient.connect();
    
    // Test connection
    await redisClient.ping();
    console.log('✅ Redis connected successfully');
    
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    throw error;
  }
};

// Get Redis client
export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
};

// Set key-value pair
export const setKey = async (key: string, value: string, ttl?: number): Promise<void> => {
  const client = getRedisClient();
  if (ttl) {
    await client.setEx(key, ttl, value);
  } else {
    await client.set(key, value);
  }
};

// Get value by key
export const getKey = async (key: string): Promise<string | null> => {
  const client = getRedisClient();
  return await client.get(key);
};

// Delete key
export const deleteKey = async (key: string): Promise<number> => {
  const client = getRedisClient();
  return await client.del(key);
};

// Set key with expiration (in seconds)
export const setKeyWithExpiry = async (key: string, value: string, seconds: number): Promise<void> => {
  const client = getRedisClient();
  await client.setEx(key, seconds, value);
};

// Check if key exists
export const keyExists = async (key: string): Promise<boolean> => {
  const client = getRedisClient();
  const exists = await client.exists(key);
  return exists === 1;
};

// Increment counter
export const incrementCounter = async (key: string): Promise<number> => {
  const client = getRedisClient();
  return await client.incr(key);
};

// Set hash field
export const setHashField = async (key: string, field: string, value: string): Promise<void> => {
  const client = getRedisClient();
  await client.hSet(key, field, value);
};

// Get hash field
export const getHashField = async (key: string, field: string): Promise<string | null> => {
  const client = getRedisClient();
  return await client.hGet(key, field);
};

// Get all hash fields
export const getAllHashFields = async (key: string): Promise<Record<string, string>> => {
  const client = getRedisClient();
  return await client.hGetAll(key);
};

// Add to set
export const addToSet = async (key: string, member: string): Promise<number> => {
  const client = getRedisClient();
  return await client.sAdd(key, member);
};

// Check if member exists in set
export const isMemberOfSet = async (key: string, member: string): Promise<boolean> => {
  const client = getRedisClient();
  const result = await client.sIsMember(key, member);
  return result === 1;
};

// Get set members
export const getSetMembers = async (key: string): Promise<string[]> => {
  const client = getRedisClient();
  return await client.sMembers(key);
};

// Close Redis connection
export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    console.log('✅ Redis connection closed');
  }
};
