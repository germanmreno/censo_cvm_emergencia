import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardHeader } from '../../../components/ui/Card';
import { situationLabel, statusLabel } from '../../../lib/schemas/contingency';

const COLORS = {
  SAFE: '#8FA463',
  INJURED: '#B91C1C',
  DISPLACED: '#F59E0B',
  MISSING_FAMILY: '#7C3AED',
  DECEASED: '#1F2937',
  OTHER: '#6B7280',
};

const STATUS_COLORS = ['#3B82F6', '#F59E0B', '#8FA463', '#6B7280'];

export function DashboardCharts({ stats }) {
  if (!stats) return null;

  const bySituation = stats.bySituation.map((s) => ({
    name: situationLabel[s.situation] ?? s.situation,
    value: s.count,
    key: s.situation,
  }));

  const byStatus = stats.byStatus.map((s) => ({
    name: statusLabel[s.status] ?? s.status,
    value: s.count,
  }));

  const byManagement = [...stats.byManagement]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((m) => ({ name: m.management, reportes: m.count }));

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader title="Situación reportada" description="Distribución por estado" />
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={bySituation}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(d) => `${d.value}`}
              >
                {bySituation.map((entry) => (
                  <Cell key={entry.key} fill={COLORS[entry.key] ?? '#6B7280'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardHeader title="Estatus de atención" description="Pipeline de casos" />
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {byStatus.map((_, i) => (
                  <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader
          title="Top 10 gerencias con reportes"
          description="Gerencias con mayor cantidad de casos registrados"
        />
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byManagement} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="reportes" fill="#0E2A47" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
