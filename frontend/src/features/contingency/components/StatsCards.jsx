import { Users, AlertTriangle, Pill, Utensils, Home, ShieldAlert } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export function StatsCards({ stats }) {
  if (!stats) return null;

  const items = [
    {
      label: 'Reportes totales',
      value: stats.total,
      sub: `${stats.totalAffected} personas afectadas`,
      icon: Users,
      color: 'bg-cvm-secondary text-white',
    },
    {
      label: 'Requieren apoyo',
      value: stats.needs.support,
      sub: 'Casos prioritarios',
      icon: AlertTriangle,
      color: 'bg-amber-500 text-white',
    },
    {
      label: 'Medicinas',
      value: stats.needs.medicine,
      sub: 'Solicitudes',
      icon: Pill,
      color: 'bg-red-600 text-white',
    },
    {
      label: 'Alimentos',
      value: stats.needs.food,
      sub: 'Solicitudes',
      icon: Utensils,
      color: 'bg-orange-500 text-white',
    },
    {
      label: 'Vivienda',
      value: stats.needs.housing,
      sub: 'Solicitudes',
      icon: Home,
      color: 'bg-rose-700 text-white',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {items.map((it) => (
        <Card key={it.label} padded={false} className="overflow-hidden">
          <div className="p-4 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-md flex items-center justify-center ${it.color}`}>
              <it.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-cvm-secondary leading-none">{it.value}</p>
              <p className="text-xs font-semibold text-slate-700 mt-1">{it.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{it.sub}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
