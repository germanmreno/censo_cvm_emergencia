import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { contingencyFormSchema, contingencySituationOptions, situationLabel } from '../../../lib/schemas/contingency';
import { api, extractApiError } from '../../../lib/api';
import { useSubmitContingency } from '../hooks/useSubmitContingency';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { Label, FieldError, FieldHint } from '../../../components/ui/Field';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Alert } from '../../../components/ui/Alert';
import { EmergencyContacts } from '../../../components/EmergencyContacts';
import { NeedsSupportSection } from './NeedsSupportSection';

export function ContingencyForm() {
  const navigate = useNavigate();
  const [submittedFileNumber, setSubmittedFileNumber] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contingencyFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      cedula: '',
      contactPhone: '',
      management: '',
      currentLocation: '',
      currentSituation: 'SAFE',
      situationOther: '',
      needsSupport: false,
      needsMedicine: false,
      medicineDetail: '',
      needsFood: false,
      needsHousing: false,
      affectedPeople: 0,
      observations: '',
    },
  });

  const submitMutation = useSubmitContingency();

  const onSubmit = async (values) => {
    setSubmitError(null);
    const payload = {
      ...values,
      needsSupport: values.needsMedicine || values.needsFood || values.needsHousing,
      situationOther: values.situationOther || null,
      medicineDetail: values.medicineDetail || null,
      observations: values.observations || null,
    };
    try {
      const result = await submitMutation.mutateAsync(payload);
      setSubmittedFileNumber(result.data.fileNumber);
    } catch (err) {
      setSubmitError(extractApiError(err, 'No se pudo enviar el reporte'));
    }
  };

  if (submittedFileNumber) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="text-center py-6">
            <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-2xl font-display font-bold text-cvm-secondary mb-2">
              Reporte enviado correctamente
            </h3>
            <p className="text-slate-700 mb-4">
              Su número de expediente es:
              <span className="block mt-2 text-2xl font-mono font-bold text-cvm-emergency">
                {submittedFileNumber}
              </span>
            </p>
            <p className="text-sm text-slate-600 mb-6">
              Guarde este número para cualquier seguimiento. Un operador de la CVM se pondrá en
              contacto con usted si requiere apoyo inmediato.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate(0)}>
                Registrar otro reporte
              </Button>
              <Button variant="primary" onClick={() => navigate('/')}>
                Volver al inicio
              </Button>
            </div>
          </div>
        </Card>

        <EmergencyContacts variant="success" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <Alert variant="danger" icon={AlertCircle}>
          {submitError}
        </Alert>
      )}

      <Card>
        <CardHeader
          title="Datos personales"
          description="Información del trabajador o familiar afectado"
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" required>Nombres</Label>
            <Input id="firstName" autoComplete="given-name" {...register('firstName')} error={errors.firstName?.message} />
            <FieldError>{errors.firstName?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="lastName" required>Apellidos</Label>
            <Input id="lastName" autoComplete="family-name" {...register('lastName')} error={errors.lastName?.message} />
            <FieldError>{errors.lastName?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="cedula" required>Cédula</Label>
            <Input
              id="cedula"
              placeholder="V-12345678"
              autoComplete="off"
              {...register('cedula')}
              error={errors.cedula?.message}
            />
            <FieldHint>Formatos válidos: V-, E-, N- seguido de 6 a 8 dígitos</FieldHint>
            <FieldError>{errors.cedula?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="contactPhone" required>Número de contacto</Label>
            <Input
              id="contactPhone"
              type="tel"
              placeholder="04141234567"
              autoComplete="tel"
              {...register('contactPhone')}
              error={errors.contactPhone?.message}
            />
            <FieldError>{errors.contactPhone?.message}</FieldError>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="management" required>Gerencia de adscripción</Label>
            <Input
              id="management"
              placeholder="Ej: Gerencia de Recursos Humanos"
              {...register('management')}
              error={errors.management?.message}
            />
            <FieldError>{errors.management?.message}</FieldError>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Situación actual" description="Estado y ubicación en este momento" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentLocation" required>Ubicación actual</Label>
            <Input
              id="currentLocation"
              placeholder="Ciudad, estado o dirección de referencia"
              {...register('currentLocation')}
              error={errors.currentLocation?.message}
            />
            <FieldError>{errors.currentLocation?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="currentSituation" required>Situación actual</Label>
            <Select
              id="currentSituation"
              {...register('currentSituation')}
              error={errors.currentSituation?.message}
            >
              {contingencySituationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
            <FieldError>{errors.currentSituation?.message}</FieldError>
          </div>
          {watch('currentSituation') === 'OTHER' && (
            <div className="sm:col-span-2">
              <Label htmlFor="situationOther" required>Detalle de la situación</Label>
              <Input id="situationOther" {...register('situationOther')} error={errors.situationOther?.message} />
              <FieldError>{errors.situationOther?.message}</FieldError>
            </div>
          )}
          <div>
            <Label htmlFor="affectedPeople">Personas afectadas (grupo familiar)</Label>
            <Input
              id="affectedPeople"
              type="number"
              min={0}
              max={50}
              {...register('affectedPeople', { valueAsNumber: true })}
              error={errors.affectedPeople?.message}
            />
            <FieldHint>0 si no hay otras personas afectadas</FieldHint>
            <FieldError>{errors.affectedPeople?.message}</FieldError>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Apoyo requerido" description="Marque las necesidades prioritarias" />
        <NeedsSupportSection
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
        />
      </Card>

      <Card>
        <CardHeader title="Observaciones" description="Información adicional relevante (opcional)" />
        <Textarea
          id="observations"
          rows={4}
          placeholder="Cualquier dato que ayude a los equipos de emergencia..."
          {...register('observations')}
          error={errors.observations?.message}
        />
        <FieldError>{errors.observations?.message}</FieldError>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Enviando reporte...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Enviar reporte
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
