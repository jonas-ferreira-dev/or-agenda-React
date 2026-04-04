import { api } from '@/services/api/client';

export async function logoutRequest() {
  const { data } = await api.post('/logout');
  return data;
}