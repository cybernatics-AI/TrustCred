import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';

// Load environment variables
dotenv.config();

// Import middleware and routes
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { logger } from './middleware/logger';

// Import routes
import authRoutes from './routes/auth';
import credentialRoutes from './routes/credentials';
import organizationRoutes from './routes/organizations';
import healthRoutes from './routes/health';

// Import database connection
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';

// Environment variable configuration with proper typing
interface EnvironmentConfig {
  NODE_ENV: string;
  PORT: number;
  API_VERSION: string;
  CORS_ORIGIN: string;
}

const config: EnvironmentConfig = {
  NODE_ENV: process.env['NODE_ENV'] || 'development',
  PORT: parseInt(process.env['PORT'] || '3001', 10),
  API_VERSION: process.env['API_VERSION'] || 'v1',
  CORS_ORIGIN: process.env['CORS_ORIGIN'] || 'http://localhost:3000'
};

const app = express();
const server = createServer(app);
const { PORT, NODE_ENV, API_VERSION, CORS_ORIGIN } = config;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom middleware
app.use(logger);
app.use(rateLimiter);

// Health check endpoint
app.use('/health', healthRoutes);

// API routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/credentials`, credentialRoutes);
app.use(`/api/${API_VERSION}/organizations`, organizationRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'TrustCred API Server',
    version: '1.0.0',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    status: 'running'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();
    console.log('✅ Database connected successfully');

    // Try to connect to Redis (optional for development)
    try {
      await connectRedis();
      console.log('✅ Redis connected successfully');
    } catch (redisError) {
      console.warn('⚠️ Redis connection failed, continuing without Redis');
      console.warn('This is fine for development, but Redis is required for production');
    }

    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`🚀 TrustCred API Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
