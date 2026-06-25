import { stringify } from 'csv-stringify/sync';

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

function bool(v) {
  return v ? 'Sí' : 'No';
}

export function toCsv(rows) {
  const records = rows.map((r) => [
    r.fileNumber,
    new Date(r.createdAt).toISOString(),
    r.firstName,
    r.lastName,
    r.cedula,
    r.contactPhone,
    r.management,
    r.currentLocation,
    SITUATION_LABEL[r.currentSituation] ?? r.currentSituation,
    r.situationOther ?? '',
    r.affectedPeople,
    bool(r.needsSupport),
    bool(r.needsMedicine),
    r.medicineDetail ?? '',
    bool(r.needsFood),
    bool(r.needsHousing),
    r.observations ?? '',
    STATUS_LABEL[r.status] ?? r.status,
    r.reportedBy?.fullName ?? r.reportedBy?.email ?? '',
  ]);
  return stringify([HEADERS, ...records], { quoted: false });
}
