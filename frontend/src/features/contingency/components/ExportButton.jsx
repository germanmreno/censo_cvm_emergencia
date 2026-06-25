import { useState } from 'react';
import { FileDown, FileSpreadsheet, Loader2 } from 'lucide-react';
import { api } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { downloadBlob } from '../../../lib/utils';

export function ExportButton({ filters = {} }) {
  const [loading, setLoading] = useState(null);

  const buildParams = () =>
    Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== '' && v !== null),
    );

  const exportCsv = async () => {
    setLoading('csv');
    try {
      const { data } = await api.get('/contingency/export.csv', {
        params: buildParams(),
        responseType: 'blob',
      });
      downloadBlob(data, `censo-emergencia-${Date.now()}.csv`);
    } finally {
      setLoading(null);
    }
  };

  const exportXlsx = async () => {
    setLoading('xlsx');
    try {
      const { data } = await api.get('/contingency/export.xlsx', {
        params: buildParams(),
        responseType: 'blob',
      });
      downloadBlob(data, `censo-emergencia-${Date.now()}.xlsx`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={exportCsv} disabled={loading !== null}>
        {loading === 'csv' ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
        Exportar CSV
      </Button>
      <Button variant="secondary" onClick={exportXlsx} disabled={loading !== null}>
        {loading === 'xlsx' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="h-4 w-4" />
        )}
        Exportar Excel
      </Button>
    </div>
  );
}
