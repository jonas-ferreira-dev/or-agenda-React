import { api } from '@/services/api/client';
import type { ClientResponse, CreateClientPayload } from '../types/client';

export async function createClient(payload: CreateClientPayload) {
  const { data } = await api.post<ClientResponse>('/clients', payload);
  return data;
}