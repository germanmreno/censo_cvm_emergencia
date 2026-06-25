import {
  createContingencySchema,
  updateStatusSchema,
  listQuerySchema,
} from './contingency.schema.js';
import {
  createReport,
  listReports,
  getReport,
  changeStatus,
  getStats,
  listForExport,
} from './contingency.service.js';
import { writeAudit } from '../../utils/audit.js';
import { toCsv } from '../../utils/csv.js';
import { toXlsxBuffer } from '../../utils/excel.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const postContingency = asyncHandler(async (req, res) => {
  const data = createContingencySchema.parse(req.body);
  const report = await createReport(data, req.user);
  res.status(201).json({ data: report });
});

export const getContingencyList = asyncHandler(async (req, res) => {
  const query = listQuerySchema.parse(req.query);
  const result = await listReports(query);
  res.json({ data: result });
});

export const getContingencyOne = asyncHandler(async (req, res) => {
  const report = await getReport(req.params.id);
  res.json({ data: report });
});

export const patchContingencyStatus = asyncHandler(async (req, res) => {
  const { status, note } = updateStatusSchema.parse(req.body);
  const updated = await changeStatus(req.params.id, status, note, req.user);
  res.json({ data: updated });
});

export const getContingencyStats = asyncHandler(async (_req, res) => {
  const stats = await getStats();
  res.json({ data: stats });
});

export const exportCsv = asyncHandler(async (req, res) => {
  const query = listQuerySchema.parse(req.query);
  const rows = await listForExport(query);
  const csv = toCsv(rows);
  await writeAudit({
    action: 'EXPORT_CSV',
    entity: 'ContingencyCensus',
    actor: req.user,
    metadata: { count: rows.length },
  });
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="censo-emergencia-${Date.now()}.csv"`);
  res.send(csv);
});

export const exportXlsx = asyncHandler(async (req, res) => {
  const query = listQuerySchema.parse(req.query);
  const rows = await listForExport(query);
  const buf = await toXlsxBuffer(rows);
  await writeAudit({
    action: 'EXPORT_XLSX',
    entity: 'ContingencyCensus',
    actor: req.user,
    metadata: { count: rows.length },
  });
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="censo-emergencia-${Date.now()}.xlsx"`,
  );
  res.send(Buffer.from(buf));
});
