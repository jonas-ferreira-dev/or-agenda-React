// src/features/platform/users/services/create-platform-user.ts

import { api } from '@/services/api/client';
import type {
  CreatePlatformUserPayload,
  PlatformUser,
} from '../types/plataform-user';

type CreatePlatformUserResponse = {
  message: string;
  data: PlatformUser;
};

export async function createPlatformUser(payload: CreatePlatformUserPayload) {
  const response = await api.post<CreatePlatformUserResponse>(
    '/platform/users',
    payload
  );

  return response.data;
}