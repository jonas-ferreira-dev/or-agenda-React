import { api } from '@/services/api/client';
import type { ProfessionalProfileResponse } from '../types/professional-profile';

export async function getProfessionalProfile() {
  const { data } = await api.get<ProfessionalProfileResponse>(
    '/professional-profile'
  );

  return data;
}