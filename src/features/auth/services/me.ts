import { api } from '@/services/api/client';
import type { MeResponse } from '../types/auth';

export async function getMeRequest() {
  const { data } = await api.get<MeResponse>('/me');
  return data;
}