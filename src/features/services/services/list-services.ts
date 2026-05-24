import { api } from '@/services/api/client';
import type { Service } from '../types/service';
import type { ServiceFilters } from '../types/service-filters';

type ListServicesResponse = {
  message: string;
  data: Service[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
};

type ListServicesParams = Partial<ServiceFilters> & {
  page?: number;
  perPage?: number;
};

function resolveActiveParam(active?: ServiceFilters['active']) {
  if (active === 'active') return 1;
  if (active === 'inactive') return 0;

  return undefined;
}

export async function listServices(
  pageOrParams: number | ListServicesParams = {},
  perPage?: number
) {
  const params: ListServicesParams =
    typeof pageOrParams === 'number'
      ? { page: pageOrParams, perPage }
      : pageOrParams;

  const response = await api.get<ListServicesResponse>('/services', {
    params: {
      page: params.page ?? 1,
      per_page: params.perPage ?? 15,
      search: params.search || undefined,
      active: resolveActiveParam(params.active),
    },
  });

  return response.data;
}