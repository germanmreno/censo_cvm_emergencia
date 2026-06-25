import { ZodError } from 'zod';
import { logger } from '../config/logger.js';

export class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function notFound(req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Recurso no encontrado' } });
}

export function errorHandler(err, req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Datos inválidos',
        details: err.flatten().fieldErrors,
      },
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  if (err?.code === 'P2002') {
    return res.status(409).json({
      error: { code: 'DUPLICATE', message: 'Registro duplicado', details: err.meta },
    });
  }

  if (err?.code === 'P2025') {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Recurso no encontrado' },
    });
  }

  logger.error({ err, path: req.path }, 'Error no controlado');
  return res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' },
  });
}
