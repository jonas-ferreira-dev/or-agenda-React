/* import { z } from 'zod';

export const serviceSchema = z.object({
  name: z.string().min(1, 'Nome do serviço é obrigatório'),
  duration_minutes: z.coerce
    .number()
    .min(1, 'Duração deve ser maior que zero'),
  price: z
    .union([z.string(), z.number()])
    .optional()
    .transform((value) => {
      if (value === '' || value === undefined || value === null) return undefined;
      return Number(value);
    }),
  description: z.string().optional(),
  active: z.boolean().default(true),
});

export type ServiceSchemaData = z.infer<typeof serviceSchema>;

*/

import { z } from 'zod';

export const serviceSchema = z.object({
  name: z.string().min(1, 'Nome do serviço é obrigatório'),
  duration_minutes: z.coerce
    .number()
    .min(1, 'Duração deve ser maior que zero'),
  price: z
    .union([z.string(), z.number()])
    .transform((value) => {
      if (value === '' || value === undefined || value === null) {
        return undefined;
      }

      return Number(value);
    })
    .optional(),
  description: z.string().optional(),
  active: z.boolean().default(true),
});

export type ServiceFormInput = z.input<typeof serviceSchema>;
export type ServiceSchemaData = z.output<typeof serviceSchema>;