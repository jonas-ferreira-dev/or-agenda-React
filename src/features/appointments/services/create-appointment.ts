import { api } from '@/services/api/client';
import type {
  AppointmentResponse,
  CreateAppointmentPayload,
} from '../types/appointment';

export async function createAppointment(payload: CreateAppointmentPayload) {
  const { data } = await api.post<AppointmentResponse>('/appointments', payload);
  return data;
}