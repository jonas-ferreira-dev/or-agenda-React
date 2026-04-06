import { api } from '@/services/api/client';
import type { ServiceResponse, UpdateServicePayload } from '../types/service';

export async function updateService(id: number, payload: UpdateServicePayload) {
  const { data } = await api.put<ServiceResponse>(`/services/${id}`, payload);
  return data;
}