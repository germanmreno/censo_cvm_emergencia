import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Label } from '../components/ui/Field';
import { ContingencyListTable } from '../features/contingency/components/ContingencyListTable';
import { ExportButton } from '../features/contingency/components/ExportButton';
import { useContingencyList } from '../features/contingency/hooks/useContingencyList';
import {
  contingencyStatusOptions,
  contingencySituationOptions,
} from '../lib/schemas/contingency';

export function AdminListPage() {
  const [filters, setFilters] = useState({
    status: '',
    currentSituation: '',
    needsSupport: '',
    q: '',
    page: 1,
    pageSize: 50,
  });

  const { data, isLoading, isFetching } = useContingencyList(filters);

  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v, page: 1 }));
  const clear = () =>
    setFilters({ status: '', currentSituation: '', needsSupport: '', q: '', page: 1, pageSize: 50 });

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif font-bold text-cvm-secondary">Reportes</h1>
          <p className="text-sm text-slate-600">
            {isFetching ? 'Actualizando...' : `${total} reporte${total === 1 ? '' : 's'} encontrado${total === 1 ? '' : 's'}`}
          </p>
        </div>
        <ExportButton filters={filters} />
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="lg:col-span-2">
          <Label htmlFor="q">Búsqueda</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="q"
              placeholder="Nombre, cédula, expediente..."
              value={filters.q}
              onChange={(e) => set('q', e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="status">Estatus</Label>
          <Select id="status" value={filters.status} onChange={(e) => set('status', e.target.value)}>
            <option value="">Todos</option>
            {contingencyStatusOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="currentSituation">Situación</Label>
          <Select
            id="currentSituation"
            value={filters.currentSituation}
            onChange={(e) => set('currentSituation', e.target.value)}
          >
            <option value="">Todas</option>
            {contingencySituationOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="needsSupport">¿Requiere apoyo?</Label>
          <Select
            id="needsSupport"
            value={filters.needsSupport}
            onChange={(e) => set('needsSupport', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </Select>
        </div>
        <div className="lg:col-span-5 flex justify-end">
          <Button variant="ghost" onClick={clear}>
            <X className="h-4 w-4" /> Limpiar filtros
          </Button>
        </div>
      </div>

      <ContingencyListTable items={data?.items ?? []} isLoading={isLoading} />

      {total > filters.pageSize && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-slate-600">
            Página {filters.page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page >= totalPages}
              onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
