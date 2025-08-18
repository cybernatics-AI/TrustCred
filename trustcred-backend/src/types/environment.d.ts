declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      API_VERSION: string;
      
      // Database
      DB_HOST: string;
      DB_PORT: string;
      DB_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_SSL: string;
      DB_MAX_CONNECTIONS: string;
      DB_IDLE_TIMEOUT: string;
      DB_CONNECTION_TIMEOUT: string;
      
      // Redis
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASSWORD: string;
      REDIS_DB: string;
      REDIS_KEY_PREFIX: string;
      
      // JWT
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      JWT_REFRESH_EXPIRES_IN: string;
      
      // Stacks Blockchain
      STACKS_NETWORK: string;
      STACKS_API_URL: string;
      STACKS_CONTRACT_ADDRESS: string;
      
      // IPFS
      IPFS_HOST: string;
      IPFS_PORT: string;
      IPFS_PROTOCOL: string;
      IPFS_API_KEY: string;
      
      // Security
      BCRYPT_ROUNDS: string;
      RATE_LIMIT_WINDOW_MS: string;
      RATE_LIMIT_MAX_REQUESTS: string;
      
      // Email
      SMTP_HOST: string;
      SMTP_PORT: string;
      SMTP_USER: string;
      SMTP_PASS: string;
      
      // SMS
      TWILIO_ACCOUNT_SID: string;
      TWILIO_AUTH_TOKEN: string;
      TWILIO_PHONE_NUMBER: string;
      
      // Logging
      LOG_LEVEL: string;
      LOG_FILE: string;
      
      // CORS
      CORS_ORIGIN: string;
      CORS_CREDENTIALS: string;
      
      // File Upload
      MAX_FILE_SIZE: string;
      UPLOAD_DIR: string;
    }
  }
}

export {};
