export type PlatformUser = {
  id: number;
  name: string;
  email: string;
  is_platform_admin: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CreatePlatformUserPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type UpdatePlatformUserPayload = {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  is_active?: boolean;
};