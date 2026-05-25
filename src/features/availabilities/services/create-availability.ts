// src/features/availabilities/services/create-availability.ts

import { api } from '@/services/api/client';
import type {
  AvailabilityPayload,
  ProfessionalAvailability,
} from '../types/availability';

type CreateAvailabilityResponse = {
  message: string;
  data: ProfessionalAvailability;
};

export async function createAvailability(payload: AvailabilityPayload) {
  const response = await api.post<CreateAvailabilityResponse>(
    '/professional-availabilities',
    payload
  );

  return response.data;
}