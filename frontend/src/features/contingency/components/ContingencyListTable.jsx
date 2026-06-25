import { Link } from 'react-router-dom';
import { formatDate } from '../../../lib/utils';
import { situationLabel } from '../../../lib/schemas/contingency';
import { StatusBadge } from './StatusBadge';
import { Pill, Utensils, Home } from 'lucide-react';

export function ContingencyListTable({ items = [], isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-500">
        Cargando reportes...
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-500">
        No hay reportes con los filtros aplicados.
      </div>
    );
  }
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Expediente</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Persona</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Cédula</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Gerencia</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Situación</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Necesita</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Estatus</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-xs font-mono text-slate-700">{r.fileNumber}</td>
                <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                  {formatDate(r.createdAt)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-cvm-secondary">
                  {r.firstName} {r.lastName}
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">{r.cedula}</td>
                <td className="px-4 py-3 text-xs text-slate-600 max-w-[180px] truncate" title={r.management}>
                  {r.management}
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  {situationLabel[r.currentSituation] ?? r.currentSituation}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {r.needsMedicine && <Pill className="h-3.5 w-3.5 text-red-600" aria-label="Medicinas" />}
                    {r.needsFood && <Utensils className="h-3.5 w-3.5 text-orange-600" aria-label="Alimentos" />}
                    {r.needsHousing && <Home className="h-3.5 w-3.5 text-rose-700" aria-label="Vivienda" />}
                    {!r.needsMedicine && !r.needsFood && !r.needsHousing && (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link
                    to={`/admin/reportes/${r.id}`}
                    className="text-cvm-secondary hover:text-cvm-secondary-light text-xs font-semibold underline-offset-2 hover:underline"
                  >
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
