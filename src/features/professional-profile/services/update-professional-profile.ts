import { api } from '@/services/api/client';
import type { ProfessionalProfileResponse } from '../types/professional-profile';

export async function updateProfessionalProfile(payload: FormData) {
  payload.append('_method', 'PUT');

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