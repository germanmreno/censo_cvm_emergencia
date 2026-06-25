import { prisma } from '../../config/db.js';
import { HttpError } from '../../middlewares/errorHandler.js';
import { generateFileNumber } from '../../utils/fileNumber.js';
import { writeAudit } from '../../utils/audit.js';

const STATUS_TRANSITIONS = {
  RECEIVED: ['IN_PROCESS', 'CLOSED'],
  IN_PROCESS: ['ATTENDED', 'CLOSED'],
  ATTENDED: ['CLOSED'],
  CLOSED: [],
};

function normalizeInput(data) {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    cedula: data.cedula.trim().toUpperCase(),
    contactPhone: data.contactPhone.trim(),
    management: data.management.trim(),
    currentLocation: data.currentLocation.trim(),
    currentSituation: data.currentSituation,
    situationOther: data.situationOther ?? null,
    needsSupport: data.needsSupport ?? false,
    needsMedicine: data.needsMedicine ?? false,
    medicineDetail: data.medicineDetail ?? null,
    needsFood: data.needsFood ?? false,
    needsHousing: data.needsHousing ?? false,
    affectedPeople: data.affectedPeople ?? 0,
    observations: data.observations ?? null,
  };
}

export async function createReport(input, actor) {
  const data = normalizeInput(input);

  const fileNumber = await generateFileNumber();

  const report = await prisma.contingencyCensus.create({
    data: {
      ...data,
      fileNumber,
      reportedById: actor?.id ?? null,
    },
  });

  await writeAudit({
    action: 'CREATE',
    entity: 'ContingencyCensus',
    entityId: report.id,
    actor,
    metadata: { fileNumber: report.fileNumber },
  });

  return report;
}

export async function listReports(query) {
  const where = {};
  if (query.status) where.status = query.status;
  if (query.management) where.management = { contains: query.management, mode: 'insensitive' };
  if (query.currentSituation) where.currentSituation = query.currentSituation;
  if (query.needsSupport !== undefined) where.needsSupport = query.needsSupport;
  if (query.needsMedicine !== undefined) where.needsMedicine = query.needsMedicine;
  if (query.needsFood !== undefined) where.needsFood = query.needsFood;
  if (query.needsHousing !== undefined) where.needsHousing = query.needsHousing;
  if (query.q) {
    where.OR = [
      { firstName: { contains: query.q, mode: 'insensitive' } },
      { lastName: { contains: query.q, mode: 'insensitive' } },
      { cedula: { contains: query.q, mode: 'insensitive' } },
      { fileNumber: { contains: query.q, mode: 'insensitive' } },
    ];
  }
  if (query.from || query.to) {
    where.createdAt = {};
    if (query.from) where.createdAt.gte = new Date(query.from);
    if (query.to) where.createdAt.lte = new Date(query.to);
  }

  const skip = (query.page - 1) * query.pageSize;
  const [items, total] = await Promise.all([
    prisma.contingencyCensus.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: query.pageSize,
      include: {
        reportedBy: { select: { id: true, fullName: true, email: true } },
        statusChangedBy: { select: { id: true, fullName: true, email: true } },
      },
    }),
    prisma.contingencyCensus.count({ where }),
  ]);

  return { items, total, page: query.page, pageSize: query.pageSize };
}

export async function getReport(id) {
  const report = await prisma.contingencyCensus.findUnique({
    where: { id },
    include: {
      reportedBy: { select: { id: true, fullName: true, email: true } },
      statusChangedBy: { select: { id: true, fullName: true, email: true } },
    },
  });
  if (!report) throw new HttpError(404, 'NOT_FOUND', 'Reporte no encontrado');
  return report;
}

export async function changeStatus(id, status, note, actor) {
  const current = await prisma.contingencyCensus.findUnique({ where: { id } });
  if (!current) throw new HttpError(404, 'NOT_FOUND', 'Reporte no encontrado');

  const allowed = STATUS_TRANSITIONS[current.status] ?? [];
  if (!allowed.includes(status) && current.status !== status) {
    throw new HttpError(
      400,
      'INVALID_TRANSITION',
      `Transición inválida: ${current.status} → ${status}`,
    );
  }

  const updated = await prisma.contingencyCensus.update({
    where: { id },
    data: {
      status,
      statusChangedById: actor?.id ?? null,
      observations: note
        ? [current.observations, `[${new Date().toISOString()}] ${note}`].filter(Boolean).join('\n')
        : current.observations,
    },
    include: {
      statusChangedBy: { select: { id: true, fullName: true, email: true } },
    },
  });

  await writeAudit({
    action: 'STATUS_CHANGE',
    entity: 'ContingencyCensus',
    entityId: id,
    actor,
    metadata: { from: current.status, to: status, note: note ?? null },
  });

  return updated;
}

export async function getStats() {
  const [byStatus, bySituation, byManagement, totals] = await Promise.all([
    prisma.contingencyCensus.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.contingencyCensus.groupBy({ by: ['currentSituation'], _count: { _all: true } }),
    prisma.contingencyCensus.groupBy({ by: ['management'], _count: { _all: true } }),
    prisma.contingencyCensus.aggregate({
      _count: { _all: true },
      _sum: { affectedPeople: true },
    }),
  ]);

  const needsCounts = await prisma.contingencyCensus.aggregate({
    _count: {
      needsSupport: true,
      needsMedicine: true,
      needsFood: true,
      needsHousing: true,
    },
    where: { needsSupport: true },
  });

  return {
    total: totals._count._all,
    totalAffected: totals._sum.affectedPeople ?? 0,
    byStatus: byStatus.map((r) => ({ status: r.status, count: r._count._all })),
    bySituation: bySituation.map((r) => ({ situation: r.currentSituation, count: r._count._all })),
    byManagement: byManagement.map((r) => ({ management: r.management, count: r._count._all })),
    needs: {
      support: needsCounts._count.needsSupport ?? 0,
      medicine: needsCounts._count.needsMedicine ?? 0,
      food: needsCounts._count.needsFood ?? 0,
      housing: needsCounts._count.needsHousing ?? 0,
    },
  };
}

export async function listForExport(query) {
  const where = {};
  if (query.status) where.status = query.status;
  if (query.management) where.management = { contains: query.management, mode: 'insensitive' };
  if (query.currentSituation) where.currentSituation = query.currentSituation;
  if (query.needsSupport !== undefined) where.needsSupport = query.needsSupport;
  if (query.from || query.to) {
    where.createdAt = {};
    if (query.from) where.createdAt.gte = new Date(query.from);
    if (query.to) where.createdAt.lte = new Date(query.to);
  }
  return prisma.contingencyCensus.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { reportedBy: { select: { fullName: true, email: true } } },
  });
}
