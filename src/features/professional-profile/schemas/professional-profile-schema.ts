import { z } from 'zod';

export const professionalProfileSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug é obrigatório')
    .regex(/^[a-z0-9-]+$/, 'Use apenas letras minúsculas, números e hífen'),
  public_name: z.string().min(1, 'Nome público é obrigatório'),
  bio: z.string().optional(),
  profile_photo: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine(
      (value) =>
        !value || /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i.test(value),
      {
        message: 'Informe uma URL válida',
      }
    ),
  is_public: z.boolean().default(true),
  booking_enabled: z.boolean().default(true),
});

export type ProfessionalProfileSchemaInput = z.input<
  typeof professionalProfileSchema
>;

export type ProfessionalProfileSchemaData = z.output<
  typeof professionalProfileSchema
>;