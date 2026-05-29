import { api } from '@/services/api/client';
import type { Appointment } from '../types/appointment';

type CompleteAppointmentResponse = {
  message: string;
  data: Appointment;
};

export async function completeAppointment(appointmentId: number) {
  const response = await api.patch<CompleteAppointmentResponse>(
    `/appointments/${appointmentId}/complete`
  );

  return response.data;
}