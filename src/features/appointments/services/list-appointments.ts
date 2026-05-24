import { api } from '@/services/api/client';
import type { Appointment } from '../types/appointment';
import type { AppointmentFilters } from '../types/appointment-filters';

type ListAppointmentsResponse = {
  message: string;
  data: Appointment[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
};

type ListAppointmentsParams = Partial<AppointmentFilters> & {
  page?: number;
  perPage?: number;
};

export async function listAppointments(params: ListAppointmentsParams = {}) {
  const response = await api.get<ListAppointmentsResponse>('/appointments', {
    params: {
      page: params.page ?? 1,
      per_page: params.perPage ?? 15,
      search: params.search || undefined,
      status: params.status || undefined,
      date: params.date || undefined,
    },
  });

  return response.data;
}