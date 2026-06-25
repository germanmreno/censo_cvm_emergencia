import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/db.js';

export async function authOptional(req, _res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return next();
    const token = header.slice(7);
    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (user && user.active) {
      req.user = { id: user.id, email: user.email, fullName: user.fullName, role: user.role };
    }
    return next();
  } catch {
    return next();
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Autenticación requerida' },
    });
  }
  return next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Autenticación requerida' },
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'No tiene permisos para esta acción' },
      });
    }
    return next();
  };
}
