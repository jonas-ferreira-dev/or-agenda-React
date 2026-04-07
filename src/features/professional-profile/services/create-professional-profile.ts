import { api } from '@/services/api/client';
import type { ProfessionalProfileResponse } from '../types/professional-profile';

export async function createProfessionalProfile(payload: FormData) {
  const { data } = await api.post<ProfessionalProfileResponse>(
    '/professional-profile',
    payload,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return data;
}