import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Log request
  console.log(`📥 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  
  // Log request body for non-GET requests
  if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
  }

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(this: Response, chunk?: any, encoding?: any): Response {
    const duration = Date.now() - start;
    const status = res.statusCode;
    
    // Color code based on status
    let statusColor = '🟢'; // Green for 2xx
    if (status >= 400 && status < 500) statusColor = '🟡'; // Yellow for 4xx
    if (status >= 500) statusColor = '🔴'; // Red for 5xx
    
    console.log(`${statusColor} ${req.method} ${req.url} - ${status} (${duration}ms)`);
    
    // Call original end method
    return originalEnd.call(this, chunk, encoding);
  };

  next();
};
