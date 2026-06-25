import { AlertTriangle } from 'lucide-react';

export function EmergencyBanner() {
  return (
    <div className="w-full bg-cvm-emergency text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 flex-shrink-0" aria-hidden />
        <div className="text-sm sm:text-base font-medium">
          <span className="font-bold">EMERGENCIA ACTIVA</span>
          <span className="mx-2 hidden sm:inline">·</span>
          <span className="block sm:inline">
            Sismo magnitud 7.2 / 7.5 en Venezuela — Reporte su situación al Censo de Contingencia CVM
          </span>
        </div>
      </div>
    </div>
  );
}
