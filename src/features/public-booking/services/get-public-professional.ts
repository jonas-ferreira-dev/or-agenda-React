import { publicApi } from '@/services/api/public-client';
import type { PublicProfessionalResponse } from '../types/public-booking';

export async function getPublicProfessional(slug: string) {
  const { data } = await publicApi.get<PublicProfessionalResponse>(
    `/public/professionals/${slug}`
  );

  return data;
}