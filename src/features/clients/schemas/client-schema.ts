import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || /\S+@\S+\.\S+/.test(value), {
      message: 'E-mail inválido',
    }),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export type ClientSchemaData = z.infer<typeof clientSchema>;