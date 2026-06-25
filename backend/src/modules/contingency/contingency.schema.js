import { z } from 'zod';

const cedulaRegex = /^[VENE]-\d{6,8}$/i;

export const createContingencySchema = z
  .object({
    firstName: z.string().min(2, 'Nombre requerido').max(120),
    lastName: z.string().min(2, 'Apellido requerido').max(120),
    cedula: z
      .string()
      .trim()
      .toUpperCase()
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
    situationOther: z.string().max(200).optional().nullable(),
    needsSupport: z.boolean().default(false),
    needsMedicine: z.boolean().default(false),
    medicineDetail: z.string().max(500).optional().nullable(),
    needsFood: z.boolean().default(false),
    needsHousing: z.boolean().default(false),
    affectedPeople: z.coerce.number().int().min(0).max(50).default(0),
    observations: z.string().max(1000).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.currentSituation === 'OTHER' && !data.situationOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['situationOther'],
        message: 'Detalle requerido cuando la situación es "Otro"',
      });
    }
    if (data.needsMedicine === true && !data.medicineDetail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['medicineDetail'],
        message: 'Especifique las medicinas requeridas',
      });
    }
    if (
      data.needsMedicine ||
      data.needsFood ||
      data.needsHousing
    ) {
      data.needsSupport = true;
    }
  });

export const updateStatusSchema = z.object({
  status: z.enum(['RECEIVED', 'IN_PROCESS', 'ATTENDED', 'CLOSED']),
  note: z.string().max(500).optional().nullable(),
});

export const listQuerySchema = z.object({
  status: z
    .enum(['RECEIVED', 'IN_PROCESS', 'ATTENDED', 'CLOSED'])
    .optional(),
  management: z.string().optional(),
  currentSituation: z
    .enum(['SAFE', 'INJURED', 'DISPLACED', 'MISSING_FAMILY', 'DECEASED', 'OTHER'])
    .optional(),
  needsSupport: z
    .union([z.literal('true'), z.literal('false'), z.boolean()])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
  needsMedicine: z
    .union([z.literal('true'), z.literal('false'), z.boolean()])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
  needsFood: z
    .union([z.literal('true'), z.literal('false'), z.boolean()])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
  needsHousing: z
    .union([z.literal('true'), z.literal('false'), z.boolean()])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
  q: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
});

export const SITUATION_LABEL = {
  SAFE: 'A salvo',
  INJURED: 'Herido/a',
  DISPLACED: 'Desplazado/a',
  MISSING_FAMILY: 'Familia desaparecida',
  DECEASED: 'Fallecido/a',
  OTHER: 'Otro',
};

export const STATUS_LABEL = {
  RECEIVED: 'Recibido',
  IN_PROCESS: 'En proceso',
  ATTENDED: 'Atendido',
  CLOSED: 'Cerrado',
};
