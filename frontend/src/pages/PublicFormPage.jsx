import { Link } from 'react-router-dom';
import { EmergencyBanner } from '../components/EmergencyBanner';
import { InstitutionalHeader } from '../components/InstitutionalHeader';
import { EmergencyContacts } from '../components/EmergencyContacts';
import { ContingencyForm } from '../features/contingency/components/ContingencyForm';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export function PublicFormPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cvm-background">
      <EmergencyBanner />
      <InstitutionalHeader showAdminLink />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-cvm-secondary hover:text-cvm-secondary-light mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Inicio
        </Link>

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-3">
            <ShieldAlert className="h-8 w-8 text-cvm-emergency" />
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-cvm-secondary">
              Reporte de situación por emergencia sísmica
            </h1>
          </div>
          <p className="text-slate-700 text-sm sm:text-base">
            Complete el siguiente formulario para registrar su situación actual. La información será
            recibida por la Corporación Venezolana de Minería para coordinar apoyo oportuno.
            Toda la información es confidencial y se utiliza únicamente con fines de asistencia
            humanitaria.
          </p>
        </div>

        <ContingencyForm />

        <div className="mt-8">
          <EmergencyContacts variant="compact" defaultOpen={true} />
        </div>
      </main>

      <footer className="bg-cvm-secondary text-white text-center text-xs py-4">
        © {new Date().getFullYear()} Corporación Venezolana de Minería — Censo de Contingencia
      </footer>
    </div>
  );
}
