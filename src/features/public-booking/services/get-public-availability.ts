import { publicApi } from '@/services/api/public-client';
import type { PublicAvailabilityResponse } from '../types/public-booking';

type GetPublicAvailabilityParams = {
  slug: string;
  date: string;
  service_id: number;
};

export async function getPublicAvailability({
  slug,
  date,
  service_id,
}: GetPublicAvailabilityParams) {
  const { data } = await publicApi.get<PublicAvailabilityResponse>(
    `/public/professionals/${slug}/availability`,
    {
      params: {
        date,
        service_id,
      },
    }
  );

  return data;
}