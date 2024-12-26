// packages/shared/src/utils/logger.ts

import winston from 'winston';

/**
 * Secure logging configuration
 */
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: 'heliosiq' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

// Redact sensitive information
logger.filter((info) => {
  const sensitiveFields = ['password', 'token', 'key', 'secret', 'credential'];
  
  const redactSensitiveData = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];
      
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        acc[key] = '[REDACTED]';
      } else if (typeof value === 'object') {
        acc[key] = redactSensitiveData(value);
      } else {
        acc[key] = value;
      }
      
      return acc;
    }, {} as any);
  };

  return redactSensitiveData(info);
});