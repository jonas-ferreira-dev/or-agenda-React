import { api } from '@/services/api/client';
import type { ServicesListResponse } from '../types/service';

export async function listServices(page = 1, perPage = 15) {
  const { data } = await api.get<ServicesListResponse>('/services', {
    params: {
      page,
      per_page: perPage,
    },
  });

  return data;
}