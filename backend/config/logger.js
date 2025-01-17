// config/logger.js
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Custom format for logging
const customFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.metadata()
);

// Create logs directory if it doesn't exist
const logsDir = 'logs';

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: customFormat,
    defaultMeta: { service: 'school-management' },
    transports: [
        // Error logs
        new DailyRotateFile({
            filename: path.join(logsDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxSize: '20m',
            maxFiles: '14d',
            zippedArchive: true
        }),

        // Combined logs
        new DailyRotateFile({
            filename: path.join(logsDir, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            zippedArchive: true
        }),

        // Audit logs for security events
        new DailyRotateFile({
            filename: path.join(logsDir, 'audit-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',
            zippedArchive: true
        })
    ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

// Custom logging methods
const customLogger = {
    info: (message, meta = {}) => {
        logger.info(message, { ...meta, timestamp: new Date() });
    },

    error: (message, error = null, meta = {}) => {
        const errorMeta = {
            ...meta,
            timestamp: new Date(),
            stack: error?.stack,
            errorMessage: error?.message
        };
        logger.error(message, errorMeta);
    },

    warn: (message, meta = {}) => {
        logger.warn(message, { ...meta, timestamp: new Date() });
    },

    audit: (action, meta = {}) => {
        logger.info(action, { 
            ...meta, 
            timestamp: new Date(),
            audit: true 
        });
    },

    // Security event logging
    security: (event, meta = {}) => {
        logger.warn(event, { 
            ...meta, 
            timestamp: new Date(),
            security: true 
        });
    }
};

// Usage examples:
/*
logger.info('User logged in', { userId: '123', ip: '192.168.1.1' });
logger.error('Database connection failed', new Error('Connection timeout'));
logger.audit('Data deleted', { 
    userId: '123', 
    action: 'delete', 
    resource: 'announcement',
    resourceId: '456'
});
logger.security('Failed login attempt', {
    username: 'test@example.com',
    ip: '192.168.1.1',
    attemptCount: 3
});
*/

module.exports = customLogger;