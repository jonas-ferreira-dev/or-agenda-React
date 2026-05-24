import { api } from '@/services/api/client';
import type { Client } from '../types/client';
import type { ClientFilters } from '../types/client-filters';

type ListClientsResponse = {
  message: string;
  data: Client[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
};

type ListClientsParams = Partial<ClientFilters> & {
  page?: number;
  perPage?: number;
};

export async function listClients(
  pageOrParams: number | ListClientsParams = {},
  perPage?: number
) {
  const params: ListClientsParams =
    typeof pageOrParams === 'number'
      ? { page: pageOrParams, perPage }
      : pageOrParams;

  const response = await api.get<ListClientsResponse>('/clients', {
    params: {
      page: params.page ?? 1,
      per_page: params.perPage ?? 15,
      search: params.search || undefined,
    },
  });

  return response.data;
}