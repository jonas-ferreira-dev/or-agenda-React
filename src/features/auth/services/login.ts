import { api } from '@/services/api/client';
import type { LoginPayload, LoginResponse } from '../types/auth';

export async function loginRequest(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>('/login', payload);
  return data;
}