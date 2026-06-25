import ExcelJS from 'exceljs';

const SITUATION_LABEL = {
  SAFE: 'A salvo',
  INJURED: 'Herido/a',
  DISPLACED: 'Desplazado/a',
  MISSING_FAMILY: 'Familia desaparecida',
  DECEASED: 'Fallecido/a',
  OTHER: 'Otro',
};

const STATUS_LABEL = {
  RECEIVED: 'Recibido',
  IN_PROCESS: 'En proceso',
  ATTENDED: 'Atendido',
  CLOSED: 'Cerrado',
};

const HEADERS = [
  'N° Expediente',
  'Fecha',
  'Nombres',
  'Apellidos',
  'Cédula',
  'Teléfono',
  'Gerencia',
  'Ubicación actual',
  'Situación',
  'Detalle situación',
  'Personas afectadas',
  'Requiere apoyo',
  'Medicinas',
  'Detalle medicinas',
  'Alimentos',
  'Vivienda',
  'Observaciones',
  'Estatus',
  'Reportado por',
];

export async function toXlsxBuffer(rows) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'CVM - Censo de Contingencia';
  wb.created = new Date();

  const ws = wb.addWorksheet('Censo');
  ws.columns = HEADERS.map((h) => ({ header: h, key: h, width: 22 }));
  ws.getRow(1).font = { bold: true };
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0E2A47' } };
  ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  for (const r of rows) {
    ws.addRow({
      'N° Expediente': r.fileNumber,
      'Fecha': new Date(r.createdAt).toISOString(),
      'Nombres': r.firstName,
      'Apellidos': r.lastName,
      'Cédula': r.cedula,
      'Teléfono': r.contactPhone,
      'Gerencia': r.management,
      'Ubicación actual': r.currentLocation,
      'Situación': SITUATION_LABEL[r.currentSituation] ?? r.currentSituation,
      'Detalle situación': r.situationOther ?? '',
      'Personas afectadas': r.affectedPeople,
      'Requiere apoyo': r.needsSupport ? 'Sí' : 'No',
      'Medicinas': r.needsMedicine ? 'Sí' : 'No',
      'Detalle medicinas': r.medicineDetail ?? '',
      'Alimentos': r.needsFood ? 'Sí' : 'No',
      'Vivienda': r.needsHousing ? 'Sí' : 'No',
      'Observaciones': r.observations ?? '',
      'Estatus': STATUS_LABEL[r.status] ?? r.status,
      'Reportado por': r.reportedBy?.fullName ?? r.reportedBy?.email ?? '',
    });
  }

  ws.autoFilter = { from: 'A1', to: { row: 1, column: HEADERS.length } };
  ws.eachRow((row) => (row.alignment = { vertical: 'middle', wrapText: true }));

  return wb.xlsx.writeBuffer();
}
