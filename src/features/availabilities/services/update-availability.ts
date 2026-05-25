// src/features/availabilities/services/update-availability.ts

import { api } from '@/services/api/client';
import type {
  AvailabilityPayload,
  ProfessionalAvailability,
} from '../types/availability';

type UpdateAvailabilityResponse = {
  message: string;
  data: ProfessionalAvailability;
};

export async function updateAvailability(
  availabilityId: number,
  payload: AvailabilityPayload
) {
  const response = await api.put<UpdateAvailabilityResponse>(
    `/professional-availabilities/${availabilityId}`,
    payload
  );

  return response.data;
}