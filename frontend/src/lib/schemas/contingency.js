import { z } from 'zod';

const cedulaRegex = /^[VENE]-\d{6,8}$/i;

export const contingencySituationOptions = [
  { value: 'SAFE', label: 'A salvo' },
  { value: 'INJURED', label: 'Herido/a' },
  { value: 'DISPLACED', label: 'Desplazado/a' },
  { value: 'MISSING_FAMILY', label: 'Familia desaparecida' },
  { value: 'DECEASED', label: 'Fallecido/a' },
  { value: 'OTHER', label: 'Otro' },
];

export const contingencyStatusOptions = [
  { value: 'RECEIVED', label: 'Recibido' },
  { value: 'IN_PROCESS', label: 'En proceso' },
  { value: 'ATTENDED', label: 'Atendido' },
  { value: 'CLOSED', label: 'Cerrado' },
];

export const situationLabel = {
  SAFE: 'A salvo',
  INJURED: 'Herido/a',
  DISPLACED: 'Desplazado/a',
  MISSING_FAMILY: 'Familia desaparecida',
  DECEASED: 'Fallecido/a',
  OTHER: 'Otro',
};

export const statusLabel = {
  RECEIVED: 'Recibido',
  IN_PROCESS: 'En proceso',
  ATTENDED: 'Atendido',
  CLOSED: 'Cerrado',
};

export const contingencyFormSchema = z
  .object({
    firstName: z.string().min(2, 'Nombre requerido').max(120),
    lastName: z.string().min(2, 'Apellido requerido').max(120),
    cedula: z
      .string()
      .trim()
      .regex(cedulaRegex, 'Formato inválido. Ejemplos: V-27376369, E-1234567, N-12345678'),
    contactPhone: z
      .string()
      .min(10, 'Teléfono debe tener al menos 10 dígitos')
      .max(20, 'Teléfono demasiado largo'),
    management: z.string().min(2, 'Gerencia requerida').max(120),
    currentLocation: z.string().min(2, 'Ubicación requerida').max(200),
    currentSituation: z.enum([
      'SAFE',
      'INJURED',
      'DISPLACED',
      'MISSING_FAMILY',
      'DECEASED',
      'OTHER',
    ]),
    situationOther: z.string().max(200).optional(),
    needsSupport: z.boolean().default(false),
    needsMedicine: z.boolean().default(false),
    medicineDetail: z.string().max(500).optional(),
    needsFood: z.boolean().default(false),
    needsHousing: z.boolean().default(false),
    affectedPeople: z.coerce.number().int().min(0).max(50).default(0),
    observations: z.string().max(1000).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.currentSituation === 'OTHER' && !data.situationOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['situationOther'],
        message: 'Detalle requerido cuando la situación es "Otro"',
      });
    }
    if (data.needsMedicine && !data.medicineDetail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['medicineDetail'],
        message: 'Especifique las medicinas requeridas',
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

export const statusChangeSchema = z.object({
  status: z.enum(['RECEIVED', 'IN_PROCESS', 'ATTENDED', 'CLOSED']),
  note: z.string().max(500).optional(),
});

export const STATUS_TRANSITIONS = {
  RECEIVED: ['IN_PROCESS', 'CLOSED'],
  IN_PROCESS: ['ATTENDED', 'CLOSED'],
  ATTENDED: ['CLOSED'],
  CLOSED: [],
};
