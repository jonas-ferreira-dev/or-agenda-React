import { api } from '@/services/api/client';
import type { ClientsListResponse } from '../types/client';

export async function listClients(page = 1, perPage = 15) {
  const { data } = await api.get<ClientsListResponse>('/clients', {
    params: {
      page,
      per_page: perPage,
    },
  });

  return data;
}