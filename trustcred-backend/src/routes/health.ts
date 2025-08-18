import { Router, Request, Response } from 'express';
import { testConnection } from '../config/database';
import { getRedisClient } from '../config/redis';

const router = Router();

// Basic health check
router.get('/', async (req: Request, res: Response): Promise<void> => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV'] || 'development',
    version: '1.0.0'
  });
});

// Detailed health check with dependencies
router.get('/detailed', async (req: Request, res: Response): Promise<void> => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV'] || 'development',
    version: '1.0.0',
    dependencies: {
      database: 'unknown',
      redis: 'unknown'
    }
  };

  try {
    // Check database connection
    const dbHealthy = await testConnection();
    health.dependencies.database = dbHealthy ? 'healthy' : 'unhealthy';
  } catch (error) {
    health.dependencies.database = 'error';
  }

  try {
    // Check Redis connection (optional)
    const redisClient = getRedisClient();
    await redisClient.ping();
    health.dependencies.redis = 'healthy';
  } catch (error) {
    health.dependencies.redis = 'unavailable';
  }

  // Determine overall status (Redis is optional)
  const criticalHealthy = health.dependencies.database === 'healthy';
  health.status = criticalHealthy ? 'healthy' : 'degraded';

  const statusCode = criticalHealthy ? 200 : 503;
  res.status(statusCode).json(health);
});

// Readiness probe for Kubernetes
router.get('/ready', async (req: Request, res: Response): Promise<void> => {
  try {
    // Check database (required)
    const dbHealthy = await testConnection();
    if (!dbHealthy) {
      res.status(503).json({
        status: 'not ready',
        reason: 'database connection failed'
      });
      return;
    }

    // Check Redis (optional)
    try {
      const redisClient = getRedisClient();
      await redisClient.ping();
    } catch (redisError) {
      console.warn('⚠️ Redis unavailable for readiness check, continuing');
    }

    res.json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      reason: 'dependency check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Liveness probe for Kubernetes
router.get('/live', (req: Request, res: Response): void => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
