import { z } from 'zod';

export const publicBookingSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  email: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || /\S+@\S+\.\S+/.test(value), {
      message: 'E-mail inválido',
    }),
  phone: z.string().trim().min(1, 'Telefone é obrigatório'),
  service_id: z
    .string()
    .min(1, 'Selecione um serviço')
    .refine((value) => Number(value) > 0, {
      message: 'Selecione um serviço',
    }),
  appointment_date: z.string().min(1, 'Selecione uma data'),
  start_time: z.string().min(1, 'Selecione um horário'),
  notes: z.string().optional(),
});

export type PublicBookingSchemaData = z.infer<typeof publicBookingSchema>;