import { api } from '@/services/api/client';
import type { Appointment } from '../types/appointment';

type CancelAppointmentPayload = {
  cancellation_reason: string;
};

type CancelAppointmentResponse = {
  message: string;
  data: Appointment;
};

export async function cancelAppointment(
  appointmentId: number,
  payload: CancelAppointmentPayload
) {
  const response = await api.patch<CancelAppointmentResponse>(
    `/appointments/${appointmentId}/cancel`,
    payload
  );

  return response.data;
}