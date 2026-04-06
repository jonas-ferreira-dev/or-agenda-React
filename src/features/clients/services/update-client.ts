import { api } from '@/services/api/client';
import type { ClientResponse, UpdateClientPayload } from '../types/client';

export async function updateClient(id: number, payload: UpdateClientPayload) {
  const { data } = await api.put<ClientResponse>(`/clients/${id}`, payload);
  return data;
}