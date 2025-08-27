import winston from 'winston';
import path from 'path';

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

// Define colors for each log level
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'grey',
  debug: 'white',
  silly: 'grey',
};

// Add colors to winston
winston.addColors(logColors);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf((info) => {
    const { timestamp, level, message, stack, ...meta } = info;
    
    let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    // Add stack trace for errors
    if (stack) {
      logMessage += `\nStack: ${stack}`;
    }
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      logMessage += `\nMeta: ${JSON.stringify(meta, null, 2)}`;
    }
    
    return logMessage;
  })
);

// Define console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf((info) => {
    const { timestamp, level, message, stack } = info;
    let logMessage = `${timestamp} ${level}: ${message}`;
    
    if (stack) {
      logMessage += `\n${stack}`;
    }
    
    return logMessage;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  format: logFormat,
  defaultMeta: {
    service: 'trustcred-backend',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  transports: [
    // Error log file
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      handleExceptions: true,
      handleRejections: true,
    }),
    
    // Combined log file
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
      handleExceptions: true,
      handleRejections: true,
    })
  );
}

// Create logs directory if it doesn't exist
import fs from 'fs';
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Export logger and utility functions
export default logger;

// Utility functions for structured logging
export const logError = (message: string, error?: Error, meta?: object) => {
  logger.error(message, {
    error: error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : undefined,
    ...meta,
  });
};

export const logInfo = (message: string, meta?: object) => {
  logger.info(message, meta);
};

export const logWarn = (message: string, meta?: object) => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: object) => {
  logger.debug(message, meta);
};

// HTTP request logger
export const logRequest = (method: string, url: string, statusCode: number, responseTime: number, meta?: object) => {
  logger.http(`${method} ${url} ${statusCode} - ${responseTime}ms`, {
    method,
    url,
    statusCode,
    responseTime,
    ...meta,
  });
};

// Blockchain operation logger
export const logBlockchain = (operation: string, contractId: string, success: boolean, meta?: object) => {
  const level = success ? 'info' : 'error';
  logger.log(level, `Blockchain ${operation}: ${contractId}`, {
    operation,
    contractId,
    success,
    timestamp: new Date().toISOString(),
    ...meta,
  });
};

// Database operation logger
export const logDatabase = (operation: string, table: string, success: boolean, meta?: object) => {
  const level = success ? 'debug' : 'error';
  logger.log(level, `Database ${operation}: ${table}`, {
    operation,
    table,
    success,
    timestamp: new Date().toISOString(),
    ...meta,
  });
};