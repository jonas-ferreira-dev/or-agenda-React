import { api } from '@/services/api/client';
import type { AppointmentsListResponse } from '../types/appointment';

export async function listAppointments(page = 1, perPage = 15) {
  const { data } = await api.get<AppointmentsListResponse>('/appointments', {
    params: {
      page,
      per_page: perPage,
    },
  });

  return data;
}