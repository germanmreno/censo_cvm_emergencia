import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, ListChecks, ShieldCheck } from 'lucide-react';
import { EmergencyBanner } from '../EmergencyBanner';
import { InstitutionalHeader } from '../InstitutionalHeader';
import { useAuthContext } from '../../features/contingency/hooks/authContext';
import { cn } from '../../lib/utils';

export function AdminLayout() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <EmergencyBanner />
      <InstitutionalHeader />

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3">
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="h-4 w-4 text-cvm-secondary" />
            <span className="font-semibold text-cvm-secondary">{user?.fullName}</span>
            <span className="text-xs text-slate-500">({user?.role})</span>
          </div>
          <div className="flex items-center gap-1">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition',
                  isActive
                    ? 'bg-cvm-secondary text-white'
                    : 'text-cvm-secondary hover:bg-slate-100',
                )
              }
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </NavLink>
            <NavLink
              to="/admin/reportes"
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition',
                  isActive
                    ? 'bg-cvm-secondary text-white'
                    : 'text-cvm-secondary hover:bg-slate-100',
                )
              }
            >
              <ListChecks className="h-4 w-4" /> Reportes
            </NavLink>
            <button
              onClick={handleLogout}
              className="ml-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold text-cvm-emergency hover:bg-red-50 transition"
            >
              <LogOut className="h-4 w-4" /> Salir
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>

      <footer className="bg-cvm-secondary text-white text-center text-xs py-3">
        © {new Date().getFullYear()} CVM — Panel de contingencia
      </footer>
    </div>
  );
}
