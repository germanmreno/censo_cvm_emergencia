import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import contingencyRoutes from './modules/contingency/contingency.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import { prisma } from './config/db.js';
import { logger } from './config/logger.js';

export function buildApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowed = env.CORS_ORIGIN.split(',').map((s) => s.trim()).filter(Boolean);
        if (!origin || allowed.includes('*') || allowed.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`CORS: origen no permitido: ${origin}`));
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '512kb' }));

  app.get('/health', async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'ok', db: 'up', time: new Date().toISOString() });
    } catch (err) {
      logger.error({ err }, 'Health check DB error');
      res.status(503).json({ status: 'degraded', db: 'down' });
    }
  });

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/contingency', contingencyRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
