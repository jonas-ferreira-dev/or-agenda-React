import { publicApi } from '@/services/api/public-client';
import type {
  CreatePublicAppointmentPayload,
  PublicAppointmentResponse,
} from '../types/public-booking';

export async function createPublicAppointment(
  slug: string,
  payload: CreatePublicAppointmentPayload
) {
  const { data } = await publicApi.post<PublicAppointmentResponse>(
    `/public/professionals/${slug}/appointments`,
    payload
  );

  return data;
}