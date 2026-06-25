import { prisma } from '../config/db.js';

export async function writeAudit({ action, entity, entityId, actor, metadata }) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId: entityId ?? null,
        actorId: actor?.id ?? null,
        actorEmail: actor?.email ?? null,
        metadata: metadata ?? undefined,
      },
    });
  } catch (err) {
    console.error('Error escribiendo audit log:', err);
  }
}
