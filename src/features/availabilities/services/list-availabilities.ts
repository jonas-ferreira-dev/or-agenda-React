// src/features/availabilities/services/list-availabilities.ts

import { api } from '@/services/api/client';
import type { ProfessionalAvailability } from '../types/availability';

type ListAvailabilitiesResponse = {
  message: string;
  data: ProfessionalAvailability[];
};

export async function listAvailabilities() {
  const response = await api.get<ListAvailabilitiesResponse>(
    '/professional-availabilities'
  );

  return response.data;
}