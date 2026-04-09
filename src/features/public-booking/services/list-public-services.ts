import { publicApi } from '@/services/api/public-client';
import type { PublicServicesResponse } from '../types/public-booking';

export async function listPublicServices(slug: string) {
  const { data } = await publicApi.get<PublicServicesResponse>(
    `/public/professionals/${slug}/services`
  );

  return data;
}