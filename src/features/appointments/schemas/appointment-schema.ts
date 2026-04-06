import { z } from 'zod';

export const appointmentSchema = z.object({
  client_id: z.coerce
    .number<string | number>()
    .min(1, 'Selecione um cliente'),
  service_id: z.coerce
    .number<string | number>()
    .min(1, 'Selecione um serviço'),
  appointment_date: z.string().min(1, 'Selecione a data'),
  start_time: z.string().min(1, 'Selecione o horário'),
  status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled']),
  notes: z.string().optional(),
});

export type AppointmentFormInput = z.input<typeof appointmentSchema>;
export type AppointmentSchemaData = z.output<typeof appointmentSchema>;