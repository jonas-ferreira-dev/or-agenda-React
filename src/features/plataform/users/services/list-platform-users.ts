import { api } from '@/services/api/client';
import type { PlatformUser } from '../types/plataform-user';
import type { PlatformUserFilters } from '../types/platform-user-filters';

type ListPlatformUsersParams = Partial<PlatformUserFilters> & {
  page?: number;
  perPage?: number;
};

type ListPlatformUsersResponse = {
  message: string;
  data: PlatformUser[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
};

function resolveIsActiveParam(status?: PlatformUserFilters['status']) {
  if (status === 'active') return 1;
  if (status === 'inactive') return 0;

  return undefined;
}

export async function listPlatformUsers(params: ListPlatformUsersParams = {}) {
  const response = await api.get<ListPlatformUsersResponse>('/platform/users', {
    params: {
      page: params.page ?? 1,
      per_page: params.perPage ?? 15,
      search: params.search || undefined,
      is_active: resolveIsActiveParam(params.status),
    },
  });

  return response.data;
}