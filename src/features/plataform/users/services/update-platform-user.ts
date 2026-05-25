import { api } from '@/services/api/client';
import type {
  PlatformUser,
  UpdatePlatformUserPayload,
} from '../types/plataform-user';

type UpdatePlatformUserResponse = {
  message: string;
  data: PlatformUser;
};

export async function updatePlatformUser(
  userId: number,
  payload: UpdatePlatformUserPayload
) {
  const response = await api.put<UpdatePlatformUserResponse>(
    `/platform/users/${userId}`,
    payload
  );

  return response.data;
}