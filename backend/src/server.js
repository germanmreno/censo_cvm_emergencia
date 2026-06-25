import { buildApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const app = buildApp();

app.listen(env.PORT, () => {
  logger.info(`Censo Emergencia CVM - API escuchando en http://localhost:${env.PORT}`);
  logger.info(`Entorno: ${env.NODE_ENV}`);
});
