require('dotenv').config();
const app = require('./src/app');
const initDb = require('./src/config/initDb');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

let server;

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', { message: err.message, stack: err.stack });
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', { message: err.message, stack: err.stack });
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});

initDb().then(() => {
  server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    logger.info(`API docs available at http://localhost:${PORT}/api-docs`);
    logger.info(`Health check at http://localhost:${PORT}/health`);
  });
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', { message: err.message, stack: err.stack });
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', { message: err.message, stack: err.stack });
  server.close(() => process.exit(1));
});
