import { api } from '@/services/api/client';
import type {
  ProfessionalProfileResponse,
  UpdateProfessionalProfilePayload,
} from '../types/professional-profile';

export async function updateProfessionalProfile(
  payload: UpdateProfessionalProfilePayload
) {
  const { data } = await api.put<ProfessionalProfileResponse>(
    '/professional-profile',
    payload
  );

  return data;
}