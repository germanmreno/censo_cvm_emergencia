import { prisma } from '../config/db.js';

export async function generateFileNumber() {
  const year = new Date().getFullYear();
  const prefix = `EMERG-${year}-`;
  const last = await prisma.contingencyCensus.findFirst({
    where: { fileNumber: { startsWith: prefix } },
    orderBy: { fileNumber: 'desc' },
    select: { fileNumber: true },
  });
  let nextSeq = 1;
  if (last) {
    const seqStr = last.fileNumber.slice(prefix.length);
    const seq = parseInt(seqStr, 10);
    if (!Number.isNaN(seq)) nextSeq = seq + 1;
  }
  return `${prefix}${String(nextSeq).padStart(5, '0')}`;
}
