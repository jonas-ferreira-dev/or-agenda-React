// src/features/availabilities/services/delete-availability.ts

import { api } from '@/services/api/client';

type DeleteAvailabilityResponse = {
  message: string;
};

export async function deleteAvailability(availabilityId: number) {
  const response = await api.delete<DeleteAvailabilityResponse>(
    `/professional-availabilities/${availabilityId}`
  );

  return response.data;
}