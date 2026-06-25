import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const publicLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_PUBLIC,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT',
      message: 'Demasiadas solicitudes. Intente nuevamente en un minuto.',
    },
  },
});

export const loginLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_LOGIN,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT',
      message: 'Demasiados intentos de inicio de sesión. Intente en un minuto.',
    },
  },
});
