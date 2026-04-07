import { z } from 'zod';

export const professionalProfileSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'Slug é obrigatório')
    .regex(/^[a-z0-9-]+$/, 'Use apenas letras minúsculas, números e hífen'),

  public_name: z
    .string()
    .trim()
    .min(1, 'Nome público é obrigatório'),

  bio: z.string().optional(),

  is_public: z.boolean(),

  booking_enabled: z.boolean(),
});

export type ProfessionalProfileSchemaData = z.infer<
  typeof professionalProfileSchema
>;