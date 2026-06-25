import { useContingencyStats } from '../features/contingency/hooks/useContingencyStats';
import { StatsCards } from '../features/contingency/components/StatsCards';
import { DashboardCharts } from '../features/contingency/components/DashboardCharts';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ExportButton } from '../features/contingency/components/ExportButton';
import { ListChecks, RefreshCcw } from 'lucide-react';

export function AdminDashboardPage() {
  const { data: stats, isLoading, refetch, isFetching } = useContingencyStats();

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif font-bold text-cvm-secondary">
            Dashboard de contingencia
          </h1>
          <p className="text-sm text-slate-600">
            Resumen ejecutivo de reportes de emergencia
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCcw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} /> Actualizar
          </Button>
          <Link to="/admin/reportes">
            <Button variant="secondary">
              <ListChecks className="h-4 w-4" /> Ver listado
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-500">
          Cargando estadísticas...
        </div>
      ) : (
        <>
          <StatsCards stats={stats} />
          <DashboardCharts stats={stats} />
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-slate-700">
              Exporte el consolidado para remitir al equipo logístico de la CVM.
            </p>
            <ExportButton />
          </div>
        </>
      )}
    </div>
  );
}
