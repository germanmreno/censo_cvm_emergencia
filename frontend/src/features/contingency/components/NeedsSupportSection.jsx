import { useState, useEffect } from 'react';
import { Pill, Utensils, Home } from 'lucide-react';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Label, FieldError } from '../../../components/ui/Field';

export function NeedsSupportSection({ register, watch, setValue, errors }) {
  const needsMedicine = watch('needsMedicine');
  const needsFood = watch('needsFood');
  const needsHousing = watch('needsHousing');
  const [showDetail, setShowDetail] = useState(needsMedicine);

  useEffect(() => {
    setShowDetail(!!needsMedicine);
    if (!needsMedicine) setValue('medicineDetail', '', { shouldValidate: false });
  }, [needsMedicine, setValue]);

  const anyNeed = needsMedicine || needsFood || needsHousing;

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
        <p className="text-sm font-semibold text-amber-900 mb-3">
          ¿Requiere apoyo? Marque lo que necesite:
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-md border border-amber-200 p-3">
            <Checkbox
              label={
                <span className="flex items-center gap-2 font-semibold">
                  <Pill className="h-4 w-4 text-cvm-emergency" /> Medicinas
                </span>
              }
              checked={needsMedicine}
              onChange={(v) => setValue('needsMedicine', v, { shouldValidate: true })}
            />
            {needsMedicine && (
              <div className="mt-3">
                <Label htmlFor="medicineDetail" required>
                  Especifique
                </Label>
                <Textarea
                  id="medicineDetail"
                  rows={2}
                  placeholder="Ej: Losartán 50mg cada 12h, Insulina NPH..."
                  {...register('medicineDetail')}
                  error={errors.medicineDetail?.message}
                />
                <FieldError>{errors.medicineDetail?.message}</FieldError>
              </div>
            )}
          </div>

          <label className="bg-white rounded-md border border-amber-200 p-3 cursor-pointer flex items-start">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-cvm-primary focus:ring-cvm-primary"
              checked={needsFood}
              onChange={(e) => setValue('needsFood', e.target.checked, { shouldValidate: true })}
            />
            <span className="ml-2 flex items-center gap-2 font-semibold text-slate-800">
              <Utensils className="h-4 w-4 text-cvm-emergency" /> Alimentos
            </span>
          </label>

          <label className="bg-white rounded-md border border-amber-200 p-3 cursor-pointer flex items-start">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-cvm-primary focus:ring-cvm-primary"
              checked={needsHousing}
              onChange={(e) => setValue('needsHousing', e.target.checked, { shouldValidate: true })}
            />
            <span className="ml-2 flex items-center gap-2 font-semibold text-slate-800">
              <Home className="h-4 w-4 text-cvm-emergency" /> Vivienda
            </span>
          </label>
        </div>
        <input type="hidden" {...register('needsSupport')} value={anyNeed ? 'true' : 'false'} />
      </div>
    </div>
  );
}
