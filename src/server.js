/* eslint-disable no-console */
const http = require('http');
const stoppable = require('stoppable');
const app = require('./app');
const normalizePort = require('./utils/normalize-port');
const gracefulShutdown = require('./utils/graceful-shutdown');
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server and make it stoppable.
 */
const server = stoppable(http.createServer(app));

/**
 * Listen on provided port, on all network interfaces.
 */


async function startServer() {
  server.listen(port, () => {
    console.info(`Server listening on port ${port}`);
  });
}


/**
 * Handle server errors.
 * @param {Error} error - The error to handle.
 * @throws {Error} - If the error is not a listen error or is not a known error code.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
server.on('error', onError);
server.on('listening', () => {
  console.info(`Server is running on port ${port}`);
});

/**
 * Gracefully handle shutdown signals.
 */
const shutdownHandler = async (signal) => {
  console.info(`⚠️ Received ${signal}. Initiating graceful shutdown...`);
  await gracefulShutdown(server);
};

process.on('SIGINT', () => shutdownHandler('SIGINT'));  // Ctrl+C
process.on('SIGTERM', () => shutdownHandler('SIGTERM')); // Docker stop / PM2 restart

startServer()

module.exports = server;
