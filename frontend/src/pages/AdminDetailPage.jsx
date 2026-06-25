import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Building2, FileText, Pill, Utensils, Home, Users, User, Save } from 'lucide-react';
import { useContingency } from '../features/contingency/hooks/useContingencyStats';
import { useChangeStatus } from '../features/contingency/hooks/useChangeStatus';
import { StatusBadge } from '../features/contingency/components/StatusBadge';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Label, FieldHint } from '../components/ui/Field';
import { Alert } from '../components/ui/Alert';
import { formatDate } from '../lib/utils';
import {
  situationLabel,
  statusLabel,
  STATUS_TRANSITIONS,
  contingencyStatusOptions,
} from '../lib/schemas/contingency';

export function AdminDetailPage() {
  const { id } = useParams();
  const { data: report, isLoading, error } = useContingency(id);
  const changeStatus = useChangeStatus();
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-500">
        Cargando reporte...
      </div>
    );
  }
  if (error || !report) {
    return (
      <div className="space-y-4">
        <Link to="/admin/reportes">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" /> Volver al listado
          </Button>
        </Link>
        <Alert variant="danger">No se pudo cargar el reporte.</Alert>
      </div>
    );
  }

  const allowed = STATUS_TRANSITIONS[report.status] ?? [];
  const canChange = allowed.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newStatus) return;
    await changeStatus.mutateAsync({ id: report.id, status: newStatus, note: note || undefined });
    setNewStatus('');
    setNote('');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Link
            to="/admin/reportes"
            className="inline-flex items-center gap-1.5 text-sm text-cvm-secondary hover:text-cvm-secondary-light mb-2"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al listado
          </Link>
          <h1 className="text-2xl font-serif font-bold text-cvm-secondary">
            Reporte {report.fileNumber}
          </h1>
          <p className="text-sm text-slate-600">Registrado el {formatDate(report.createdAt)}</p>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader title="Datos personales" />
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs font-semibold text-slate-500 uppercase">Nombres</dt>
                <dd className="text-cvm-secondary font-medium mt-1">{report.firstName}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500 uppercase">Apellidos</dt>
                <dd className="text-cvm-secondary font-medium mt-1">{report.lastName}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500 uppercase">Cédula</dt>
                <dd className="text-slate-800 font-mono mt-1">{report.cedula}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500 uppercase">Teléfono</dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${report.contactPhone}`}
                    className="inline-flex items-center gap-1.5 text-cvm-secondary font-semibold hover:underline"
                  >
                    <Phone className="h-4 w-4" /> {report.contactPhone}
                  </a>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold text-slate-500 uppercase">Gerencia</dt>
                <dd className="text-slate-800 mt-1 inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-slate-500" /> {report.management}
                </dd>
              </div>
            </dl>
          </Card>

          <Card>
            <CardHeader title="Situación actual" />
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold text-slate-500 uppercase">Ubicación</dt>
                <dd className="text-slate-800 mt-1 inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-500" /> {report.currentLocation}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500 uppercase">Situación</dt>
                <dd className="text-slate-800 font-medium mt-1">
                  {situationLabel[report.currentSituation] ?? report.currentSituation}
                </dd>
                {report.situationOther && (
                  <p className="text-xs text-slate-600 mt-1">{report.situationOther}</p>
                )}
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500 uppercase">Personas afectadas</dt>
                <dd className="text-slate-800 font-medium mt-1 inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-slate-500" /> {report.affectedPeople}
                </dd>
              </div>
            </dl>
          </Card>

          <Card>
            <CardHeader title="Apoyo requerido" />
            <div className="grid sm:grid-cols-3 gap-3">
              <NeedCard
                icon={Pill}
                title="Medicinas"
                active={report.needsMedicine}
                detail={report.medicineDetail}
              />
              <NeedCard
                icon={Utensils}
                title="Alimentos"
                active={report.needsFood}
              />
              <NeedCard
                icon={Home}
                title="Vivienda"
                active={report.needsHousing}
              />
            </div>
          </Card>

          {report.observations && (
            <Card>
              <CardHeader title="Observaciones" />
              <div className="text-sm text-slate-700 whitespace-pre-wrap">
                {report.observations}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Cambiar estatus" />
            {!canChange ? (
              <Alert variant="info">
                Este reporte está cerrado. No admite más cambios.
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Label htmlFor="newStatus">Nuevo estatus</Label>
                  <Select
                    id="newStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    required
                  >
                    <option value="">Seleccione...</option>
                    {allowed.map((s) => (
                      <option key={s} value={s}>
                        {statusLabel[s]}
                      </option>
                    ))}
                  </Select>
                  <FieldHint>
                    Estatus actual: <strong>{statusLabel[report.status]}</strong>
                  </FieldHint>
                </div>
                <div>
                  <Label htmlFor="note">Nota (opcional)</Label>
                  <Textarea
                    id="note"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Comentario de seguimiento..."
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={!newStatus || changeStatus.isLoading}
                >
                  <Save className="h-4 w-4" />
                  {changeStatus.isLoading ? 'Guardando...' : 'Actualizar estatus'}
                </Button>
              </form>
            )}
          </Card>

          <Card>
            <CardHeader title="Auditoría" />
            <dl className="text-sm space-y-2">
              <div>
                <dt className="text-xs font-semibold text-slate-500 uppercase">Reportado por</dt>
                <dd className="text-slate-800 inline-flex items-center gap-1.5 mt-0.5">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  {report.reportedBy?.fullName ?? report.reportedBy?.email ?? 'Público (auto-reporte)'}
                </dd>
              </div>
              {report.statusChangedBy && (
                <div>
                  <dt className="text-xs font-semibold text-slate-500 uppercase">Último cambio por</dt>
                  <dd className="text-slate-800 mt-0.5">
                    {report.statusChangedBy.fullName} ({formatDate(report.updatedAt)})
                  </dd>
                </div>
              )}
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}

function NeedCard({ icon: Icon, title, active, detail }) {
  return (
    <div
      className={`rounded-md border p-3 ${
        active
          ? 'border-red-300 bg-red-50'
          : 'border-slate-200 bg-slate-50 opacity-60'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`h-4 w-4 ${active ? 'text-cvm-emergency' : 'text-slate-400'}`} />
        <span className={`text-sm font-semibold ${active ? 'text-cvm-emergency' : 'text-slate-500'}`}>
          {title}
        </span>
        <span className={`ml-auto text-xs font-bold ${active ? 'text-red-700' : 'text-slate-400'}`}>
          {active ? 'SÍ' : 'NO'}
        </span>
      </div>
      {detail && <p className="text-xs text-slate-700">{detail}</p>}
    </div>
  );
}
