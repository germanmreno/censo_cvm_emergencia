import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import { EmergencyBanner } from '../components/EmergencyBanner';
import { InstitutionalHeader } from '../components/InstitutionalHeader';
import { Input } from '../components/ui/Input';
import { Label, FieldError } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { useAuthContext } from '../features/contingency/hooks/authContext';
import { loginSchema } from '../lib/schemas/contingency';
import { extractApiError } from '../lib/api';

export function AdminLoginPage() {
  const { user, login } = useAuthContext();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  if (user) return <Navigate to="/admin" replace />;

  const onSubmit = async ({ email, password }) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setSubmitError(extractApiError(err, 'Credenciales inválidas'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cvm-background">
      <EmergencyBanner />
      <InstitutionalHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-cvm-secondary hover:text-cvm-secondary-light mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="h-7 w-7 text-cvm-secondary" />
            <h1 className="text-2xl font-serif font-bold text-cvm-secondary">
              Acceso administrativo
            </h1>
          </div>
          <p className="text-sm text-slate-600 mb-6">
            Panel de gestión y seguimiento de reportes
          </p>

          {submitError && (
            <Alert variant="danger" icon={AlertCircle} className="mb-4">
              {submitError}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email" required>Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                error={errors.email?.message}
              />
              <FieldError>{errors.email?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor="password" required>Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                error={errors.password?.message}
              />
              <FieldError>{errors.password?.message}</FieldError>
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
