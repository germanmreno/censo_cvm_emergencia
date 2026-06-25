import { Link } from 'react-router-dom';
import { ShieldAlert, FileText, BarChart3, ArrowRight } from 'lucide-react';
import { EmergencyBanner } from '../components/EmergencyBanner';
import { InstitutionalHeader } from '../components/InstitutionalHeader';
import { EmergencyContacts } from '../components/EmergencyContacts';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuthContext } from '../features/contingency/hooks/authContext';

export function HomePage() {
  const { user } = useAuthContext();
  return (
    <div className="min-h-screen flex flex-col bg-cvm-background">
      <EmergencyBanner />
      <InstitutionalHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-cvm-secondary mb-3">
            Censo de Contingencia CVM
          </h1>
          <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto">
            Plataforma para registrar la situación del personal y sus familias de la Corporación
            Venezolana de Minería ante la emergencia sísmica que afecta a Venezuela.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Card className="border-l-4 border-l-cvm-emergency">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-md bg-cvm-emergency text-white flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-display font-bold text-cvm-secondary mb-1">
                  Reportar mi situación
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  Complete el formulario de censo. Sus datos son confidenciales.
                </p>
                <Link to="/reporte">
                  <Button variant="danger">
                    Iniciar reporte <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-cvm-secondary">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-md bg-cvm-secondary text-white flex items-center justify-center flex-shrink-0">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-display font-bold text-cvm-secondary mb-1">
                  Panel administrativo
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  Dashboard, listado y exportación para equipos de respuesta.
                </p>
                {user ? (
                  <Link to="/admin">
                    <Button variant="primary">Ir al panel <ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                ) : (
                  <Link to="/admin/login">
                    <Button variant="primary">Acceder <ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        </div>

        <EmergencyContacts />
      </main>

      <footer className="bg-cvm-secondary text-white text-center text-xs py-4">
        © {new Date().getFullYear()} Corporación Venezolana de Minería — Censo de Contingencia
      </footer>
    </div>
  );
}
