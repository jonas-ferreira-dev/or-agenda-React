import { api } from '@/services/api/client';
import type {
  CreateProfessionalProfilePayload,
  ProfessionalProfileResponse,
} from '../types/professional-profile';

export async function createProfessionalProfile(
  payload: CreateProfessionalProfilePayload
) {
  const { data } = await api.post<ProfessionalProfileResponse>(
    '/professional-profile',
    payload
  );

  return data;
}