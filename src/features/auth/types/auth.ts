export type User = {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: User;
};

export type MeResponse = {
  user: User;
};