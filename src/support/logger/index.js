const winston = require('winston');
const { NODE_ENV } = require('config');
const expressWinston = require('express-winston');
const packageName = require('../../../package.json');
const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDirectory = path.join(__dirname, '..','..','..','logs');
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true });
}

// Log formatter function
const logFormatter = winston.format.printf((info) => {
  const { timestamp, level, stack, message } = info;
  const errorMessage = stack || message;
  return `${timestamp} ${level}: ${errorMessage}`;
});

// Base logger configuration
const baseLoggerConfig = {
  maxsize: 5242880, // 5MB
  maxFiles: 5,
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    logFormatter // Apply custom formatting here
  ),
  defaultMeta: { service: `${packageName.name?.toLocaleLowerCase() || 'default'}-service` },
};

// Console transport configuration
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    logFormatter
  ),
});

// Create the logger
const logger = winston.createLogger({
  ...baseLoggerConfig,
  transports: [consoleTransport],
});

// Add file transports in production
if (NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({ filename: path.join(logsDirectory, 'error.log'), level: 'error' })
  );
  logger.add(
    new winston.transports.File({ filename: path.join(logsDirectory, 'combined.log'), level: 'debug' })
  );
}

// Export the logger
module.exports = logger;

// Export request logger middleware
module.exports.requestLogger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
  /**
   * Ignore specific routes if necessary.
   * Currently, no routes are ignored.
   * @param {object} _req - The request object.
   * @param {object} _res - The response object.
   * @returns {boolean} - Always returns `false`.
   */
  ignoreRoute(_req, _res) {
    return false;
  },
});
