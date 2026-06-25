import { readFileSync, existsSync } from 'node:fs';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';
import { buildApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const app = buildApp();

const certPath = process.env.HTTPS_CERT;
const keyPath = process.env.HTTPS_KEY;
const useHttps = certPath && keyPath && existsSync(certPath) && existsSync(keyPath);

if (useHttps) {
  const httpsOptions = {
    cert: readFileSync(certPath),
    key: readFileSync(keyPath),
  };
  createHttpsServer(httpsOptions, app).listen(env.PORT, () => {
    logger.info(`Censo Emergencia CVM - API escuchando en https://localhost:${env.PORT}`);
    logger.info(`Entorno: ${env.NODE_ENV}`);
  });
} else {
  createHttpServer(app).listen(env.PORT, () => {
    logger.info(`Censo Emergencia CVM - API escuchando en http://localhost:${env.PORT}`);
    logger.info(`Entorno: ${env.NODE_ENV}`);
  });
}
