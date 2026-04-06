import { api } from '@/services/api/client';

export async function deleteAppointment(id: number) {
  const { data } = await api.delete(`/appointments/${id}`);
  return data;
}