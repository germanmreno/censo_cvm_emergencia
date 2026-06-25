import { Link } from 'react-router-dom';

export function InstitutionalHeader({ showAdminLink = false }) {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap sm:flex-nowrap">
          <img
            src="/branding/logo_ministerio.png"
            alt="Ministerio del Poder Popular de Desarrollo Minero Ecológico e Industrias Básicas"
            className="h-10 sm:h-14 w-auto object-contain flex-shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />

          <div
            aria-hidden
            className="hidden sm:block h-12 sm:h-14 w-px bg-slate-300 flex-shrink-0"
          />

          <Link to="/" className="flex items-center gap-3 min-w-0 flex-1">
            <img
              src="/branding/logo_cvm.png"
              alt="Corporación Venezolana de Minería"
              className="h-11 sm:h-14 w-auto object-contain flex-shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="leading-tight min-w-0">
              <p className="text-[9px] sm:text-[11px] uppercase tracking-wider text-slate-600 font-bold truncate">
                Corporación Venezolana de Minería
              </p>
              <p className="font-display text-cvm-secondary text-base sm:text-xl font-bold truncate">
                Censo de Contingencia
              </p>
            </div>
          </Link>

          {showAdminLink && (
            <Link
              to="/admin/login"
              className="text-xs sm:text-sm text-cvm-secondary hover:text-cvm-secondary-light font-semibold underline-offset-4 hover:underline whitespace-nowrap"
            >
              Acceso administrativo
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
