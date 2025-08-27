import { Request, Response, NextFunction } from 'express';
import { logRequest, logInfo } from '../utils/logger';

export const logger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Log incoming request
  logInfo('Incoming request', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });
  
  // Log request body for non-GET requests (but sanitize sensitive data)
  if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    
    // Remove sensitive fields from logs
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'signature'];
    sensitiveFields.forEach(field => {
      if (sanitizedBody[field]) {
        sanitizedBody[field] = '[REDACTED]';
      }
    });
    
    logInfo('Request body', {
      method: req.method,
      url: req.url,
      body: sanitizedBody,
    });
  }

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(this: Response, chunk?: any, encoding?: any): Response {
    const duration = Date.now() - start;
    const status = res.statusCode;
    
    // Log response using our structured logger
    logRequest(req.method, req.url, status, duration, {
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      contentLength: res.get('Content-Length'),
    });
    
    // Call original end method
    return originalEnd.call(this, chunk, encoding);
  };

  next();
};
