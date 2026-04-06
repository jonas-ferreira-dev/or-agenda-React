import { api } from '@/services/api/client';

export async function deleteService(id: number) {
  const { data } = await api.delete(`/services/${id}`);
  return data;
}