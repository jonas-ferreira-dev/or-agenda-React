import { api } from '@/services/api/client';
import type {
  AppointmentResponse,
  UpdateAppointmentPayload,
} from '../types/appointment';

export async function updateAppointment(
  id: number,
  payload: UpdateAppointmentPayload
) {
  const { data } = await api.put<AppointmentResponse>(
    `/appointments/${id}`,
    payload
  );

  return data;
}