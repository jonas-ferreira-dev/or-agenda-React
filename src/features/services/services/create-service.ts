import { api } from '@/services/api/client';
import type { CreateServicePayload, ServiceResponse } from '../types/service';

export async function createService(payload: CreateServicePayload) {
  const { data } = await api.post<ServiceResponse>('/services', payload);
  return data;
}