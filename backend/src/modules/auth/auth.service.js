import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/db.js';
import { env } from '../../config/env.js';
import { HttpError } from '../../middlewares/errorHandler.js';
import { writeAudit } from '../../utils/audit.js';

function signAccess(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );
}

function signRefresh(user) {
  return jwt.sign({ sub: user.id, type: 'refresh' }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user || !user.active) {
    throw new HttpError(401, 'INVALID_CREDENTIALS', 'Credenciales inválidas');
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new HttpError(401, 'INVALID_CREDENTIALS', 'Credenciales inválidas');
  }

  const accessToken = signAccess(user);
  const refreshToken = signRefresh(user);

  await writeAudit({
    action: 'LOGIN',
    entity: 'User',
    entityId: user.id,
    actor: { id: user.id, email: user.email },
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
  };
}

export async function refresh(token) {
  if (!token) throw new HttpError(401, 'UNAUTHORIZED', 'Refresh token requerido');
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
    if (payload.type !== 'refresh') {
      throw new HttpError(401, 'UNAUTHORIZED', 'Token inválido');
    }
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.active) {
      throw new HttpError(401, 'UNAUTHORIZED', 'Usuario no disponible');
    }
    return {
      accessToken: signAccess(user),
      refreshToken: signRefresh(user),
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    };
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new HttpError(401, 'UNAUTHORIZED', 'Refresh token inválido o expirado');
  }
}

export async function me(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, fullName: true, role: true },
  });
  if (!user) throw new HttpError(404, 'NOT_FOUND', 'Usuario no encontrado');
  return user;
}
