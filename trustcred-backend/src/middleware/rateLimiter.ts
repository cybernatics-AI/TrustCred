import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter for development
// In production, use Redis-based rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const clientId = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000', 10); // 15 minutes
  const maxRequests = parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100', 10);

  // Get or create client record
  let clientRecord = requestCounts.get(clientId);
  if (!clientRecord || now > clientRecord.resetTime) {
    clientRecord = { count: 0, resetTime: now + windowMs };
    requestCounts.set(clientId, clientRecord);
  }

  // Check rate limit
  if (clientRecord.count >= maxRequests) {
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests',
        statusCode: 429,
        retryAfter: Math.ceil((clientRecord.resetTime - now) / 1000)
      }
    });
    return;
  }

  // Increment request count
  clientRecord.count++;
  
  // Add rate limit headers
  res.set({
    'X-RateLimit-Limit': maxRequests.toString(),
    'X-RateLimit-Remaining': (maxRequests - clientRecord.count).toString(),
    'X-RateLimit-Reset': new Date(clientRecord.resetTime).toISOString()
  });

  next();
};

// Clean up expired records periodically
setInterval(() => {
  const now = Date.now();
  for (const [clientId, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(clientId);
    }
  }
}, 60000); // Clean up every minute
