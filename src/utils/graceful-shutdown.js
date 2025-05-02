const prisma = require('../db/index'); // Adjust the path as needed
const logger = require('../support/logger');

/**
 * Gracefully shuts down the server and database connections, then exits the process.
 * @param {object} server - The server object to close.
 * @returns {Promise<void>} - A promise that resolves when shutdown is complete.
 */
module.exports = async (server) => {
  try {
    logger.info("Initiating graceful shutdown...");

    if (server && server.stop) {
      await new Promise((resolve, reject) => {
        server.stop((err) => (err ? reject(err) : resolve()));
      });
      logger.info("Express server closed.");
    }

    if (prisma) {
      await prisma.$disconnect();
      logger.info("Prisma client disconnected.");
    }

    logger.info("Cleanup complete. Exiting now...");
    process.exit(0);
  } catch (error) {
    logger.error(`Error during shutdown: ${error.message}`);
    process.exit(1);
  }
};
